"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [{ name: "Banking", value: 100 }];

const COLORS = [
  "#D6FBF2",
  "#B3F3E3",
  "#86EAD4",
  "#5DD2B7",
  "#36B497",
  "#1E8E77",
];

interface SpendingByChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export default function SpendingByChart({ data, title }: SpendingByChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center text-sm">
      {title && (
        <div className="text-lg font-semibold text-white/80 mb-4">{title}</div>
      )}

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            stroke="none"
            label={({ name, value }) =>
              `${name} (${((value / total) * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col items-start mt-4 space-y-1 text-sm text-gray-400">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>
              {entry.name} — {((entry.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
