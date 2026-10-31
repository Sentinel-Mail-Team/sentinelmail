import type { Campaign, EmailRecord } from "./types";

export const dashboardStats = {
  emailsAnalyzed: 1284,
  threatsDetected: 347,
  highRiskIncidents: 86,
  suspiciousIps: 129,
  suspiciousDomains: 74,
  relatedCampaigns: 18,
};

export const threatTrend = [
  { day: "Aug 27", safe: 142, medium: 18, high: 6 },
  { day: "Aug 28", safe: 158, medium: 22, high: 9 },
  { day: "Aug 29", safe: 131, medium: 15, high: 4 },
  { day: "Aug 30", safe: 176, medium: 27, high: 11 },
  { day: "Aug 31", safe: 164, medium: 31, high: 14 },
  { day: "Sep 1", safe: 189, medium: 24, high: 8 },
  { day: "Sep 2", safe: 121, medium: 19, high: 13 },
];

export const threatDistribution = [
  { name: "Phishing", value: 168, color: "#ef4444" },
  { name: "Credential theft", value: 96, color: "#f59e0b" },
  { name: "Malware delivery", value: 41, color: "#3b82f6" },
  { name: "Spoofing", value: 27, color: "#22d3ee" },
  { name: "Other", value: 15, color: "#57617a" },
];

const phishingEmail: EmailRecord = {
  id: "EML-40921",
  incidentId: "INV-58231",
  subject: "Action Required: Verify Your Account to Avoid Suspension",
  from: "IT Security Team <security-alert@paypal-secure-verify.com>",
  fromDomain: "paypal-secure-verify.com",
  replyTo: "no-reply@acct-support-center.ru",
  to: "j.mehta@northbridge-logistics.com",
  receivedAt: "2026-09-02T09:41:00+05:30",
  riskScore: 91,
  riskLevel: "critical",
  threatType: "Phishing / Credential Theft",
  campaignId: "CMP-1187",
  bodyPreview:
    "We detected unusual sign-in activity on your account. To avoid a 24-hour suspension, confirm your identity immediately using the secure link below. Failure to verify may result in permanent account lock.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: true, detail: "Link routes through a look-alike login page hosted on a domain registered 6 days ago." },
    { label: "Sender / domain mismatch", detected: true, detail: "Display name references PayPal; sending domain is unrelated to any PayPal-owned infrastructure." },
    { label: "Urgent authentication request", detected: true, detail: "Message uses a 24-hour suspension deadline to pressure the recipient into acting without verification." },
    { label: "SPF failure", detected: true, detail: "Sending server is not authorized to send mail for the claimed domain." },
    { label: "DMARC failure", detected: true, detail: "Message fails domain alignment and would be rejected under an enforced DMARC policy." },
    { label: "Suspicious domain reputation", detected: true, detail: "Sending domain flagged by multiple threat feeds within the last 72 hours." },
    { label: "Related incidents detected", detected: true, detail: "Shares sending infrastructure with a second incident (EML-40944) from the same day." },
  ],
  auth: [
    { protocol: "SPF", result: "FAIL", detail: "185.220.101.47 is not listed in paypal-secure-verify.com's SPF record.", plainLanguage: "The server that sent this email was never approved to send mail on behalf of this domain — a strong sign the sender address was faked." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=paypal-secure-verify.com.", plainLanguage: "The email's cryptographic signature matches, but that only proves it wasn't altered in transit — it says nothing about whether the sending domain is trustworthy, and this one was registered days ago." },
    { protocol: "DMARC", result: "FAIL", detail: "Policy p=reject; alignment failed on From: header.", plainLanguage: "The domain's own policy says messages like this should be rejected, meaning a properly enforcing mail server would have blocked it before it reached the inbox." },
  ],
  ips: [
    { ip: "185.220.101.47", approximateLocation: "Approximate IP infrastructure location: Bucharest, Romania", asn: "AS9009 (M247 Ltd)", reputation: "malicious", riskLevel: "critical", notes: "Associated with 14 prior phishing campaigns across three threat feeds." },
    { ip: "45.153.160.2", approximateLocation: "Approximate IP infrastructure location: Amsterdam, Netherlands", asn: "AS207137", reputation: "suspicious", riskLevel: "high", notes: "Hosting provider frequently abused for short-lived phishing kits." },
  ],
  domains: [
    { domain: "paypal-secure-verify.com", registered: "2026-08-27", registrar: "NiceNIC.NET", reputation: "malicious", riskLevel: "critical", notes: "Registered 6 days before this message was sent; uses privacy-proxy WHOIS." },
    { domain: "acct-support-center.ru", registered: "2026-07-14", registrar: "REGRU-RU", reputation: "suspicious", riskLevel: "high", notes: "Reply-to domain with no legitimate mail history prior to this campaign." },
  ],
  urls: [
    { url: "hxxps://paypal-secure-verify.com/login/confirm-identity", category: "Credential harvesting", reputation: "malicious", riskLevel: "critical", notes: "Clones the PayPal login page; form posts credentials to a third-party collection endpoint." },
    { url: "hxxps://bit.ly/3xVerify-Now", category: "URL shortener redirect", reputation: "suspicious", riskLevel: "high", notes: "Shortened link masks the true destination; resolves to the credential-harvesting page above." },
  ],
  timeline: [
    { time: "09:41", label: "Email received", detail: "Message ingested from mail gateway for j.mehta@northbridge-logistics.com.", status: "info" },
    { time: "09:41", label: "SPF authentication failed", detail: "Sending IP not authorized for claimed domain.", status: "critical" },
    { time: "09:42", label: "Suspicious URL extracted", detail: "2 URLs extracted and queued for reputation analysis.", status: "warning" },
    { time: "09:42", label: "IP reputation checked", detail: "185.220.101.47 matched against threat intelligence feeds.", status: "warning" },
    { time: "09:43", label: "Related incident found", detail: "Shared domain/IP infrastructure with EML-40944 detected.", status: "warning" },
    { time: "09:44", label: "Threat classified HIGH RISK", detail: "Composite risk score calculated at 91/100.", status: "critical" },
    { time: "09:45", label: "Investigation generated", detail: "Forensic report INV-58231 created and queued for analyst review.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "This message scores 91/100 because it combines a failed sender authentication chain (SPF and DMARC both fail) with a credential-harvesting URL and a domain that was registered only six days ago. Any one of these would warrant a closer look; together they indicate a deliberate impersonation attempt rather than a misconfiguration.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "The display name impersonates a known brand while the underlying domain has no relationship to it, the message manufactures urgency with a 24-hour suspension deadline, and the primary link leads to a login page that visually mirrors the real service but submits credentials to an unrelated third-party server.",
    },
    {
      question: "Are there related incidents?",
      answer: "Yes. EML-40944, received the same afternoon, shares both the sending domain and the originating IP address with this message. Both have been grouped under campaign CMP-1187 with an 87% correlation confidence.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "SPF and DMARC both failed. DKIM passed, but a passing signature only confirms the message wasn't altered after signing — it does not vouch for the sending domain's legitimacy, which is why the SPF and DMARC failures are the more meaningful signal here.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "Confirm whether the recipient interacted with the link or submitted credentials, check the mailbox for forwarding-rule changes, search the mail gateway logs for other recipients of messages from the same sending IP, and consider blocking the domain and IP at the perimeter if not already actioned.",
    },
  ],
  attachments: [],
};

