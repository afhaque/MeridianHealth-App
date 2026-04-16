"use client";
import { useMemo } from "react";
import type { Deal } from "@/lib/types";

export default function TimeToCloseTable({ deals }: { deals: Deal[] }) {
  const rows = useMemo(() => {
    const map: Record<string, { days: number[]; value: number }> = {};
    deals
      .filter((d) => d.deal_stage === "Closed Won" && d.created_date && d.close_date)
      .forEach((d) => {
        const days = Math.round(
          (new Date(d.close_date).getTime() - new Date(d.created_date).getTime()) / 86_400_000
        );
        if (!map[d.company_name]) map[d.company_name] = { days: [], value: 0 };
        map[d.company_name].days.push(days);
        map[d.company_name].value += Number(d.deal_value);
      });
    return Object.entries(map)
      .map(([company, v]) => ({
        company,
        avgDays: Math.round(v.days.reduce((a, b) => a + b, 0) / v.days.length),
        deals: v.days.length,
        value: v.value,
      }))
      .sort((a, b) => a.avgDays - b.avgDays)
      .slice(0, 8);
  }, [deals]);

  return (
    <div className="overflow-auto max-h-48">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-white/40 uppercase tracking-widest border-b border-white/10">
            <th className="text-left pb-2 font-medium">Company</th>
            <th className="text-right pb-2 font-medium">Avg Days</th>
            <th className="text-right pb-2 font-medium">Deals</th>
            <th className="text-right pb-2 font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.company} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 text-white pr-4 truncate max-w-[140px]">{r.company}</td>
              <td className="py-2 text-right text-[#00e5cc] font-medium">{r.avgDays}d</td>
              <td className="py-2 text-right text-white/60">{r.deals}</td>
              <td className="py-2 text-right text-white/60">${(r.value / 1000).toFixed(0)}k</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
