import React from "react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Edit,
  Trash2,
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
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.16)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A5B2C5]">Access Status:</span>
            <Badge variant={accessBadgeVariant}>
              {community.accessStatus.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A5B2C5]">Confidence:</span>
            <span className="font-semibold text-[#F5F7FB]">{community.confidence}</span>
          </div>
          <button
            onClick={() => onOpenScoreExplanation(community)}
            className="flex items-center gap-1.5 text-xs text-[#C5F56A] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono">Score: {community.priorityScore}/100</span>
          </button>
        </div>

        {/* 4 core metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A5B2C5] mb-1">
              <Users className="w-3 h-3 text-[#4ADFFF]" />
              <span>Reachable</span>
            </div>
            <p className="font-mono text-base font-bold text-[#F5F7FB]">
              {community.reachableAudience}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-sans">
              of {community.estimatedReach} total
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A5B2C5] mb-1">
              <TrendingUp className="w-3 h-3 text-[#C5F56A]" />
              <span>Exp. Registrations</span>
            </div>
            <p className="font-mono text-base font-bold text-[#C5F56A]">
              {community.expectedRegs}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-sans">
              {(community.conversionRate * 100).toFixed(1)}% expected conv
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A5B2C5] mb-1">
              <Clock className="w-3 h-3 text-[#FB923C]" />
              <span>Velocity</span>
            </div>
            <p className="font-mono text-base font-bold text-[#F5F7FB]">
              {community.regsPerHour}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-sans">
              regs / outreach hr
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A5B2C5] mb-1">
              <DollarSign className="w-3 h-3 text-[#4ADFFF]" />
              <span>Unit Cost (CAC)</span>
            </div>
            <p className="font-mono text-base font-bold text-[#4ADFFF]">
              ₹{community.costPerReg}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-sans">
              ₹{community.cost} total cost
            </p>
          </div>
        </div>

        {/* Strategic Analysis & Next Step */}
        <div className="p-4 rounded-xl bg-[#0A1020] border border-[rgba(148,163,184,0.14)] space-y-2">
          <div>
            <p className="font-mono font-semibold text-xs uppercase tracking-wider text-[#4ADFFF]">
              Recommended Growth Action
            </p>
            <p className="text-xs text-[#F5F7FB] mt-0.5 leading-relaxed font-medium">
              {community.nextAction || "Deploy outcome-focused teaser copy to community leads."}
            </p>
          </div>
          {community.notes && (
            <div className="pt-2 border-t border-[rgba(148,163,184,0.1)]">
              <p className="text-[10px] font-mono uppercase text-[#64748B]">Context & Operational Notes</p>
              <p className="text-xs text-[#A5B2C5] mt-0.5 leading-relaxed">
                {community.notes}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(148,163,184,0.16)]">
          <button
            onClick={() => onDelete(community.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(community)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors cursor-pointer"
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
