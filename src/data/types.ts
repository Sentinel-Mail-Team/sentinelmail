export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export type AuthResult = "PASS" | "FAIL" | "NEUTRAL";

export interface AuthenticationCheck {
  protocol: "SPF" | "DKIM" | "DMARC";
  result: AuthResult;
  detail: string;
  plainLanguage: string;
}

export interface Indicator {
  label: string;
  detected: boolean;
  detail: string;
}

export interface IpIntel {
  ip: string;
  approximateLocation: string;
  asn: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface DomainIntel {
  domain: string;
  registered: string;
  registrar: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface UrlIntel {
  url: string;
  category: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface TimelineEvent {
  time: string;
  label: string;
  detail: string;
  status: "info" | "warning" | "critical" | "success";
}

export interface AiQaPair {
  question: string;
  answer: string;
}

export interface EmailRecord {
  id: string;
  incidentId: string;
  subject: string;
  from: string;
  fromDomain: string;
  replyTo?: string;
  to: string;
  receivedAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  threatType: string;
  campaignId?: string;
  bodyPreview: string;
  indicators: Indicator[];
  auth: AuthenticationCheck[];
  ips: IpIntel[];
  domains: DomainIntel[];
  urls: UrlIntel[];
  timeline: TimelineEvent[];
  aiQa: AiQaPair[];
  attachments: { name: string; type: string; verdict: RiskLevel }[];
}

export interface Campaign {
  id: string;
  name: string;
  relatedIncidents: number;
  confidence: number;
  sharedDomain: string;
  sharedIp: string;
  emailIds: string[];
}
