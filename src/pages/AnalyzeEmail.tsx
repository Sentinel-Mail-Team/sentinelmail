/**
 * SentinelMail — Analyze Email
 * -----------------------------------------------------------------------
 * Route:        "/analyze"
 * Purpose:      Entry point of the detection pipeline. Accepts a real
 *               .eml upload (drag-and-drop or file picker), parses it
 *               client-side, and scores it live via the rule-based
 *               engine — or loads a curated demo phishing sample.
 * Data source:  `parseEmailFile()` + `analyzeParsedEmail()` for real
 *               uploads; a fixed demo record ("EML-40921") for the
 *               "Load Sample" path.
 * -----------------------------------------------------------------------
 */
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { parseEmailFile } from "@/lib/emailParser";
import { analyzeParsedEmail } from "@/lib/analyzeEngine";
import { useAnalysisStore } from "@/lib/store";

const STEPS = [
  "Parsing Email",
  "Extracting Indicators",
  "Authentication Check",
  "Threat Analysis",
  "Correlation",
  "Investigation",
];

export function AnalyzeEmail() {
  const navigate = useNavigate();
  const addRecord = useAnalysisStore((s) => s.add);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runStepAnimation = useCallback((onDone: () => void) => {
    setAnalyzing(true);
    setStepIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= STEPS.length) {
        clearInterval(interval);
        setTimeout(onDone, 350);
        return;
      }
      setStepIndex(i);
    }, 500);
  }, []);

  const analyzeRealFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(file.name);
      runStepAnimation(async () => {
        try {
          const parsed = await parseEmailFile(file);
          const record = analyzeParsedEmail(parsed);
          addRecord(record);
          navigate(`/analysis/${record.id}`);
        } catch (e) {
          setAnalyzing(false);
          setError(
            "Couldn't parse this file as a valid .eml message. Make sure it's a raw email export (not .msg or a screenshot), or try the sample instead."
          );
        }
      });
    },
    [addRecord, navigate, runStepAnimation]
  );

  const runSampleAnalysis = useCallback(() => {
    setError(null);
    setFileName("sample-phishing-invoice.eml");
    runStepAnimation(() => navigate("/analysis/EML-40921"));
  }, [navigate, runStepAnimation]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) analyzeRealFile(file);
    },
    [analyzeRealFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeRealFile(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold text-text tracking-tight">Analyze Email</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Upload a raw .eml file for real, in-browser forensic analysis, or load a sample to see the full workflow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Upload Email</CardTitle>
            <CardDescription>Accepts .eml files up to 25MB · parsed entirely in your browser</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!analyzing ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors",
                dragging ? "border-cyan/60 bg-cyan/5" : "border-border-soft hover:border-border hover:bg-surface-2/40"
              )}
            >
              <input ref={inputRef} type="file" accept=".eml" className="hidden" onChange={handleFileSelect} />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 border border-border">
                <UploadCloud className="h-5.5 w-5.5 text-text-muted" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm text-text">
                  <span className="text-cyan font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-dim mt-1">.eml files only — each upload is independently parsed and scored</p>
              </div>
              {fileName && !error && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted">
                  <FileText className="h-3.5 w-3.5" />
                  {fileName}
                </div>
              )}
            </div>
          ) : (
            <AnalysisSequence stepIndex={stepIndex} />
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-critical shrink-0 mt-0.5" />
              <p className="text-sm text-critical">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!analyzing && (
        <Card>
          <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25 shrink-0">
                <Sparkles className="h-4.5 w-4.5 text-cyan" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-text font-medium">Load Sample Phishing Email</p>
                <p className="text-xs text-text-muted mt-0.5 max-w-md">
                  Runs the full detection pipeline against a curated credential-theft sample with a pre-built
                  correlation and campaign, so you can see the deeper investigation views populated.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={runSampleAnalysis}>
              Load Sample
            </Button>
          </CardContent>
        </Card>
      )}

      {!analyzing && (
        <p className="text-xs text-text-dim leading-relaxed">
          Real uploads are scored by a rule-based engine (urgency language, brand/domain mismatch, SPF/DKIM/DMARC
          headers if present, suspicious link patterns, risky attachment types) — not a live threat-intelligence feed
          or a trained ML model. IP, domain, and URL reputations shown for real uploads are marked accordingly.
        </p>
      )}
    </div>
  );
}

function AnalysisSequence({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="py-4">
      <ul className="space-y-3">
        {STEPS.map((step, idx) => {
          const done = idx < stepIndex;
          const active = idx === stepIndex;
          return (
            <li key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  done && "bg-safe/15 border-safe/40 text-safe",
                  active && "bg-cyan/15 border-cyan/40 text-cyan",
                  !done && !active && "bg-surface-3 border-border text-text-dim"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-mono",
                  done && "text-text-muted",
                  active && "text-text",
                  !done && !active && "text-text-dim"
                )}
              >
                {step}
              </span>
              {active && (
                <span className="ml-auto h-px flex-1 max-w-24 bg-gradient-to-r from-cyan/40 to-transparent" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