const credentialTheftEmail: EmailRecord = {
  id: "EML-40944",
  incidentId: "INV-58239",
  subject: "Your Document Has Been Shared — Review Required",
  from: "Document Center <no-reply@paypal-secure-verify.com>",
  fromDomain: "paypal-secure-verify.com",
  to: "r.acharya@northbridge-logistics.com",
  receivedAt: "2026-09-02T14:07:00+05:30",
  riskScore: 88,
  riskLevel: "critical",
  threatType: "Credential Theft",
  campaignId: "CMP-1187",
  bodyPreview:
    "A secure document has been shared with you via the corporate file portal. Sign in with your work email to view the file before the sharing link expires.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: true, detail: "Link leads to a fake single sign-on page requesting corporate credentials." },
    { label: "Sender / domain mismatch", detected: true, detail: "Claims to be an internal document portal but originates from an external, unrelated domain." },
    { label: "Urgent authentication request", detected: true, detail: "Message implies the sharing link will expire to discourage careful review." },
    { label: "SPF failure", detected: true, detail: "Sending server not authorized for the claimed domain." },
    { label: "DMARC failure", detected: true, detail: "Fails domain alignment under an enforced reject policy." },
    { label: "Suspicious domain reputation", detected: true, detail: "Same domain reputation flag as the linked phishing incident." },
    { label: "Related incidents detected", detected: true, detail: "Shares sending domain and IP with EML-40921." },
  ],
  auth: [
    { protocol: "SPF", result: "FAIL", detail: "185.220.101.47 is not listed in paypal-secure-verify.com's SPF record.", plainLanguage: "Same unauthorized sending server as the related incident — the sender address is spoofed." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=paypal-secure-verify.com.", plainLanguage: "The signature matches, but the domain itself is the same recently registered domain seen in the related phishing message." },
    { protocol: "DMARC", result: "FAIL", detail: "Policy p=reject; alignment failed on From: header.", plainLanguage: "The domain's policy calls for rejection, so a properly configured mail server would not have delivered this." },
  ],
  ips: [
    { ip: "185.220.101.47", approximateLocation: "Approximate IP infrastructure location: Bucharest, Romania", asn: "AS9009 (M247 Ltd)", reputation: "malicious", riskLevel: "critical", notes: "Same infrastructure used in EML-40921, sent five hours earlier." },
  ],
  domains: [
    { domain: "paypal-secure-verify.com", registered: "2026-08-27", registrar: "NiceNIC.NET", reputation: "malicious", riskLevel: "critical", notes: "Reused across both messages in this campaign." },
  ],
  urls: [
    { url: "hxxps://paypal-secure-verify.com/portal/sso-review", category: "Credential harvesting", reputation: "malicious", riskLevel: "critical", notes: "Fake single sign-on form; harvested credentials match the pattern from the related incident." },
  ],
  timeline: [
    { time: "14:07", label: "Email received", detail: "Message ingested from mail gateway for r.acharya@northbridge-logistics.com.", status: "info" },
    { time: "14:07", label: "SPF authentication failed", detail: "Sending IP not authorized for claimed domain.", status: "critical" },
    { time: "14:08", label: "Suspicious URL extracted", detail: "1 URL extracted and queued for reputation analysis.", status: "warning" },
    { time: "14:08", label: "IP reputation checked", detail: "185.220.101.47 matched prior campaign infrastructure.", status: "warning" },
    { time: "14:09", label: "Related incident found", detail: "Correlated with EML-40921 via shared domain and IP.", status: "warning" },
    { time: "14:10", label: "Threat classified HIGH RISK", detail: "Composite risk score calculated at 88/100.", status: "critical" },
    { time: "14:11", label: "Investigation generated", detail: "Forensic report INV-58239 created and queued for analyst review.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "It scores 88/100 due to failed SPF and DMARC checks, a fake single sign-on page requesting corporate credentials, and reuse of the exact sending domain and IP seen in the related phishing incident from the same day.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "The message impersonates an internal document-sharing portal while originating from an external domain, creates urgency around a link expiring, and directs the recipient to a login page designed to capture their work credentials.",
    },
    {
      question: "Are there related incidents?",
      answer: "Yes — this message shares its sending domain and IP address with EML-40921, sent roughly five hours earlier to a different recipient at the same organization. Both are grouped under campaign CMP-1187.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "SPF and DMARC both failed, matching the pattern seen in the related incident. DKIM passed but does not offset the domain-level failures.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "Check whether either recipient submitted credentials, force a password reset for both mailboxes as a precaution, review sign-in logs for anomalous access, and confirm the malicious domain and IP are blocked organization-wide.",
    },
  ],
  attachments: [],
};

