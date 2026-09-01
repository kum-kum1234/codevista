import React from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import {
  Users2,
  CircleDot,
  Zap,
  CircleCheck,
  Trophy,
  Heart,
  Hash,
  Gamepad2,
  MessageCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const REASONS = [
  {
    icon: Users2,
    title: "Kids Teaching Kids",
    desc: "When a kid explains Python in their own voice — with real examples and even mistakes — it just clicks. No boring adult scripts, no confusing jargon.",
  },
  {
    icon: CircleDot,
    title: "Peer Learning Works",
    desc: "Research proves it: kids learn better from peers. Peer learning boosts memory, focus, and confidence. That's exactly how CodeVista is built.",
  },
  {
    icon: Zap,
    title: "Learn in Your Own Time",
    desc: "No fixed schedules. No pressure. Start any lesson, pause anytime, replay as many times as you need — all at your child's own pace.",
  },
  {
    icon: CircleCheck,
    title: "Projects, Not Boring Exercises",
    desc: "Every course ends with real Python projects — games, art, and interactive programs kids can show off to friends and family.",
  },
  {
    icon: Trophy,
    title: "Earn a Certificate",
    desc: "After completing a course, every child gets a downloadable certificate of achievement — LinkedIn-ready, printable, and shareable.",
  },
  {
    icon: Heart,
    title: "Super Affordable",
    desc: "Full annual access costs less than a pizza. One payment, no hidden charges, no auto-renewals — learning for a full year.",
  },
];

export default function WhyUs() {
  const navigate = useNavigate();

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="why-us" />

      {/* ---------------- Hero: left-aligned editorial layout, not the centered pastel-badge template ---------------- */}
      <section className="px-8 pt-16 pb-14 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 items-end">
          <div>
            <p className="text-xs font-extrabold tracking-wide" style={{ color: "#FF5A36" }}>
              WHY CODEVISTA
            </p>
            <h1 className="font-display mt-3 text-3xl md:text-5xl font-extrabold leading-[1.1] text-[#241B4E]">
              Coding taught by kids,
              <br />
              not{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
              >
                lectured at them.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-500">
              Most platforms hand a child an adult curriculum with a cartoon
              mascot stuck on top. We built ours around one idea: kids explain
              things to kids better than anyone else can.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 text-white"
            style={{ backgroundColor: "#241B4E" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
              In their own words
            </p>
            <p className="mt-2 text-sm italic leading-relaxed">
              "It's the first thing I open after school — not because I have
              to, because I want to see what breaks next."
            </p>
            <p className="mt-3 text-xs font-semibold text-white/60">
              — Vihaan M., age 10
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Reasons: alternating list, not a card grid ---------------- */}
      <section className="bg-[#FDFCFA] px-8 py-16">
        <div className="mx-auto max-w-3xl">
          {REASONS.map(({ icon: Icon, title, desc }, i) => {
            const c = PALETTE[i % PALETTE.length];
            const flip = i % 2 === 1;
            return (
              <div
                key={title}
                className={`flex items-start gap-5 py-6 ${
                  i !== 0 ? "border-t border-slate-100" : ""
                } ${flip ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-display text-base font-extrabold text-[#241B4E]">
                    {String(i + 1).padStart(2, "0")}. {title}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Code Together */}
        <div
          className="mx-auto mt-12 max-w-3xl rounded-3xl px-8 py-8 text-center"
          style={{ background: "linear-gradient(135deg, #FFF1EC 0%, #FFF8E1 100%)", border: "2px solid #FFD3C2" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-[#FF5A36] shadow-sm">
            <Hash size={11} /> BONUS COMMUNITY
          </span>
          <h2 className="font-display mt-3 text-xl font-extrabold text-[#241B4E]">
            Weekly Code Together Sessions
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs text-slate-500">
            Every Saturday, join a live Zoom session where kids share projects, help each other
            debug, and learn new tricks together. It's like a friendly coding club!
          </p>

          <ul className="mt-4 space-y-1.5 text-xs font-semibold text-[#241B4E]">
            <li className="flex items-center justify-center gap-2">
              <CircleCheck size={13} style={{ color: PALETTE[0].text }} />
              Share cool projects you've built
              <Gamepad2 size={13} style={{ color: PALETTE[4].text }} />
            </li>
            <li className="flex items-center justify-center gap-2">
              <CircleCheck size={13} style={{ color: PALETTE[0].text }} />
              Get help from other kids &amp; the team
              <MessageCircle size={13} style={{ color: PALETTE[5].text }} />
            </li>
            <li className="flex items-center justify-center gap-2">
              <CircleCheck size={13} style={{ color: PALETTE[0].text }} />
              Learn fun new Python tricks together
              <Lightbulb size={13} style={{ color: PALETTE[3].text }} />
            </li>
          </ul>

          <button
            onClick={() => navigate("/code-together")}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
          >
            Join Code Together <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-8 py-14 text-center" style={{ backgroundColor: "#241B4E" }}>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
          Ready to start your child's coding journey?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Join thousands of kids learning Python the fun way — from other kids!
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
          >
            Explore Courses <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="rounded-full border-2 border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            Read FAQs
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}