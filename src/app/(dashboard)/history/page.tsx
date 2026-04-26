"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface AnalysisListItem {
  id: string;
  campaignIds: string[];
  summary: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchAnalyses() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: pagination.page.toString(),
          pageSize: pagination.pageSize.toString(),
          search: debouncedSearch,
        });
        const res = await fetch(`/api/analysis?${query}`);
        if (res.ok) {
          const result = await res.json();
          setAnalyses(result.data);
          setPagination(result.pagination);
        }
      } catch {
        console.error("Failed to fetch analyses");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/analysis/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      console.error("Failed to delete analysis");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Analysis History
        </h1>
        <p className="text-label mt-1">
          {pagination.total} analysis report{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-text-secondary)" }}
        />
        <input
          type="text"
          placeholder="Search by summary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: "40px" }}
          id="history-search"
        />
      </div>

      {/* List */}
      {analyses.length === 0 ? (
        <div className="card py-16 text-center">
          <p style={{ color: "var(--color-text-secondary)" }}>
            {pagination.total === 0 && !debouncedSearch
              ? "No analyses yet. Select campaigns from the dashboard and click Analyze now."
              : "No results match your search."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {analyses.map((analysis) => {
              const date = new Date(analysis.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );
              const previewSummary =
                analysis.summary.length > 120
                  ? analysis.summary.slice(0, 120) + "..."
                  : analysis.summary;

              return (
                <div key={analysis.id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-label">{date}</p>
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--color-coral-light)",
                            color: "var(--color-coral)",
                          }}
                        >
                          {analysis.campaignIds.length} campaign
                          {analysis.campaignIds.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {previewSummary}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Link
                        href={`/analysis/${analysis.id}`}
                        className="btn-icon"
                        aria-label="View analysis"
                        id={`view-analysis-${analysis.id}`}
                      >
                        <Eye size={16} strokeWidth={1.5} />
                      </Link>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(analysis.id)}
                        aria-label="Delete analysis"
                        id={`delete-analysis-${analysis.id}`}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                className="btn-icon"
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                disabled={pagination.page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1
                  )
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center gap-1">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="text-label">...</span>
                      )}
                      <button
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: p }))
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          pagination.page === p
                            ? "bg-coral text-white"
                            : "text-text-secondary hover:bg-coral-light hover:text-coral"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                className="btn-icon"
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
