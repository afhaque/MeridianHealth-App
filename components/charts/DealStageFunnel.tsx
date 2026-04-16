"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Deal } from "@/lib/types";

const STAGE_ORDER = ["Qualified", "Demo Scheduled", "Negotiation", "Closed Won", "Closed Lost"];
const COLORS: Record<string, string> = {
  "Qualified": "#00e5cc40",
  "Demo Scheduled": "#00e5cc60",
  "Negotiation": "#00e5cc90",
  "Closed Won": "#00e5cc",
  "Closed Lost": "#ff4d4d60",
};

export default function DealStageFunnel({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    deals.forEach((d) => { map[d.deal_stage] = (map[d.deal_stage] || 0) + 1; });
    return STAGE_ORDER.filter((s) => map[s]).map((stage) => ({ stage, count: map[stage] || 0 }));
  }, [deals]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" barCategoryGap="20%">
        <XAxis type="number" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="stage" tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
        <Tooltip
          contentStyle={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 8 }}
          itemStyle={{ color: "#00e5cc" }}
          formatter={(v) => [v, "Deals"]}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[entry.stage] || "#00e5cc50"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
