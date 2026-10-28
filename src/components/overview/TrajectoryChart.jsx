import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { useGrowth } from "../../context/GrowthContext";
import { Card } from "../common/Card";

export function TrajectoryChart() {
  const { simulatorParams, projections, actualRegistrations } = useGrowth();
  const actualCount = actualRegistrations.length;
  const days = simulatorParams.campaignDays || 7;

  // Build 7-day cumulative trajectory data
  // Planned target: S-curve reaching 500
  // Simulated projection: S-curve reaching projections.projectedUnique
  // Actual test registrations: points based on current actualCount
  const targetPerDay = [40, 100, 185, 280, 375, 450, 500];
  const projectedTotal = projections.projectedUnique;

  const data = Array.from({ length: days }).map((_, i) => {
    const dayIndex = i + 1;
    // S-curve multiplier
    const progressFactor = Math.pow(dayIndex / days, 1.25);
    const simulatedCumulative = Math.round(projectedTotal * progressFactor);
    const plannedTarget = targetPerDay[i] !== undefined
      ? targetPerDay[i]
      : Math.round((500 / days) * dayIndex);

    // Actual registrations cumulative estimation for demo (or flat current actual count)
    const actualCumulative = dayIndex === 1
      ? Math.min(actualCount, 2)
      : dayIndex === 2
      ? Math.min(actualCount, 5)
      : actualCount;

    return {
      day: `Day ${dayIndex}`,
      plannedTarget,
      simulatedProjection: simulatedCumulative,
      actualRecorded: actualCumulative,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121A2B] border border-[#2B3A58] rounded-lg p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-[#F5F7FA] border-b border-[#1E2B45] pb-1">
            {label} Registration Trajectory
          </p>
          <div className="flex items-center justify-between gap-4 text-[#9BA8BB]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#51D6C7]" /> Planned Target:
            </span>
            <span className="font-bold text-[#F5F7FA]">
              {payload.find((p) => p.dataKey === "plannedTarget")?.value || 0}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#9BA8BB]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8F56A]" /> Simulated Projection:
            </span>
            <span className="font-bold text-[#B8F56A]">
              {payload.find((p) => p.dataKey === "simulatedProjection")?.value || 0}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#9BA8BB]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" /> Actual Test Recorded:
            </span>
            <span className="font-bold text-[#FACC15]">
              {payload.find((p) => p.dataKey === "actualRecorded")?.value || 0}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="7-Day Registration Trajectory"
      subtitle="Planned 500 target path vs current simulated forecast and actual test records"
      badge={
        <span className="text-[10px] font-semibold text-[#B8F56A] bg-[#B8F56A]/10 px-2 py-0.5 rounded border border-[#B8F56A]/20">
          Target: 500
        </span>
      }
    >
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8F56A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#B8F56A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#51D6C7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#51D6C7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2B45" vertical={false} />
            <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <ReferenceLine y={500} stroke="#FB923C" strokeDasharray="4 4" label={{ value: "500 Goal", fill: "#FB923C", fontSize: 10, position: "insideTopRight" }} />
            <Area
              type="monotone"
              name="Planned Target (500)"
              dataKey="plannedTarget"
              stroke="#51D6C7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#targetGradient)"
            />
            <Area
              type="monotone"
              name="Simulated Projection"
              dataKey="simulatedProjection"
              stroke="#B8F56A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#projGradient)"
            />
            <Area
              type="monotone"
              name="Actual Test Records"
              dataKey="actualRecorded"
              stroke="#FACC15"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-[#9BA8BB] mt-2 italic text-center">
        * Simulated projection accounts for {Math.round(simulatorParams.overlapRate * 100)}% deduplicated cross-channel overlap.
      </p>
    </Card>
  );
}
