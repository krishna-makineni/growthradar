import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGrowth } from "../../context/GrowthContext";
import { Card } from "../common/Card";

export function ChannelBreakdownChart() {
  const { projections, simulatorParams } = useGrowth();

  const channelData = projections.channels.map((ch) => ({
    name: ch.name.replace("Partner ", "").replace("Direct ", ""),
    Gross: ch.gross,
    Unique: ch.unique,
    Cost: ch.cost,
    CAC: ch.cac,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.2)] rounded-lg p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-heading font-semibold text-[#F5F7FB] border-b border-[rgba(148,163,184,0.12)] pb-1">
            {label}
          </p>
          <div className="flex justify-between gap-4 text-[#A5B2C5]">
            <span>Gross Potential:</span>
            <span className="font-mono font-bold text-[#F5F7FB]">{data.Gross}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A5B2C5]">
            <span>Deduplicated Unique:</span>
            <span className="font-mono font-bold text-[#C5F56A]">{data.Unique}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A5B2C5]">
            <span>Allocated Budget:</span>
            <span className="font-mono font-bold text-[#4ADFFF]">₹{data.Cost}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A5B2C5]">
            <span>Channel CAC:</span>
            <span className="font-mono font-bold text-[#FB923C]">₹{data.CAC} / reg</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Channel Contribution & Deduplication"
      subtitle="Gross reach vs deduplicated unique registrations across acquisition channels"
      badge={
        <span className="text-[10px] font-mono font-semibold text-[#4ADFFF] bg-[#4ADFFF]/10 px-2 py-0.5 rounded border border-[#4ADFFF]/25">
          {Math.round(simulatorParams.overlapRate * 100)}% Deduplication
        </span>
      }
    >
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <Bar dataKey="Gross" name="Gross Potential" fill="#1E293B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Unique" name="Deduplicated Unique" fill="#C5F56A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Budget spend pill summary */}
      <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        {projections.channels.map((ch, idx) => (
          <div key={idx} className="p-2.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-[#A5B2C5] truncate font-medium">{ch.name}</p>
              <p className="font-mono font-bold text-[#F5F7FB] mt-0.5 text-xs sm:text-sm">
                {ch.unique} <span className="text-[10px] font-normal text-[#A5B2C5]">unique</span>
              </p>
            </div>
            <div className="mt-2 pt-1.5 border-t border-[rgba(148,163,184,0.08)] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#4ADFFF]">₹{ch.cost}</span>
              <span className="text-[#A5B2C5]">₹{ch.cac}/reg</span>
            </div>
          </div>
        ))}
      </div>

      {/* Budget & Overlap Reconciliation Footer */}
      <div className="mt-3 pt-2 border-t border-[rgba(148,163,184,0.1)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A5B2C5]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5F56A]" />
          <span>Total Gross: <strong className="text-[#F5F7FB]">{projections.totalGross}</strong> → Unique: <strong className="text-[#C5F56A]">{projections.projectedUnique}</strong> ({projections.deduplicatedOverlap} duplicates removed)</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#4ADFFF]">Allocated: ₹{projections.totalAllocatedBudget}</span>
          <span className="text-[#64748B]">•</span>
          <span className="text-[#C5F56A]">Reserve Pool: ₹{projections.budgetRemaining}</span>
          <span className="text-[#64748B]">•</span>
          <span className="text-[#F5F7FB]">Cap: ₹{projections.totalBudget}</span>
        </div>
      </div>
    </Card>
  );
}
