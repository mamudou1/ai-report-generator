// components/ReportList.tsx
"use client";

import { useMutation } from "convex/react";
import { api }         from "@/convex/_generated/api";
import { Id }          from "@/convex/_generated/dataModel";

interface Report {
  _id:        Id<"reports">;
  title:      string;
  reportType: string;
  format:     string;
  createdAt:  number;
  wordCount?: number;
  content:    string;
  topic:      string;
}

interface ReportListProps {
  reports:   Report[];
  activeId?: string;
  onSelect:  (r: Report) => void;
  onDownload:(r: Report) => void;
}

export default function ReportList({ reports, activeId, onSelect, onDownload }: ReportListProps) {
  const deleteReport = useMutation(api.reports.deleteReport);

  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="text-4xl mb-3">🗂️</div>
        <p className="text-sm text-slate-400 font-medium">No reports yet</p>
        <p className="text-xs text-slate-300 mt-1">Generated reports will appear here</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <p className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {reports.length} Report{reports.length !== 1 ? "s" : ""}
      </p>
      <ul className="space-y-1 px-2">
        {reports.map((r) => {
          const isActive = r._id === activeId;
          return (
            <li key={r._id}>
              <button
                onClick={() => onSelect(r)}
                className={`w-full text-left px-3 py-3 rounded-lg transition group
                            ${isActive
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-slate-50 border border-transparent"}`}
              >
                {/* Title */}
                <p className={`text-sm font-semibold truncate leading-tight
                               ${isActive ? "text-blue-800" : "text-slate-700"}`}>
                  {r.title}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400">{r.reportType}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className={`text-[10px] font-semibold uppercase ${r.format === "pdf" ? "text-red-400" : "text-blue-400"}`}>
                    {r.format}
                  </span>
                  {r.wordCount && (
                    <>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{r.wordCount.toLocaleString()} words</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">{fmt(r.createdAt)}</p>

                {/* Action buttons — appear on hover / when active */}
                <div className={`flex gap-2 mt-2 ${isActive ? "flex" : "hidden group-hover:flex"}`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDownload(r); }}
                    className="text-[11px] px-2 py-1 rounded bg-blue-700 text-white hover:bg-blue-600 transition font-medium"
                  >
                    Download
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm("Delete this report?")) await deleteReport({ id: r._id });
                    }}
                    className="text-[11px] px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
