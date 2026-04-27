"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import {
  ArrowLeft,
  FileDown,
  AlertTriangle,
  Lightbulb,
  ListOrdered,
} from "lucide-react";

// We will import @react-pdf/renderer dynamically inside the export function to avoid SSR/React 19 issues during initial render
import { PdfDocument } from "@/components/analysis/PdfDocument";

interface AnalysisData {
  id: string;
  summary: string;
  suggestions: {
    summary: string;
    underperforming_campaigns: string[];
    optimization_suggestions: string[];
    prioritized_actions: string[];
  };
  createdAt: string;
  campaigns: Array<{ id: string; name: string; platform: string }>;
}

import { useGetAnalysisQuery } from "@/app/services/analysis";

export default function AnalysisDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const [isMounted, setIsMounted] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { data: analysis, isLoading, isError } = useGetAnalysisQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Analysis not found.
        </p>
        <Link href="/history" className="btn-secondary text-sm">
          Back to History
        </Link>
      </div>
    );
  }

  const suggestions = analysis.suggestions;
  const dateStr = new Date(analysis.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleExportPdf = async () => {
    if (!analysis) return;
    setExporting(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const doc = (
        <PdfDocument
          summary={suggestions.summary ?? analysis.summary}
          underperformingCampaigns={suggestions.underperforming_campaigns ?? []}
          optimizationSuggestions={suggestions.optimization_suggestions ?? []}
          prioritizedActions={suggestions.prioritized_actions ?? []}
          date={dateStr}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `advize-analysis-${analysis.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/history"
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to History
          </Link>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Analysis Report
          </h1>
          <p className="text-label mt-1">{dateStr}</p>
        </div>

        {isMounted && (
          <button
            className="btn-secondary text-sm"
            onClick={handleExportPdf}
            disabled={exporting}
            id="export-pdf-btn"
          >
            <FileDown size={14} strokeWidth={1.5} />
            {exporting ? "Preparing PDF..." : "Export PDF"}
          </button>
        )}
      </div>

      <div className="card">
        <p className="text-label mb-2">
          Campaigns analyzed ({analysis.campaigns.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.campaigns.map((c) => (
            <span
              key={c.id}
              className="inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "var(--color-coral-light)",
                color: "var(--color-coral)",
              }}
            >
              {c.name} ({c.platform})
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-card-title mb-3">Summary</h2>
        <p
          className="text-body leading-relaxed"
          style={{ color: "var(--color-text-primary)" }}
        >
          {suggestions.summary ?? analysis.summary}
        </p>
      </div>

      {suggestions.underperforming_campaigns?.length > 0 && (
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--color-butter)" }}
            />
            <h2 className="text-card-title">Underperforming Campaigns</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {suggestions.underperforming_campaigns.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-body"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-butter)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.optimization_suggestions?.length > 0 && (
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--color-coral)" }}
            />
            <h2 className="text-card-title">Optimization Suggestions</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {suggestions.optimization_suggestions.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-body"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-coral)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.prioritized_actions?.length > 0 && (
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <ListOrdered
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--color-mint)" }}
            />
            <h2 className="text-card-title">Prioritized Actions</h2>
          </div>
          <ol className="flex flex-col gap-2">
            {suggestions.prioritized_actions.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-body"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "var(--color-mint)" }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
