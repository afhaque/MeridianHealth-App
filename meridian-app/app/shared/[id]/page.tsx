"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Deal } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import RevenueChart from "@/components/charts/RevenueChart";
import RepPerformanceChart from "@/components/charts/RepPerformanceChart";
import TimeToCloseTable from "@/components/charts/TimeToCloseTable";
import DealStageFunnel from "@/components/charts/DealStageFunnel";
import LeadSourceChart from "@/components/charts/LeadSourceChart";
import WinRateChart from "@/components/charts/WinRateChart";

export default function SharedPage() {
  const { id } = useParams<{ id: string }>();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("meridian_snapshots")
        .select("data, label")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("Snapshot not found.");
      } else {
        setDeals(data.data as Deal[]);
        setLabel(data.label || "Shared Snapshot");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading snapshot...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const closedWon = deals.filter((d) => d.deal_stage === "Closed Won");
  const totalRevenue = closedWon.reduce((s, d) => s + Number(d.deal_value), 0);
  const winRate = deals.length
    ? Math.round((closedWon.length / deals.filter(d => ["Closed Won","Closed Lost"].includes(d.deal_stage)).length) * 100)
    : 0;
  const avgDeal = closedWon.length ? Math.round(totalRevenue / closedWon.length) : 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <nav className="bg-[#00e5cc] px-6 py-4 flex items-center justify-between">
        <span className="text-black font-bold text-lg tracking-tight">Meridian Health</span>
        <span className="text-black/60 text-sm">{label}</span>
      </nav>
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Shared Insights</h1>
          <p className="text-white/40 text-sm mt-1">{deals.length} deals · Read-only snapshot</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Revenue (Won)", value: `$${(totalRevenue / 1_000_000).toFixed(2)}M` },
            { label: "Win Rate", value: `${winRate}%` },
            { label: "Avg Deal Size", value: `$${avgDeal.toLocaleString()}` },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-[#00e5cc] text-3xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card title="Revenue Over Time"><RevenueChart deals={deals} /></Card>
          <Card title="Rep Performance"><RepPerformanceChart deals={deals} /></Card>
          <Card title="Time to Close"><TimeToCloseTable deals={deals} /></Card>
          <Card title="Deal Stage Funnel"><DealStageFunnel deals={deals} /></Card>
          <Card title="Lead Source Breakdown"><LeadSourceChart deals={deals} /></Card>
          <Card title="Win Rate by Product Line"><WinRateChart deals={deals} /></Card>
        </div>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5">
      <h2 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}
