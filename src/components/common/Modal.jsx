import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-[#0D1523] border border-[rgba(148,163,184,0.22)] rounded-xl shadow-2xl overflow-hidden z-10`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-[rgba(148,163,184,0.16)] bg-[#0A1020]">
          <div>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#F5F7FB] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#A5B2C5] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with scrolling */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  confirmVariant = "danger",
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-[#A5B2C5] leading-relaxed">{message}</p>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(148,163,184,0.16)]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs md:text-sm font-medium text-[#A5B2C5] hover:text-[#F5F7FB] bg-[#111C2E] hover:bg-[#18253D] border border-[rgba(148,163,184,0.16)] rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            confirmVariant === "danger"
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
              : "bg-[#C5F56A] hover:bg-[#b8ea5e] text-[#070B14]"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
