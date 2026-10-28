import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function RecommendedActionCard({ onActionClick }) {
  const { recommendedAction } = useGrowth();

  if (!recommendedAction) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0D1523] border border-[#C5F56A]/30 p-5 md:p-6 shadow-sm">
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5F56A]" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(148,163,184,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C5F56A]/10 border border-[#C5F56A]/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#C5F56A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-[#C5F56A] uppercase tracking-wider">
                Growth Decision Engine
              </span>
              <span className="text-[10px] text-[#A5B2C5] bg-[#111C2E] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.12)]">
                Recommended Priority
              </span>
            </div>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#F5F7FB] mt-0.5">
              Recommended Next Action
            </h2>
          </div>
        </div>

        {onActionClick && (
          <button
            onClick={onActionClick}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors self-start lg:self-auto shrink-0 shadow-sm cursor-pointer"
          >
            <span>{recommendedAction.actionButtonText || "Execute in Radar"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main recommendation core */}
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-heading text-base md:text-lg font-semibold text-[#F5F7FB] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5F56A] shrink-0" />
            {recommendedAction.action}
          </h3>
          <p className="text-sm text-[#A5B2C5] mt-1.5 leading-relaxed">
            {recommendedAction.why}
          </p>
        </div>

        {/* 3-column breakdown of supporting data, measurement, and pivot condition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Supporting Data */}
          <div className="p-3.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4ADFFF] mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Supporting Data / Assumptions</span>
            </div>
            <p className="text-xs text-[#A5B2C5] leading-relaxed">
              {recommendedAction.supportingData}
            </p>
          </div>

          {/* Metric to measure */}
          <div className="p-3.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C5F56A] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What to Measure (Est.)</span>
            </div>
            <p className="text-xs text-[#A5B2C5] leading-relaxed">
              {recommendedAction.metricToMeasure}
            </p>
          </div>

          {/* When to reconsider */}
          <div className="p-3.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FB923C] mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>When to Reconsider</span>
            </div>
            <p className="text-xs text-[#A5B2C5] leading-relaxed">
              {recommendedAction.reconsiderCondition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
