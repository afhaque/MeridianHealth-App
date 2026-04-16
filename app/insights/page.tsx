"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Deal } from "@/lib/types";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import RevenueChart from "@/components/charts/RevenueChart";
import RepPerformanceChart from "@/components/charts/RepPerformanceChart";
import TimeToCloseTable from "@/components/charts/TimeToCloseTable";
import DealStageFunnel from "@/components/charts/DealStageFunnel";
import LeadSourceChart from "@/components/charts/LeadSourceChart";
import WinRateChart from "@/components/charts/WinRateChart";
import { supabase } from "@/lib/supabase";

export default function InsightsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("deals");
    if (!raw) {
      router.replace("/upload");
      return;
    }
    setDeals(JSON.parse(raw));
  }, [router]);

  async function handleShare() {
    setSharing(true);
    try {
      const { data, error } = await supabase
        .from("meridian_snapshots")
        .insert({ data: deals, label: `Snapshot ${new Date().toLocaleDateString()}` })
        .select("id")
        .single();
      if (error) throw error;
      const url = `${window.location.origin}/shared/${data.id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url).catch(() => {});
    } catch {
      alert("Failed to create share link. Please try again.");
    } finally {
      setSharing(false);
    }
  }

  if (!deals.length) return null;

  const closedWon = deals.filter((d) => d.deal_stage === "Closed Won");
  const totalRevenue = closedWon.reduce((s, d) => s + Number(d.deal_value), 0);
  const winRate = deals.length ? Math.round((closedWon.length / deals.filter(d => ["Closed Won","Closed Lost"].includes(d.deal_stage)).length) * 100) : 0;
  const avgDeal = closedWon.length ? Math.round(totalRevenue / closedWon.length) : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Insights</h1>
              <p className="text-white/40 text-sm mt-1">{deals.length} deals loaded</p>
            </div>
            <div className="flex items-center gap-3">
              {shareUrl && (
                <div className="bg-[#0d0d0d] border border-[#00e5cc]/30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-[#00e5cc] text-xs font-mono truncate max-w-xs">{shareUrl}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="text-white/40 hover:text-white text-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              )}
              <button
                onClick={handleShare}
                disabled={sharing}
                className="bg-[#00e5cc] text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#00c9b3] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {sharing ? "Sharing..." : "Share Snapshot"}
              </button>
            </div>
          </div>

          {/* KPI Summary */}
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

          {/* Insight Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InsightCard title="Revenue Over Time">
              <RevenueChart deals={deals} />
            </InsightCard>
            <InsightCard title="Rep Performance">
              <RepPerformanceChart deals={deals} />
            </InsightCard>
            <InsightCard title="Time to Close">
              <TimeToCloseTable deals={deals} />
            </InsightCard>
            <InsightCard title="Deal Stage Funnel">
              <DealStageFunnel deals={deals} />
            </InsightCard>
            <InsightCard title="Lead Source Breakdown">
              <LeadSourceChart deals={deals} />
            </InsightCard>
            <InsightCard title="Win Rate by Product Line">
              <WinRateChart deals={deals} />
            </InsightCard>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function InsightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5">
      <h2 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}
