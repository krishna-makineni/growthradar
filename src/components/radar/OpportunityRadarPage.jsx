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
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
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
  const [sortBy, setSortBy] = useState("priorityScore"); // 'priorityScore' | 'expectedRegs' | 'regsPerHour' | 'costPerReg' | 'confidence'
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

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
        if (sortBy === "costPerReg") return (a.costPerReg || 0) - (b.costPerReg || 0); // lower is better
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
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#B8F56A]/10 text-[#B8F56A] border border-[#B8F56A]/20">
                Signature Feature
              </span>
              <span className="text-xs text-[#9BA8BB]">
                Transparent Prioritization Model
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
              Opportunity Radar
            </h1>
            <p className="text-xs md:text-sm text-[#9BA8BB] mt-1 max-w-2xl leading-relaxed">
              Evaluate and rank campus channels based on expected yield, effort velocity, CAC efficiency, and access status.
              Every score is fully explainable and recalculates as you adjust inputs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              id="add-community-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Community</span>
            </button>
          </div>
        </div>

        {/* Informational banner */}
        <div className="mt-4 pt-3 border-t border-[#1E2B45]/70 flex items-center gap-2 text-xs text-[#9BA8BB]">
          <Info className="w-3.5 h-3.5 text-[#51D6C7] shrink-0" />
          <span>
            Records seeded below are marked as illustrative data for simulation. Click any row or card to view formula calculations.
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0F1626] border border-[#1E2B45] rounded-lg text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#B8F56A]"
          />
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#0F1626] border border-[#1E2B45] rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[#F5F7FA] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#121A2B]">All Categories</option>
              {categories.filter((c) => c !== "all").map((cat) => (
                <option key={cat} value={cat} className="bg-[#121A2B]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Access Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0F1626] border border-[#1E2B45] rounded-lg px-2.5 py-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#F5F7FA] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-[#121A2B]">All Access Statuses</option>
              <option value="approved" className="bg-[#121A2B]">Approved Only</option>
              <option value="permission_requested" className="bg-[#121A2B]">Permission Requested</option>
              <option value="contact_identified" className="bg-[#121A2B]">Contact Identified</option>
              <option value="uncontacted" className="bg-[#121A2B]">Uncontacted</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#0F1626] border border-[#1E2B45] rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#F5F7FA] focus:outline-none text-xs cursor-pointer"
            >
              <option value="priorityScore" className="bg-[#121A2B]">Sort: Priority Score</option>
              <option value="expectedRegs" className="bg-[#121A2B]">Sort: Expected Regs</option>
              <option value="regsPerHour" className="bg-[#121A2B]">Sort: Regs / Hour (Velocity)</option>
              <option value="costPerReg" className="bg-[#121A2B]">Sort: Cost per Reg (CAC)</option>
              <option value="confidence" className="bg-[#121A2B]">Sort: Confidence Level</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[#0F1626] border border-[#1E2B45] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded ${
                viewMode === "table" ? "bg-[#1E2B45] text-[#B8F56A]" : "text-[#64748B] hover:text-[#F5F7FA]"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded ${
                viewMode === "cards" ? "bg-[#1E2B45] text-[#B8F56A]" : "text-[#64748B] hover:text-[#F5F7FA]"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === "table" ? (
        <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#9BA8BB]">
              <thead className="bg-[#0F1626] text-[#F5F7FA] uppercase tracking-wider text-[10px] border-b border-[#1E2B45]">
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
              <tbody className="divide-y divide-[#1E2B45]/60">
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
                      className="hover:bg-[#15233B]/70 cursor-pointer transition-colors group"
                    >
                      {/* Priority rank & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              comm.priorityScore >= 75
                                ? "bg-[#B8F56A]/15 text-[#B8F56A]"
                                : comm.priorityScore >= 50
                                ? "bg-[#51D6C7]/15 text-[#51D6C7]"
                                : "bg-[#1E2B45] text-[#9BA8BB]"
                            }`}
                          >
                            {comm.priorityScore}
                          </span>
                          <div>
                            <span className="font-semibold text-[#F5F7FA] group-hover:text-[#B8F56A] transition-colors block">
                              {comm.name}
                            </span>
                            {comm.isDemo && (
                              <span className="text-[9px] text-[#64748B]">Illustrative Seed Data</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[#F5F7FA]">{comm.category}</span>
                      </td>

                      {/* Access Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Badge variant={accessStatusColors[comm.accessStatus] || "default"}>
                          {comm.accessStatus.replace("_", " ")}
                        </Badge>
                      </td>

                      {/* Reachable */}
                      <td className="py-3 px-4 text-right font-medium text-[#F5F7FA]">
                        {comm.reachableAudience}
                        <span className="text-[10px] text-[#64748B] block">
                          of {comm.estimatedReach}
                        </span>
                      </td>

                      {/* Expected Regs */}
                      <td className="py-3 px-4 text-right font-bold text-[#B8F56A]">
                        {comm.expectedRegs}
                        <span className="text-[10px] text-[#64748B] block font-normal">
                          {(comm.conversionRate * 100).toFixed(1)}% conv
                        </span>
                      </td>

                      {/* Velocity (regs/hr) */}
                      <td className="py-3 px-4 text-right font-medium text-[#51D6C7]">
                        {comm.regsPerHour} <span className="text-[10px] text-[#64748B]">/ hr</span>
                      </td>

                      {/* Cost per reg */}
                      <td className="py-3 px-4 text-right font-medium text-[#FACC15]">
                        ₹{comm.costPerReg}
                        <span className="text-[10px] text-[#64748B] block">₹{comm.cost} total</span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            comm.confidence === "High"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : comm.confidence === "Medium"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-amber-500/10 text-amber-400"
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
                          className="px-2 py-1 rounded bg-[#182238] hover:bg-[#1E2B45] text-[11px] font-bold text-[#B8F56A] border border-[#1E2B45] flex items-center gap-1 mx-auto"
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
                          className="text-[#9BA8BB] hover:text-[#F5F7FA] text-xs underline mr-2"
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
              className="bg-[#121A2B] border border-[#1E2B45] hover:border-[#B8F56A]/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#51D6C7]">
                      {comm.category}
                    </span>
                    <h3 className="text-base font-bold text-[#F5F7FA] mt-0.5 group-hover:text-[#B8F56A] transition-colors">
                      {comm.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-black text-[#B8F56A]">
                      {comm.priorityScore}
                    </span>
                    <span className="text-[10px] text-[#64748B] block">Score</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={accessStatusColors[comm.accessStatus] || "default"}>
                    {comm.accessStatus.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] text-[#9BA8BB] bg-[#0F1626] px-2 py-0.5 rounded border border-[#1E2B45]">
                    Conf: {comm.confidence}
                  </span>
                </div>

                {/* 3 Metric counters */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#0F1626] border border-[#1E2B45] text-center text-xs mb-3">
                  <div>
                    <p className="text-[10px] text-[#64748B]">Reachable</p>
                    <p className="font-bold text-[#F5F7FA]">{comm.reachableAudience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Exp. Regs</p>
                    <p className="font-bold text-[#B8F56A]">{comm.expectedRegs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Est. CAC</p>
                    <p className="font-bold text-[#FACC15]">₹{comm.costPerReg}</p>
                  </div>
                </div>

                <p className="text-xs text-[#9BA8BB] line-clamp-2 leading-relaxed">
                  {comm.notes || comm.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2B45] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScoreModalCommunity(comm);
                  }}
                  className="flex items-center gap-1 text-[#51D6C7] hover:underline text-[11px]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Formula Breakdown</span>
                </button>

                <span className="text-[#9BA8BB] group-hover:text-[#F5F7FA] font-medium flex items-center gap-1">
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