const legitimateEmail: EmailRecord = {
  id: "EML-40958",
  incidentId: "INV-58244",
  subject: "Q3 Logistics Review — Meeting Notes Attached",
  from: "Priya Nair <priya.nair@northbridge-logistics.com>",
  fromDomain: "northbridge-logistics.com",
  to: "team-ops@northbridge-logistics.com",
  receivedAt: "2026-09-02T11:20:00+05:30",
  riskScore: 4,
  riskLevel: "safe",
  threatType: "None",
  bodyPreview:
    "Sharing notes from this morning's Q3 review. Action items are highlighted at the bottom — let me know if I've missed anything before Friday's follow-up.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: false, detail: "No credential-related links present in the message body." },
    { label: "Sender / domain mismatch", detected: false, detail: "Sending domain matches the organization's verified mail infrastructure." },
    { label: "Urgent authentication request", detected: false, detail: "No urgency or account-verification language detected." },
    { label: "SPF failure", detected: false, detail: "Sending server is listed in the organization's SPF record." },
    { label: "DMARC failure", detected: false, detail: "Passes domain alignment under the organization's DMARC policy." },
    { label: "Suspicious domain reputation", detected: false, detail: "Domain has an established, clean sending history." },
    { label: "Related incidents detected", detected: false, detail: "No correlation with any open campaign." },
  ],
  auth: [
    { protocol: "SPF", result: "PASS", detail: "10.44.2.18 is listed in northbridge-logistics.com's SPF record.", plainLanguage: "The sending server is on the organization's approved list — the sender address is legitimate." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=northbridge-logistics.com.", plainLanguage: "The message content matches what was signed and hasn't been tampered with in transit." },
    { protocol: "DMARC", result: "PASS", detail: "Policy p=reject; alignment passed on From: header.", plainLanguage: "The message fully aligns with the domain's own authentication policy — a clean result across the board." },
  ],
  ips: [
    { ip: "10.44.2.18", approximateLocation: "Approximate IP infrastructure location: Hyderabad, India", asn: "AS45194 (Corporate mail relay)", reputation: "clean", riskLevel: "safe", notes: "Internal corporate mail relay with consistent sending history." },
  ],
  domains: [
    { domain: "northbridge-logistics.com", registered: "2014-03-02", registrar: "GoDaddy.com, LLC", reputation: "clean", riskLevel: "safe", notes: "Organization's own primary domain, registered over a decade ago." },
  ],
  urls: [],
  timeline: [
    { time: "11:20", label: "Email received", detail: "Message ingested from mail gateway for team-ops@northbridge-logistics.com.", status: "info" },
    { time: "11:20", label: "Authentication checks passed", detail: "SPF, DKIM, and DMARC all passed.", status: "success" },
    { time: "11:20", label: "No indicators detected", detail: "Content and link analysis found no threat indicators.", status: "success" },
    { time: "11:21", label: "Classified SAFE", detail: "Composite risk score calculated at 4/100.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "It isn't — this message scores 4/100. All three authentication checks pass, the sending domain is the organization's own verified infrastructure, and no phishing indicators were detected in the content or links.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "None were found. There is no sender impersonation, no urgency language, and no credential-harvesting links in this message.",
    },
    {
      question: "Are there related incidents?",
      answer: "No. This message has no correlation with any open campaign or flagged infrastructure.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "None — SPF, DKIM, and DMARC all passed, which is consistent with mail sent from the organization's own domain.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "No further action is needed. This message can remain classified as safe.",
    },
  ],
  attachments: [{ name: "Q3-review-notes.pdf", type: "application/pdf", verdict: "safe" }],
};

