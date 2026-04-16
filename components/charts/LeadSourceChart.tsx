"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Deal } from "@/lib/types";

const COLORS = ["#00e5cc", "#00b8a3", "#008c7d", "#006058", "#003d38", "#00ffee"];

export default function LeadSourceChart({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    deals.forEach((d) => { map[d.lead_source] = (map[d.lead_source] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [deals]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 8 }}
          itemStyle={{ color: "#00e5cc" }}
        />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#aaa", fontSize: 11 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
