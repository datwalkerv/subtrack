"use client";

import {
  getSubscriptions,
  updateExpiredSubscriptions,
} from "@/actions/subscriptionsActions";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MonthlySpendingTrend() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    setCurrentMonth(new Date());

    const init = async () => {
      await updateExpiredSubscriptions();
      const res = await getSubscriptions();
      if (res?.success && Array.isArray(res.data)) {
        setSubscriptions(res.data);
      }
    };

    init();
  }, []);

  if (!currentMonth) return null;

  const currency = subscriptions[0]?.currency || "HUF";

  const monthlyData = (() => {
    // Generate 12 months starting from this month
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + i
      );
      return d;
    });

    return months.map((monthDate) => {
      const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const end = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const total = subscriptions.reduce((sum, s) => {
        const payDate = new Date(s.nextPaymentDate);
        const endDate = s.endDate ? new Date(s.endDate) : null;
        const cost = Number(s.cost || 0);

        // skip expired subscriptions
        if (endDate && endDate < start) return sum;

        let projectedDate = new Date(
          payDate.getFullYear(),
          payDate.getMonth(),
          1
        );

        while (projectedDate <= end) {
          if (
            projectedDate.getFullYear() === monthDate.getFullYear() &&
            projectedDate.getMonth() === monthDate.getMonth()
          ) {
            sum += cost;
            break;
          }
          projectedDate.setMonth(projectedDate.getMonth() + 1); // day stays 1
        }

        return sum;
      }, 0);

      return {
        month: monthDate.toLocaleString("hu-HU", {
          month: "short",
          year: "numeric",
        }),
        value: total,
      };
    });
  })();

  console.log("Monthly Data:", monthlyData);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#666" }}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(value) => `${currency} ${value}`}
            tick={{ fontSize: 12, fill: "#666" }}
            tickMargin={8}
          />
          <Tooltip
            formatter={(value: number) => [`${currency} ${value}`, "Összesen"]}
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "#1C1E1D",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: 12,
            }}
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
