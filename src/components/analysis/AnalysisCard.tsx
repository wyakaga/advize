import Link from "next/link";

interface AnalysisCardProps {
  id: string;
  date: string;
  campaignCount: number;
  summaryPreview: string;
}

export function AnalysisCard({
  id,
  date,
  campaignCount,
  summaryPreview,
}: AnalysisCardProps) {
  return (
    <div className="card transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <p className="text-label">{date}</p>
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: "var(--color-coral-light)",
            color: "var(--color-coral)",
          }}
        >
          {campaignCount} campaign{campaignCount !== 1 ? "s" : ""}
        </span>
      </div>
      <p
        className="text-sm mb-3"
        style={{ color: "var(--color-text-primary)" }}
      >
        {summaryPreview}
      </p>
      <Link
        href={`/analysis/${id}`}
        className="text-sm font-medium"
        style={{ color: "var(--color-coral)" }}
      >
        View details
      </Link>
    </div>
  );
}
