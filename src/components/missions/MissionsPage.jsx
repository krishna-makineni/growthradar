import React, { useState } from "react";
import {
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  User,
  Filter,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { Badge } from "../common/Badge";
import { MissionModal } from "./MissionModal";
import { ConfirmDialog } from "../common/Modal";

export function MissionsPage() {
  const { missions, addMission, updateMission, toggleMissionStatus, deleteMission, simulatorParams } = useGrowth();

  const totalMissionCost = missions.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
  const campaignBudget = simulatorParams?.budget || 2000;
  const unallocatedBudget = campaignBudget - totalMissionCost;

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copied, setCopied] = useState(false);

  // Status stats
  const totalMissions = missions.length;
  const completedMissions = missions.filter((m) => m.status === "completed").length;
  const inProgressMissions = missions.filter((m) => m.status === "in_progress").length;
  const blockedMissions = missions.filter((m) => m.status === "blocked").length;
  const completionPercent = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  // Filtered
  const filteredMissions = missions.filter((m) => {
    const matchesStatus = selectedStatus === "all" || m.status === selectedStatus;
    const matchesChannel = selectedChannel === "all" || m.channel === selectedChannel;
    return matchesStatus && matchesChannel;
  });

  const handleCopySummary = () => {
    const text = `📋 CAMPUS GROWTH RADAR - 7-DAY MISSION SUMMARY
Target: 500 Unique Registrations | ₹2,000 Budget Cap
Progress: ${completedMissions}/${totalMissions} Completed (${completionPercent}%)

${missions
  .map(
    (m, i) =>
      `${i + 1}. [${m.status.toUpperCase()}] Day ${m.dueDay}: ${m.title}
   - Owner: ${m.owner} | Effort: ${m.effortHours}h | Cost: ₹${m.cost}
   - Metric: ${m.metric}
   - Description: ${m.description}`
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const statusBadges = {
    not_started: { label: "Not Started", variant: "default" },
    in_progress: { label: "In Progress", variant: "cyan" },
    completed: { label: "Completed", variant: "lime" },
    blocked: { label: "Blocked", variant: "rose" },
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/25">
                Sprint Execution
              </span>
              <span className="text-xs text-[#A5B2C5]">
                Accountability Playbook
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              Growth Mission Generator
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Convert high-level simulator strategy into concrete daily execution tasks with assigned owners, timelines, and measurable verification metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F5F7FB] bg-[#0A1020] hover:bg-[#111C2E] border border-[rgba(148,163,184,0.16)] rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C5F56A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Briefing!" : "Copy Mission Briefing"}</span>
            </button>

            <button
              onClick={() => {
                setEditingMission(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mission</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker bar & Budget Reconciliation */}
        <div className="mt-5 pt-4 border-t border-[rgba(148,163,184,0.12)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[#F5F7FB]">
              Sprint Execution Progress: <span className="font-mono">{completedMissions}</span> of <span className="font-mono">{totalMissions}</span> Completed (<span className="font-mono text-[#C5F56A]">{completionPercent}%</span>)
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#A5B2C5]">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.14)]">
                <DollarSign className="w-3 h-3 text-[#C5F56A]" />
                <span>Missions Allocated: <strong className="font-mono text-[#F5F7FB]">₹{totalMissionCost}</strong> / <strong className="font-mono text-[#A5B2C5]">₹{campaignBudget}</strong></span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ml-1 ${
                  unallocatedBudget >= 0
                    ? "bg-[#C5F56A]/10 text-[#C5F56A] border-[#C5F56A]/25"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                }`}>
                  {unallocatedBudget >= 0 ? `₹${unallocatedBudget} Reserve Pool` : `₹${Math.abs(unallocatedBudget)} Over Budget`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C5F56A]" /> <span className="font-mono">{completedMissions}</span> Done
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4ADFFF]" /> <span className="font-mono">{inProgressMissions}</span> Active
                </span>
                {blockedMissions > 0 && (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> <span className="font-mono">{blockedMissions}</span> Blocked
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-[#0A1020] border border-[rgba(148,163,184,0.16)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4ADFFF] to-[#C5F56A] transition-all duration-300 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#F5F7FB] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#0D1523]">All Statuses</option>
              <option value="not_started" className="bg-[#0D1523]">Not Started</option>
              <option value="in_progress" className="bg-[#0D1523]">In Progress</option>
              <option value="completed" className="bg-[#0D1523]">Completed</option>
              <option value="blocked" className="bg-[#0D1523]">Blocked</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg px-2.5 py-1.5">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-transparent text-[#F5F7FB] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#0D1523]">All Channels</option>
              <option value="Content & Copy" className="bg-[#0D1523]">Content & Copy</option>
              <option value="Ambassador Network" className="bg-[#0D1523]">Ambassador Network</option>
              <option value="Final-Year Class" className="bg-[#0D1523]">Final-Year Class</option>
              <option value="College Coding Club" className="bg-[#0D1523]">College Coding Club</option>
              <option value="Analytics & Growth" className="bg-[#0D1523]">Analytics & Growth</option>
              <option value="Peer Referral" className="bg-[#0D1523]">Peer Referral</option>
            </select>
          </div>
        </div>

        <span className="text-[#A5B2C5] text-xs">
          Showing <span className="font-mono">{filteredMissions.length}</span> of <span className="font-mono">{missions.length}</span> sprint missions
        </span>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-8 text-center bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl text-[#64748B] text-xs">
            No missions found for the selected filter.
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const badge = statusBadges[mission.status] || statusBadges.not_started;
            return (
              <div
                key={mission.id}
                className={`bg-[#0D1523] border rounded-xl p-5 transition-all shadow-sm ${
                  mission.status === "completed"
                    ? "border-[rgba(148,163,184,0.1)] opacity-75"
                    : mission.status === "blocked"
                    ? "border-rose-500/40 bg-rose-500/5"
                    : "border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Status toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleMissionStatus(mission.id)}
                      className={`mt-0.5 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        mission.status === "completed"
                          ? "bg-[#C5F56A]/15 border-[#C5F56A]/30 text-[#C5F56A]"
                          : mission.status === "in_progress"
                          ? "bg-[#4ADFFF]/15 border-[#4ADFFF]/30 text-[#4ADFFF]"
                          : mission.status === "blocked"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                          : "bg-[#111C2E] border-[rgba(148,163,184,0.16)] text-[#64748B] hover:text-[#F5F7FB]"
                      }`}
                      title="Click to advance status"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-semibold text-[#4ADFFF] bg-[#0A1020] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.16)]">
                          Day {mission.dueDay}
                        </span>
                        <span className="text-[10px] text-[#A5B2C5] bg-[#0A1020] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.16)]">
                          {mission.channel}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>

                      <h3
                        className={`font-heading text-base font-semibold tracking-tight ${
                          mission.status === "completed"
                            ? "line-through text-[#A5B2C5]"
                            : "text-[#F5F7FB]"
                        }`}
                      >
                        {mission.title}
                      </h3>

                      <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Day */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => {
                        setEditingMission(mission);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] rounded-lg transition-colors cursor-pointer"
                      title="Edit Mission"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(mission.id)}
                      className="p-1.5 text-[#A5B2C5] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Mission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meta footer row */}
                <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#A5B2C5]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Owner: <strong className="text-[#F5F7FB]">{mission.owner}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Effort: <strong className="font-mono text-[#F5F7FB]">{mission.effortHours} hrs</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Cost: <strong className="font-mono text-[#4ADFFF]">₹{mission.cost}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">Metric: <strong className="text-[#C5F56A] truncate font-mono">{mission.metric}</strong></span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      <MissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMission(null);
        }}
        initialData={editingMission}
        onSave={(data) => {
          if (editingMission) {
            updateMission(editingMission.id, data);
          } else {
            addMission(data);
          }
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteMission(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Growth Mission"
        message="Are you sure you want to remove this sprint mission?"
        confirmText="Delete Mission"
      />
    </div>
  );
}
