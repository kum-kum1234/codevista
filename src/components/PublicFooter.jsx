import React from "react";
import { Link } from "react-router-dom";
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

const LEARN_LINKS = [
  { label: "Python Starters", to: "/courses/python-starters" },
  { label: "Python Explorer", to: "/courses/python-explorer" },
  { label: "Python Creator", to: "/courses/python-creator" },
  { label: "See All Courses", to: "/courses" },
];

const SUPPORT_LINKS = [
  { label: "Community", to: "/community" },
  { label: "Python Help Guide", to: "/python-help-guide" },
  { label: "FAQs", to: "/faq" },
  { label: "Contact Us", to: "/contact" },
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
            <span className="font-display font-extrabold text-[#241B4E]">CodeVista</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 max-w-[200px]">
            Bite-sized Python lessons, taught by kids, for kids aged 8–14.
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
            LEARN
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            {LEARN_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-[#8B5CF6] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-extrabold tracking-wide" style={{ color: PALETTE[1].text }}>
            SUPPORT
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            {SUPPORT_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-[#8B5CF6] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-extrabold tracking-wide" style={{ color: PALETTE[4].text }}>
            COMPANY
          </p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
            <li>
              <Link to="/why-us" className="hover:text-[#8B5CF6] transition-colors">
                Why CodeVista
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#8B5CF6] transition-colors">
                Contact
              </Link>
            </li>
            <li className="text-slate-400">Terms of Service</li>
            <li className="text-slate-400">Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-[#F0EAFF] pt-4 text-[10px] text-slate-400">
        © {new Date().getFullYear()} CodeVista. All rights reserved.
      </div>
    </footer>
  );
}