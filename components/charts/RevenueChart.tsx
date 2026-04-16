"use client";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Deal } from "@/lib/types";

export default function RevenueChart({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    deals
      .filter((d) => d.deal_stage === "Closed Won" && d.close_date)
      .forEach((d) => {
        const month = d.close_date.slice(0, 7);
        map[month] = (map[month] || 0) + Number(d.deal_value);
      });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue: Math.round(revenue / 1000) }));
  }, [deals]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00e5cc" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00e5cc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
        <Tooltip
          contentStyle={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 8 }}
          labelStyle={{ color: "#fff", fontSize: 12 }}
          itemStyle={{ color: "#00e5cc" }}
          formatter={(v) => [`$${v}k`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#00e5cc" strokeWidth={2} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
