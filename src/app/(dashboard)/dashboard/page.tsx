"use client";

import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { Spinner, useOverlayState } from "@heroui/react";
import { Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { MetricCards } from "@/components/dashboard/MetricCards";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
} from "@/app/services/campaigns";
import { useAnalyzeCampaignsMutation } from "@/app/services/analysis";
import AnalyzeLoadingModal from "@/components/dashboard/AnalyzeLoadingModal";

export default function DashboardPage() {
  const router = useRouter();

  const { isOpen, setOpen } = useOverlayState();
  const {
    isOpen: isDeleteModalOpen,
    setOpen: setDeleteModalOpen,
    close: closeDeleteModal,
  } = useOverlayState();

  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, isFetching } = useGetCampaignsQuery(
    pagination.page,
    pagination.pageSize,
    search,
    platform,
  );
  const deleteMutation = useDeleteCampaignMutation();
  const analyzeMutation = useAnalyzeCampaignsMutation();

  const campaigns = useMemo(() => {
    return (data?.data ?? []).map((c) => ({
      ...c,
      startDate: new Date(c.startDate).toISOString(),
      endDate: new Date(c.endDate).toISOString(),
    }));
  }, [data]);

  const paginationData = useMemo(
    () =>
      data?.pagination ?? {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    [data],
  );

  const globalTotals = useMemo(
    () =>
      data?.totals ?? {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
      },
    [data],
  );

  const chartData = useMemo(
    () =>
      campaigns.map((c) => ({
        name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
        conversions: c.conversions,
        cost: c.cost,
      })),
    [campaigns],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
      }, 500),
    [],
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        closeDeleteModal();
      },
    });
  };

  const handleAnalyze = async () => {
    if (selectedIds.size === 0) return;
    setOpen(true);
    analyzeMutation.mutate(Array.from(selectedIds), {
      onSuccess: (data) => {
        router.push(`/analysis/${data.analysisId}`);
      },
      onError: () => {
        setOpen(false);
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Dashboard
          </h1>
          <p className="text-label mt-1">
            {paginationData.total} campaign
            {paginationData.total !== 1 ? "s" : ""} tracked
          </p>
        </div>
      </div>

      <MetricCards {...globalTotals} />

      <MetricsChart data={chartData} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-card-title">Campaigns</h2>

          <button
            className="btn-primary analyze-button disabled:cursor-not-allowed disabled:opacity-30"
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending || selectedIds.size === 0}
            id="analyze-now-btn"
          >
            {analyzeMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              <Zap size={16} strokeWidth={1.5} />
            )}
            {analyzeMutation.isPending
              ? "Analyzing..."
              : `Analyze now (${selectedIds.size})`}
          </button>
        </div>

        {campaigns.length === 0 && !localSearch && !search && !platform && !isFetching ? (
          <div className="empty-dashboard-state card flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-coral-light text-coral">
              <Zap size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold">No campaigns yet</h2>
            <p className="mt-2 max-w-sm text-text-secondary">
              Upload a CSV from your ad platform or add a campaign manually to
              start analyzing with AI.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => router.push("/campaigns/new")}
                className="btn-primary"
              >
                Add Manually
              </button>
              <button
                onClick={() => router.push("/campaigns/upload")}
                className="btn-secondary"
              >
                Upload CSV
              </button>
            </div>
          </div>
        ) : (
          <CampaignTable
            data={campaigns}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            onDelete={handleDelete}
            search={localSearch}
            onSearchChange={handleSearchChange}
            platform={platform}
            onPlatformChange={handlePlatformChange}
            pagination={paginationData}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onPageSizeChange={(pageSize) =>
              setPagination((prev) => ({ ...prev, pageSize, page: 1 }))
            }
            isDeleteModalOpen={isDeleteModalOpen}
            onDeleteModalOpenChange={setDeleteModalOpen}
            isFilteredState={!!(search || platform || isFetching)}
          />
        )}
      </div>

      <AnalyzeLoadingModal isOpen={isOpen} onOpenChange={setOpen} />
    </div>
  );
}
