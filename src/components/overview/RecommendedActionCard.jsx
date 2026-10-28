import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function RecommendedActionCard({ onActionClick }) {
  const { recommendedAction } = useGrowth();

  if (!recommendedAction) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#121A2B] to-[#15233B] border border-[rgba(184,245,106,0.3)] p-5 md:p-6 shadow-xl shadow-black/20">
      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8F56A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B8F56A]/15 border border-[#B8F56A]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#B8F56A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#B8F56A] uppercase tracking-wider">
                Growth Decision Engine
              </span>
              <span className="text-[10px] text-[#9BA8BB] bg-[#1E2B45] px-2 py-0.5 rounded">
                Dynamic Recommendation
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[#F5F7FA] mt-0.5">
              Recommended Next Action
            </h2>
          </div>
        </div>

        {onActionClick && (
          <button
            onClick={onActionClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg transition-colors self-start lg:self-auto shrink-0 shadow-sm"
          >
            <span>Execute in Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main recommendation core */}
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8F56A]" />
            {recommendedAction.action}
          </h3>
          <p className="text-sm text-[#9BA8BB] mt-1.5 leading-relaxed">
            {recommendedAction.why}
          </p>
        </div>

        {/* 3-column breakdown of supporting data, measurement, and pivot condition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* Supporting Data */}
          <div className="p-3.5 rounded-lg bg-[#0F1626]/80 border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#51D6C7] mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Supporting Data / Assumptions</span>
            </div>
            <p className="text-xs text-[#9BA8BB] leading-normal">
              {recommendedAction.supportingData}
            </p>
          </div>

          {/* Metric to measure */}
          <div className="p-3.5 rounded-lg bg-[#0F1626]/80 border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B8F56A] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What to Measure</span>
            </div>
            <p className="text-xs text-[#9BA8BB] leading-normal">
              {recommendedAction.metricToMeasure}
            </p>
          </div>

          {/* When to reconsider */}
          <div className="p-3.5 rounded-lg bg-[#0F1626]/80 border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FB923C] mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>When to Reconsider</span>
            </div>
            <p className="text-xs text-[#9BA8BB] leading-normal">
              {recommendedAction.reconsiderCondition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
