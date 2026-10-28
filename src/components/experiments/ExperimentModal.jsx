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
      title={initialData ? "Edit Growth Experiment" : "Create Growth Experiment"}
      subtitle="Configure A/B variants, sample sizes, and hypotheses"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Experiment Title *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. WhatsApp Hook: Resume Differentiation vs Free Workshop"
            className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm transition-colors"
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Test Hypothesis *
          </label>
          <textarea
            rows={2}
            value={formData.hypothesis}
            onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
            placeholder="We believe that leading with tangible GitHub resume commits will increase conversion by >25%..."
            className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm resize-none"
          />
          {errors.hypothesis && <p className="text-rose-400 text-xs mt-1">{errors.hypothesis}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Variant A (Control Copy / Hook) *
            </label>
            <textarea
              rows={2}
              value={formData.variantA}
              onChange={(e) => setFormData({ ...formData, variantA: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm resize-none"
            />
            {errors.variantA && <p className="text-rose-400 text-xs mt-1">{errors.variantA}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Variant B (Treatment Copy / Hook) *
            </label>
            <textarea
              rows={2}
              value={formData.variantB}
              onChange={(e) => setFormData({ ...formData, variantB: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm resize-none"
            />
            {errors.variantB && <p className="text-rose-400 text-xs mt-1">{errors.variantB}</p>}
          </div>
        </div>

        {/* Numbers grid for A */}
        <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] space-y-2">
          <p className="font-mono text-xs font-semibold text-[#A5B2C5]">Control (Variant A) Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#A5B2C5] mb-1">Sample Size</label>
              <input
                type="number"
                value={formData.sampleSizeA}
                onChange={(e) => setFormData({ ...formData, sampleSizeA: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#A5B2C5] mb-1">Conversions</label>
              <input
                type="number"
                value={formData.conversionsA}
                onChange={(e) => setFormData({ ...formData, conversionsA: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A]"
              />
            </div>
          </div>
        </div>

        {/* Numbers grid for B */}
        <div className="p-3 rounded-lg bg-[#0A1020] border border-[#C5F56A]/25 space-y-2">
          <p className="font-mono text-xs font-semibold text-[#C5F56A]">Treatment (Variant B) Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#A5B2C5] mb-1">Sample Size</label>
              <input
                type="number"
                value={formData.sampleSizeB}
                onChange={(e) => setFormData({ ...formData, sampleSizeB: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#A5B2C5] mb-1">Conversions</label>
              <input
                type="number"
                value={formData.conversionsB}
                onChange={(e) => setFormData({ ...formData, conversionsB: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Test Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm cursor-pointer"
            >
              <option value="draft" className="bg-[#0D1523]">Draft (Proposed)</option>
              <option value="running" className="bg-[#0D1523]">Running</option>
              <option value="completed" className="bg-[#0D1523]">Completed</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              placeholder="e.g. Placement prep groups"
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Action Taken / Implementation Notes
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Rolled out Variant B copy to all coding club circulars"
            className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(148,163,184,0.16)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs md:text-sm font-medium text-[#A5B2C5] hover:text-[#F5F7FB] bg-[#111C2E] hover:bg-[#18253D] border border-[rgba(148,163,184,0.16)] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs md:text-sm font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors cursor-pointer"
          >
            {initialData ? "Save Changes" : "Create Experiment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
