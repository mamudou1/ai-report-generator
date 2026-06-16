// components/ReportForm.tsx
"use client";

import { useState } from "react";

const REPORT_TYPES = [
  "General Report",
  "Financial Report",
  "Technical Report",
  "Marketing Report",
  "HR & People Report",
  "Project Status Report",
  "Strategic Analysis",
  "Risk Assessment",
];

interface ReportFormProps {
  onGenerate: (data: {
    title:      string;
    topic:      string;
    reportType: string;
    format:     string;
  }) => void;
  generating: boolean;
}

export default function ReportForm({ onGenerate, generating }: ReportFormProps) {
  const [title,      setTitle]      = useState("");
  const [topic,      setTopic]      = useState("");
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [format,     setFormat]     = useState("pdf");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;
    onGenerate({ title, topic, reportType, format });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
          Report Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q3 2025 Financial Performance Review"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800
                     placeholder:text-slate-300 text-sm focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Topic / Brief */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
          Topic / Brief
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Describe what this report should cover. The more detail you give, the better the output."
          rows={4}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800
                     placeholder:text-slate-300 text-sm focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Report Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
          Report Type
        </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Output Format */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
          Output Format
        </label>
        <div className="flex gap-3">
          {[
            { value: "pdf",  label: "PDF",       icon: "📄" },
            { value: "docx", label: "Word (.docx)", icon: "📝" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border
                          text-sm font-medium cursor-pointer transition
                          ${format === opt.value
                            ? "border-blue-700 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}
            >
              <input
                type="radio"
                name="format"
                value={opt.value}
                checked={format === opt.value}
                onChange={() => setFormat(opt.value)}
                className="hidden"
              />
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={generating || !title.trim() || !topic.trim()}
        className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-white
                   font-semibold text-sm tracking-wide transition disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {generating ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Generating…
          </>
        ) : (
          "✦ Generate Report"
        )}
      </button>
    </form>
  );
}
