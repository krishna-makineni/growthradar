import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Edit,
  Trash2,
  Sparkles,
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
    running: { label: "Running", variant: "teal" },
    completed: { label: "Completed", variant: "lime" },
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#B8F56A]/10 text-[#B8F56A] border border-[#B8F56A]/20">
                Rigorous Testing
              </span>
              <span className="text-xs text-[#9BA8BB]">
                A/B Statistical Validation
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
              Growth Experiment Lab
            </h1>
            <p className="text-xs md:text-sm text-[#9BA8BB] mt-1 max-w-2xl leading-relaxed">
              Validate copy, channel mechanics, and CTA variations before rolling them out across 500+ campus prospects.
              Conversion rates and statistical significance are computed deterministically with sample-size safeguards.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingExp(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Experiment</span>
          </button>
        </div>

        {/* Statistical Integrity Guarantee Banner */}
        <div className="mt-4 pt-3.5 border-t border-[#1E2B45]/70 flex items-start gap-2 text-xs text-[#9BA8BB]">
          <Info className="w-4 h-4 text-[#51D6C7] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FA]">Statistical Rigor Policy:</strong> We never invent winners without adequate sample size. Tests with &lt;100 participants per variant display explicit sample-size warnings. Significance is derived from a two-proportion z-test (α = 0.05).
          </span>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        {experiments.map((exp) => {
          const stats = calculateExperimentStats(exp);
          const badge = statusBadges[exp.status] || statusBadges.draft;

          return (
            <div
              key={exp.id}
              className="bg-[#121A2B] border border-[#1E2B45] hover:border-[#2B3A58] rounded-xl p-5 md:p-6 shadow-md transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2B45]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#51D6C7]/15 flex items-center justify-center text-[#51D6C7]">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#9BA8BB] uppercase font-semibold">
                        Day {exp.startDay} - {exp.endDay}
                      </span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-[#F5F7FA] mt-0.5">
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
                    className="p-1.5 text-[#9BA8BB] hover:text-[#F5F7FA] hover:bg-[#182238] rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Edit test parameters"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Test</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(exp.id)}
                    className="p-1.5 text-[#9BA8BB] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Experiment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hypothesis */}
              <div className="p-3.5 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-xs">
                <span className="font-semibold text-[#51D6C7] uppercase tracking-wider text-[10px] block mb-1">
                  Core Hypothesis
                </span>
                <p className="text-[#F5F7FA] leading-relaxed italic">
                  "{exp.hypothesis}"
                </p>
                <p className="text-[11px] text-[#9BA8BB] mt-1.5">
                  Target Audience: {exp.audience}
                </p>
              </div>

              {/* Variant Comparison Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variant A */}
                <div className="p-4 rounded-xl bg-[#141E33] border border-[#1E2B45] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#9BA8BB] uppercase tracking-wider text-[11px]">
                      Variant A (Control)
                    </span>
                    <span className="text-base font-bold text-[#F5F7FA]">
                      {stats.rateA}% conv
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F7FA] bg-[#0F1626] p-2.5 rounded-lg border border-[#1E2B45] leading-relaxed">
                    {exp.variantA}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#9BA8BB] pt-1">
                    <span>Sample Size: <strong>{exp.sampleSizeA}</strong></span>
                    <span>Conversions: <strong>{exp.conversionsA}</strong></span>
                  </div>
                </div>

                {/* Variant B */}
                <div className="p-4 rounded-xl bg-[#141E33] border border-[rgba(184,245,106,0.25)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#B8F56A] uppercase tracking-wider text-[11px]">
                      Variant B (Treatment)
                    </span>
                    <span className="text-base font-black text-[#B8F56A]">
                      {stats.rateB}% conv
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F7FA] bg-[#0F1626] p-2.5 rounded-lg border border-[#1E2B45] leading-relaxed">
                    {exp.variantB}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#9BA8BB] pt-1">
                    <span>Sample Size: <strong>{exp.sampleSizeB}</strong></span>
                    <span>Conversions: <strong>{exp.conversionsB}</strong></span>
                  </div>
                </div>
              </div>

              {/* Statistical Results & Lift bar */}
              <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2B45] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5F7FA]">
                      Statistical Verdict:
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                        stats.isWinner
                          ? "bg-[#B8F56A]/15 text-[#B8F56A] border border-[#B8F56A]/30"
                          : stats.hasData && !stats.hasAdequateSample
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-[#1E2B45] text-[#9BA8BB]"
                      }`}
                    >
                      {stats.significance}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9BA8BB]">
                    Observed Relative Lift:{" "}
                    <strong
                      className={
                        Number(stats.relLift) > 0 ? "text-[#B8F56A]" : "text-rose-400"
                      }
                    >
                      {Number(stats.relLift) > 0 ? `+${stats.relLift}%` : `${stats.relLift}%`}
                    </strong>{" "}
                    ({stats.absLift}% absolute difference)
                  </p>
                </div>

                {exp.notes && (
                  <div className="max-w-md text-xs text-[#9BA8BB] md:text-right border-t md:border-t-0 md:border-l border-[#1E2B45] pt-2 md:pt-0 md:pl-4">
                    <span className="font-semibold text-[#51D6C7] block text-[10px] uppercase">
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
