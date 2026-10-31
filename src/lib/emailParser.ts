import PostalMime from "postal-mime";

export interface ParsedEmail {
  subject: string;
  fromName: string;
  fromAddress: string;
  toAddress: string;
  replyToAddress: string | null;
  date: string | null;
  text: string;
  html: string;
  rawHeaders: { key: string; value: string }[];
  authResultsHeader: string | null;
  receivedHeaders: string[];
  attachments: { filename: string; mimeType: string; size: number }[];
}

export async function parseEmailFile(file: File): Promise<ParsedEmail> {
  const buffer = await file.arrayBuffer();
  const parser = new PostalMime();
  const parsed = await parser.parse(buffer);

  const rawHeaders = (parsed.headers ?? []).map((h) => ({ key: h.key, value: h.value }));
  const authResultsHeader =
    rawHeaders.find((h) => h.key.toLowerCase() === "authentication-results")?.value ?? null;
  const receivedHeaders = rawHeaders.filter((h) => h.key.toLowerCase() === "received").map((h) => h.value);

  const fromAddress = parsed.from?.address ?? "unknown@unknown";
  const replyTo = parsed.replyTo?.[0]?.address ?? null;

  return {
    subject: parsed.subject ?? "(no subject)",
    fromName: parsed.from?.name || fromAddress,
    fromAddress,
    toAddress: parsed.to?.[0]?.address ?? "unknown-recipient",
    replyToAddress: replyTo,
    date: parsed.date ?? null,
    text: parsed.text ?? "",
    html: parsed.html ?? "",
    rawHeaders,
    authResultsHeader,
    receivedHeaders,
    attachments: (parsed.attachments ?? []).map((a) => ({
      filename: a.filename ?? "unnamed-attachment",
      mimeType: a.mimeType ?? "application/octet-stream",
      size: typeof a.content === "string" ? a.content.length : a.content?.byteLength ?? 0,
    })),
  };
}
