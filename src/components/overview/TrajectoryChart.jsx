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
  const totalDays = projections.totalCampaignDays || simulatorParams.campaignDays || 7;
  const daysLeft = projections.daysRemaining !== undefined ? projections.daysRemaining : totalDays;
  const currentDay = Math.min(totalDays, Math.max(1, totalDays - daysLeft + 1));

  // Cumulative planned target curve reaching 500
  const targetPerDay = [40, 100, 185, 280, 375, 450, 500];
  const projectedTotal = projections.projectedUnique || 486;

  // Realistic S-curve cumulative weights for the 7-day student campaign sprint
  const forecastDailyWeights = [35, 88, 165, 255, 345, 425, 486];

  const data = Array.from({ length: totalDays }).map((_, i) => {
    const dayIndex = i + 1;

    // Planned target pacing
    const plannedTarget = targetPerDay[i] !== undefined
      ? targetPerDay[i]
      : Math.round((500 / totalDays) * dayIndex);

    // Simulated forecast cumulative trajectory scaled to current projection
    const weight = forecastDailyWeights[i] !== undefined ? forecastDailyWeights[i] : (projectedTotal / totalDays) * dayIndex;
    const simulatedProjection = Math.round((weight / 486) * projectedTotal);

    // Actual verified test registrations: ONLY plotted for elapsed days; future days remain null
    let actualRecorded = null;
    if (dayIndex <= currentDay) {
      if (currentDay === 1) {
        actualRecorded = actualCount;
      } else {
        // Distribute actual count across elapsed days
        const step = actualCount / currentDay;
        actualRecorded = Math.min(actualCount, Math.round(step * dayIndex));
      }
    }

    return {
      day: `Day ${dayIndex}`,
      dayNum: dayIndex,
      plannedTarget,
      simulatedProjection,
      actualRecorded,
      isElapsed: dayIndex <= currentDay,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0]?.payload;
      const planned = pointData?.plannedTarget || 0;
      const simulated = pointData?.simulatedProjection || 0;
      const actual = pointData?.actualRecorded;

      return (
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.2)] rounded-lg p-3 shadow-xl text-xs space-y-1.5 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-1.5">
            <span className="font-heading font-semibold text-[#F5F7FB]">
              {label} Trajectory
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111C2E] text-[#A5B2C5] border border-[rgba(148,163,184,0.14)]">
              {pointData?.isElapsed ? "Elapsed" : "Forecast"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-[#A5B2C5] pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADFFF]" /> Planned Target:
            </span>
            <span className="font-mono font-bold text-[#F5F7FB]">
              {planned}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-[#A5B2C5]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5F56A]" /> Simulated Forecast:
            </span>
            <span className="font-mono font-bold text-[#C5F56A]">
              {simulated}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[rgba(148,163,184,0.1)] text-[#A5B2C5]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" /> Actual Verified:
            </span>
            <span className="font-mono font-bold text-[#FB923C]">
              {actual !== null && actual !== undefined ? `${actual} records` : <span className="text-[#64748B] font-normal italic">Upcoming</span>}
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
      subtitle={`Planned 500-student trajectory vs simulated forecast (${projections.projectedUnique}) and verified actual test records`}
      badge={
        <span className="text-[10px] font-mono font-semibold text-[#C5F56A] bg-[#C5F56A]/10 px-2 py-0.5 rounded border border-[#C5F56A]/25">
          Sprint Day {currentDay} of {totalDays}
        </span>
      }
    >
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5F56A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#C5F56A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADFFF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4ADFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
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
              stroke="#4ADFFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#targetGradient)"
            />
            <Area
              type="monotone"
              name="Simulated Forecast"
              dataKey="simulatedProjection"
              stroke="#C5F56A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#projGradient)"
            />
            <Area
              type="monotone"
              name="Actual Verified (Test)"
              dataKey="actualRecorded"
              stroke="#FB923C"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              fillOpacity={0}
              connectNulls={false}
              dot={{ r: 4, fill: "#FB923C", stroke: "#070B14", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[rgba(148,163,184,0.1)] text-[11px] text-[#A5B2C5]">
        <span>
          * Simulated forecast accounts for {Math.round(simulatorParams.overlapRate * 100)}% cross-channel deduplication.
        </span>
        <span className="text-[#64748B] italic">
          Future days indicate modeled estimates, not recorded past events.
        </span>
      </div>
    </Card>
  );
}

