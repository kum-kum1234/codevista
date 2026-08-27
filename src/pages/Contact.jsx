import React, { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Mail, MapPin, Clock, Check, ChevronRight } from "lucide-react";

// Deliberately NOT using the shared playfulPalette (orange/coral + Baloo2)
// here — that palette mirrors PythonKid's brand color (#ff4d00) and font
// pairing almost exactly. This page uses its own identity: deep teal/ink
// instead of orange, and Space Grotesk + IBM Plex Mono instead of
// Baloo 2 + Nunito, so Contact doesn't read as a PythonKid clone.
function ContactFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;600;700&display=swap');
      .cv-display { font-family: 'Space Grotesk', sans-serif; }
      .cv-body { font-family: 'Inter', sans-serif; }
      .cv-mono { font-family: 'IBM Plex Mono', monospace; }
    `}</style>
  );
}

const INK = "#0B1220";
const TEAL = "#0F766E";
const TEAL_SOFT = "#E6F5F3";
const AMBER = "#D97706";

const CHANNELS = [
  { icon: Mail, label: "hello@codevista.io" },
  { icon: MapPin, label: "Bangalore, India" },
  { icon: Clock, label: "Replies within a day, Mon–Sat" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="cv-body w-full bg-white text-sm" style={{ color: INK }}>
      <ContactFonts />
      <PublicHeader active="contact" />

      <section className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr]">
        {/* Left: intro panel — teal/ink, not orange/purple */}
        <div
          className="relative overflow-hidden px-8 py-14 md:py-20 md:sticky md:top-[57px] md:h-[calc(100vh-57px)] flex flex-col"
          style={{ background: `linear-gradient(160deg, ${INK} 0%, #123B36 55%, ${TEAL} 100%)` }}
        >
          <span className="pointer-events-none absolute -right-10 -top-10 select-none cv-mono text-[200px] font-semibold leading-none opacity-[0.06] text-white">
            {"{ }"}
          </span>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/20 cv-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" /> status: online
            </span>
            <h1 className="cv-display mt-5 text-3xl md:text-[2.5rem] font-semibold leading-tight text-white">
              Say hi.
              <br />
              We're listening.
            </h1>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Course question, a bug you found, or just want to talk Python with a fellow builder — drop it below.
            </p>
          </div>

          <div className="relative mt-10 space-y-3">
            {CHANNELS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex max-w-[260px] items-center gap-2.5 rounded-xl rounded-bl-sm bg-white/95 px-3.5 py-2.5 shadow-lg"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: TEAL_SOFT, color: TEAL }}
                >
                  <Icon size={14} />
                </span>
                <span className="text-xs font-semibold" style={{ color: INK }}>{label}</span>
              </div>
            ))}
          </div>

          <p className="relative mt-auto pt-10 text-[11px] text-white/40">
            No bots, no ticket numbers — a real human on the CodeVista team reads every message.
          </p>
        </div>

        {/* Right: form styled as a code editor window */}
        <div className="flex items-center justify-center bg-[#F7F9F9] px-6 py-14 md:py-20">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 shadow-xl">
            <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ backgroundColor: INK }}>
              <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
              <span className="ml-2 cv-mono text-[11px] text-white/50">new_message.py</span>
            </div>

            <div className="bg-white p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <span
                    className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: TEAL_SOFT, color: TEAL }}
                  >
                    <Check size={20} />
                  </span>
                  <p className="cv-mono mt-4 text-xs" style={{ color: TEAL }}>$ message.send() → 200 OK</p>
                  <p className="cv-display mt-2 text-lg font-semibold" style={{ color: INK }}>
                    Sent! Thanks {form.name.split(" ")[0] || "there"}.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">We'll get back to you within a day or two.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="cv-mono text-[11px] font-semibold" style={{ color: TEAL }}>name =</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-slate-100 bg-[#F7F9F9] px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                      placeholder='"Arjun Sharma"'
                    />
                  </div>
                  <div>
                    <label className="cv-mono text-[11px] font-semibold" style={{ color: TEAL }}>email =</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-slate-100 bg-[#F7F9F9] px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                      placeholder='"you@example.com"'
                    />
                  </div>
                  <div>
                    <label className="cv-mono text-[11px] font-semibold" style={{ color: TEAL }}>message = """</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-slate-100 bg-[#F7F9F9] px-3 py-2 text-sm outline-none focus:border-[#0F766E] resize-none"
                      placeholder="How can we help?"
                    />
                    <span className="cv-mono text-[11px] font-semibold" style={{ color: TEAL }}>"""</span>
                  </div>
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 cv-mono text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: INK }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = INK)}
                  >
                    run send_message()
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}