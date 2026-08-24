import React, { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What age group is CodeVista designed for?",
    a: "CodeVista is built for kids aged 6–14. Our lessons are taught by kids, for kids, so the pacing and language stay age-appropriate throughout.",
  },
  {
    q: "Does my child need any coding experience to start?",
    a: "No experience needed! Python Starters begins from the very basics — what Python is, how to write your first line of code, and builds up from there.",
  },
  {
    q: "What devices does CodeVista work on?",
    a: "CodeVista runs entirely in the browser — no downloads or installs. It works on any laptop, Chromebook, or tablet with an internet connection.",
  },
  {
    q: "Is there a parent sign-in required?",
    a: "Nope — that's actually why CodeVista was built! Kids can sign up and start learning without needing a parent to log in every time.",
  },
  {
    q: "What do we get with the ₹1,499 annual plan?",
    a: "One payment covers a full year of access to all current and future courses, downloadable certificates, and the weekly Code Together community sessions.",
  },
  {
    q: "Can I cancel or get a refund?",
    a: "There's no auto-renewal — access simply ends after a year unless you renew. Reach out via the Contact page if you have questions about a refund.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="faq" />

      <section
        className="px-8 py-12 text-center"
        style={{ background: "linear-gradient(135deg, #FFF8E1 0%, #FFF1EC 100%)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#E8A400] shadow-sm">
          <HelpCircle size={12} /> Got Questions?
        </span>
        <h1 className="font-display mt-4 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
          Frequently Asked <span style={{ color: "#FF5A36" }}>Questions</span>
        </h1>
               <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Everything you need to know before your child starts their coding journey.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3">
          <img
            src="https://images.unsplash.com/photo-1623076189461-f7706b741c04?auto=format&fit=crop&w=400&h=400&q=80"
            alt="A kid asking questions while coding"
            className="h-24 w-full rounded-2xl object-cover shadow-sm sm:h-36"
          />
          <img
  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=500&q=85"
  alt="Child learning coding on a laptop"
  className="h-24 w-full rounded-2xl object-cover shadow-sm sm:h-36"
/>

<img
  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&h=500&q=85"
  alt="Children working together on a coding project"
  className="h-24 w-full rounded-2xl object-cover shadow-sm sm:h-36"
/>
        </div>
      </section>

      <section className="px-8 py-12">
        <div className="mx-auto max-w-2xl space-y-3">
          {FAQS.map((item, i) => {
            const c = PALETTE[i % PALETTE.length];
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl border-2 overflow-hidden"
                style={{ borderColor: isOpen ? c.border : "#F0EAFF" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-bold text-[#241B4E]">{item.q}</span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform"
                    style={{
                      backgroundColor: c.bg,
                      color: c.text,
                      transform: isOpen ? "rotate(180deg)" : "none",
                    }}
                  >
                    <ChevronDown size={13} />
                  </span>
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}