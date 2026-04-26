"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Zap } from "lucide-react";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import {
  CampaignTable,
  CampaignRow,
} from "@/components/dashboard/CampaignTable";

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [globalTotals, setGlobalTotals] = useState({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    cost: 0,
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/campaigns?page=${pagination.page}&pageSize=${pagination.pageSize}`
      );
      if (res.ok) {
        const result = await res.json();
        setCampaigns(result.data);
        setPagination(result.pagination);
        setGlobalTotals(result.totals);
      }
    } catch {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    const init = async () => {
      await fetchCampaigns();
    };
    init();
  }, [fetchCampaigns]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === campaigns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(campaigns.map((c) => c.id)));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } catch {
      console.error("Failed to delete campaign");
    }
  };

  const handleAnalyze = async () => {
    if (selectedIds.size === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignIds: Array.from(selectedIds) }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/analysis/${data.analysisId}`);
      }
    } catch {
      console.error("Failed to analyze campaigns");
    } finally {
      setAnalyzing(false);
    }
  };



  const chartData = campaigns.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
    conversions: c.conversions,
    cost: c.cost,
  }));

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Dashboard
          </h1>
          <p className="text-label mt-1">
            {pagination.total} campaign{pagination.total !== 1 ? "s" : ""}{" "}
            tracked
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <MetricCards {...globalTotals} />

      {/* Chart */}
      <MetricsChart data={chartData} />

      {/* Campaigns table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-card-title">Campaigns</h2>

          {selectedIds.size > 0 && (
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={analyzing}
              id="analyze-now-btn"
            >
              {analyzing ? (
                <Spinner size="sm" />
              ) : (
                <Zap size={16} strokeWidth={1.5} />
              )}
              {analyzing ? "Analyzing..." : `Analyze now (${selectedIds.size})`}
            </button>
          )}
        </div>
        <CampaignTable
          data={campaigns}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) =>
            setPagination((prev) => ({ ...prev, pageSize, page: 1 }))
          }
        />
      </div>
    </div>
  );
}
