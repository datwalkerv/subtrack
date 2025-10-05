"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "okt. 2025", value: 234 },
  { month: "nov. 2025", value: 234 },
  { month: "dec. 2025", value: 234 },
  { month: "jan. 2026", value: 234 },
  { month: "febr. 2026", value: 234 },
  { month: "márc. 2026", value: 234 },
  { month: "ápr. 2026", value: 234 },
  { month: "máj. 2026", value: 234 },
  { month: "jún. 2026", value: 234 },
  { month: "júl. 2026", value: 234 },
  { month: "szept. 2026", value: 234 },
];

export default function EuroTrendChart() {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#666" }}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(value) => `€${value}`}
            tick={{ fontSize: 12, fill: "#666" }}
            domain={[232, 236]}
            tickMargin={8}
          />
          <Tooltip
            formatter={(value: number) => [`€${value}`, "Value"]}
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ backgroundColor: "#1C1E1D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: 12 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#a68bff"    
            strokeWidth={2}
            dot={{ r: 3, fill: "#a68bff", stroke: "#a68bff" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
