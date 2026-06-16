// components/ReportPreview.tsx
"use client";

interface ReportPreviewProps {
  title:      string;
  content:    string;
  reportType: string;
  onDownload: () => void;
  format:     string;
}

// Minimal markdown → JSX renderer (no external deps)
function renderMarkdown(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-lg font-bold text-blue-800 mt-7 mb-2 pb-1.5
                                border-b border-blue-200">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="text-base font-semibold text-blue-700 mt-5 mb-1.5">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={i} className="ml-5 list-disc text-sm text-slate-700 my-0.5 leading-relaxed">
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1">
        {line}
      </p>
    );
  });
}

export default function ReportPreview({
  title, content, reportType, onDownload, format,
}: ReportPreviewProps) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const company = {
    name:    process.env.NEXT_PUBLIC_COMPANY_NAME    || "Acme Corporation",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "123 Business Avenue, Banjul, The Gambia",
  };

  return (
    <div className="space-y-4">
      {/* Download bar */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200
                      rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Report ready</p>
          <p className="text-xs text-slate-400">Preview below — download when you&apos;re satisfied</p>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600
                     text-white text-sm font-semibold transition shadow-sm"
        >
          <span>↓</span>
          <span>Download {format.toUpperCase()}</span>
        </button>
      </div>

      {/* Paper preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Company header band */}
        <div className="bg-[#0f172a] px-8 py-5 text-center">
          <p className="text-white font-bold text-xl tracking-wide">{company.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">{company.address}</p>
        </div>

        {/* Blue accent bar */}
        <div className="h-1 bg-blue-700" />

        {/* Report header */}
        <div className="px-8 py-6 border-b border-slate-100 text-center">
          <h1 className="text-2xl font-bold text-blue-800">{title}</h1>
          <p className="text-sm text-slate-400 italic mt-1">{reportType}  ·  {dateStr}</p>
        </div>

        {/* Report body */}
        <div className="px-8 py-6 min-h-[400px]">
          {renderMarkdown(content)}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-8 py-3 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">
            {company.name}  ·  Confidential  ·  Generated on {dateStr}
          </p>
        </div>
      </div>
    </div>
  );
}
