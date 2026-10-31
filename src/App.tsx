import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { AnalyzeEmail } from "@/pages/AnalyzeEmail";
import { AnalysisResults } from "@/pages/AnalysisResults";
import { ThreatIntelligence } from "@/pages/ThreatIntelligence";
import { InvestigationTimeline } from "@/pages/InvestigationTimeline";
import { Reports } from "@/pages/Reports";
import { History } from "@/pages/History";
import { Settings } from "@/pages/Settings";

// React Flow (the correlation graph) pulls in a large dependency graph, so it's
// loaded on demand instead of bundled into the main chunk every page pays for.
const CorrelationGraphPage = lazy(() =>
  import("@/pages/CorrelationGraphPage").then((m) => ({ default: m.CorrelationGraphPage }))
);

function RouteLoading() {
  return <div className="text-sm text-text-muted px-1 py-8">Loading…</div>;
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<AnalyzeEmail />} />
        <Route path="/analysis/:emailId" element={<AnalysisResults />} />
        <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
        <Route
          path="/correlation"
          element={
            <Suspense fallback={<RouteLoading />}>
              <CorrelationGraphPage />
            </Suspense>
          }
        />
        <Route path="/timeline" element={<InvestigationTimeline />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
