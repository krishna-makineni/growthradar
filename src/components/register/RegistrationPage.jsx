import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Download,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { ConfirmDialog } from "../common/Modal";

export function RegistrationPage() {
  const { registerStudent, actualRegistrations, resetRegistrationsOnly } = useGrowth();

  const handleExportCSV = () => {
    if (!actualRegistrations || actualRegistrations.length === 0) return;
    const headers = ["Registration ID", "Student Name", "Email", "Graduation Batch", "College / Institution", "Referral Code", "Source Channel", "Timestamp"];
    const rows = actualRegistrations.map((r) => [
      r.id,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      r.normalizedEmail || r.email,
      r.graduationYear,
      `"${(r.college || "").replace(/"/g, '""')}"`,
      r.referralCode || "DIRECT",
      r.source || "direct_portal",
      r.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campus_growth_radar_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse query params if any (e.g. ?ref=AMB-PRIYA&source=coding_club)
  const getQueryParam = (param) => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || "";
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    graduationYear: "2025",
    college: "",
    referralCode: "",
    source: "direct_portal",
  });

  useEffect(() => {
    const ref = getQueryParam("ref");
    const src = getQueryParam("source");
    if (ref || src) {
      setFormData((prev) => ({
        ...prev,
        referralCode: ref ? ref.toUpperCase() : prev.referralCode,
        source: src || prev.source,
      }));
    }
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [duplicateError, setDuplicateError] = useState("");
  const [successfulReg, setSuccessfulReg] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setDuplicateError("");

    const formEl = e.currentTarget;
    const nameVal = (formEl.elements["name"]?.value || formData.name || "").trim();
    const emailVal = (formEl.elements["email"]?.value || formData.email || "").trim();
    const gradVal = (formEl.elements["graduationYear"]?.value || formData.graduationYear || "2025").trim();
    const collegeVal = (formEl.elements["college"]?.value || formData.college || "").trim();
    const refVal = (formEl.elements["referralCode"]?.value || formData.referralCode || "").trim();

    const submissionData = {
      name: nameVal,
      email: emailVal,
      graduationYear: gradVal,
      college: collegeVal,
      referralCode: refVal,
      source: formData.source || "direct_portal",
    };

    const errors = {};
    if (!nameVal) errors.name = "Full name is required";
    if (!emailVal) {
      errors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errors.email = "Please enter a valid email format";
      }
    }
    if (!collegeVal) errors.college = "College / Institution name is required";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const result = registerStudent(submissionData);

    if (result.success) {
      setSuccessfulReg(result.registration);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#C5F56A", "#4ADFFF", "#FB923C"],
        });
      } catch (err) {
        // Safe fallback
      }
    } else {
      setDuplicateError(result.error);
    }
  };

  const handleCopyPersonalLink = () => {
    if (!successfulReg) return;
    const url = `${window.location.origin}/register?ref=${successfulReg.id}&source=peer_share`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const faqs = [
    {
      q: "What prerequisites are needed for this 60-minute workshop?",
      a: "Basic familiarity with any programming language (Python or JavaScript) is helpful, but no prior Machine Learning or AI background is needed. We provide pre-configured online sandbox environments so you don't need local GPU setups.",
    },
    {
      q: "What project will I actually build during the session?",
      a: "You will build and deploy a working AI Resume Analyzer & Interview Prep Bot using an LLM API. You will walk away with working code and a GitHub repository you can discuss during technical placements.",
    },
    {
      q: "Is there any registration fee or hidden cost?",
      a: "No. The workshop is 100% free for verified final-year engineering students. We do not ask for credit cards or payment details.",
    },
    {
      q: "Can non-CS/IT branches (ECE, EEE, Mech, Civil) attend?",
      a: "Yes! Modern tech hiring looks for software aptitude across all branches. The AI project is designed to be accessible and highly relevant regardless of your department.",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] flex items-center justify-between text-xs text-[#A5B2C5]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#4ADFFF] shrink-0" />
          <span>
            <strong className="text-[#F5F7FB]">Interactive Test Portal:</strong> Submissions in this portal validate email duplication, attribute referrals, and directly update the dashboard KPI metrics.
          </span>
        </div>
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="text-xs text-[#A5B2C5] hover:text-rose-400 flex items-center gap-1 shrink-0 ml-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Clear Test Records</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5F56A]/10 border border-[#C5F56A]/25 text-[#C5F56A] text-xs font-mono font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Hands-on Build Lab</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-[#F5F7FB] tracking-tight leading-tight">
          Build Your First AI Project in <span className="text-[#C5F56A]">60 Minutes</span>
        </h1>

        <p className="text-xs sm:text-base text-[#A5B2C5] leading-relaxed max-w-2xl mx-auto">
          Skip generic webinars. Join NxtWave's live hands-on engineering sprint to write, test, and deploy a working GenAI application for your placement resume.
        </p>

        {/* Schedule & Metadata Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1523] border border-[rgba(148,163,184,0.16)] text-[#F5F7FB]">
            <Calendar className="w-3.5 h-3.5 text-[#4ADFFF]" />
            <span>Saturday, 6:00 PM IST (60 mins)</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1523] border border-[rgba(148,163,184,0.16)] text-[#F5F7FB]">
            <Clock className="w-3.5 h-3.5 text-[#C5F56A]" />
            <span>Duration: 60 Minutes</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1523] border border-[rgba(148,163,184,0.16)] text-[#F5F7FB]">
            <Users className="w-3.5 h-3.5 text-[#FB923C]" />
            <span>Target: Final-Year Students</span>
          </span>
        </div>
      </div>

      {/* Main Registration Form or Success Ticket */}
      <div className="max-w-xl mx-auto">
        {successfulReg ? (
          /* Confirmed Registration Ticket View */
          <div className="bg-[#0D1523] border border-[#C5F56A]/40 rounded-2xl p-6 md:p-8 shadow-sm text-center space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-[#C5F56A]/10 border border-[#C5F56A]/30 flex items-center justify-center mx-auto text-[#C5F56A]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-semibold text-[#C5F56A] uppercase tracking-wider">
                Registration Confirmed
              </span>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] mt-1">
                Welcome to the Build Lab, {successfulReg.name}!
              </h2>
              <p className="text-xs text-[#A5B2C5] mt-1">
                Your test registration has been recorded and attributed to the growth simulation.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-4 rounded-xl bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.1)] pb-2">
                <span className="text-[#A5B2C5]">Registration ID:</span>
                <span className="font-mono font-bold text-[#C5F56A]">{successfulReg.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A5B2C5]">Registrant:</span>
                <span className="font-semibold text-[#F5F7FB]">{successfulReg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A5B2C5]">Email:</span>
                <span className="text-[#F5F7FB] font-mono">{successfulReg.normalizedEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A5B2C5]">College:</span>
                <span className="text-[#F5F7FB]">{successfulReg.college}</span>
              </div>
              {successfulReg.referralCode && (
                <div className="flex justify-between pt-1 border-t border-[rgba(148,163,184,0.1)]">
                  <span className="text-[#A5B2C5]">Attributed Referral:</span>
                  <span className="text-[#4ADFFF] font-mono font-bold">{successfulReg.referralCode}</span>
                </div>
              )}
            </div>

            {/* Peer Share Link */}
            <div className="p-4 rounded-xl bg-[#111C2E] border border-[rgba(148,163,184,0.14)] space-y-2 text-left">
              <p className="text-xs font-semibold text-[#F5F7FB] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5F56A]" />
                Invite Your Batchmates:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/register?ref=${successfulReg.id}&source=peer_share`}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.16)] text-xs font-mono text-[#A5B2C5]"
                />
                <button
                  type="button"
                  onClick={handleCopyPersonalLink}
                  className="px-3 py-2 rounded-lg bg-[#C5F56A] hover:bg-[#b8ea5e] text-[#070B14] text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessfulReg(null);
                setFormData({
                  name: "",
                  email: "",
                  graduationYear: "2025",
                  college: "",
                  referralCode: "",
                  source: "direct_portal",
                });
              }}
              className="text-xs text-[#4ADFFF] hover:underline cursor-pointer"
            >
              + Submit Another Test Registration
            </button>
          </div>
        ) : (
          /* Live Registration Form */
          <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="font-heading text-lg md:text-xl font-bold text-[#F5F7FB]">
                Reserve Your Workshop Seat — Free
              </h2>
              <p className="text-xs text-[#A5B2C5] mt-1">
                Zero spam. Only registration access and live cloud sandbox environment credentials.
              </p>
            </div>

            {duplicateError && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{duplicateError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs md:text-sm">
              {/* Name */}
              <div>
                <label className="block font-medium text-[#F5F7FB] mb-1">
                  Full Name *
                </label>
                <input
                  id="reg-name-input"
                  name="name"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onInput={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm transition-colors"
                />
                {formErrors.name && <p className="text-rose-400 text-xs mt-1">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium text-[#F5F7FB] mb-1">
                  Email Address * (Duplicate detection applied)
                </label>
                <input
                  id="reg-email-input"
                  name="email"
                  type="email"
                  placeholder="e.g. priya.sharma@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onInput={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm transition-colors"
                />
                {formErrors.email && <p className="text-rose-400 text-xs mt-1">{formErrors.email}</p>}
              </div>

              {/* Grad Year & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F5F7FB] mb-1">
                    Graduation Year
                  </label>
                  <select
                    id="reg-batch-select"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm cursor-pointer"
                  >
                    <option value="2025" className="bg-[#0D1523]">2025 (Final Year)</option>
                    <option value="2026" className="bg-[#0D1523]">2026 (Pre-Final Year)</option>
                    <option value="2027" className="bg-[#0D1523]">2027</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#F5F7FB] mb-1">
                    College / University *
                  </label>
                  <input
                    id="reg-college-input"
                    name="college"
                    type="text"
                    placeholder="e.g. National Institute of Tech"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    onInput={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm transition-colors"
                  />
                  {formErrors.college && <p className="text-rose-400 text-xs mt-1">{formErrors.college}</p>}
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block font-medium text-[#F5F7FB] mb-1">
                  Campus Ambassador Referral Code <span className="text-[#64748B] font-normal">(Optional)</span>
                </label>
                <input
                  id="reg-code-input"
                  name="referralCode"
                  type="text"
                  placeholder="e.g. AMB-PRIYA or AMB-ROHIT"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  onInput={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono focus:outline-none focus:border-[#C5F56A] text-xs md:text-sm"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Credits verified campus ambassadors for batchmate referrals.
                </p>
              </div>

              <button
                id="reg-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C5F56A] hover:bg-[#b8ea5e] text-[#070B14] font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Free Workshop Registration</span>
              </button>

              <p className="text-[11px] text-[#64748B] text-center">
                Privacy Conscious: Student emails are masked in public reports. No phone spam.
              </p>
            </form>
          </div>
        )}
      </div>

      {/* Workshop Learning Agenda & Project Specs */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] space-y-2">
          <div className="w-7 h-7 rounded-lg bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25 flex items-center justify-center font-mono font-bold text-xs">
            01
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#F5F7FB]">60-Minute Live Build</h3>
          <p className="text-xs text-[#A5B2C5] leading-relaxed">
            Write code live alongside an AI engineer. Build a working LLM agent with zero boilerplate.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] space-y-2">
          <div className="w-7 h-7 rounded-lg bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/25 flex items-center justify-center font-mono font-bold text-xs">
            02
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#F5F7FB]">Verified GitHub Repo</h3>
          <p className="text-xs text-[#A5B2C5] leading-relaxed">
            Commit your project directly to your GitHub profile to showcase during technical campus interviews.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] space-y-2">
          <div className="w-7 h-7 rounded-lg bg-[#FB923C]/10 text-[#FB923C] border border-[#FB923C]/25 flex items-center justify-center font-mono font-bold text-xs">
            03
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#F5F7FB]">Industry AI Standards</h3>
          <p className="text-xs text-[#A5B2C5] leading-relaxed">
            Learn real prompting architectures and API integration patterns used in top AI tech startups.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-2xl mx-auto space-y-3 pt-4">
        <h3 className="font-heading text-base font-bold text-[#F5F7FB] text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs md:text-sm font-medium text-[#F5F7FB] hover:text-[#C5F56A] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#C5F56A]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#64748B]" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#A5B2C5] leading-relaxed border-t border-[rgba(148,163,184,0.1)] pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test Registrations Log */}
      <div className="max-w-3xl mx-auto pt-4">
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[rgba(148,163,184,0.12)]">
            <div>
              <h4 className="font-heading text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">
                Recorded Test Registrations ({actualRegistrations.length})
              </h4>
              <p className="text-[11px] text-[#A5B2C5]">
                Persisted in browser localStorage • Directly updates the Overview KPI cards
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1020] hover:bg-[#111C2E] text-[#4ADFFF] hover:text-[#C5F56A] text-xs font-semibold border border-[rgba(148,163,184,0.16)] transition-colors cursor-pointer"
                title="Download all registrations as CSV file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <span className="text-[10px] font-mono text-[#4ADFFF] bg-[#4ADFFF]/10 px-2 py-0.5 rounded border border-[#4ADFFF]/20">
                Live Feed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A5B2C5]">
              <thead className="text-[10px] uppercase font-mono text-[#64748B] border-b border-[rgba(148,163,184,0.1)]">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-3">Batch</th>
                  <th className="py-2.5 px-3">Attributed Referral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(148,163,184,0.08)] text-xs">
                {actualRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#111C2E]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#C5F56A]">{reg.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#F5F7FB]">{reg.name}</td>
                    <td className="py-2.5 px-3 truncate max-w-[180px]">{reg.college}</td>
                    <td className="py-2.5 px-3 font-mono">{reg.graduationYear}</td>
                    <td className="py-2.5 px-3 font-mono text-[#4ADFFF]">
                      {reg.referralCode || "— (Direct)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetRegistrationsOnly}
        title="Clear Test Registrations"
        message="Are you sure you want to clear all test registrations? The actual count on the Overview dashboard will reset to 0."
        confirmText="Clear Records"
      />
    </div>
  );
}
