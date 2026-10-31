/**
 * SentinelMail — Rule-Based Analysis Engine
 * -----------------------------------------------------------------------
 * This is the actual "detection algorithm" behind every real .eml
 * upload. It is a transparent, weighted rule engine — NOT a trained
 * ML model and NOT an LLM. Each check below inspects real parsed
 * email data (headers, links, content) and adds points to a running
 * score, which is then mapped to a risk level (see `scoreToLevel` in
 * `src/lib/risk.ts`).
 *
 * See also: `src/components/ScoringMethodology.tsx`, which renders
 * this same rule table in the UI on every Analysis Results page.
 * -----------------------------------------------------------------------
 */
import type {
  AiQaPair,
  AuthenticationCheck,
  DomainIntel,
  EmailRecord,
  Indicator,
  IpIntel,
  TimelineEvent,
  UrlIntel,
} from "@/data/types";
import { scoreToLevel } from "@/lib/risk";
import type { ParsedEmail } from "@/lib/emailParser";

const URGENCY_WORDS = [
  "urgent", "immediately", "suspend", "suspended", "verify your account", "verify now",
  "confirm your identity", "act now", "24 hours", "expire", "expires", "expiring",
  "unusual activity", "unauthorized", "final notice", "action required", "restricted",
];

const BRAND_KEYWORDS = [
  "paypal", "microsoft", "apple", "amazon", "google", "netflix", "bank", "chase",
  "wellsfargo", "hdfc", "icici", "sbi", "dhl", "fedex", "linkedin", "facebook", "instagram",
];

const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly"];
const SUSPICIOUS_PATH_WORDS = ["login", "verify", "secure", "account", "confirm", "update", "signin", "sso"];
const RISKY_ATTACHMENT_EXT = [".exe", ".scr", ".js", ".vbs", ".bat", ".jar", ".cmd", ".ps1"];

const NO_LIVE_FEED_NOTE =
  "Live threat-intelligence lookup (e.g. VirusTotal, URLhaus) is not connected in this demo — this reputation is inferred from message patterns only, not a real-time feed.";

function extractUrls(text: string, html: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/gi;
  const found = new Set<string>();
  for (const m of `${text}\n${html}`.matchAll(urlRegex)) {
    found.add(m[0].replace(/[.,;]+$/, ""));
  }
  return Array.from(found).slice(0, 8);
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function extractOriginatingIp(receivedHeaders: string[]): string | null {
  const ipRegex = /\[?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]?/;
  const isPrivate = (ip: string) =>
    /^10\./.test(ip) || /^192\.168\./.test(ip) || /^127\./.test(ip) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip);
  for (const header of receivedHeaders) {
    const match = header.match(ipRegex);
    if (match && !isPrivate(match[1])) return match[1];
  }
  return null;
}

function parseAuthResults(header: string | null): { spf: "PASS" | "FAIL" | "NEUTRAL"; dkim: "PASS" | "FAIL" | "NEUTRAL"; dmarc: "PASS" | "FAIL" | "NEUTRAL" } {
  const read = (key: string): "PASS" | "FAIL" | "NEUTRAL" => {
    if (!header) return "NEUTRAL";
    const m = header.match(new RegExp(`${key}=(pass|fail|softfail|neutral|none)`, "i"));
    if (!m) return "NEUTRAL";
    const v = m[1].toLowerCase();
    if (v === "pass") return "PASS";
    if (v === "fail" || v === "softfail") return "FAIL";
    return "NEUTRAL";
  };
  return { spf: read("spf"), dkim: read("dkim"), dmarc: read("dmarc") };
}

