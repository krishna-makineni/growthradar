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
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Mission Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Brief 12 Campus Ambassadors on Referral Codes"
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
          />
          {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Description & Context *
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed tactical breakdown of how this mission will be completed..."
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
          />
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Target Channel
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Owner *
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="e.g. Growth Lead / Priya"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
            {errors.owner && <p className="text-rose-400 text-xs mt-1">{errors.owner}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Effort (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={formData.effortHours}
              onChange={(e) => setFormData({ ...formData, effortHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Budget (₹ INR)
            </label>
            <input
              type="number"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Due Day (Day 1 - 7)
            </label>
            <select
              value={formData.dueDay}
              onChange={(e) => setFormData({ ...formData, dueDay: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  Day {d} of Sprint
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Expected Outcome
            </label>
            <input
              type="text"
              value={formData.expectedOutcome}
              onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
              placeholder="e.g. 100+ new impressions"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Measurable Success Metric
            </label>
            <input
              type="text"
              value={formData.metric}
              onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
              placeholder="e.g. 5 CR confirmations"
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
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
            {initialData ? "Save Mission" : "Create Mission"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
