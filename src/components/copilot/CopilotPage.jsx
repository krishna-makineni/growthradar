import React, { useState } from "react";
import {
  Copy,
  Check,
  Info,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

const AUDIENCES = [
  { id: "whatsapp", label: "College WhatsApp Group", icon: "💬" },
  { id: "ambassador", label: "Student Ambassador 1-on-1 DM", icon: "🤝" },
  { id: "coding_club", label: "Coding Club Discord / Slack", icon: "💻" },
  { id: "placement", label: "Placement Prep Community", icon: "🎯" },
  { id: "social", label: "LinkedIn / Social Post", icon: "📱" },
];

const TONES = [
  { id: "outcome", label: "Outcome-Focused (Recommended)", desc: "Focuses on tangible code repo for placements" },
  { id: "technical", label: "Technical & Direct", desc: "Focuses on architecture, APIs, and zero fluff" },
  { id: "friendly", label: "Friendly Peer-to-Peer", desc: "Casual, supportive, batchmate tone" },
  { id: "direct", label: "Short & Action-Oriented", desc: "High scanability with bullet points" },
];

export function CopilotPage() {
  const [selectedAudience, setSelectedAudience] = useState("placement");
  const [selectedTone, setSelectedTone] = useState("outcome");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Deterministic rule-based copy engine adhering to anti-hype guidelines
  const generateVariants = () => {
    if (selectedAudience === "placement") {
      return [
        {
          title: "Variant 1: Resume Differentiation Angle",
          hypothesis: "Final-year students preparing for tech interviews prioritize tangible GitHub commits over conceptual webinars.",
          text: `Hey everyone, for anyone preparing for upcoming placement drives:\n\nNxtWave is hosting a free 60-minute practical build lab: "Build Your First AI Project in 60 Minutes".\n\nInstead of watching presentation slides, you'll write and deploy a working AI Resume Analyzer using an LLM API live, and push the code directly to your GitHub profile.\n\n🗓 Saturday, 6:00 PM IST (60 mins)\n💻 Hands-on coding in cloud sandbox\n🔗 Reserve your seat: https://campusgrowth.nxtwave.in/register?source=placement_group`,
        },
        {
          title: "Variant 2: Technical Interview Talking Point",
          hypothesis: "Highlighting that interviewers specifically ask about GenAI project experience creates high intent.",
          text: `Quick heads-up for 2025/2026 batchmates:\n\nIf you want a concrete AI project to talk through during technical interviews, NxtWave is running a 60-minute code-along session this weekend.\n\nYou'll learn how to connect an LLM API to structured data and build a working micro-app from scratch. Code templates and sandbox provided.\n\nFree registration: https://campusgrowth.nxtwave.in/register?source=placement_talk`,
        },
        {
          title: "Variant 3: Concise 3-Bullet Circular",
          hypothesis: "Short, skimmable messages reduce cognitive load and increase click-through rates in crowded placement groups.",
          text: `📢 Placement Build Lab: Build Your First AI Project in 60 Mins\n\n• What: Write, test, and deploy a live LLM application\n• Who: 2025/2026 Engineering Students (All Branches)\n• Deliverable: Working code repository on your GitHub\n• Cost: Free\n\nRegistration link: https://campusgrowth.nxtwave.in/register?source=placement_bullets`,
        },
      ];
    }

    if (selectedAudience === "whatsapp") {
      return [
        {
          title: "Variant 1: Batchmate Notification",
          hypothesis: "A peer tone avoids perceived institutional broadcasting and encourages organic forwardability.",
          text: `Hey guys! Found something genuinely useful for our final year:\n\nNxtWave is doing a free 60-min hands-on AI project workshop this Saturday. You actually write code live and build a working AI application for your resume rather than listening to theory.\n\nTakes 60 mins and it's completely free: https://campusgrowth.nxtwave.in/register?source=class_whatsapp`,
        },
        {
          title: "Variant 2: Practical Skills Focus",
          hypothesis: "Addressing anxiety about needing prior ML experience increases conversion among non-CS students.",
          text: `Class update: Free 60-min AI project workshop this weekend.\n\nNo prior Machine Learning background needed—it's a guided code-along where we build an LLM project in a browser sandbox. Good project addition before off-campus drives.\n\nLink to register: https://campusgrowth.nxtwave.in/register?source=class_update`,
        },
        {
          title: "Variant 3: Direct Link & Agenda",
          hypothesis: "High clarity on time investment (60 mins exact) minimizes attendance hesitation.",
          text: `📌 "Build Your First AI Project in 60 Minutes" — Free Workshop\n\nSaturday • 6:00 PM IST • 60 Minutes\nBuild and deploy your first live AI app with provided starter templates.\n\nRegister here: https://campusgrowth.nxtwave.in/register?source=class_short`,
        },
      ];
    }

    if (selectedAudience === "coding_club") {
      return [
        {
          title: "Variant 1: Developer-First Architecture",
          hypothesis: "Developers respond to mentions of APIs, endpoints, and live terminal interaction rather than generic AI promises.",
          text: `Hey devs! For our coding club members interested in Applied GenAI:\n\nNxtWave is hosting an interactive 60-minute build session: "Build Your First AI Project in 60 Minutes". We'll inspect prompt chaining, call LLM APIs, and deploy a functional web service live. Free sandbox access provided.\n\nRegister & view repository preview: https://campusgrowth.nxtwave.in/register?source=coding_club`,
        },
        {
          title: "Variant 2: Live Code-Along Invitation",
          hypothesis: "Framing as an interactive live coding session filters for high-commitment students.",
          text: `Club announcement: Instead of another theoretical webinar, this Saturday is a 100% code-along sprint. You will deploy a working AI app in 60 minutes and add the repository to your GitHub.\n\nReserve your spot: https://campusgrowth.nxtwave.in/register?source=club_live`,
        },
        {
          title: "Variant 3: Fast-Track Tech Teaser",
          hypothesis: "Low-friction participation with provided starter templates encourages immediate signups.",
          text: `⚡ 60-Min AI Sprint: Build & deploy an LLM application live.\nStack: Python / JS + LLM APIs + Cloud Sandbox.\nDeliverable: Working GitHub project.\n\nFree registration: https://campusgrowth.nxtwave.in/register?source=club_fast`,
        },
      ];
    }

    if (selectedAudience === "ambassador") {
      return [
        {
          title: "Variant 1: Personal 1-on-1 Peer DM",
          hypothesis: "Personal recommendations from verified campus ambassadors achieve the lowest CAC and highest attendance intent.",
          text: `Hey [Name]! Are you attending the 60-minute AI build lab this Saturday? You get to build and deploy an actual AI project live for your placement resume with starter code provided. It's free—here's my personal invite link if you want to join: https://campusgrowth.nxtwave.in/register?ref=[YOUR_CODE]`,
        },
        {
          title: "Variant 2: Study-Group Invite",
          hypothesis: "Encouraging dual-signups with a friend increases follow-through.",
          text: `Hey, a few of us from our batch are joining NxtWave's free 60-min AI project workshop this weekend to get a working GenAI project on our GitHub profiles before placements. Here's the link to grab a seat: https://campusgrowth.nxtwave.in/register?ref=[YOUR_CODE]`,
        },
        {
          title: "Variant 3: Direct Project Focus",
          hypothesis: "Clear expectation of time commitment and direct benefit reduces refusal rate.",
          text: `Hey [Name], thought this might help with your interview prep: NxtWave is running a 60-minute live build on Saturday where you build your first working AI application. Free registration link: https://campusgrowth.nxtwave.in/register?ref=[YOUR_CODE]`,
        },
      ];
    }

    // Default: Social / LinkedIn
    return [
      {
        title: "Variant 1: Career Project Narrative",
        hypothesis: "Career-oriented storytelling attracts proactive final-year students seeking portfolio enhancement.",
        text: `As final-year engineering students head into placement season, having a live, deployed AI project on your GitHub makes a massive difference.\n\nJoin NxtWave's free 60-minute build workshop: "Build Your First AI Project in 60 Minutes".\n\nNo theoretical lectures—just hands-on code and cloud deployment.\n\n🗓 Saturday, 6:00 PM IST\n🔗 Reserve your seat: https://campusgrowth.nxtwave.in/register?source=linkedin_post`,
      },
      {
        title: "Variant 2: Technical Breakdown",
        hypothesis: "Listing concrete skills learned demonstrates immediate educational value.",
        text: `What can you build in 60 minutes?\n\nJoin us this Saturday as we build and deploy a working AI application from scratch using modern LLM APIs. Ideal for 2025/2026 engineering graduates looking to strengthen their technical portfolios.\n\nFree registration link: https://campusgrowth.nxtwave.in/register?source=social_tech`,
      },
      {
        title: "Variant 3: Quick Event Snapshot",
        hypothesis: "Punchy short-form posts convert passive social scrollers into active registrants.",
        text: `⚡ Free Workshop: Build Your First AI Project in 60 Minutes.\nWrite code live. Deploy in the cloud. Add to your placement resume.\n\nFree seats open: https://campusgrowth.nxtwave.in/register?source=social_quick`,
      },
    ];
  };

  const variants = generateVariants();

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25">
                Growth Utility
              </span>
              <span className="text-xs text-[#A5B2C5]">
                Transparent Prompt Heuristics
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              AI Campaign Copilot
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Generate battle-tested, high-converting outreach copy for WhatsApp groups, student ambassadors, and coding clubs.
              All messages adhere strictly to truth-in-advertising guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4ADFFF] bg-[#4ADFFF]/10 px-3 py-1.5 rounded-lg border border-[#4ADFFF]/25 self-start md:self-auto font-mono">
            <ShieldCheck className="w-4 h-4 text-[#4ADFFF]" />
            <span>Rule-Based Prompt Engine</span>
          </div>
        </div>

        {/* Ethical Copy Guidelines banner */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(148,163,184,0.12)] flex items-start gap-2 text-xs text-[#A5B2C5]">
          <Info className="w-4 h-4 text-[#4ADFFF] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FB]">Truth in Growth Advertising:</strong> All generated suggestions strictly avoid fake scarcity, unsupported placement guarantees, fabricated testimonials, or misleading attendance claims.
          </span>
        </div>
      </div>

      {/* Control Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Audience Choice */}
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-4 space-y-2.5">
          <label className="block text-[11px] font-mono font-semibold text-[#A5B2C5] uppercase tracking-wider">
            1. Target Campus Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AUDIENCES.map((aud) => (
              <button
                key={aud.id}
                type="button"
                onClick={() => setSelectedAudience(aud.id)}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  selectedAudience === aud.id
                    ? "bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/35 shadow-sm"
                    : "bg-[#0A1020] text-[#A5B2C5] hover:text-[#F5F7FB] border border-[rgba(148,163,184,0.14)]"
                }`}
              >
                <span>{aud.icon}</span>
                <span className="truncate">{aud.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Choice */}
        <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-4 space-y-2.5">
          <label className="block text-[11px] font-mono font-semibold text-[#A5B2C5] uppercase tracking-wider">
            2. Strategic Messaging Tone
          </label>
          <div className="space-y-1.5">
            {TONES.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => setSelectedTone(tone.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  selectedTone === tone.id
                    ? "bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/35 shadow-sm"
                    : "bg-[#0A1020] text-[#A5B2C5] hover:text-[#F5F7FB] border border-[rgba(148,163,184,0.14)]"
                }`}
              >
                <span>{tone.label}</span>
                <span className="text-[10px] text-[#64748B] hidden sm:inline">{tone.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Message Variants Grid */}
      <div className="space-y-3.5">
        <h2 className="text-[11px] font-mono font-semibold text-[#A5B2C5] uppercase tracking-wider">
          Generated High-Converting Message Variations (3 Variants):
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {variants.map((variant, idx) => (
            <div
              key={idx}
              className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-[#C5F56A] uppercase tracking-wider">
                    {variant.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {variant.text.length} chars
                  </span>
                </div>

                {/* Growth Hypothesis */}
                <div className="p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)] flex items-start gap-2 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-[#FB923C] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#A5B2C5] leading-normal italic">
                    {variant.hypothesis}
                  </p>
                </div>

                {/* Message Body */}
                <div className="p-3.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)] text-xs font-sans text-[#F5F7FB] whitespace-pre-wrap leading-relaxed select-all">
                  {variant.text}
                </div>
              </div>

              {/* Copy CTA */}
              <button
                type="button"
                onClick={() => handleCopy(variant.text, idx)}
                className="w-full py-2 rounded-lg bg-[#111C2E] hover:bg-[#18253D] text-xs font-semibold text-[#F5F7FB] border border-[rgba(148,163,184,0.16)] hover:border-[#C5F56A]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C5F56A]" />
                    <span className="text-[#C5F56A]">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#A5B2C5]" />
                    <span>Copy Message Template</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
