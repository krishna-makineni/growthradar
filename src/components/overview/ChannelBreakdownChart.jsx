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
        <div className="bg-[#121A2B] border border-[#2B3A58] rounded-lg p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-[#F5F7FA] border-b border-[#1E2B45] pb-1">
            {label}
          </p>
          <div className="flex justify-between gap-4 text-[#9BA8BB]">
            <span>Gross Registrations:</span>
            <span className="font-bold text-[#F5F7FA]">{data.Gross}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#9BA8BB]">
            <span>Deduplicated Unique:</span>
            <span className="font-bold text-[#B8F56A]">{data.Unique}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#9BA8BB]">
            <span>Allocated Budget:</span>
            <span className="font-bold text-[#51D6C7]">₹{data.Cost}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#9BA8BB]">
            <span>Channel CAC:</span>
            <span className="font-bold text-[#FACC15]">₹{data.CAC} / reg</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Channel Contribution & Deduplication"
      subtitle="Gross potential vs deduplicated unique registrations by acquisition stream"
      badge={
        <span className="text-[10px] font-semibold text-[#51D6C7] bg-[#51D6C7]/10 px-2 py-0.5 rounded border border-[#51D6C7]/20">
          {Math.round(simulatorParams.overlapRate * 100)}% Deduplication
        </span>
      }
    >
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2B45" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <Bar dataKey="Gross" name="Gross Potential" fill="#334155" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Unique" name="Deduplicated Unique" fill="#B8F56A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Budget spend pill summary */}
      <div className="mt-4 pt-3 border-t border-[#1E2B45] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        {projections.channels.map((ch, idx) => (
          <div key={idx} className="p-2 rounded bg-[#0F1626] border border-[#1E2B45]/70">
            <p className="text-[10px] text-[#9BA8BB] truncate">{ch.name}</p>
            <p className="font-bold text-[#51D6C7] mt-0.5">₹{ch.cost}</p>
            <p className="text-[9px] text-[#64748B]">CAC: ₹{ch.cac}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
