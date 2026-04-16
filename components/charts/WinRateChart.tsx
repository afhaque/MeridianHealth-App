"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import type { Deal } from "@/lib/types";

export default function WinRateChart({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const map: Record<string, { won: number; total: number }> = {};
    deals
      .filter((d) => ["Closed Won", "Closed Lost"].includes(d.deal_stage))
      .forEach((d) => {
        if (!map[d.product_line]) map[d.product_line] = { won: 0, total: 0 };
        if (d.deal_stage === "Closed Won") map[d.product_line].won++;
        map[d.product_line].total++;
      });
    return Object.entries(map).map(([product, v]) => ({
      product,
      winRate: Math.round((v.won / v.total) * 100),
    }));
  }, [deals]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis dataKey="product" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <ReferenceLine y={50} stroke="#ffffff20" strokeDasharray="4 4" />
        <Tooltip
          contentStyle={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 8 }}
          itemStyle={{ color: "#00e5cc" }}
          formatter={(v) => [`${v}%`, "Win Rate"]}
        />
        <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.winRate >= 70 ? "#00e5cc" : entry.winRate >= 50 ? "#00e5cc80" : "#00e5cc40"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
