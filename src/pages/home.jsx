import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import heroImage from "../assets/hero-image.png";

import {
  Sparkles,
  Check,
  CheckCircle2,
  ArrowRight,
  Play,
  Code2,
  Braces,
  Users,
  Star,
  ChevronDown,
  Trophy,
  Monitor,
  Rocket,
  Worm,
  Gift,
  Award,
  Gamepad2,
  Calculator,
  Dices,
  BarChart3,
} from "lucide-react";

const HOME_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

/* ---------------------------------- data ---------------------------------- */

const HERO_FEATURES = [
  { icon: Code2, label: "Learn Python from scratch", color: PALETTE[2] },
  { icon: Rocket, label: "Build real projects", color: PALETTE[1] },
  { icon: Award, label: "Certificates & progress tracking", color: PALETTE[3] },
];

const CHILD_TABS = ["Lessons", "Projects", "Quizzes", "Achievements", "Progress"];

const RECENT_PROJECTS = [
  { icon: Calculator, name: "Calculator", meta: "Python Project", color: PALETTE[1] },
  { icon: Dices, name: "Guess the Number", meta: "Python Game", color: PALETTE[4] },
  { icon: Gamepad2, name: "Rock Paper Scissors", meta: "Python Game", color: PALETTE[0] },
];

const COURSES = [
  {
    key: "starter",
    age: "Ages 8–11",
    name: "Python Starter",
    icon: Worm,
    desc: "Perfect for beginners. Learn the basics of Python step by step.",
    features: ["20 Lessons", "5 Projects", "Quizzes & Challenges", "Certificate of Completion"],
    color: PALETTE[2],
    cta: "Start Learning",
  },
  {
    key: "explorer",
    age: "Ages 10–13",
    name: "Python Explorer",
    icon: Rocket,
    desc: "Go deeper and build real projects while learning advanced concepts.",
    features: ["30 Lessons", "10 Projects", "Quizzes & Challenges", "Certificate of Completion"],
    color: PALETTE[4],
    cta: "Start Learning",
  },
  {
    key: "creator",
    age: "Ages 12–16",
    name: "Python Creator",
    icon: Sparkles,
    desc: "Master Python by building apps, games and solving real problems.",
    features: ["40+ Lessons", "15+ Projects", "Quizzes & Challenges", "Certificate of Completion"],
    color: PALETTE[3],
    cta: "Start Learning",
  },
];

const PARENT_POINTS = [
  "Weekly progress reports",
  "See completed lessons & projects",
  "Track learning time & streaks",
  "Safe, ad-free and kid-friendly",
  "24/7 AI help for kids",
  "Build confidence and problem solving skills",
];

