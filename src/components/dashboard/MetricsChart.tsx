"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CampaignChartData {
  name: string;
  conversions: number;
  cost: number;
}

interface MetricsChartProps {
  data: CampaignChartData[];
}

export function MetricsChart({ data }: MetricsChartProps) {
  const isEmpty = data.length === 0;

  return (
    <div className="card">
      <h2 className="text-card-title mb-4">Conversions vs. Cost</h2>
      <div className="relative h-80 w-full">
        {isEmpty && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <p className="text-label text-sm">No data available to visualize</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6B7F7A" }}
              tickLine={false}
              axisLine={{ stroke: "#E8E2D5" }}
              // angle={15}
              // textAnchor="start"
              tickFormatter={(value) =>
                value.length > 8 ? `${value.slice(0, 8)}...` : value
              }
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7F7A" }}
              tickLine={false}
              axisLine={{ stroke: "#E8E2D5" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E8E2D5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 13, color: "#6B7F7A" }}
            />
            <Bar
              dataKey="conversions"
              name="Conversions"
              fill="#FF7A5C"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="cost"
              name="Cost ($)"
              fill="#F9C74F"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
