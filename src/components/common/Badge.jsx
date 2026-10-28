import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const variantStyles = {
    lime: "bg-[rgba(197,245,106,0.1)] text-[#C5F56A] border border-[rgba(197,245,106,0.25)]",
    teal: "bg-[rgba(74,223,255,0.1)] text-[#4ADFFF] border border-[rgba(74,223,255,0.25)]",
    cyan: "bg-[rgba(74,223,255,0.1)] text-[#4ADFFF] border border-[rgba(74,223,255,0.25)]",
    amber: "bg-[rgba(251,146,60,0.1)] text-[#FB923C] border border-[rgba(251,146,60,0.25)]",
    rose: "bg-[rgba(248,113,113,0.1)] text-[#F87171] border border-[rgba(248,113,113,0.25)]",
    purple: "bg-[rgba(168,85,247,0.1)] text-[#C084FC] border border-[rgba(168,85,247,0.25)]",
    blue: "bg-[rgba(74,223,255,0.1)] text-[#4ADFFF] border border-[rgba(74,223,255,0.25)]",
    default: "bg-[#111C2E] text-[#A5B2C5] border border-[rgba(148,163,184,0.16)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
