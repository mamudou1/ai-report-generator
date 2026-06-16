// app/page.tsx
"use client";

import { useState }           from "react";
import { useMutation, useQuery } from "convex/react";
import { api }                from "@/convex/_generated/api";
import { Id }                 from "@/convex/_generated/dataModel";
import ReportForm             from "@/components/ReportForm";
import ReportList             from "@/components/ReportList";
import ReportPreview          from "@/components/ReportPreview";

interface ActiveReport {
  _id?:       Id<"reports">;
  title:      string;
  topic:      string;
  reportType: string;
  format:     string;
  content:    string;
  createdAt?: number;
  wordCount?: number;
}

// ── Download helper ────────────────────────────────────────────────────────
async function downloadReport(report: ActiveReport) {
  const res = await fetch("/api/download", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      title:      report.title,
      content:    report.content,
      format:     report.format,
      reportType: report.reportType,
    }),
  });

  if (!res.ok) { alert("Download failed. Please try again."); return; }

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${report.title.replace(/\s+/g, "_")}.${report.format}`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeReport, setActiveReport] = useState<ActiveReport | null>(null);
  const [generating,   setGenerating]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [view,         setView]         = useState<"form" | "preview">("form");

  const createReport = useMutation(api.reports.createReport);
  const reports      = useQuery(api.reports.listReports) ?? [];

  // ── Generate ──────────────────────────────────────────────────────────
  const handleGenerate = async (formData: {
    title: string; topic: string; reportType: string; format: string;
  }) => {
    setError(null);
    setGenerating(true);
    setView("form");

    try {
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.content) throw new Error(data.error || "Generation failed");

      // Save to Convex
      const id = await createReport({
        title:      formData.title,
        topic:      formData.topic,
        content:    data.content,
        format:     formData.format,
        reportType: formData.reportType,
      });

      setActiveReport({ ...formData, content: data.content, _id: id });
      setView("preview");

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  // ── Select from sidebar ────────────────────────────────────────────────
  const handleSelect = (r: ActiveReport) => {
    setActiveReport(r);
    setView("preview");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Top header ── */}
      <header className="flex items-center justify-between bg-[#0f172a] px-6 py-3.5 shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">AI Report Generator</h1>
          <p className="text-slate-400 text-xs">Branded, consistent reports — powered by Claude</p>
        </div>
        <button
          onClick={() => { setActiveReport(null); setView("form"); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400
                     text-white transition"
        >
          + New Report
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-72 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <ReportList
            reports={reports as ActiveReport[]}
            activeId={activeReport?._id as string}
            onSelect={handleSelect}
            onDownload={downloadReport}
          />
        </aside>

        {/* ── Main panel ── */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">

          {/* Tab switcher (only visible when a report is loaded) */}
          {activeReport && (
            <div className="flex gap-1 mb-5 bg-white border border-slate-200 rounded-lg p-1 w-fit">
              {(["form", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition capitalize
                              ${view === tab
                                ? "bg-blue-700 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700"}`}
                >
                  {tab === "form" ? "Edit / New" : "Preview"}
                </button>
              ))}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg
                            text-sm text-red-700 flex items-center gap-2">
              <span>⚠</span> {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          {/* Content area */}
          <div className="max-w-3xl mx-auto">
            {view === "form" || !activeReport ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-800 mb-1">Create a New Report</h2>
                <p className="text-xs text-slate-400 mb-5">
                  Fill in the details and Claude will generate a fully structured, branded report.
                </p>
                <ReportForm onGenerate={handleGenerate} generating={generating} />
              </div>
            ) : (
              <ReportPreview
                title={activeReport.title}
                content={activeReport.content}
                reportType={activeReport.reportType}
                format={activeReport.format}
                onDownload={() => downloadReport(activeReport)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
