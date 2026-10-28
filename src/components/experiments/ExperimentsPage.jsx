import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  Edit,
  Trash2,
  Info,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { Badge } from "../common/Badge";
import { calculateExperimentStats } from "../../utils/growthCalculations";
import { ExperimentModal } from "./ExperimentModal";
import { ConfirmDialog } from "../common/Modal";

export function ExperimentsPage() {
  const { experiments, addExperiment, updateExperiment, deleteExperiment } = useGrowth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const statusBadges = {
    draft: { label: "Draft", variant: "default" },
    running: { label: "Running", variant: "cyan" },
    completed: { label: "Completed", variant: "lime" },
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25">
                Rigorous Testing
              </span>
              <span className="text-xs text-[#A5B2C5]">
                A/B Statistical Validation
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              Growth Experiment Lab
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Validate copy, channel mechanics, and CTA variations before rolling them out across campus groups.
              Conversion rates and statistical significance are computed deterministically with sample-size safeguards.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingExp(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Experiment</span>
          </button>
        </div>

        {/* Statistical Integrity Guarantee Banner */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(148,163,184,0.12)] flex items-start gap-2 text-xs text-[#A5B2C5]">
          <Info className="w-4 h-4 text-[#4ADFFF] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FB]">Statistical Rigor Policy:</strong> We never declare winners without adequate sample size. Tests with &lt;100 participants per variant display explicit sample-size warnings. Significance is derived from a two-proportion z-test (α = 0.05).
          </span>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-5">
        {experiments.map((exp) => {
          const stats = calculateExperimentStats(exp);
          const badge = statusBadges[exp.status] || statusBadges.draft;

          return (
            <div
              key={exp.id}
              className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] rounded-xl p-5 md:p-6 shadow-sm transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(148,163,184,0.12)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4ADFFF]/10 border border-[#4ADFFF]/25 flex items-center justify-center text-[#4ADFFF]">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#A5B2C5] uppercase font-semibold">
                        Day {exp.startDay} - {exp.endDay}
                      </span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <h2 className="font-heading text-base md:text-lg font-bold text-[#F5F7FB] mt-0.5">
                      {exp.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingExp(exp);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit test parameters"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Test</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(exp.id)}
                    className="p-1.5 text-[#A5B2C5] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Experiment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hypothesis */}
              <div className="p-3.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-xs">
                <span className="font-mono font-semibold text-[#4ADFFF] uppercase tracking-wider text-[10px] block mb-1">
                  Core Hypothesis
                </span>
                <p className="text-[#F5F7FB] leading-relaxed italic">
                  "{exp.hypothesis}"
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#A5B2C5] mt-2 pt-2 border-t border-[rgba(148,163,184,0.08)]">
                  <span><strong className="text-[#F5F7FB]">Target Audience:</strong> {exp.audience}</span>
                  <span><strong className="text-[#4ADFFF]">Primary Metric:</strong> {exp.primaryMetric}</span>
                  {exp.secondaryMetric && (
                    <span><strong className="text-[#FB923C]">Secondary Metric:</strong> {exp.secondaryMetric}</span>
                  )}
                </div>
              </div>

              {/* Variant Comparison Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variant A */}
                <div className="p-4 rounded-xl bg-[#111C2E] border border-[rgba(148,163,184,0.16)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#A5B2C5] uppercase tracking-wider text-[11px]">
                      Variant A (Control)
                    </span>
                    <span className="font-mono text-base font-bold text-[#F5F7FB]">
                      {stats.rateA}% conv
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F7FB] bg-[#0A1020] p-2.5 rounded-lg border border-[rgba(148,163,184,0.12)] leading-relaxed">
                    {exp.variantA}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#A5B2C5] pt-1 font-mono">
                    <span>Sample: <strong className="text-[#F5F7FB]">{exp.sampleSizeA}</strong></span>
                    <span>Conversions: <strong className="text-[#F5F7FB]">{exp.conversionsA}</strong></span>
                  </div>
                </div>

                {/* Variant B */}
                <div className="p-4 rounded-xl bg-[#111C2E] border border-[#C5F56A]/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#C5F56A] uppercase tracking-wider text-[11px]">
                      Variant B (Treatment)
                    </span>
                    <span className="font-mono text-base font-bold text-[#C5F56A]">
                      {stats.rateB}% conv
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F7FB] bg-[#0A1020] p-2.5 rounded-lg border border-[rgba(148,163,184,0.12)] leading-relaxed">
                    {exp.variantB}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#A5B2C5] pt-1 font-mono">
                    <span>Sample: <strong className="text-[#F5F7FB]">{exp.sampleSizeB}</strong></span>
                    <span>Conversions: <strong className="text-[#C5F56A]">{exp.conversionsB}</strong></span>
                  </div>
                </div>
              </div>

              {/* Statistical Results & Lift bar */}
              <div className="p-4 rounded-xl bg-[#0A1020] border border-[rgba(148,163,184,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5F7FB]">
                      Statistical Verdict:
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded ${
                        stats.isWinner
                          ? "bg-[#C5F56A]/15 text-[#C5F56A] border border-[#C5F56A]/30"
                          : stats.hasData && !stats.hasAdequateSample
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-[#111C2E] text-[#A5B2C5] border border-[rgba(148,163,184,0.16)]"
                      }`}
                    >
                      {stats.significance}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A5B2C5]">
                    Observed Relative Lift:{" "}
                    <strong
                      className={`font-mono ${
                        Number(stats.relLift) > 0 ? "text-[#C5F56A]" : "text-rose-400"
                      }`}
                    >
                      {Number(stats.relLift) > 0 ? `+${stats.relLift}%` : `${stats.relLift}%`}
                    </strong>{" "}
                    ({stats.absLift}% absolute difference)
                  </p>
                </div>

                {exp.notes && (
                  <div className="max-w-md text-xs text-[#A5B2C5] md:text-right border-t md:border-t-0 md:border-l border-[rgba(148,163,184,0.16)] pt-2 md:pt-0 md:pl-4">
                    <span className="font-mono font-semibold text-[#4ADFFF] block text-[10px] uppercase">
                      Action Taken / Deployment:
                    </span>
                    <span>{exp.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      <ExperimentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExp(null);
        }}
        initialData={editingExp}
        onSave={(data) => {
          if (editingExp) {
            updateExperiment(editingExp.id, data);
          } else {
            addExperiment(data);
          }
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteExperiment(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Growth Experiment"
        message="Are you sure you want to remove this experiment record?"
        confirmText="Delete Experiment"
      />
    </div>
  );
}
