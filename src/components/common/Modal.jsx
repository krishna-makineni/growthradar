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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-[#121A2B] border border-[#2B3A58] rounded-xl shadow-2xl overflow-hidden z-10`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#1E2B45] bg-[#0F1626]">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#F5F7FA]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#9BA8BB] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA8BB] hover:text-[#F5F7FA] hover:bg-[#1E2B45] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with scrolling */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4">
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
      <p className="text-sm text-[#9BA8BB] leading-relaxed">{message}</p>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2B45]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[#9BA8BB] hover:text-white bg-[#182238] hover:bg-[#1E2B45] rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            confirmVariant === "danger"
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
              : "bg-[#B8F56A] hover:bg-[#a3dc5b] text-[#0B1020]"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
