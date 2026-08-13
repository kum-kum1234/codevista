import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

export default function TopBanner() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-orange-50 px-4 py-2 text-xs text-pk-orange-end relative shrink-0">
      <Sparkles size={13} />
      <span>
        Your browser is now Python ready! Code Lab &amp; Playground are instant &nbsp;·&nbsp; Write &amp;
        run in-browser Python now — zero installation, runs right here, right in the browser!
      </span>
      <button
        onClick={() => setShow(false)}
        className="absolute right-4 text-slate-400 hover:text-slate-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}