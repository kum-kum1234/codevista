import React from "react";
import { PALETTE } from "../theme/playfulPalette";

// lucide-react removed all brand/logo icons (Facebook, Twitter, Instagram,
// Youtube, etc.) in recent versions, so social links use simple monogram
// chips instead — no external icon dependency, and it won't break again on
// a future lucide-react upgrade.
const SOCIALS = [
  { label: "YouTube", initial: "Y", color: PALETTE[0].text },
  { label: "Facebook", initial: "f", color: PALETTE[1].text },
  { label: "X", initial: "X", color: PALETTE[4].text },
  { label: "Instagram", initial: "I", color: PALETTE[5].text },
];

export default function PublicFooter() {
  return (
    <footer className="font-body relative border-t border-[#F0EAFF] bg-[#FDFBFF] px-8 py-10">
      {/* signature rainbow rail */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${PALETTE.map((c) => c.solid).join(", ")})`,
        }}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
            >
              {"</>"}
            </span>
            <span className="font-display font-extrabold text-[#241B4E]">PythonKid</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 max-w-[200px]">
            Making Python programming fun and accessible for kids aged 6-14.
          </p>
          <div className="mt-3 flex gap-2.5">
            {SOCIALS.map(({ label, initial, color }, i) => (
              <span
                key={i}
                aria-label={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                {initial}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold tracking-wide" style={{ color: PALETTE[0].text }}>
            COURSES
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            <li>Python Starters</li>
            <li>Python Explorer</li>
            <li>Python Creator</li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-extrabold tracking-wide" style={{ color: PALETTE[1].text }}>
            RESOURCES
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            <li>Community</li>
            <li>Python Help Guide</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-extrabold tracking-wide" style={{ color: PALETTE[4].text }}>
            COMPANY
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            <li>Our Story</li>
            <li>Newsroom</li>
            <li>Contact</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-[#F0EAFF] pt-4 text-[10px] text-slate-400">
        © {new Date().getFullYear()} Gokulam Technologies. All rights reserved.
      </div>
    </footer>
  );
}