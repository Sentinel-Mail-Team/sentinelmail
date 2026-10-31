/**
 * SentinelMail — Analysis Session Store
 * -----------------------------------------------------------------------
 * A minimal zustand store holding real emails the user has uploaded
 * and analyzed this session. In-memory only — no backend, no
 * persistence, cleared on page refresh. See `src/lib/emails.ts` for
 * the hooks that merge this with the curated demo data set.
 *
 * NOTE: only the raw `records` map is exposed from this store. A
 * derived/sorted array must NOT be computed inside a selector — doing
 * so returns a new array reference on every call and breaks React's
 * useSyncExternalStore snapshot caching (causes an infinite render
 * loop). Sorting happens in `useMemo` in `src/lib/emails.ts` instead.
 * -----------------------------------------------------------------------
 */
import { create } from "zustand";
import type { EmailRecord } from "@/data/types";

interface AnalysisStore {
  records: Record<string, EmailRecord>;
  add: (record: EmailRecord) => void;
}

// NOTE: only expose the raw `records` map from the store selector. Deriving a
// sorted array *inside* a selector (e.g. `list: () => Object.values(...).sort()`)
// returns a new array reference on every call, which breaks React's
// useSyncExternalStore snapshot caching and causes an infinite render loop.
// Sorting/array conversion happens in useMemo in src/lib/emails.ts instead.
export const useAnalysisStore = create<AnalysisStore>((set) => ({
  records: {},
  add: (record) =>
    set((state) => ({ records: { ...state.records, [record.id]: record } })),
}));
