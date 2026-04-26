"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCSVReader } from "react-papaparse";
import { Spinner } from "@heroui/react";
import { Download, Upload, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";

interface CsvRow {
  name: string;
  platform: string;
  impressions: string;
  clicks: string;
  conversions: string;
  cost: string;
  startDate: string;
  endDate: string;
}

const REQUIRED_COLUMNS = [
  "name",
  "platform",
  "impressions",
  "clicks",
  "conversions",
  "cost",
  "startDate",
  "endDate",
];

const VALID_PLATFORMS = ["Facebook", "Google", "TikTok", "LinkedIn"];

export default function UploadCsvPage() {
  const router = useRouter();
  const { CSVReader } = useCSVReader();
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const validateAndSetData = useCallback(
    (results: { data: string[][] }) => {
      const rawData = results.data;
      if (rawData.length < 2) {
        setErrors(["CSV file is empty or has no data rows."]);
        return;
      }

      const headers = rawData[0].map((h: string) => h.trim().toLowerCase());
      const missing = REQUIRED_COLUMNS.filter(
        (col) => !headers.includes(col.toLowerCase())
      );

      if (missing.length > 0) {
        setErrors([`Missing required columns: ${missing.join(", ")}`]);
        return;
      }

      const colIndex = REQUIRED_COLUMNS.reduce(
        (acc, col) => {
          acc[col] = headers.indexOf(col.toLowerCase());
          return acc;
        },
        {} as Record<string, number>
      );

      const validationErrors: string[] = [];
      const parsed: CsvRow[] = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.every((cell: string) => !cell.trim())) continue;

        const name = row[colIndex.name]?.trim() ?? "";
        const platform = row[colIndex.platform]?.trim() ?? "";
        const impressions = row[colIndex.impressions]?.trim() ?? "";
        const clicks = row[colIndex.clicks]?.trim() ?? "";
        const conversions = row[colIndex.conversions]?.trim() ?? "";
        const cost = row[colIndex.cost]?.trim() ?? "";
        const startDate = row[colIndex.startDate]?.trim() ?? "";
        const endDate = row[colIndex.endDate]?.trim() ?? "";

        if (!name) {
          validationErrors.push(`Row ${i}: Missing campaign name`);
          continue;
        }
        if (!VALID_PLATFORMS.includes(platform)) {
          validationErrors.push(
            `Row ${i}: Invalid platform "${platform}". Use: ${VALID_PLATFORMS.join(", ")}`
          );
          continue;
        }

        parsed.push({
          name,
          platform,
          impressions,
          clicks,
          conversions,
          cost,
          startDate,
          endDate,
        });
      }

      setErrors(validationErrors);
      setRows(parsed);
    },
    []
  );

  const handleConfirmUpload = async () => {
    setUploading(true);
    try {
      const payload = rows.map((r) => ({
        name: r.name,
        platform: r.platform,
        impressions: Number(r.impressions) || 0,
        clicks: Number(r.clicks) || 0,
        conversions: Number(r.conversions) || 0,
        cost: Number(r.cost) || 0,
        startDate: r.startDate,
        endDate: r.endDate,
      }));

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Upload failed");

      setUploaded(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "name,platform,impressions,clicks,conversions,cost,startDate,endDate\nSummer Sale 2026,Facebook,50000,2500,150,1200.00,2026-06-01,2026-06-30\nBrand Awareness Q3,Google,100000,4000,200,2500.00,2026-07-01,2026-09-30";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advize-campaign-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Upload Campaigns
        </h1>
        <p className="text-label mt-1">
          Import campaigns from a CSV file, or{" "}
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-1 font-medium"
            style={{ color: "var(--color-coral)" }}
          >
            <PlusCircle size={12} strokeWidth={1.5} />
            add manually instead
          </Link>
        </p>
      </div>

      <div className="card w-full min-h-[75vh]">
        {/* Template download */}
        <div className="mb-6">
          <button
            className="btn-secondary text-sm"
            onClick={handleDownloadTemplate}
            id="download-template-btn"
          >
            <Download size={14} strokeWidth={1.5} />
            Download CSV template
          </button>
        </div>

        {/* CSV Reader */}
        {!uploaded && rows.length === 0 && (
          <CSVReader
            onUploadAccepted={validateAndSetData}
            config={{ skipEmptyLines: true }}
          >
            {({
              getRootProps,
              acceptedFile,
            }: {
              getRootProps: () => Record<string, unknown>;
              acceptedFile: File | null;
            }) => (
              <div
                {...getRootProps()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-colors hover:border-(--color-coral) h-[60vh]"
                style={{
                  borderColor: acceptedFile
                    ? "var(--color-coral)"
                    : "var(--color-border)",
                  backgroundColor: acceptedFile
                    ? "var(--color-coral-light)"
                    : "transparent",
                }}
              >
                <Upload
                  size={32}
                  strokeWidth={1.5}
                  style={{
                    color: acceptedFile
                      ? "var(--color-coral)"
                      : "var(--color-text-secondary)",
                  }}
                />
                <p
                  className="mt-3 text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {acceptedFile
                    ? acceptedFile.name
                    : "Click or drag a CSV file here"}
                </p>
                <p className="text-label mt-1">
                  Columns: name, platform, impressions, clicks, conversions,
                  cost, startDate, endDate
                </p>
              </div>
            )}
          </CSVReader>
        )}

        {/* Validation errors */}
        {errors.length > 0 && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
            }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={16}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0"
                style={{ color: "#D64545" }}
              />
              <div>
                {errors.map((err, i) => (
                  <p key={i} className="text-sm" style={{ color: "#D64545" }}>
                    {err}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview table */}
        {rows.length > 0 && !uploaded && (
          <div className="mt-6">
            <h3 className="text-card-title mb-3">
              Preview ({rows.length} campaign{rows.length !== 1 ? "s" : ""})
            </h3>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Platform</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Cost</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="font-medium">{row.name}</td>
                      <td>
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--color-coral-light)",
                            color: "var(--color-coral)",
                          }}
                        >
                          {row.platform}
                        </span>
                      </td>
                      <td>{Number(row.impressions).toLocaleString()}</td>
                      <td>{Number(row.clicks).toLocaleString()}</td>
                      <td>{Number(row.conversions).toLocaleString()}</td>
                      <td>${Number(row.cost).toFixed(2)}</td>
                      <td>{row.startDate}</td>
                      <td>{row.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                className="btn-primary"
                onClick={handleConfirmUpload}
                disabled={uploading}
                id="confirm-upload-btn"
              >
                {uploading ? <Spinner size="sm" /> : null}
                {uploading
                  ? "Uploading..."
                  : `Upload ${rows.length} campaign${rows.length !== 1 ? "s" : ""}`}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setRows([]);
                  setErrors([]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {uploaded && (
          <div
            className="mt-4 flex items-center gap-2 rounded-xl p-4"
            style={{
              backgroundColor: "#F0FFF4",
              border: "1px solid #C6F6D5",
            }}
          >
            <CheckCircle
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--color-mint)" }}
            />
            <p className="text-sm" style={{ color: "var(--color-mint)" }}>
              Campaigns uploaded. Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