export function analyzeParsedEmail(parsed: ParsedEmail): EmailRecord {
  const now = new Date();
  const suffix = now.getTime().toString(36).toUpperCase().slice(-5);
  const id = `EML-U${suffix}`;
  const incidentId = `INV-U${suffix}`;

  const fromDomain = parsed.fromAddress.split("@")[1] ?? "unknown";
  const replyToDomain = parsed.replyToAddress ? parsed.replyToAddress.split("@")[1] : null;
  const bodyText = `${parsed.subject}\n${parsed.text}\n${parsed.html}`.toLowerCase();

  const indicators: Indicator[] = [];
  let score = 4; // baseline for a clean message

  // --- Urgency / social engineering language ---
  const matchedUrgency = URGENCY_WORDS.filter((w) => bodyText.includes(w));
  if (matchedUrgency.length > 0) {
    indicators.push({
      label: "Urgency / pressure language detected",
      detected: true,
      detail: `Message contains pressure language commonly used in social engineering: "${matchedUrgency.slice(0, 3).join('", "')}".`,
    });
    score += Math.min(20, matchedUrgency.length * 8);
  } else {
    indicators.push({
      label: "Urgency / pressure language detected",
      detected: false,
      detail: "No urgency or deadline-style pressure language found in the subject or body.",
    });
  }

  // --- Brand impersonation ---
  const mentionedBrand = BRAND_KEYWORDS.find(
    (b) => parsed.fromName.toLowerCase().includes(b) || bodyText.includes(b)
  );
  const brandMismatch = mentionedBrand && !fromDomain.toLowerCase().includes(mentionedBrand);
  if (brandMismatch) {
    indicators.push({
      label: "Sender / brand domain mismatch",
      detected: true,
      detail: `Message references "${mentionedBrand}" but the sending domain (${fromDomain}) has no relationship to that brand's known infrastructure.`,
    });
    score += 25;
  } else {
    indicators.push({
      label: "Sender / brand domain mismatch",
      detected: false,
      detail: "No brand name was found that conflicts with the sending domain.",
    });
  }

  // --- Reply-to mismatch ---
  if (replyToDomain && replyToDomain !== fromDomain) {
    indicators.push({
      label: "Reply-To domain differs from sender",
      detected: true,
      detail: `Reply-To (${replyToDomain}) does not match the From domain (${fromDomain}) — replies would be routed elsewhere.`,
    });
    score += 12;
  }

  // --- URLs ---
  const urls = extractUrls(parsed.text, parsed.html);
  const urlIntel: UrlIntel[] = [];
  let anySuspiciousUrl = false;
  for (const url of urls) {
    const domain = domainOf(url);
    const isShortener = SHORTENERS.some((s) => domain.includes(s));
    const hasSuspiciousPath = SUSPICIOUS_PATH_WORDS.some((w) => url.toLowerCase().includes(w));
    const isIpUrl = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain);
    const flagged = isShortener || hasSuspiciousPath || isIpUrl;
    if (flagged) anySuspiciousUrl = true;
    urlIntel.push({
      url,
      category: isIpUrl ? "IP-literal link" : isShortener ? "URL shortener redirect" : hasSuspiciousPath ? "Login / credential-style path" : "General link",
      reputation: flagged ? "suspicious" : "unknown",
      riskLevel: flagged ? "high" : "low",
      notes: NO_LIVE_FEED_NOTE,
    });
  }
  if (urls.length > 0) {
    indicators.push({
      label: "Suspicious link patterns",
      detected: anySuspiciousUrl,
      detail: anySuspiciousUrl
        ? `${urlIntel.filter((u) => u.reputation === "suspicious").length} of ${urls.length} extracted link(s) match shortener, IP-literal, or credential-style path patterns.`
        : `${urls.length} link(s) extracted; none matched known suspicious URL patterns (this is a pattern check only, not a live reputation lookup).`,
    });
    if (anySuspiciousUrl) score += 22;
  }

  // --- Authentication ---
  const authVerdicts = parseAuthResults(parsed.authResultsHeader);
  const auth: AuthenticationCheck[] = (["spf", "dkim", "dmarc"] as const).map((protocol) => {
    const result = authVerdicts[protocol];
    const upper = protocol.toUpperCase() as "SPF" | "DKIM" | "DMARC";
    const plainLanguage =
      result === "FAIL"
        ? `${upper} failed for this message — a strong signal the sending server was not authorized to send on behalf of this domain.`
        : result === "PASS"
        ? `${upper} passed — this check aligns with what the domain owner has authorized.`
        : `No ${upper} result was present in this message's headers, so this could not be verified from the raw file alone.`;
    return {
      protocol: upper,
      result,
      detail: parsed.authResultsHeader
        ? parsed.authResultsHeader.slice(0, 160)
        : "No Authentication-Results header found in this message.",
      plainLanguage,
    };
  });
  for (const a of auth) {
    if (a.result === "FAIL") {
      indicators.push({ label: `${a.protocol} failure`, detected: true, detail: a.plainLanguage });
      score += 18;
    }
  }

  // --- Attachments ---
  const riskyAttachments = parsed.attachments.filter((a) =>
    RISKY_ATTACHMENT_EXT.some((ext) => a.filename.toLowerCase().endsWith(ext))
  );
  if (parsed.attachments.length > 0) {
    indicators.push({
      label: "Risky attachment type",
      detected: riskyAttachments.length > 0,
      detail:
        riskyAttachments.length > 0
          ? `${riskyAttachments.length} attachment(s) use executable-style extensions (${riskyAttachments.map((a) => a.filename).join(", ")}).`
          : `${parsed.attachments.length} attachment(s) present; none use commonly-abused executable extensions.`,
    });
    if (riskyAttachments.length > 0) score += 20;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const riskLevel = scoreToLevel(score);

  const threatType =
    riskLevel === "safe" || riskLevel === "low"
      ? "None"
      : anySuspiciousUrl && (authVerdicts.spf === "FAIL" || authVerdicts.dmarc === "FAIL")
      ? "Phishing / Credential Theft"
      : riskyAttachments.length > 0
      ? "Possible Malware Delivery"
      : brandMismatch
      ? "Brand Impersonation"
      : "Suspicious / Social Engineering";

  // --- Domains ---
  const domains: DomainIntel[] = [
    {
      domain: fromDomain,
      registered: "Unknown (WHOIS lookup not connected)",
      registrar: "Unknown",
      reputation: brandMismatch || authVerdicts.spf === "FAIL" ? "suspicious" : "unknown",
      riskLevel: brandMismatch || authVerdicts.spf === "FAIL" ? "high" : "low",
      notes: NO_LIVE_FEED_NOTE,
    },
  ];
  if (replyToDomain && replyToDomain !== fromDomain) {
    domains.push({
      domain: replyToDomain,
      registered: "Unknown (WHOIS lookup not connected)",
      registrar: "Unknown",
      reputation: "unknown",
      riskLevel: "medium",
      notes: NO_LIVE_FEED_NOTE,
    });
  }

  // --- IPs ---
  const originatingIp = extractOriginatingIp(parsed.receivedHeaders);
  const ips: IpIntel[] = originatingIp
    ? [
        {
          ip: originatingIp,
          approximateLocation: "Approximate IP infrastructure location: unavailable (no live geolocation feed connected)",
          asn: "Unknown (ASN lookup not connected)",
          reputation: "unknown",
          riskLevel: "medium",
          notes: `Extracted from this message's Received headers. ${NO_LIVE_FEED_NOTE}`,
        },
      ]
    : [];

  // --- Timeline ---
  const t0 = now;
  const stamp = (offsetMs: number) => {
    const d = new Date(t0.getTime() + offsetMs);
    return d.toISOString().slice(11, 16);
  };
  const timeline: TimelineEvent[] = [
    { time: stamp(0), label: "Email received", detail: "Message parsed from uploaded .eml file.", status: "info" },
    {
      time: stamp(400),
      label: parsed.authResultsHeader ? "Authentication headers parsed" : "No authentication headers found",
      detail: parsed.authResultsHeader
        ? "SPF, DKIM, and DMARC results extracted from Authentication-Results header."
        : "Message did not include an Authentication-Results header.",
      status: authVerdicts.spf === "FAIL" || authVerdicts.dmarc === "FAIL" ? "critical" : "info",
    },
    {
      time: stamp(800),
      label: `${urls.length} link(s) extracted`,
      detail: anySuspiciousUrl ? "One or more links matched suspicious URL patterns." : "Links extracted and pattern-checked.",
      status: anySuspiciousUrl ? "warning" : "info",
    },
    {
      time: stamp(1200),
      label: `Threat classified ${riskLevel.toUpperCase()}`,
      detail: `Composite risk score calculated at ${score}/100 from rule-based indicators.`,
      status: riskLevel === "critical" || riskLevel === "high" ? "critical" : riskLevel === "medium" ? "warning" : "success",
    },
    { time: stamp(1500), label: "Investigation generated", detail: `Report ${incidentId} created.`, status: "success" },
  ];

  // --- AI Investigator (templated from real findings, not a live LLM call) ---
  const detectedLabels = indicators.filter((i) => i.detected).map((i) => i.label);
  const aiQa: AiQaPair[] = [
    {
      question: "Why is this email high risk?",
      answer:
        detectedLabels.length > 0
          ? `This message scores ${score}/100 based on ${detectedLabels.length} triggered indicator(s): ${detectedLabels.join(", ")}. Each was detected directly from the uploaded message's headers, links, or content.`
          : `This message scores ${score}/100. No high-risk indicators were triggered by the rule-based checks run against it.`,
    },
    {
      question: "What indicators suggest phishing?",
      answer:
        detectedLabels.length > 0
          ? `The triggered indicators are: ${detectedLabels.join("; ")}.`
          : "No phishing-style indicators were detected in this message.",
    },
    {
      question: "Are there related incidents?",
      answer: "This uploaded message has not been correlated against other incidents — correlation in this demo only runs across the built-in sample campaign.",
    },
    {
      question: "Which authentication checks failed?",
      answer: auth.some((a) => a.result === "FAIL")
        ? `${auth.filter((a) => a.result === "FAIL").map((a) => a.protocol).join(" and ")} failed. ${auth.find((a) => a.result === "FAIL")?.plainLanguage ?? ""}`
        : parsed.authResultsHeader
        ? "None of SPF, DKIM, or DMARC failed based on the headers present in this message."
        : "This message had no Authentication-Results header, so authentication could not be verified from the file alone.",
    },
    {
      question: "What should an analyst investigate next?",
      answer:
        riskLevel === "critical" || riskLevel === "high"
          ? "Confirm whether the recipient interacted with any extracted links, check mailbox rules for tampering, and consider blocking the sending domain pending further review."
          : "No further action appears necessary based on the indicators checked, but manual review is always reasonable for messages requesting sensitive action.",
    },
  ];

  return {
    id,
    incidentId,
    subject: parsed.subject,
    from: `${parsed.fromName} <${parsed.fromAddress}>`,
    fromDomain,
    replyTo: parsed.replyToAddress ?? undefined,
    to: parsed.toAddress,
    receivedAt: parsed.date ?? now.toISOString(),
    riskScore: score,
    riskLevel,
    threatType,
    bodyPreview: (parsed.text || parsed.html.replace(/<[^>]+>/g, " ")).slice(0, 240).trim() || "(no readable body content)",
    indicators,
    auth,
    ips,
    domains,
    urls: urlIntel,
    timeline,
    aiQa,
    attachments: parsed.attachments.map((a) => ({
      name: a.filename,
      type: a.mimeType,
      verdict: RISKY_ATTACHMENT_EXT.some((ext) => a.filename.toLowerCase().endsWith(ext)) ? "high" : "safe",
    })),
  };
}
