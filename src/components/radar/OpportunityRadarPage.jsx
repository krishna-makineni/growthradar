import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  Info,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { Badge } from "../common/Badge";
import { CommunityModal } from "./CommunityModal";
import { CommunityDetailDrawer } from "./CommunityDetailDrawer";
import { ScoreExplanationModal } from "./ScoreExplanationModal";
import { ConfirmDialog } from "../common/Modal";

export function OpportunityRadarPage() {
  const { communities, addCommunity, updateCommunity, deleteCommunity } = useGrowth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("priorityScore");
  const [viewMode, setViewMode] = useState("table");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [detailCommunity, setDetailCommunity] = useState(null);
  const [scoreModalCommunity, setScoreModalCommunity] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    return communities
      .filter((comm) => {
        const matchesSearch =
          comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comm.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || comm.category === selectedCategory;
        const matchesStatus =
          selectedStatus === "all" || comm.accessStatus === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "priorityScore") return (b.priorityScore || 0) - (a.priorityScore || 0);
        if (sortBy === "expectedRegs") return (b.expectedRegs || 0) - (a.expectedRegs || 0);
        if (sortBy === "regsPerHour") return (b.regsPerHour || 0) - (a.regsPerHour || 0);
        if (sortBy === "costPerReg") return (a.costPerReg || 0) - (b.costPerReg || 0);
        if (sortBy === "confidence") {
          const confOrder = { High: 3, Medium: 2, Low: 1 };
          return (confOrder[b.confidence] || 0) - (confOrder[a.confidence] || 0);
        }
        return 0;
      });
  }, [communities, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const accessStatusColors = {
    approved: "lime",
    permission_requested: "teal",
    contact_identified: "amber",
    uncontacted: "default",
    unavailable: "rose",
  };

  const categories = [
    "all",
    "College Coding Club",
    "Placement Prep Group",
    "Final-Year Class",
    "Technical Society",
    "Student Developer Community",
    "Campus Ambassador Network",
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25">
                Signature Feature
              </span>
              <span className="text-xs text-[#A5B2C5]">
                Transparent Prioritization Model
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              Opportunity Radar
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Evaluate and rank campus channels based on expected yield, effort velocity, CAC efficiency, and access status.
              Every score is fully explainable and recalculates as you adjust inputs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              id="add-community-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Community</span>
            </button>
          </div>
        </div>

        {/* Informational banner */}
        <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] flex items-center gap-2 text-xs text-[#A5B2C5]">
          <Info className="w-3.5 h-3.5 text-[#4ADFFF] shrink-0" />
          <span>
            Records seeded below are marked as illustrative simulation data. Click any row or card to inspect formula calculations.
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg text-[#F5F7FB] placeholder-[#64748B] focus:outline-none focus:border-[#C5F56A] text-xs transition-colors"
          />
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[#F5F7FB] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#0D1523]">All Categories</option>
              {categories.filter((c) => c !== "all").map((cat) => (
                <option key={cat} value={cat} className="bg-[#0D1523]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Access Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg px-2.5 py-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#F5F7FB] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#0D1523]">All Access Statuses</option>
              <option value="approved" className="bg-[#0D1523]">Approved Only</option>
              <option value="permission_requested" className="bg-[#0D1523]">Permission Requested</option>
              <option value="contact_identified" className="bg-[#0D1523]">Contact Identified</option>
              <option value="uncontacted" className="bg-[#0D1523]">Uncontacted</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#F5F7FB] focus:outline-none text-xs cursor-pointer"
            >
              <option value="priorityScore" className="bg-[#0D1523]">Sort: Priority Score</option>
              <option value="expectedRegs" className="bg-[#0D1523]">Sort: Expected Regs</option>
              <option value="regsPerHour" className="bg-[#0D1523]">Sort: Regs / Hour (Velocity)</option>
              <option value="costPerReg" className="bg-[#0D1523]">Sort: Cost per Reg (CAC)</option>
              <option value="confidence" className="bg-[#0D1523]">Sort: Confidence Level</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[#0A1020] border border-[rgba(148,163,184,0.16)] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-[#111C2E] text-[#C5F56A]" : "text-[#64748B] hover:text-[#F5F7FB]"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-[#111C2E] text-[#C5F56A]" : "text-[#64748B] hover:text-[#F5F7FB]"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === "table" ? (
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A5B2C5]">
              <thead className="bg-[#0A1020] text-[#F5F7FB] uppercase tracking-wider text-[10px] font-mono border-b border-[rgba(148,163,184,0.16)]">
                <tr>
                  <th className="py-3 px-4">Priority & Community</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Access Status</th>
                  <th className="py-3 px-4 text-right">Reachable</th>
                  <th className="py-3 px-4 text-right">Exp. Regs</th>
                  <th className="py-3 px-4 text-right">Velocity</th>
                  <th className="py-3 px-4 text-right">Est. CAC</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(148,163,184,0.1)]">
                {filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-[#64748B]">
                      No communities match the current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAndSorted.map((comm) => (
                    <tr
                      key={comm.id}
                      onClick={() => setDetailCommunity(comm)}
                      className="hover:bg-[#111C2E]/60 cursor-pointer transition-colors group"
                    >
                      {/* Priority rank & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-mono font-bold ${
                              comm.priorityScore >= 75
                                ? "bg-[#C5F56A]/15 text-[#C5F56A] border border-[#C5F56A]/30"
                                : comm.priorityScore >= 50
                                ? "bg-[#4ADFFF]/15 text-[#4ADFFF] border border-[#4ADFFF]/30"
                                : "bg-[#111C2E] text-[#A5B2C5] border border-[rgba(148,163,184,0.16)]"
                            }`}
                          >
                            {comm.priorityScore}
                          </span>
                          <div>
                            <span className="font-semibold text-[#F5F7FB] group-hover:text-[#C5F56A] transition-colors block">
                              {comm.name}
                            </span>
                            {comm.isDemo && (
                              <span className="text-[9px] font-mono text-[#64748B]">Illustrative Seed Data</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[#A5B2C5]">{comm.category}</span>
                      </td>

                      {/* Access Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Badge variant={accessStatusColors[comm.accessStatus] || "default"}>
                          {comm.accessStatus.replace("_", " ")}
                        </Badge>
                      </td>

                      {/* Reachable */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#F5F7FB]">
                        {comm.reachableAudience}
                        <span className="text-[10px] text-[#64748B] block font-sans">
                          of {comm.estimatedReach}
                        </span>
                      </td>

                      {/* Expected Regs */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#C5F56A]">
                        {comm.expectedRegs}
                        <span className="text-[10px] text-[#64748B] block font-normal font-sans">
                          {(comm.conversionRate * 100).toFixed(1)}% conv
                        </span>
                      </td>

                      {/* Velocity (regs/hr) */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#4ADFFF]">
                        {comm.regsPerHour} <span className="text-[10px] text-[#64748B] font-sans">/ hr</span>
                      </td>

                      {/* Cost per reg */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#FB923C]">
                        ₹{comm.costPerReg}
                        <span className="text-[10px] text-[#64748B] block font-sans">₹{comm.cost} total</span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            comm.confidence === "High"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : comm.confidence === "Medium"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {comm.confidence}
                        </span>
                      </td>

                      {/* Score Breakdown Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScoreModalCommunity(comm);
                          }}
                          className="px-2 py-1 rounded bg-[#111C2E] hover:bg-[#18253D] text-[11px] font-mono font-bold text-[#C5F56A] border border-[rgba(148,163,184,0.16)] flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{comm.priorityScore}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCommunity(comm);
                          }}
                          className="text-[#A5B2C5] hover:text-[#F5F7FB] text-xs underline cursor-pointer mr-1"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((comm) => (
            <div
              key={comm.id}
              onClick={() => setDetailCommunity(comm)}
              className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[#C5F56A]/40 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#4ADFFF]">
                      {comm.category}
                    </span>
                    <h3 className="font-heading text-base font-bold text-[#F5F7FB] mt-0.5 group-hover:text-[#C5F56A] transition-colors">
                      {comm.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xl font-bold text-[#C5F56A]">
                      {comm.priorityScore}
                    </span>
                    <span className="text-[10px] text-[#64748B] block">Score</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={accessStatusColors[comm.accessStatus] || "default"}>
                    {comm.accessStatus.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] text-[#A5B2C5] bg-[#111C2E] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.12)]">
                    Conf: {comm.confidence}
                  </span>
                </div>

                {/* 3 Metric counters */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-center text-xs mb-3">
                  <div>
                    <p className="text-[10px] text-[#64748B]">Reachable</p>
                    <p className="font-mono font-bold text-[#F5F7FB]">{comm.reachableAudience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Exp. Regs</p>
                    <p className="font-mono font-bold text-[#C5F56A]">{comm.expectedRegs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Est. CAC</p>
                    <p className="font-mono font-bold text-[#FB923C]">₹{comm.costPerReg}</p>
                  </div>
                </div>

                <p className="text-xs text-[#A5B2C5] line-clamp-2 leading-relaxed">
                  {comm.notes || comm.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScoreModalCommunity(comm);
                  }}
                  className="flex items-center gap-1 text-[#4ADFFF] hover:underline text-[11px] cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Formula Breakdown</span>
                </button>

                <span className="text-[#A5B2C5] group-hover:text-[#F5F7FB] font-medium flex items-center gap-1">
                  View Profile &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Community Modal */}
      <CommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data) => addCommunity(data)}
      />

      {/* Edit Community Modal */}
      <CommunityModal
        isOpen={Boolean(editingCommunity)}
        onClose={() => setEditingCommunity(null)}
        initialData={editingCommunity}
        onSave={(data) => {
          if (editingCommunity) {
            updateCommunity(editingCommunity.id, data);
            setEditingCommunity(null);
          }
        }}
      />

      {/* Detail Drawer Modal */}
      <CommunityDetailDrawer
        isOpen={Boolean(detailCommunity)}
        onClose={() => setDetailCommunity(null)}
        community={detailCommunity}
        onEdit={(comm) => {
          setDetailCommunity(null);
          setEditingCommunity(comm);
        }}
        onDelete={(id) => {
          setDetailCommunity(null);
          setDeletingId(id);
        }}
        onOpenScoreExplanation={(comm) => setScoreModalCommunity(comm)}
      />

      {/* Transparent Score Breakdown Modal */}
      <ScoreExplanationModal
        isOpen={Boolean(scoreModalCommunity)}
        onClose={() => setScoreModalCommunity(null)}
        community={scoreModalCommunity}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteCommunity(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Community Record"
        message="Are you sure you want to remove this community from the Opportunity Radar? This will update the growth forecast."
        confirmText="Delete Record"
      />
    </div>
  );
}
