import React, { useState } from "react";
import {
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Calendar,
  User,
  Filter,
  DollarSign,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { Badge } from "../common/Badge";
import { MissionModal } from "./MissionModal";
import { ConfirmDialog } from "../common/Modal";

export function MissionsPage() {
  const { missions, addMission, updateMission, toggleMissionStatus, deleteMission } = useGrowth();

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
    in_progress: { label: "In Progress", variant: "teal" },
    completed: { label: "Completed", variant: "lime" },
    blocked: { label: "Blocked", variant: "rose" },
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#51D6C7]/10 text-[#51D6C7] border border-[#51D6C7]/20">
                Sprint Execution
              </span>
              <span className="text-xs text-[#9BA8BB]">
                Accountability Playbook
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
              Growth Mission Generator
            </h1>
            <p className="text-xs md:text-sm text-[#9BA8BB] mt-1 max-w-2xl leading-relaxed">
              Convert high-level simulator strategy into concrete daily execution tasks with assigned owners, timelines, and measurable verification metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F5F7FA] bg-[#0F1626] hover:bg-[#18253D] border border-[#1E2B45] rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#B8F56A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Briefing!" : "Copy Mission Briefing"}</span>
            </button>

            <button
              onClick={() => {
                setEditingMission(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mission</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker bar */}
        <div className="mt-5 pt-4 border-t border-[#1E2B45] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F5F7FA]">
              Sprint Execution Progress: {completedMissions} of {totalMissions} Completed ({completionPercent}%)
            </span>
            <div className="flex items-center gap-3 text-[11px] text-[#9BA8BB]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B8F56A]" /> {completedMissions} Done
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#51D6C7]" /> {inProgressMissions} Active
              </span>
              {blockedMissions > 0 && (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> {blockedMissions} Blocked
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#0F1626] border border-[#1E2B45] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#51D6C7] to-[#B8F56A] transition-all duration-300 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0F1626] border border-[#1E2B45] rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#F5F7FA] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#121A2B]">All Statuses</option>
              <option value="not_started" className="bg-[#121A2B]">Not Started</option>
              <option value="in_progress" className="bg-[#121A2B]">In Progress</option>
              <option value="completed" className="bg-[#121A2B]">Completed</option>
              <option value="blocked" className="bg-[#121A2B]">Blocked</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0F1626] border border-[#1E2B45] rounded-lg px-2.5 py-1.5">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-transparent text-[#F5F7FA] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#121A2B]">All Channels</option>
              <option value="Content & Copy" className="bg-[#121A2B]">Content & Copy</option>
              <option value="Ambassador Network" className="bg-[#121A2B]">Ambassador Network</option>
              <option value="Final-Year Class" className="bg-[#121A2B]">Final-Year Class</option>
              <option value="College Coding Club" className="bg-[#121A2B]">College Coding Club</option>
              <option value="Analytics & Growth" className="bg-[#121A2B]">Analytics & Growth</option>
              <option value="Peer Referral" className="bg-[#121A2B]">Peer Referral</option>
            </select>
          </div>
        </div>

        <span className="text-[#9BA8BB] text-xs">
          Showing {filteredMissions.length} of {missions.length} sprint missions
        </span>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-3.5">
        {filteredMissions.length === 0 ? (
          <div className="p-8 text-center bg-[#121A2B] border border-[#1E2B45] rounded-xl text-[#64748B] text-xs">
            No missions found for the selected filter.
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const badge = statusBadges[mission.status] || statusBadges.not_started;
            return (
              <div
                key={mission.id}
                className={`bg-[#121A2B] border rounded-xl p-5 transition-all shadow-md ${
                  mission.status === "completed"
                    ? "border-[#1E2B45]/70 opacity-80"
                    : mission.status === "blocked"
                    ? "border-rose-500/40 bg-rose-500/5"
                    : "border-[#1E2B45] hover:border-[#2B3A58]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Status toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleMissionStatus(mission.id)}
                      className={`mt-0.5 p-1.5 rounded-lg border transition-colors ${
                        mission.status === "completed"
                          ? "bg-[#B8F56A]/15 border-[#B8F56A]/30 text-[#B8F56A]"
                          : mission.status === "in_progress"
                          ? "bg-[#51D6C7]/15 border-[#51D6C7]/30 text-[#51D6C7]"
                          : mission.status === "blocked"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                          : "bg-[#182238] border-[#1E2B45] text-[#64748B] hover:text-[#F5F7FA]"
                      }`}
                      title="Click to advance status"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-[#51D6C7] bg-[#0F1626] px-2 py-0.5 rounded border border-[#1E2B45]">
                          Day {mission.dueDay}
                        </span>
                        <span className="text-[10px] text-[#9BA8BB] bg-[#0F1626] px-2 py-0.5 rounded border border-[#1E2B45]">
                          {mission.channel}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>

                      <h3
                        className={`text-base font-bold tracking-tight ${
                          mission.status === "completed"
                            ? "line-through text-[#9BA8BB]"
                            : "text-[#F5F7FA]"
                        }`}
                      >
                        {mission.title}
                      </h3>

                      <p className="text-xs text-[#9BA8BB] mt-1 leading-relaxed">
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
                      className="p-1.5 text-[#9BA8BB] hover:text-[#F5F7FA] hover:bg-[#182238] rounded-lg transition-colors"
                      title="Edit Mission"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(mission.id)}
                      className="p-1.5 text-[#9BA8BB] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Mission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meta footer row */}
                <div className="mt-4 pt-3 border-t border-[#1E2B45]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#9BA8BB]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Owner: <strong className="text-[#F5F7FA]">{mission.owner}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Effort: <strong className="text-[#F5F7FA]">{mission.effortHours} hrs</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Cost: <strong className="text-[#51D6C7]">₹{mission.cost}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">Metric: <strong className="text-[#B8F56A] truncate">{mission.metric}</strong></span>
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