export const emails: EmailRecord[] = [phishingEmail, credentialTheftEmail, legitimateEmail];

export const campaign: Campaign = {
  id: "CMP-1187",
  name: "PayPal Impersonation — Credential Harvesting Wave",
  relatedIncidents: 3,
  confidence: 87,
  sharedDomain: "paypal-secure-verify.com",
  sharedIp: "185.220.101.47",
  emailIds: [phishingEmail.id, credentialTheftEmail.id],
};

export const recentInvestigations = [
  { incidentId: phishingEmail.incidentId, subject: phishingEmail.subject, riskLevel: phishingEmail.riskLevel, riskScore: phishingEmail.riskScore, receivedAt: phishingEmail.receivedAt, analyst: "Unassigned" },
  { incidentId: credentialTheftEmail.incidentId, subject: credentialTheftEmail.subject, riskLevel: credentialTheftEmail.riskLevel, riskScore: credentialTheftEmail.riskScore, receivedAt: credentialTheftEmail.receivedAt, analyst: "Unassigned" },
  { incidentId: legitimateEmail.incidentId, subject: legitimateEmail.subject, riskLevel: legitimateEmail.riskLevel, riskScore: legitimateEmail.riskScore, receivedAt: legitimateEmail.receivedAt, analyst: "Auto-cleared" },
  { incidentId: "INV-58198", subject: "Invoice #4471 Overdue — Immediate Payment Needed", riskLevel: "high" as const, riskScore: 79, receivedAt: "2026-09-01T16:32:00+05:30", analyst: "A. Fernandes" },
  { incidentId: "INV-58177", subject: "Your Mailbox Storage Is Almost Full", riskLevel: "medium" as const, riskScore: 54, receivedAt: "2026-09-01T10:05:00+05:30", analyst: "A. Fernandes" },
];

export const historyRecords = [
  ...recentInvestigations,
  { incidentId: "INV-58160", subject: "Wire Transfer Confirmation Needed — Urgent", riskLevel: "critical" as const, riskScore: 94, receivedAt: "2026-08-31T09:14:00+05:30", analyst: "S. Rao" },
  { incidentId: "INV-58142", subject: "New Voicemail Message Received", riskLevel: "low" as const, riskScore: 22, receivedAt: "2026-08-30T13:47:00+05:30", analyst: "Auto-cleared" },
  { incidentId: "INV-58121", subject: "Weekly Team Standup Notes", riskLevel: "safe" as const, riskScore: 2, receivedAt: "2026-08-30T09:02:00+05:30", analyst: "Auto-cleared" },
  { incidentId: "INV-58098", subject: "Password Expiry Notice — Reset Within 24 Hours", riskLevel: "high" as const, riskScore: 83, receivedAt: "2026-08-29T15:51:00+05:30", analyst: "S. Rao" },
];

export function getEmailById(id: string) {
  return emails.find((e) => e.id === id);
}
