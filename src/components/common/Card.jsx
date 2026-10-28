import React from "react";

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  highlight = false,
  badge,
}) {
  return (
    <div
      className={`bg-[#121A2B] border rounded-xl p-5 md:p-6 transition-all duration-200 ${
        highlight
          ? "border-[rgba(184,245,106,0.35)] shadow-lg shadow-[rgba(184,245,106,0.05)]"
          : "border-[#1E2B45] hover:border-[#2B3A58]"
      } ${className}`}
    >
      {(title || subtitle || action || badge) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#1E2B45]/60">
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-base md:text-lg font-semibold text-[#F5F7FA] tracking-tight">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#9BA8BB] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
