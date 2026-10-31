# SentinelMail — AI Email Threat Detection & Forensics (MVP Frontend)

A SOC-style dashboard demonstrating the full email threat investigation flow:
**Upload Email → Analyze → Risk Score → Authentication → Threat Intelligence → Correlation → Investigation → Report**

This is a frontend-only demo — there is no backend and no external API calls — but real
`.eml` uploads are genuinely parsed and scored client-side (see "How analysis works" below).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Recharts (trend / distribution charts)
- @xyflow/react (React Flow) for the correlation graph
- lucide-react icons
- react-router-dom
- postal-mime — client-side `.eml` parsing
- zustand — session-only store for real uploaded/analyzed emails

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## How analysis works

**Uploading a real `.eml` file** (drag-and-drop or click-to-upload) is genuinely parsed
in the browser and scored by a rule-based engine in `src/lib/analyzeEngine.ts`. It checks:

- Urgency/pressure language in the subject or body
- Brand name mentioned vs. sending domain mismatch
- Reply-To domain differing from the From domain
- Suspicious link patterns (URL shorteners, IP-literal links, login/verify-style paths)
- Real SPF/DKIM/DMARC results parsed from the message's `Authentication-Results` header,
  if present — if the header is absent, this is reported as "not verifiable," not faked
- Risky attachment extensions (.exe, .scr, .js, etc.)

Each uploaded email gets its own generated ID and is stored in a session-only in-memory
store, so it shows up in **Dashboard → Recent Investigations** and **History** alongside
the built-in demo data, labeled "You (uploaded)". Refreshing the browser clears uploaded
analyses (no backend/persistence) — this is intentional for the MVP.

**What real uploads do *not* have:** live threat-intelligence reputation (VirusTotal,
URLhaus, WHOIS, IP geolocation) or a trained ML classifier — none of that is connected in
this demo. Every IP/domain/URL reputation for a real upload is explicitly labeled
`unknown`/pattern-based with a note saying so, rather than fabricating a "malicious"
verdict. Only the three built-in demo emails have curated, hand-written threat-intel data
and a pre-built campaign correlation, since those require data this demo doesn't fetch live.

**Load Sample Phishing Email** (on the Analyze Email page) still uses the curated demo
email so you can see the full correlation graph, campaign detection, and richer threat
intel populated end-to-end.

## For presenting this project (viva / college demo)

Two things are built specifically to make this easy to present:

- **Settings → About This Project** — problem statement, objective, tech stack, and an
  honest scope/limitations list, plus a Team & Guide section with placeholders for you
  to fill in before presenting.
- **Any Analysis Results page → "How this score is calculated"** — an expandable panel
  showing the actual weighted rule table the engine uses (baseline + per-indicator point
  values + risk-level thresholds), so you have a ready, accurate answer if asked
  "what algorithm/model is this."

## Demo flow

1. Go to **Analyze Email** and either:
   - Drop in your own `.eml` file to see a real, independently-scored result, or
   - Click **Load Sample** to see the curated phishing example with a full campaign correlation.
2. Watch the analysis pipeline animate through its six stages, then land on
   **Analysis Results**.
3. From there, jump into **Threat Intelligence**, **Correlation Graph**, and
   **Investigation Timeline** — each page has a dropdown to switch between whichever
   emails currently exist (demo + anything you've uploaded this session).
4. **Reports** renders a full forensic report per incident and supports
   **Print / Export Report** via the browser print dialog.
5. **History** lists all past incidents with risk-level filters, uploads included.

## Project structure

```
src/
  components/
    layout/       Sidebar, Topbar, AppLayout
    charts/       Recharts wrappers (trend, distribution)
    ui/           Button, Card, Table, RiskBadge, ScoreDial, StatTile
    CorrelationNode.tsx   custom React Flow node
    AiInvestigatorPanel.tsx
    ScoringMethodology.tsx   "how this score is calculated" panel (Analysis Results)
    EmailSwitcher.tsx
  data/
    types.ts      domain model types
    mock.ts        curated demo data (3 sample emails, campaign, dashboard stats)
  lib/
    risk.ts        risk-level → color/label mapping
    utils.ts       cn() class merge helper
    emailParser.ts  postal-mime wrapper — turns a File into structured fields
    analyzeEngine.ts rule-based scorer — turns parsed fields into an EmailRecord
    store.ts        zustand store holding real analyzed uploads (session only)
    emails.ts        hooks merging demo data + real uploads for every page
  pages/           one file per route
```

## Notes for wiring up a real backend later

- The `EmailRecord` shape in `src/data/types.ts` is designed to map cleanly onto a
  parsed `.eml` + real enrichment result — `analyzeEngine.ts` already produces this
  shape from real (if heuristic) data, so swapping in real APIs means replacing the
  scoring logic inside it, not the data model.
- Real threat-intel: call VirusTotal/URLhaus for the extracted `urls[]`/`domains[]`/`ips[]`
  instead of tagging them `"unknown"`.
- Real ML: replace the weighted-heuristic score in `analyzeParsedEmail()` with a call to
  a trained classifier (see conversation history / project notes for suggested model types).
- Real AI Investigator: replace the templated `aiQa` answers with a live LLM call fed the
  same indicators as context (RAG-style), instead of string templates.
- IP "location" is deliberately worded as **"Approximate IP infrastructure location"**
  (or explicitly "unavailable" for real uploads) throughout — keep that phrasing if you
  wire in real IP intelligence data, to avoid implying attacker geolocation.
