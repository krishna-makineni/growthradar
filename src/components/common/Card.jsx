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
      className={`bg-[#0D1523] border rounded-xl p-5 md:p-6 transition-all duration-150 ${
        highlight
          ? "border-[rgba(197,245,106,0.32)] shadow-[0_4px_24px_rgba(197,245,106,0.04)]"
          : "border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)]"
      } ${className}`}
    >
      {(title || subtitle || action || badge) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[rgba(148,163,184,0.12)]">
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="font-heading text-base md:text-lg font-semibold text-[#F5F7FB] tracking-tight">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#A5B2C5] mt-0.5">
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
