interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
}

function MetricCard({ label, value, subtitle, accentColor }: MetricCardProps) {
  return (
    <div className="card">
      <p className="text-label mb-1">{label}</p>
      <p className="text-metric" style={accentColor ? { color: accentColor } : undefined}>
        {value}
      </p>
      {subtitle && (
        <p className="text-label mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface MetricCardsProps {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export function MetricCards({ impressions, clicks, conversions, cost }: MetricCardsProps) {
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";
  const cpc = clicks > 0 ? (cost / clicks).toFixed(2) : "0.00";
  const cpa = conversions > 0 ? (cost / conversions).toFixed(2) : "0.00";
  const roas = cost > 0 ? ((conversions * 30) / cost).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        label="Click-Through Rate"
        value={`${ctr}%`}
        subtitle="Clicks / Impressions"
      />
      <MetricCard
        label="Cost per Click"
        value={`$${cpc}`}
        subtitle="Total cost / Clicks"
      />
      <MetricCard
        label="Cost per Acquisition"
        value={`$${cpa}`}
        subtitle="Total cost / Conversions"
        accentColor="var(--color-mint)"
      />
      <MetricCard
        label="Return on Ad Spend"
        value={`${roas}x`}
        subtitle="Revenue / Ad spend"
        accentColor="var(--color-mint)"
      />
    </div>
  );
}
