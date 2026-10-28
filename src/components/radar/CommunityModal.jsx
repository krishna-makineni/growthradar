import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";

const CATEGORIES = [
  "College Coding Club",
  "Placement Prep Group",
  "Final-Year Class",
  "Technical Society",
  "Student Developer Community",
  "Campus Ambassador Network",
];

const ACCESS_STATUSES = [
  { value: "uncontacted", label: "Uncontacted" },
  { value: "contact_identified", label: "Contact Identified" },
  { value: "permission_requested", label: "Permission Requested" },
  { value: "approved", label: "Approved" },
  { value: "unavailable", label: "Unavailable / Blocked" },
];

export function CommunityModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    estimatedReach: 1000,
    reachableAudience: 600,
    conversionRate: 0.07,
    effortHours: 5,
    cost: 300,
    confidence: "Medium",
    accessStatus: "contact_identified",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || CATEGORIES[0],
        estimatedReach: initialData.estimatedReach || 1000,
        reachableAudience: initialData.reachableAudience || 600,
        conversionRate: initialData.conversionRate !== undefined ? initialData.conversionRate : 0.07,
        effortHours: initialData.effortHours || 5,
        cost: initialData.cost !== undefined ? initialData.cost : 300,
        confidence: initialData.confidence || "Medium",
        accessStatus: initialData.accessStatus || "contact_identified",
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        name: "",
        category: CATEGORIES[0],
        estimatedReach: 1200,
        reachableAudience: 700,
        conversionRate: 0.075,
        effortHours: 6,
        cost: 350,
        confidence: "Medium",
        accessStatus: "contact_identified",
        notes: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Community name is required";
    if (Number(formData.estimatedReach) <= 0) errs.estimatedReach = "Must be greater than 0";
    if (Number(formData.reachableAudience) <= 0) errs.reachableAudience = "Must be greater than 0";
    if (Number(formData.reachableAudience) > Number(formData.estimatedReach)) {
      errs.reachableAudience = "Reachable audience cannot exceed total estimated reach";
    }
    if (Number(formData.conversionRate) < 0.001 || Number(formData.conversionRate) > 1) {
      errs.conversionRate = "Conversion rate must be between 0.1% and 100%";
    }
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
      estimatedReach: Number(formData.estimatedReach),
      reachableAudience: Number(formData.reachableAudience),
      conversionRate: Number(formData.conversionRate),
      effortHours: Number(formData.effortHours),
      cost: Number(formData.cost),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Community Assumptions" : "Add Student Community Record"}
      subtitle="Configure reach, access hurdles, and expected conversion benchmarks"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
        {/* Name */}
        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Community / Channel Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. University IEEE Student Branch"
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category & Access Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Access Status
            </label>
            <select
              value={formData.accessStatus}
              onChange={(e) => setFormData({ ...formData, accessStatus: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              {ACCESS_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reach numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Total Community Reach
            </label>
            <input
              type="number"
              value={formData.estimatedReach}
              onChange={(e) => setFormData({ ...formData, estimatedReach: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
            {errors.estimatedReach && <p className="text-rose-400 text-xs mt-1">{errors.estimatedReach}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Reachable Final-Year Audience *
            </label>
            <input
              type="number"
              value={formData.reachableAudience}
              onChange={(e) => setFormData({ ...formData, reachableAudience: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
            {errors.reachableAudience && <p className="text-rose-400 text-xs mt-1">{errors.reachableAudience}</p>}
          </div>
        </div>

        {/* Conversion Rate & Confidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Expected Conversion Rate (0.01 - 0.20)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.005"
                min="0.005"
                max="0.5"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
              />
              <span className="text-xs text-[#51D6C7] font-semibold shrink-0">
                {(Number(formData.conversionRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
            {errors.conversionRate && <p className="text-rose-400 text-xs mt-1">{errors.conversionRate}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Confidence in Estimates
            </label>
            <select
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            >
              <option value="High">High (Validated Campus Past Performance)</option>
              <option value="Medium">Medium (Industry Benchmark Benchmark)</option>
              <option value="Low">Low (Unvalidated Assumption)</option>
            </select>
          </div>
        </div>

        {/* Effort & Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Outreach Effort (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={formData.effortHours}
              onChange={(e) => setFormData({ ...formData, effortHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
            {errors.effortHours && <p className="text-rose-400 text-xs mt-1">{errors.effortHours}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#F5F7FA] mb-1">
              Allocated Cost (₹ INR)
            </label>
            <input
              type="number"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm"
            />
            {errors.cost && <p className="text-rose-400 text-xs mt-1">{errors.cost}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-[#F5F7FA] mb-1">
            Execution Notes & Next Action
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Schedule call with President; draft custom announcement message"
            className="w-full px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] focus:outline-none focus:border-[#B8F56A] text-xs md:text-sm resize-none"
          />
        </div>

        {/* Actions */}
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
            {initialData ? "Save Changes" : "Create Community"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
