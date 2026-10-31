import { useMemo } from "react";
import { emails as demoEmails, recentInvestigations as demoRecent, historyRecords as demoHistory } from "@/data/mock";
import { useAnalysisStore } from "@/lib/store";
import type { EmailRecord } from "@/data/types";

function useUploadedList(): EmailRecord[] {
  const records = useAnalysisStore((s) => s.records);
  // records (the store's raw map) only changes reference when add() is called,
  // so this only recomputes when a new email is actually analyzed.
  return useMemo(
    () => Object.values(records).sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1)),
    [records]
  );
}

/** All emails: static demo set + anything the user has actually uploaded and analyzed this session. */
export function useAllEmails(): EmailRecord[] {
  const uploaded = useUploadedList();
  return useMemo(() => [...uploaded, ...demoEmails], [uploaded]);
}

export function useEmailById(id: string | undefined): EmailRecord | undefined {
  const records = useAnalysisStore((s) => s.records);
  if (!id) return undefined;
  return records[id] ?? demoEmails.find((e) => e.id === id);
}

export function useEmailByIncidentId(incidentId: string | undefined): EmailRecord | undefined {
  const uploaded = useUploadedList();
  if (!incidentId) return undefined;
  return (
    uploaded.find((e) => e.incidentId === incidentId) ??
    demoEmails.find((e) => e.incidentId === incidentId)
  );
}

function toRow(e: EmailRecord, analyst: string) {
  return {
    incidentId: e.incidentId,
    subject: e.subject,
    riskLevel: e.riskLevel,
    riskScore: e.riskScore,
    receivedAt: e.receivedAt,
    analyst,
  };
}

/** Recent-investigations row list, with real uploads surfaced first. */
export function useRecentInvestigations() {
  const uploaded = useUploadedList();
  return useMemo(
    () => [...uploaded.map((e) => toRow(e, "You (uploaded)")), ...demoRecent],
    [uploaded]
  );
}

/** Full history table rows, with real uploads surfaced first. */
export function useHistoryRecords() {
  const uploaded = useUploadedList();
  return useMemo(
    () => [...uploaded.map((e) => toRow(e, "You (uploaded)")), ...demoHistory],
    [uploaded]
  );
}
