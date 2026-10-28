import React from "react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  Edit,
  Trash2,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export function CommunityDetailDrawer({
  isOpen,
  onClose,
  community,
  onEdit,
  onDelete,
  onOpenScoreExplanation,
}) {
  if (!community) return null;

  const accessBadgeVariant = {
    approved: "lime",
    permission_requested: "teal",
    contact_identified: "amber",
    uncontacted: "default",
    unavailable: "rose",
  }[community.accessStatus] || "default";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={community.name}
      subtitle={`${community.category} • Opportunity Intelligence Profile`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs md:text-sm">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#0F1626] border border-[#1E2B45]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9BA8BB]">Access Status:</span>
            <Badge variant={accessBadgeVariant}>
              {community.accessStatus.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9BA8BB]">Confidence:</span>
            <span className="font-semibold text-[#F5F7FA]">{community.confidence}</span>
          </div>
          <button
            onClick={() => onOpenScoreExplanation(community)}
            className="flex items-center gap-1.5 text-xs text-[#B8F56A] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: {community.priorityScore}/100</span>
          </button>
        </div>

        {/* 4 core metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-[#141E33] border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9BA8BB] mb-1">
              <Users className="w-3 h-3 text-[#51D6C7]" />
              <span>Reachable</span>
            </div>
            <p className="text-base font-bold text-[#F5F7FA]">
              {community.reachableAudience}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              of {community.estimatedReach} total
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#141E33] border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9BA8BB] mb-1">
              <TrendingUp className="w-3 h-3 text-[#B8F56A]" />
              <span>Exp. Registrations</span>
            </div>
            <p className="text-base font-bold text-[#B8F56A]">
              {community.expectedRegs}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              {(community.conversionRate * 100).toFixed(1)}% expected conv
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#141E33] border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9BA8BB] mb-1">
              <Clock className="w-3 h-3 text-[#FACC15]" />
              <span>Velocity</span>
            </div>
            <p className="text-base font-bold text-[#F5F7FA]">
              {community.regsPerHour}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              regs / outreach hr
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#141E33] border border-[#1E2B45]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9BA8BB] mb-1">
              <DollarSign className="w-3 h-3 text-[#51D6C7]" />
              <span>Unit Cost (CAC)</span>
            </div>
            <p className="text-base font-bold text-[#51D6C7]">
              ₹{community.costPerReg}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              ₹{community.cost} total cost
            </p>
          </div>
        </div>

        {/* Strategic Analysis & Next Step */}
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2B45] space-y-2">
          <p className="font-semibold text-[#F5F7FA] text-xs uppercase tracking-wider text-[#51D6C7]">
            Recommended Growth Action
          </p>
          <p className="text-xs text-[#9BA8BB] leading-relaxed">
            {community.notes || "Establish direct contact with community coordinator and distribute the outcome-focused AI teaser circular."}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1E2B45]">
          <button
            onClick={() => onDelete(community.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(community)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Assumptions</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