const RECENT_ACTIVITY = [
  { label: "Lesson Completed", meta: "Loops in Python", when: "Today" },
  { label: "Project Submitted", meta: "Calculator Project", when: "Yesterday" },
  { label: "Quiz Completed", meta: "Python Basics Quiz", when: "2 days ago" },
  { label: "New Badge Earned", meta: "Problem Solver", when: "2 days ago" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Choose a Course", desc: "Pick the right course for your child's age and level.", icon: Monitor },
  { step: 2, title: "Learn & Build", desc: "Interactive lessons, quizzes and real projects.", icon: Code2 },
  { step: 3, title: "Track & Celebrate", desc: "Track progress and celebrate every achievement.", icon: Trophy },
];

const STATS = [
  { icon: Star, value: "4.9/5", label: "Parent Rating", color: PALETTE[3] },
  { icon: Users, value: "2,000+", label: "Kids Learning", color: PALETTE[4] },
  { icon: Rocket, value: "500+", label: "Projects Built", color: PALETTE[1] },
  { icon: Trophy, value: "95%", label: "Parent Satisfaction", color: PALETTE[0] },
];

const TESTIMONIALS = [
  {
    quote:
      "My 9-year-old built her first game in just 2 weeks! The platform is amazing and easy to follow.",
    name: "Priya M.",
    meta: "Parent of Aarav (9)",
  },
  {
    quote: "The progress reports help me stay updated. My son loves coding now!",
    name: "Rahul S.",
    meta: "Parent of Vihaan (11)",
  },
  {
    quote: "Finally a platform that makes coding fun and productive for kids.",
    name: "Neha K.",
    meta: "Parent of Anaya (10)",
  },
];

const PRICING_FEATURES = [
  "All Python Courses",
  "Unlimited Projects",
  "Parent Dashboard & Reports",
  "Certificates",
  "AI Coding Assistant",
  "Cancel Anytime",
];

const FAQS = [
  { q: "What age group is this program for?", a: "CodeVista is designed for kids aged 8 to 14, with courses matched to each age group's pace and skill level." },
  { q: "Does my child need prior coding experience?", a: "Not at all. Python Starter begins from the very basics — no experience needed." },
  { q: "How much time should my child spend each week?", a: "Most kids progress well with 2–4 hours a week, but lessons are self-paced and flexible." },
  { q: "Do I need to sit with my child during lessons?", a: "No, lessons are designed for kids to follow independently, with 24/7 AI help on hand." },
  { q: "What happens after the free trial?", a: "You can choose a plan to continue, or cancel anytime with no charge." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your parent dashboard." },
  { q: "Will my child get a certificate?", a: "Yes! Every completed course comes with a certificate of completion to celebrate their progress." },
];

/* ------------------------------- sub components ------------------------------ */

function SectionTag({ children, color }) {
  return (
    <span
      className="inline-block rounded-full px-4 py-1 text-xs font-extrabold tracking-wide"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {children}
    </span>
  );
}

function TestimonialCard({ quote, name, meta }) {
  return (
    <div className="rounded-2xl border-2 border-[#F0EAFF] bg-white p-6 shadow-sm">
      <div className="flex gap-0.5 text-[#E8A400]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="#E8A400" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-600 leading-relaxed">"{quote}"</p>
      <div className="mt-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white"
          style={{ background: HOME_GRADIENT }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-extrabold text-[#241B4E]">{name}</p>
          <p className="text-[11px] font-semibold text-slate-400">{meta}</p>
        </div>
      </div>
    </div>
  );
}

function FaqRow({ q, a, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border-2 border-[#F0EAFF] bg-white px-5 py-4 text-left transition-colors hover:border-[#DFCBFF]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-[#241B4E]">{q}</span>
        <ChevronDown
          size={18}
          className="shrink-0 text-[#8B5CF6] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open && <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">{a}</p>}
    </button>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="font-body min-h-screen bg-white">
      <FontLoader />
      <PublicHeader active="home" />

                      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* background image */}
        <img
  src={heroImage}
  alt="Kid coding a Python game on CodeVista"
  className="absolute inset-0 h-full w-full object-contain object-right select-none"
  draggable={false}
/>

        {/* scrim so the text stays readable over the photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.05) 75%)",
          }}
        />

        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: HOME_GRADIENT }}
        />

        {/* content */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-8">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold"
              style={{ backgroundColor: PALETTE[4].bg, color: PALETTE[4].text }}
            >
              <Sparkles size={13} /> AI Python Learning Platform for Kids (Ages 8–14)
            </span>

            <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1.1] text-[#241B4E] md:text-5xl">
              Kids Aren't Just Learning Python.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: HOME_GRADIENT }}
              >
                They're Building Their Future.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-slate-500">
              Interactive lessons, real projects and AI support that make coding
              fun, easy and rewarding.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {HERO_FEATURES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    <Icon size={13} />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-md transition-transform hover:scale-105"
                style={{ background: HOME_GRADIENT }}
              >
                Start 7-Day Free Trial <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/why-us")}
                className="flex items-center gap-1.5 rounded-full border-2 border-[#EEE7FF] bg-white/70 px-6 py-3 text-sm font-extrabold text-[#8B5CF6] backdrop-blur-sm hover:bg-white"
              >
                See How It Works <ChevronDown size={15} className="-rotate-90" />
              </button>
            </div>
            <p className="mt-3 text-[11px] font-bold text-slate-400">
              No credit card required · Cancel anytime
            </p>
          </div>
        </div>

        {/* floating stat card, anchored to the section's bottom-right */}
        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-lg sm:flex">
          <div className="flex -space-x-2">
            {PALETTE.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="h-6 w-6 rounded-full border-2 border-white"
                style={{ backgroundColor: c.solid }}
              />
            ))}
          </div>
          <span className="text-[11px] font-extrabold text-[#241B4E]">
            2,000+ Kids Are Already Building!
          </span>
        </div>
      </section>
      
            {/* ---------------- WHAT YOUR CHILD SEES ---------------- */}
      <section className="bg-[#FBFAFE] px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-[#241B4E] md:text-3xl">
            This is exactly what{" "}
            <span style={{ color: "#8B5CF6" }}>your child sees</span>.
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            A safe, fun and interactive learning experience made for kids.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CHILD_TABS.map((tab, i) => (
              <span
                key={tab}
                className="rounded-full px-4 py-1.5 text-xs font-bold"
                style={{
                  backgroundColor: i === 0 ? PALETTE[4].text : PALETTE[4].bg,
                  color: i === 0 ? "white" : PALETTE[4].text,
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* dashboard mockup */}
          <div className="mt-8 rounded-2xl border-2 border-[#F0EAFF] bg-white p-5 text-left shadow-xl md:p-6">
            <div className="flex items-center justify-between border-b border-[#F0EAFF] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                  style={{ background: HOME_GRADIENT }}
                >
                  <Sparkles size={17} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#241B4E]">Welcome back! 👋</p>
                  <p className="text-xs font-semibold text-slate-400">
                    Let's continue your learning journey.
                  </p>
                </div>
              </div>
              <span className="hidden rounded-full bg-[#F5EEFF] px-3 py-1 text-[11px] font-extrabold text-[#8B5CF6] sm:block">
                Level 4 · Junior Coder
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <p className="text-xs font-extrabold text-[#241B4E]">Continue Learning</p>
                <div className="mt-2 rounded-xl bg-[#FBFAFE] p-3">
                  <p className="text-xs font-bold text-slate-600">Python Basics</p>
                  <p className="text-[11px] font-semibold text-slate-400">Lesson 12: Loops in Python</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEE7FF]">
                    <div className="h-full w-[71%] rounded-full" style={{ background: HOME_GRADIENT }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>71%</span>
                    <span className="text-[#8B5CF6]">Continue →</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#241B4E]">My Progress</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { label: "Lessons Completed", value: "32", color: PALETTE[2] },
                    { label: "Projects Built", value: "8", color: PALETTE[4] },
                    { label: "Day Streak", value: "12", color: PALETTE[3] },
                    { label: "Certificates", value: "3", color: PALETTE[1] },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-2.5" style={{ backgroundColor: s.color.bg }}>
                      <p className="text-sm font-extrabold" style={{ color: s.color.text }}>{s.value}</p>
                      <p className="text-[10px] font-bold text-slate-500 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#241B4E]">Recent Projects</p>
                <div className="mt-2 space-y-2">
                  {RECENT_PROJECTS.map(({ icon: Icon, name, meta, color }) => (
                    <div key={name} className="flex items-center gap-2 rounded-xl bg-[#FBFAFE] p-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        <Icon size={15} />
                      </span>
                      <div>
                        <p className="text-[11px] font-extrabold text-[#241B4E]">{name}</p>
                        <p className="text-[10px] font-semibold text-slate-400">{meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/why-us")}
            className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-md transition-transform hover:scale-105"
            style={{ background: HOME_GRADIENT }}
          >
            <Play size={15} fill="white" /> Watch 60-Second Demo
          </button>
        </div>
      </section>

            {/* ---------------- EXPLORE COURSES ---------------- */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-[#241B4E] md:text-3xl">
            Explore Our Courses
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Designed by experts. Loved by kids.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {COURSES.map(({ key, age, name, icon: Icon, desc, features, color, cta }) => (
              <div
                key={key}
                className="flex flex-col rounded-2xl border-2 p-6 text-left shadow-sm transition-transform hover:-translate-y-1"
                style={{ borderColor: color.border }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    <Icon size={22} />
                  </span>
                  <div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {age}
                    </span>
                    <p className="font-display mt-0.5 text-lg font-extrabold text-[#241B4E]">{name}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">{desc}</p>

                <ul className="mt-4 space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Check size={14} style={{ color: color.text }} /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/courses")}
                  className="mt-5 rounded-full py-2.5 text-sm font-extrabold text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: color.solid }}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8B5CF6] hover:underline"
          >
            View All Courses <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ---------------- FOR PARENTS ---------------- */}
      <section className="bg-[#FBFAFE] px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTag color={PALETTE[4]}>FOR PARENTS</SectionTag>
            <h2 className="font-display mt-3 text-2xl font-extrabold leading-tight text-[#241B4E] md:text-3xl">
              Learning You Can Trust.
              <br />
              Progress You Can See.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
              We make it easy for parents to stay involved in their child's
              learning journey.
            </p>
            <ul className="mt-5 space-y-2.5">
              {PARENT_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
                  <CheckCircle2 size={17} className="shrink-0 text-[#1FB671]" /> {p}
                </li>
              ))}
            </ul>
          </div>

          {/* parent dashboard mockup */}
          <div className="rounded-2xl border-2 border-[#F0EAFF] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0EAFF] pb-3">
              <p className="text-xs font-extrabold text-[#241B4E]">Parent Dashboard</p>
              <span className="text-[11px] font-semibold text-slate-400">Aarav (Age 10)</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Lessons Completed", value: "32/60" },
                { label: "Projects Built", value: "8/20" },
                { label: "Current Streak", value: "12 Days" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[#FBFAFE] p-2.5 text-center">
                  <p className="text-sm font-extrabold text-[#8B5CF6]">{s.value}</p>
                  <p className="text-[9px] font-bold leading-tight text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#241B4E]">
                <BarChart3 size={13} /> Learning Activity (This Week)
              </p>
              <svg viewBox="0 0 220 60" className="mt-2 w-full">
                <polyline
                  points="0,45 30,35 60,40 90,20 120,28 150,10 180,18 220,5"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-extrabold text-[#241B4E]">Recent Activity</p>
              <div className="mt-2 space-y-2">
                {RECENT_ACTIVITY.map((a) => (
                  <div key={a.label} className="flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-slate-600">{a.label}</p>
                      <p className="font-semibold text-slate-400">{a.meta}</p>
                    </div>
                    <span className="font-semibold text-slate-300">{a.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-[#241B4E] md:text-3xl">How It Works</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Just 3 simple steps to build a coding journey.
          </p>

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-center">
            {/* steps row */}
            <div className="flex flex-1 flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
                <React.Fragment key={step}>
                  <div className="flex w-40 flex-col items-center text-center">
                    <div className="relative">
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: PALETTE[i * 2].bg, color: PALETTE[i * 2].text }}
                      >
                        <Icon size={26} />
                      </span>
                      <span
                        className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                        style={{ backgroundColor: PALETTE[i * 2].solid }}
                      >
                        {step}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-extrabold text-[#241B4E]">{title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{desc}</p>
                  </div>

                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="mt-6 hidden shrink-0 text-[#DFCBFF] sm:block" size={22} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* gradient card */}
            <div
              className="rounded-2xl p-6 text-left text-white lg:w-72 lg:shrink-0"
              style={{ background: HOME_GRADIENT }}
            >
              <p className="font-display text-lg font-extrabold leading-snug">
                From Curious
                <br />
                To Confident Coder
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-white/80">
                We're with them every step of the way! 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="bg-[#FBFAFE] px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-center text-2xl font-extrabold text-[#241B4E] md:text-3xl">
            Loved by Kids. Trusted by Parents.
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-slate-500">
            Real results from our amazing community.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="rounded-2xl border-2 border-[#F0EAFF] bg-white p-4 text-center">
                <span
                  className="mx-auto flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  <Icon size={16} />
                </span>
                <p className="mt-2 text-lg font-extrabold text-[#241B4E]">{value}</p>
                <p className="text-[10px] font-bold text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING + FAQ ---------------- */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* pricing card */}
          <div
            className="relative overflow-hidden rounded-2xl p-7 text-white shadow-xl"
            style={{ background: HOME_GRADIENT }}
          >
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold tracking-wide">
              MOST POPULAR
            </span>
            <p className="font-display mt-3 text-xl font-extrabold">
              Start Your Child's Coding Journey Today!
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-4xl font-extrabold">₹1,499</span>
              <span className="pb-1 text-sm font-bold text-white/80">/ month</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-bold text-white/60 line-through">₹1,999</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold">
                25% OFF
              </span>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">
              {PRICING_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs font-bold">
                  <Check size={14} /> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/signup")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-extrabold text-[#8B5CF6] shadow-md transition-transform hover:scale-105"
            >
              Start 7-Day Free Trial <ArrowRight size={16} />
            </button>
            <p className="mt-2 text-center text-[11px] font-bold text-white/70">
              No credit card required · Cancel anytime
            </p>
            <Gift className="pointer-events-none absolute -bottom-4 -right-4 text-white/10" size={110} />
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#241B4E]">
              Quick Answers for Parents
            </h2>
            <div className="mt-4 space-y-2.5">
              {FAQS.map((f, i) => (
                <FaqRow
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="px-6 md:px-8 pb-16 md:pb-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-3xl px-8 py-14 text-center text-white"
          style={{ background: HOME_GRADIENT }}
        >
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">
            Their First Python Project Is One Click Away.
          </h2>
          <p className="max-w-lg text-sm font-semibold text-white/80">
            Join thousands of kids who are learning, building and having fun!
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-2 flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#8B5CF6] shadow-md transition-transform hover:scale-105"
          >
            Start Free Trial Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}