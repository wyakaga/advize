"use client";

import { useEffect, useState, useMemo, ChangeEvent, useCallback } from "react";
import Link from "next/link";
import { Spinner, Dropdown } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Search, ChevronLeft, ChevronRight, X, MoreVertical } from "lucide-react";
import debounce from "lodash.debounce";

import {
  useGetAnalysesQuery,
  useDeleteAnalysisMutation,
} from "@/app/services/analysis";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useGetAnalysesQuery(page, pageSize, search);
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteAnalysisMutation();

  const analyses = useMemo(() => {
    if (!data) return [];

    return data.data;
  }, [data]);
  const pagination = useMemo(() => {
    if (!data)
      return {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };

    return data.pagination;
  }, [data]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    [],
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["analyses"] });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
          value={localSearch}
          onChange={handleSearch}
          className="form-input w-full"
          style={{ paddingLeft: "40px", paddingRight: localSearch ? "40px" : "12px" }}
          id="history-search"
        />
        {localSearch && (
          <button
            onClick={() => {
              setLocalSearch("");
              setSearch("");
              setPage(1);
              debouncedSearch.cancel();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-label hover:text-coral transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {analyses.length === 0 ? (
        <div className="card py-16 text-center">
          <p style={{ color: "var(--color-text-secondary)" }}>
            {!search
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
                },
              );
              const previewSummary =
                analysis.summary.length > 120
                  ? analysis.summary.slice(0, 120) + "..."
                  : analysis.summary;

              return (
                <Link 
                  key={analysis.id} 
                  href={`/analysis/${analysis.id}`}
                  className="card block cursor-pointer transition-shadow hover:shadow-md no-underline"
                  style={{ color: "inherit" }}
                >
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
                    <div className="flex shrink-0 gap-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <div
                            className="btn-icon"
                            aria-label="Actions"
                            id={`actions-analysis-${analysis.id}`}
                          >
                            <MoreVertical size={16} strokeWidth={1.5} />
                          </div>
                        </Dropdown.Trigger>
                        <Dropdown.Popover>
                          <Dropdown.Menu aria-label="Analysis Actions">
                            <Dropdown.Item
                              key="delete"
                              id={`delete-analysis-${analysis.id}`}
                              textValue="Delete"
                              variant="danger"
                              onPress={() => handleDelete(analysis.id)}
                              isDisabled={deleteMutation.isPending && deleteMutation.variables === analysis.id}
                            >
                              <div className="flex items-center gap-2 text-danger">
                                {deleteMutation.isPending && deleteMutation.variables === analysis.id ? (
                                  <Spinner size="sm" color="danger" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                Delete
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                className="btn-icon"
                onClick={() => setPage((p) => p - 1)}
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
                      Math.abs(p - pagination.page) <= 1,
                  )
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center gap-1">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="text-label">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
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
                onClick={() => setPage((p) => p + 1)}
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
