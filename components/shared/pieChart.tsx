"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Banking", value: 100 },
];

const COLORS = ["#5E2CA5"]; 

export default function SpendingByCategoryChart() {
  return (
      <div className="flex flex-col items-center text-sm">
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
              label={({ name, value }) => `${name} (${value}%)`}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[0] }} />
          <span>Banking (100%)</span>
        </div>
      </div>
  );
}
