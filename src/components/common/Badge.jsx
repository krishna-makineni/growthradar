import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const variantStyles = {
    lime: "bg-[rgba(184,245,106,0.12)] text-[#B8F56A] border border-[rgba(184,245,106,0.25)]",
    teal: "bg-[rgba(81,214,199,0.12)] text-[#51D6C7] border border-[rgba(81,214,199,0.25)]",
    amber: "bg-[rgba(251,146,60,0.12)] text-[#FB923C] border border-[rgba(251,146,60,0.25)]",
    rose: "bg-[rgba(248,113,113,0.12)] text-[#F87171] border border-[rgba(248,113,113,0.25)]",
    purple: "bg-[rgba(168,85,247,0.12)] text-[#C084FC] border border-[rgba(168,85,247,0.25)]",
    blue: "bg-[rgba(59,130,246,0.12)] text-[#60A5FA] border border-[rgba(59,130,246,0.25)]",
    default: "bg-[#1E2B45] text-[#9BA8BB] border border-[#2B3A58]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
