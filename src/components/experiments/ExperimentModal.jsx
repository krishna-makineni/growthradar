import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";

export function ExperimentModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    hypothesis: "",
    variantA: "",
    variantB: "",
    audience: "",
    primaryMetric: "Unique Registration Conversion Rate (%)",
    supportingMetrics: "Click-through rate, drop-off",
    sampleSizeA: 200,
    conversionsA: 15,
    sampleSizeB: 200,
    conversionsB: 28,
    status: "running",
    startDay: 1,
    endDay: 4,
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        hypothesis: initialData.hypothesis || "",
        variantA: initialData.variantA || "",
        variantB: initialData.variantB || "",
        audience: initialData.audience || "",
        primaryMetric: initialData.primaryMetric || "Unique Registration Conversion Rate (%)",
        supportingMetrics: initialData.supportingMetrics || "",
        sampleSizeA: initialData.sampleSizeA || 0,
        conversionsA: initialData.conversionsA || 0,
        sampleSizeB: initialData.sampleSizeB || 0,
        conversionsB: initialData.conversionsB || 0,
        status: initialData.status || "running",
        startDay: initialData.startDay || 1,
        endDay: initialData.endDay || 4,
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        name: "",
        hypothesis: "",
        variantA: "",
        variantB: "",
        audience: "",
        primaryMetric: "Unique Registration Conversion Rate (%)",
        supportingMetrics: "",
        sampleSizeA: 150,
        conversionsA: 10,
        sampleSizeB: 150,
        conversionsB: 22,
        status: "running",
        startDay: 2,
        endDay: 5,
        notes: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Experiment name is required";
    if (!formData.hypothesis.trim()) errs.hypothesis = "Hypothesis is required";
    if (!formData.variantA.trim()) errs.variantA = "Variant A is required";
    if (!formData.variantB.trim()) errs.variantB = "Variant B is required";
    if (Number(formData.sampleSizeA) < 0) errs.sampleSizeA = "Sample size cannot be negative";
    if (Number(formData.conversionsA) > Number(formData.sampleSizeA)) {
      errs.conversionsA = "Conversions cannot exceed sample size";
    }
    if (Number(formData.conversionsB) > Number(formData.sampleSizeB)) {
      errs.conversionsB = "Conversions cannot exceed sample size";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      sampleSizeA: Number(formData.sampleSizeA),
      conversionsA: Number(formData.conversionsA),
      sampleSizeB: Number(formData.sampleSizeB),
      conversionsB: Number(formData.conversionsB),
      startDay: Number(formData.startDay),
      endDay: Number(formData.endDay),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Growth Experiment" : "Create Growth A/B Experiment"}
      subtitle="Define hypothesis, test variants, sample sizes, and observe conversion lift"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Experiment Title *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Outcome Framing vs Technical Jargon"
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Test Hypothesis *
          </label>
          <textarea
            rows={2}
            value={formData.hypothesis}
            onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
            placeholder="e.g. If we frame the workshop around building a resume project, conversions will lift by >30%..."
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
          />
          {errors.hypothesis && <p className="text-rose-400 text-xs mt-1">{errors.hypothesis}</p>}
        </div>

        {/* Variants A & B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Variant A (Control) *
            </label>
            <textarea
              rows={2}
              value={formData.variantA}
              onChange={(e) => setFormData({ ...formData, variantA: e.target.value })}
              placeholder="e.g. Standard 'Join free workshop' copy"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
            />
            {errors.variantA && <p className="text-rose-400 text-xs mt-1">{errors.variantA}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Variant B (Treatment) *
            </label>
            <textarea
              rows={2}
              value={formData.variantB}
              onChange={(e) => setFormData({ ...formData, variantB: e.target.value })}
              placeholder="e.g. Outcome-oriented 'Build project for resume' copy"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
            />
            {errors.variantB && <p className="text-rose-400 text-xs mt-1">{errors.variantB}</p>}
          </div>
        </div>

        {/* Sample size & Conversions data */}
        <div className="p-3.5 rounded-lg bg-[#0F1626] border border-[#1E2B45] space-y-3">
          <p className="font-semibold text-[#51D6C7] text-xs">Test Observation Metrics:</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#9BA8BB] mb-1">
                Variant A: Sample Size
              </label>
              <input
                type="number"
                min="0"
                value={formData.sampleSizeA}
                onChange={(e) => setFormData({ ...formData, sampleSizeA: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-[#121A2B] border border-[#1E2B45] text-[#F5F7FA] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#9BA8BB] mb-1">
                Variant A: Conversions
              </label>
              <input
                type="number"
                min="0"
                value={formData.conversionsA}
                onChange={(e) => setFormData({ ...formData, conversionsA: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-[#121A2B] border border-[#1E2B45] text-[#F5F7FA] text-xs"
              />
              {errors.conversionsA && <p className="text-rose-400 text-[10px] mt-0.5">{errors.conversionsA}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#9BA8BB] mb-1">
                Variant B: Sample Size
              </label>
              <input
                type="number"
                min="0"
                value={formData.sampleSizeB}
                onChange={(e) => setFormData({ ...formData, sampleSizeB: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-[#121A2B] border border-[#1E2B45] text-[#F5F7FA] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#9BA8BB] mb-1">
                Variant B: Conversions
              </label>
              <input
                type="number"
                min="0"
                value={formData.conversionsB}
                onChange={(e) => setFormData({ ...formData, conversionsB: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-[#121A2B] border border-[#1E2B45] text-[#F5F7FA] text-xs"
              />
              {errors.conversionsB && <p className="text-rose-400 text-[10px] mt-0.5">{errors.conversionsB}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              <option value="draft">Draft / Planning</option>
              <option value="running">Running / Live Test</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              placeholder="e.g. 500 final-year CS students"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Observed Interpretation / Next Action
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Document takeaways and which variant to deploy at scale..."
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2B45]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#9BA8BB] hover:text-white bg-[#182238] hover:bg-[#1E2B45] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg shadow-sm transition-colors"
          >
            {initialData ? "Save Experiment" : "Create Experiment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
