import React from "react";
import { Clock } from "lucide-react";

export default function SpecialOfferBar() {
   return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-pk-border shrink-0"
      style={{ backgroundColor: "#F5EEFF" }}
    >
      <div className="flex items-center gap-2">
        <span>🔥</span>
        <span className="text-xs font-bold" style={{ color: "#8B5CF6" }}>SPECIAL OFFER</span>
        <span className="text-lg font-extrabold text-pk-text-dark">₹1,499</span>
        <div className="text-xs text-slate-500 leading-tight">
          <p className="font-semibold">Annual Access</p>
          <p>One payment, a full year of access</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <Clock size={13} /> 01:00:00 left
        </span>
        <button
          className="rounded-lg px-4 py-2 text-xs font-bold text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #1AACDB)" }}
        >
          Unlock Now - Pay Only ₹1,499
        </button>
      </div>
    </div>
  );
}