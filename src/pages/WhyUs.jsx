import React from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import {
  Sparkles,
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
  Award,
  Landmark,
  BookMarked,
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
    desc: "Research proves it: kids learn better from peers. Peer learning boosts memory, focus, and confidence. That's exactly how PythonKid is built.",
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

const BADGES = [
  { icon: Award, label: "Young Innovators", colorIndex: 0 },
  { icon: Landmark, label: "Oxford Summer Scholars", colorIndex: 1 },
  { icon: BookMarked, label: "Published Authors", colorIndex: 2 },
];

export default function WhyUs() {
  const navigate = useNavigate();

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="why-us" />

      {/* ---------------- Hero ---------------- */}
      <section
        className="px-8 py-12 text-center"
        style={{ background: "linear-gradient(135deg, #FFF1EC 0%, #F5EEFF 50%, #EAF8FE 100%)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#FF5A36] shadow-sm">
          <Sparkles size={12} /> Made by Kids, for Kids
        </span>
        <h1 className="font-display mt-4 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
          Why Learn with{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
          >
            PythonKid?
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          The first platform where real kids teach other kids to code in Python — short videos,
          cool projects, and friendly voices that make Python feel like play.
        </p>
      </section>

      {/* ---------------- Reasons grid ---------------- */}
      <section className="bg-[#FDFCFA] px-8 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map(({ icon: Icon, title, desc }, i) => {
            const c = PALETTE[i % PALETTE.length];
            return (
              <div key={title} className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: c.border }}>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  <Icon size={16} />
                </span>
                <p className="font-display mt-3 text-sm font-bold text-[#241B4E]">{title}</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* Weekly Code Together */}
        <div
          className="mx-auto mt-8 max-w-4xl rounded-3xl px-8 py-8 text-center"
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

        {/* Founders */}
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#EC4899] shadow-sm">
            <Heart size={11} /> Our Story
          </span>
          <h2 className="font-display mt-3 text-2xl font-extrabold text-[#241B4E]">
            Meet the Kids Behind PythonKid
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs text-slate-500">
            PythonKid wasn't built in a boardroom — it was built by two 11-year-olds who wanted
            coding to be fun.
          </p>

          <div
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl p-6 text-left items-center"
            style={{ background: "linear-gradient(135deg, #F5EEFF 0%, #FFEEF6 100%)", border: "2px solid #DFCBFF" }}
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=450&fit=crop"
              alt="Sahaj and Sujas, the twin founders of PythonKid"
              className="h-56 w-full rounded-2xl object-cover md:h-64"
            />

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#EC4899]">
                <Heart size={11} /> THE FOUNDERS
              </span>
              <h3 className="font-display mt-2 text-lg font-extrabold text-[#241B4E]">Sahaj &amp; Sujas</h3>
              <p className="text-xs text-slate-400">Twin Brothers · Aged 11 · Bangalore, India</p>

              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Hey! We're Sahaj and Sujas — twin brothers who don't look alike, dress alike, or
                eat alike... but we do share one big thing: <b className="text-[#241B4E]">we love coding!</b>
              </p>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                We started learning Python in grade 4. When we looked for courses, everything was
                too advanced or too boring — and required a parent to sign in. So we thought,
                "What if kids had friends teaching them instead?" — and PythonKid was born!
              </p>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                We've published books on Bribooks, won Olympiad medals, and were selected as{" "}
                <b className="text-[#241B4E]">Oxford Summer School Scholars</b> — among only
                two chosen from all of India for 2026!
              </p>
              <p className="mt-2 text-xs font-bold" style={{ color: "#FF5A36" }}>
                Happy coding! — Sahaj &amp; Sujas 🧑‍💻 🧑‍💻
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {BADGES.map(({ icon: Icon, label, colorIndex }) => {
                  const c = PALETTE[colorIndex];
                  return (
                    <span
                      key={label}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{ backgroundColor: c.bg, color: c.text }}
                    >
                      <Icon size={11} /> {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
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