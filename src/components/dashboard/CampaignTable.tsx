"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export interface CampaignRow {
  id: string;
  name: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  startDate: string;
  endDate: string;
}

interface CampaignTableProps {
  data: CampaignRow[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onDelete: (id: string) => void;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CampaignTable({
  data,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onDelete,
  pagination,
  onPageChange,
  onPageSizeChange,
}: CampaignTableProps) {
  const columns = useMemo<ColumnDef<CampaignRow>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={data.length > 0 && selectedIds.size === data.length}
            onChange={onToggleAll}
            className="h-4 w-4 cursor-pointer accent-(--color-coral)"
            aria-label="Select all campaigns"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.has(row.original.id)}
            onChange={() => onToggleSelect(row.original.id)}
            className="h-4 w-4 cursor-pointer accent-(--color-coral)"
            aria-label={`Select ${row.original.name}`}
          />
        ),
        size: 40,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "platform",
        header: "Platform",
        cell: ({ row }) => (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: "var(--color-coral-light)",
              color: "var(--color-coral)",
            }}
          >
            {row.original.platform}
          </span>
        ),
      },
      {
        accessorKey: "impressions",
        header: "Impressions",
        cell: ({ row }) => row.original.impressions.toLocaleString(),
      },
      {
        accessorKey: "clicks",
        header: "Clicks",
        cell: ({ row }) => row.original.clicks.toLocaleString(),
      },
      {
        accessorKey: "conversions",
        header: "Conversions",
        cell: ({ row }) => row.original.conversions.toLocaleString(),
      },
      {
        accessorKey: "cost",
        header: "Cost",
        cell: ({ row }) =>
          `$${row.original.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      },
      {
        id: "dateRange",
        header: "Date Range",
        cell: ({ row }) => {
          const start = new Date(row.original.startDate).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          );
          const end = new Date(row.original.endDate).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          );
          return `${start} - ${end}`;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="btn-icon"
            onClick={() => onDelete(row.original.id)}
            aria-label={`Delete ${row.original.name}`}
            id={`delete-campaign-${row.original.id}`}
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        ),
        size: 48,
      },
    ],
    [data, selectedIds, onToggleAll, onToggleSelect, onDelete]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="card flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  No campaigns yet. Ready to start?
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-border-light pt-4">
        <div className="flex items-center gap-4">
          <p className="text-label">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} results
          </p>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-white px-2 py-1 text-xs outline-none focus:border-coral"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn-icon"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
              .map((p, i, arr) => (
                <div key={p} className="flex items-center gap-1">
                  {i > 0 && arr[i - 1] !== p - 1 && <span className="text-label">...</span>}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
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
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
