import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Download, Sparkles, Smartphone } from "lucide-react";

export function QrCodeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [useBranded, setUseBranded] = useState(false);
  const siteUrl = "https://growthradar-gamma.vercel.app/";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrSrc = useBranded ? "/growthradar-qr-branded.png" : "/growthradar-qr.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0D1523] border border-[#C5F56A]/30 p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5F56A]/10 border border-[#C5F56A]/25 text-[#C5F56A] text-[10px] font-mono font-semibold uppercase">
            <Smartphone className="w-3 h-3" />
            <span>Instant Mobile Access</span>
          </div>
          <h2 className="font-heading text-lg font-bold text-[#F5F7FB]">
            Scan to Open App
          </h2>
          <p className="text-xs text-[#A5B2C5]">
            Point your phone camera to experience Campus Growth Radar live on mobile.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-xl inline-block shadow-lg mx-auto border border-[rgba(148,163,184,0.2)]">
          <img
            src={qrSrc}
            alt="Campus Growth Radar QR Code"
            className="w-56 h-56 object-contain rounded-lg mx-auto"
          />
        </div>

        {/* Theme toggle for QR */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setUseBranded(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              !useBranded
                ? "bg-[#C5F56A] text-[#070B14] font-bold"
                : "bg-[#111C2E] text-[#A5B2C5] hover:text-[#F5F7FB]"
            }`}
          >
            Clean Contrast
          </button>
          <button
            onClick={() => setUseBranded(true)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              useBranded
                ? "bg-[#C5F56A] text-[#070B14] font-bold"
                : "bg-[#111C2E] text-[#A5B2C5] hover:text-[#F5F7FB]"
            }`}
          >
            Electric Lime Dark
          </button>
        </div>

        {/* URL Pill & Copy */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.16)] text-xs">
          <input
            type="text"
            readOnly
            value={siteUrl}
            className="bg-transparent text-[#A5B2C5] font-mono text-[11px] w-full focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-[#111C2E] hover:bg-[#C5F56A] hover:text-[#070B14] text-[#A5B2C5] transition-colors shrink-0 cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#C5F56A]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md bg-[#111C2E] hover:bg-[#4ADFFF] hover:text-[#070B14] text-[#A5B2C5] transition-colors shrink-0"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Download links */}
        <div className="flex items-center justify-center gap-3 pt-1 text-xs">
          <a
            href="/growthradar-qr.png"
            download="growthradar-qr.png"
            className="flex items-center gap-1.5 text-[11px] text-[#4ADFFF] hover:underline"
          >
            <Download className="w-3 h-3" />
            <span>Download PNG</span>
          </a>
          <span className="text-[#64748B]">•</span>
          <a
            href="/growthradar-qr.svg"
            download="growthradar-qr.svg"
            className="flex items-center gap-1.5 text-[11px] text-[#C5F56A] hover:underline"
          >
            <Download className="w-3 h-3" />
            <span>Download SVG</span>
          </a>
        </div>
      </div>
    </div>
  );
}
