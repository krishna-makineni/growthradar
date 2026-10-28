import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";

const CHANNELS = [
  "Content & Copy",
  "Ambassador Network",
  "Final-Year Class",
  "College Coding Club",
  "Technical Society",
  "Analytics & Growth",
  "Peer Referral",
];

export function MissionModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    channel: CHANNELS[0],
    owner: "Growth Lead",
    effortHours: 3,
    cost: 0,
    expectedOutcome: "",
    metric: "",
    dueDay: 2,
    status: "not_started",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        channel: initialData.channel || CHANNELS[0],
        owner: initialData.owner || "Growth Lead",
        effortHours: initialData.effortHours || 3,
        cost: initialData.cost !== undefined ? initialData.cost : 0,
        expectedOutcome: initialData.expectedOutcome || "",
        metric: initialData.metric || "",
        dueDay: initialData.dueDay || 2,
        status: initialData.status || "not_started",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        channel: CHANNELS[0],
        owner: "Growth Lead",
        effortHours: 3,
        cost: 0,
        expectedOutcome: "",
        metric: "",
        dueDay: 2,
        status: "not_started",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Mission title is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.owner.trim()) errs.owner = "Owner is required";
    if (Number(formData.effortHours) < 0) errs.effortHours = "Effort cannot be negative";
    if (Number(formData.cost) < 0) errs.cost = "Cost cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      effortHours: Number(formData.effortHours),
      cost: Number(formData.cost),
      dueDay: Number(formData.dueDay),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Growth Mission" : "Create New Growth Mission"}
      subtitle="Define actionable sprint task with clear success criteria and owner"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Mission Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Publish GitHub repository proof teaser"
            className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm transition-colors"
          />
          {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Detailed Description / Playbook *
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Step-by-step instructions for the executor..."
            className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm resize-none"
          />
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Channel Stream
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm cursor-pointer"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch} className="bg-[#0D1523]">
                  {ch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Accountable Owner *
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="e.g. Ambassador Lead"
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
            />
            {errors.owner && <p className="text-rose-400 text-xs mt-1">{errors.owner}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Due Day (Sprint)
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={formData.dueDay}
              onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Effort (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={formData.effortHours}
              onChange={(e) => setFormData({ ...formData, effortHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FB] mb-1">
              Allocated Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FB] mb-1">
            Verification Metric / Deliverable *
          </label>
          <input
            type="text"
            value={formData.metric}
            onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
            placeholder="e.g. 5 partner coding clubs publish link by 2 PM"
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
            {initialData ? "Save Changes" : "Create Mission"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
