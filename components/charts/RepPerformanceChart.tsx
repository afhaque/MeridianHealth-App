"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Deal } from "@/lib/types";

export default function RepPerformanceChart({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const map: Record<string, { revenue: number; won: number; total: number }> = {};
    deals.forEach((d) => {
      if (!map[d.rep_name]) map[d.rep_name] = { revenue: 0, won: 0, total: 0 };
      if (d.deal_stage === "Closed Won") {
        map[d.rep_name].revenue += Number(d.deal_value);
        map[d.rep_name].won++;
      }
      if (["Closed Won", "Closed Lost"].includes(d.deal_stage)) map[d.rep_name].total++;
    });
    return Object.entries(map)
      .map(([name, v]) => ({
        name: name.split(" ")[0],
        revenue: Math.round(v.revenue / 1000),
        winRate: v.total ? Math.round((v.won / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [deals]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
        <Tooltip
          contentStyle={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 8 }}
          labelStyle={{ color: "#fff", fontSize: 12 }}
          itemStyle={{ color: "#00e5cc" }}
          formatter={(v) => [`$${v}k`, "Revenue"]}
        />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#00e5cc" : "#00e5cc80"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
