import React from "react";
import { useNavigate } from "react-router-dom";
import { FontLoader, PALETTE, BRAND } from "../theme/playfulPalette";

const NAV = [
  { key: "home", label: "Home", path: "/" },
  { key: "courses", label: "Courses", path: "/courses" },
  { key: "why-us", label: "Why Us", path: "/why-us" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "faq", label: "FAQ", path: "/faq" },
];

/**
 * Shared header for public/marketing pages (Home, Courses, Why Us, Contact, FAQ).
 * Pass `active` (matching a NAV key) to highlight the current section.
 */
export default function PublicHeader({ active }) {
  const navigate = useNavigate();

  return (
    <header className="font-body sticky top-0 z-20 flex items-center justify-between border-b-2 border-[#FFE4D6] bg-white/90 px-8 py-3 backdrop-blur">
      <FontLoader />

      <div className="flex items-center gap-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
          >
            {"</>"}
          </span>
          <span className="font-display text-lg font-extrabold text-[#241B4E]">
            CodeVista
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-500">
          {NAV.map(({ key, label, path }, i) => {
            const isActive = active === key;
            const color = PALETTE[i % PALETTE.length];

            return (
              <button
                key={key}
                onClick={() => navigate(path)}
                className="relative pb-1 transition-colors"
                style={isActive ? { color: color.text } : undefined}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-[2px] left-0 h-[3px] w-full rounded-full"
                    style={{ background: color.solid }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/login")}
          className="rounded-full border-2 border-[#EEE7FF] px-4 py-2 text-xs font-bold text-[#8B5CF6] hover:bg-[#F5EEFF]"
        >
          Log in
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
        >
          Get Started
        </button>
      </div>
    </header>
  );
}