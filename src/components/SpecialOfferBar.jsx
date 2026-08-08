import React from "react";
import { Clock } from "lucide-react";

export default function SpecialOfferBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-orange-50 px-6 py-3 border-b border-pk-border shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-pk-orange-end">🔥</span>
        <span className="text-xs font-bold text-pk-orange-end">SPECIAL OFFER</span>
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
        <button className="rounded-lg bg-pk-orange-end px-4 py-2 text-xs font-bold text-white hover:opacity-90">
          Unlock Now - Pay Only ₹1,499
        </button>
      </div>
    </div>
  );
}