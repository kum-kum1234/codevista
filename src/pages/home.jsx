import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

import { FontLoader, PALETTE } from "../theme/playfulPalette";
import AnimatedBackground from "../components/AnimatedBackground";

import {
  Rocket,
  Zap,
  Monitor,
  Target,
  Play,
  ArrowRight,
  Check,
  BookOpen,
  Code2,
  Wand2,
  Crown,
  PlayCircle,
  Lock,
  FolderKanban,
  Clock,
  Gift,
  Calendar,
  Table2,
  NotebookPen,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronDown,
  Award,
  Users2,
  Smile,
  Laptop2,
  Eye,
  Laptop,
  FileText,
  GraduationCap,
  Lightbulb,
  Smartphone,
} from "lucide-react";

// Home page uses its own accent gradient
const HOME_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const COURSES = [
  {
    icon: Rocket,
    level: "Beginner",
    title: "Python Starters",
    desc: "The absolute first steps — variables, printing, and basic commands, explained the way an 11-year-old would explain it to a friend.",
    lessons: 10,
    projects: 2,
    hours: 6,
    items: [
      { title: "Your First Line of Code", free: true },
      { title: "Talking to the Screen with print()", free: false },
      { title: "Boxes That Hold Stuff: Variables", free: false },
    ],
    more: 7,
    colorIndex: 4,
  },
  {
    icon: Code2,
    level: "Intermediate",
    title: "Python Explorer",
    desc: "Once the basics click, this is where kids start making decisions in code — lists, conditions, and real logic.",
    lessons: 9,
    projects: 2,
    hours: 7,
    items: [
      { title: "Grouping Things: Lists & Tuples", free: true },
      { title: "Organizing Data: Sets & Dictionaries", free: false },
      { title: "Making Choices: If, Elif, Else", free: false },
    ],
    more: 6,
    colorIndex: 2,
  },
  {
    icon: Wand2,
    level: "Advanced",
    title: "Python Creator",
    desc: "Turtle Graphics turns code into art. This is the course kids beg to keep doing — spirals, shapes, and animation.",
    lessons: 7,
    projects: 1,
    hours: 7,
    items: [
      { title: "Meet the Turtle", free: true },
      { title: "Shapes & Loops", free: false },
      { title: "Color, Speed & Style", free: false },
    ],
    more: 4,
    colorIndex: 5,
  },
];

const BONUS_ITEMS = [
  {
    icon: Calendar,
    tag: "Weekly Group Call",
    title: "Weekend Live Class",
    desc: "A live Zoom every weekend where kids show off what they built, get stuck together, and un-stuck together. No extra charge.",
    footer: "Every Saturday · Included free",
    colorIndex: 4,
  },
  {
    icon: Table2,
    tag: "Planning Tool — Free",
    title: "Study Planner",
    desc: "Drag Python into your child's existing weekly routine in under two minutes — no spreadsheets needed.",
    footer: null,
    colorIndex: 2,
    mockup: "timetable",
  },
  {
    icon: NotebookPen,
    tag: "Journaling Tool — Free",
    title: "My Notebook",
    desc: "A private space where kids jot down what confused them, what clicked, and ideas for their next project.",
    footer: null,
    colorIndex: 5,
    mockup: "notes",
  },
];

const PLAN_FEATURES = [
  "Every course, current and future",
  "Guided projects, not just theory",
  "A built-in playground to experiment freely",
  "A certificate when they finish",
  "The notebook and planner tools",
  "One year, one payment, nothing recurring",
];

const WHY_STATS = [
  { icon: Award, label: "Founded by two 11-year-olds", colorIndex: 4 },
  { icon: Users2, label: "2,000+ kids learning already", colorIndex: 2 },
  { icon: Smile, label: "Built to feel like play", colorIndex: 3 },
  { icon: Laptop2, label: "Runs in any browser, no installs", colorIndex: 1 },
];

const TESTIMONIALS_KIDS = [
  {
    name: "Vihaan M.",
    meta: "Age 10 · Delhi",
    quote:
      "I genuinely didn't think this was something I could do. Now it's the first thing I open after school.",
  },
  {
    name: "Ishaan G.",
    meta: "Age 11 · Pune",
    quote:
      "Finished three courses in a month because the lessons are actually short. I never felt like giving up halfway.",
  },
  {
    name: "Arjun P.",
    meta: "Age 13 · Kolkata",
    quote:
      "Weirdly, coding made maths make more sense to me. Numbers stopped being scary.",
  },
  {
    name: "Dhruv A.",
    meta: "Age 12 · Ahmedabad",
    quote:
      "Used what I learned here for my science fair project. Still can't believe it actually worked.",
  },
  {
    name: "Advait K.",
    meta: "Age 13 · Bangalore",
    quote:
      "The turtle art lessons got me hooked — I made a spinning galaxy pattern and showed literally everyone.",
  },
];

const TESTIMONIALS_PARENTS = [
  {
    name: "Priya S.",
    meta: "Parent · Bengaluru",
    quote:
      "I can actually see her progress without hovering over her shoulder. That alone was worth it.",
  },
  {
    name: "Sunita P.",
    meta: "Parent · Hyderabad",
    quote:
      "She now explains code to me. I don't understand half of it, but I love that she's the teacher now.",
  },
  {
    name: "Neha R.",
    meta: "Parent · Chennai",
    quote:
      "Two weeks in, my son asked when the next lesson was. That has never happened with anything else.",
  },
  {
    name: "Pooja A.",
    meta: "Parent · Kolkata",
    quote:
      "She built a little birthday-card app for me as a surprise. I wasn't ready for how that would feel.",
  },
  {
    name: "Anita T.",
    meta: "Parent · Jaipur",
    quote:
      "My daughter is quiet at school but not here — she's confident about this in a way I hadn't seen before.",
  },
];

const FAQS = [
  {
    q: "How old should my child be to start?",
    a: "Anywhere from 8 to 14. Younger kids tend to start with Python Starters; older or more confident kids can jump straight into Explorer.",
  },
  {
    q: "Do we need to install any software?",
    a: "No. Everything — lessons, the code editor, and projects — runs directly in the browser on a phone, tablet, or laptop.",
  },
  {
    q: "What do we actually get after paying?",
    a: "Immediate access to every course, the practice playground, the notebook and planner tools, and anything new we add during the year.",
  },
  {
    q: "Is there a fixed class schedule?",
    a: "No fixed times. Kids can start, pause, replay, or come back a week later — the weekend live class is the only scheduled part, and it's optional.",
  },
];

function TestimonialCard({ name, meta, quote }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");

  const c = PALETTE[(name.length + meta.length) % PALETTE.length];

  return (
    <div
      className="w-64 shrink-0 rounded-2xl border-2 bg-white p-4"
      style={{ borderColor: c.border }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          {initials}
        </span>

        <div>
          <p className="text-xs font-bold text-[#241B4E]">{name}</p>
          <p className="text-[10px] text-slate-400">{meta}</p>
        </div>
      </div>

      <div className="mt-2 flex gap-0.5" style={{ color: "#E8A400" }}>
        {[0, 1, 2, 3, 4].map((n) => (
          <Star key={n} size={11} fill="#E8A400" strokeWidth={0} />
        ))}
      </div>

      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
        {quote}
      </p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [view, setView] = useState("desktop");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="home" />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden px-8 py-16">
        <AnimatedBackground />

        {/* THIS IS THE IMPORTANT PART */}
        <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE — TEXT */}
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold shadow-sm"
              style={{ color: "#8B5CF6" }}
            >
              <Sparkles size={14} />
              BUILT BY KIDS · TRUSTED BY 2,000+ FAMILIES
            </span>

            <h1 className="font-display mt-6 text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Kids Aren’t Just Learning Python.
              <br />

              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: HOME_GRADIENT }}
              >
                They’re Building It.
              </span>
            </h1>

            <p className="mt-6 text-base text-slate-300 max-w-md">
              CodeVista turns coding into a journey where kids can learn,
              build, and grow together.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: HOME_GRADIENT }}
            >
              Try a Free Lesson <ArrowRight size={16} />
            </button>

            <p className="mt-6 text-xs text-slate-300">
              No installs &nbsp;·&nbsp; No card required &nbsp;·&nbsp; Any device
              &nbsp;·&nbsp; Taught by kids
            </p>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1623076189461-f7706b741c04?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="A kid coding on a laptop"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />

                <img
                  src="https://images.unsplash.com/photo-1597933471507-1ca5765185d8?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="A kid learning Python on a laptop"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />

                <img
                  src="https://images.unsplash.com/photo-1653566031285-8e198bca09d5?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="A kid excited about a coding project"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>

              <p className="text-xs text-slate-400">
                Real kids, real projects — not stock actors.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="min-w-0 w-full flex justify-end">
            {/* Hero Image — right side */}
<div className="overflow-hidden rounded-3xl bg-transparent shadow-xl">
  <img
    src="/imm.png"
    alt="Kids learning coding and building projects together"
    className="w-full h-full object-cover scale-[1.08]"
  />
</div>
          </div>

        </div>
      </section>

      {/* ---------------- Live demo section ---------------- */}
      <section className="bg-[#FDFCFA] py-20 px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white border-2 px-4 py-1.5 text-xs font-bold shadow-sm"
            style={{
              borderColor: PALETTE[2].border,
              color: PALETTE[2].text,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            PEEK INSIDE AN ACTUAL LESSON
          </span>

          <h2 className="font-display mt-5 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
            This is exactly{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: HOME_GRADIENT }}
            >
              what your child sees.
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
            No signup wall, no watered-down preview — this is the real lesson
            screen, video and all.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {[
              { icon: Zap, label: "Zero Setup", i: 3 },
              { icon: Monitor, label: "Phone, Tablet, or Laptop", i: 1 },
              { icon: Target, label: "Ages 8–14", i: 4 },
            ].map(({ icon: Icon, label, i }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-3 py-1.5"
                style={{
                  borderColor: PALETTE[i].border,
                  color: PALETTE[i].text,
                }}
              >
                <Icon size={13} />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="view"
                checked={view === "desktop"}
                onChange={() => setView("desktop")}
                style={{ accentColor: "#8B5CF6" }}
              />
              Desktop view
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="view"
                checked={view === "mobile"}
                onChange={() => setView("mobile")}
                style={{ accentColor: "#8B5CF6" }}
              />
              Mobile view
            </label>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-start justify-center gap-8">

            {/* Desktop browser mockup */}
            <div
              className="w-full max-w-3xl rounded-2xl border-2 bg-white shadow-xl overflow-hidden text-left"
              style={{ borderColor: PALETTE[2].border }}
            >
              <div
                className="flex items-center gap-1.5 border-b-2 bg-[#F8F7FC] px-4 py-2.5"
                style={{ borderColor: PALETTE[2].border }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                <span className="ml-3 rounded-md bg-white border border-slate-200 px-3 py-1 text-[11px] text-slate-400 flex-1 max-w-xs">
                  codevista.in/lessons/what-is-python
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5">

                {/* Video panel */}
                <div
                  className="sm:col-span-2"
                  style={{ backgroundColor: "#241B4E" }}
                >
                  <div className="relative aspect-[4/3]">
                    <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      NOW PLAYING
                    </span>

                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background:
                          "linear-gradient(135deg, #8B5CF6, #1AACDB, #1FB671)",
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                        style={{ background: HOME_GRADIENT }}
                      >
                        <Play
                          size={22}
                          className="text-white ml-1"
                          fill="white"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-bold text-white leading-tight">
                      Your First Line of Code
                    </p>

                    <p className="mt-1 text-[10px] text-white/50">
                      Lesson 1 · Python Starters · 20 min
                    </p>

                    <div className="mt-2 h-1 w-full rounded-full bg-white/15">
                      <div
                        className="h-1 w-1/3 rounded-full"
                        style={{ background: HOME_GRADIENT }}
                      />
                    </div>

                    <div className="mt-1 flex justify-between text-[9px] text-white/40">
                      <span>7:02</span>
                      <span>20:00</span>
                    </div>
                  </div>
                </div>

                {/* Lesson content panel */}
                <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-slate-100">
                  <div className="flex items-center border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    {[
                      { icon: Eye, label: "Watch", active: false },
                      { icon: BookOpen, label: "Lesson", active: true },
                      { icon: Laptop, label: "Practice", active: false },
                      { icon: FileText, label: "Resources", active: false },
                      {
                        icon: GraduationCap,
                        label: "Certificate",
                        active: false,
                      },
                    ].map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className="flex flex-1 flex-col items-center gap-1 py-3"
                        style={
                          active
                            ? {
                                color: "#8B5CF6",
                                borderBottom: "2px solid #8B5CF6",
                              }
                            : undefined
                        }
                      >
                        <Icon size={15} />
                        <span className="hidden sm:block">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-[#241B4E]">
                      <BookOpen size={14} style={{ color: "#8B5CF6" }} />
                      Key Concept
                    </p>

                    <div
                      className="mt-3 rounded-lg px-3 py-2.5 font-mono text-[11px]"
                      style={{ backgroundColor: "#12102A" }}
                    >
                      <p className="text-white/40">
                        # Talking to the screen
                      </p>

                      <p>
                        <span style={{ color: "#1FB671" }}>print</span>
                        <span className="text-white">(</span>
                        <span style={{ color: "#1AACDB" }}>
                          "Hello!"
                        </span>
                        <span className="text-white">)</span>
                      </p>
                    </div>

                    <div
                      className="mt-3 rounded-lg border-2 p-2.5"
                      style={{
                        backgroundColor: PALETTE[2].bg,
                        borderColor: PALETTE[2].border,
                      }}
                    >
                      <p
                        className="flex items-center gap-1.5 text-[11px] font-bold"
                        style={{ color: PALETTE[2].text }}
                      >
                        <Lightbulb size={12} />
                        Why it matters:
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-slate-500">
                        print() is how your code "speaks" — it's the very first
                        thing every programmer learns to say.
                      </p>
                    </div>

                    <div
                      className="mt-3 flex items-start gap-2 rounded-lg border-2 p-2.5"
                      style={{
                        backgroundColor: PALETTE[4].bg,
                        borderColor: PALETTE[4].border,
                      }}
                    >
                      <span className="text-base">🧑</span>

                      <p className="text-[11px] text-[#241B4E]">
                        <span className="font-bold">Sujas:</span>{" "}
                        <span className="italic">
                          "This was the first thing that made coding feel real
                          to me."
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="hidden md:flex flex-col items-center">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Smartphone size={13} />
                Mobile view
              </p>

              <div className="w-48 rounded-[1.75rem] border-4 border-[#241B4E] bg-white shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 pt-2 text-[9px] font-semibold text-[#241B4E]">
                  <span>9:41</span>
                  <span>•••</span>
                </div>

                <div
                  className="relative mt-1 aspect-[4/3]"
                  style={{ backgroundColor: "#241B4E" }}
                >
                  <span className="absolute left-1.5 top-1.5 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[7px] font-bold text-white">
                    LIVE
                  </span>

                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6, #1AACDB, #1FB671)",
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ background: HOME_GRADIENT }}
                    >
                      <Play
                        size={13}
                        className="text-white ml-0.5"
                        fill="white"
                      />
                    </span>
                  </div>

                  <p className="absolute bottom-1 left-1.5 right-1.5 text-[7px] font-semibold text-white/80 leading-tight">
                    Your First Line of Code
                  </p>

                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-1/3"
                    style={{ background: "#8B5CF6" }}
                  />
                </div>

                <div className="flex items-center justify-around border-b border-slate-100 py-1.5 text-slate-300">
                  {[Eye, BookOpen, Laptop, FileText, GraduationCap].map(
                    (Icon, i) => (
                      <Icon
                        key={i}
                        size={11}
                        style={
                          i === 1 ? { color: "#8B5CF6" } : undefined
                        }
                      />
                    )
                  )}
                </div>

                <div className="p-2">
                  <p className="flex items-center gap-1 text-[9px] font-bold text-[#241B4E]">
                    <BookOpen size={10} style={{ color: "#8B5CF6" }} />
                    Key Concept
                  </p>

                  <div
                    className="mt-1.5 rounded-md px-2 py-1.5 font-mono text-[7px]"
                    style={{ backgroundColor: "#12102A" }}
                  >
                    <p className="text-white/40">
                      # Talking to the screen
                    </p>

                    <p>
                      <span style={{ color: "#1FB671" }}>print</span>
                      <span className="text-white">(</span>
                      <span style={{ color: "#1AACDB" }}>
                        "Hello!"
                      </span>
                      <span className="text-white">)</span>
                    </p>
                  </div>

                  <div
                    className="mt-1.5 rounded-md border p-1.5"
                    style={{
                      backgroundColor: PALETTE[2].bg,
                      borderColor: PALETTE[2].border,
                    }}
                  >
                    <p
                      className="text-[7px] font-bold"
                      style={{ color: PALETTE[2].text }}
                    >
                      💡 Why it matters:
                    </p>

                    <p className="mt-0.5 font-mono text-[6px] text-slate-500 leading-tight">
                      print() is how code "speaks" — the first thing every
                      programmer learns.
                    </p>
                  </div>

                  <div
                    className="mt-1.5 flex items-start gap-1 rounded-md border p-1.5"
                    style={{
                      backgroundColor: PALETTE[4].bg,
                      borderColor: PALETTE[4].border,
                    }}
                  >
                    <span className="text-[9px]">🧑</span>

                    <p className="text-[6px] text-[#241B4E] leading-tight">
                      <span className="font-bold">Sujas:</span>{" "}
                      <span className="italic">
                        "This made coding feel real to me."
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            This is one lesson out of 26+ — and it's yours to try free.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
            style={{ background: HOME_GRADIENT }}
          >
            Try a Free Lesson <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ---------------- Curriculum ---------------- */}
      <section
        className="px-8 py-20"
        style={{
          background:
            "linear-gradient(135deg, #EAF8FE 0%, #EAFBF1 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm"
            style={{ color: PALETTE[2].text }}
          >
            <BookOpen size={12} />
            THE FULL PATH
          </span>

          <h2 className="font-display mt-4 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
            Three courses.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: HOME_GRADIENT }}
            >
              One clear path.
            </span>
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            26+ lessons, real projects at every stage, and a certificate
            waiting at the end.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {COURSES.map(
              ({
                icon: Icon,
                level,
                title,
                desc,
                lessons,
                projects,
                hours,
                items,
                more,
                colorIndex,
              }) => {
                const c = PALETTE[colorIndex];

                return (
                  <div
                    key={title}
                    className="flex flex-col rounded-2xl border-2 bg-white p-5 shadow-sm"
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: c.bg,
                          color: c.text,
                        }}
                      >
                        <Icon size={16} />
                      </span>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[9px] font-extrabold text-[#E8A400]">
                          <Crown size={10} />
                          Premium
                        </span>

                        <p
                          className="mt-1 text-[10px] font-bold"
                          style={{ color: c.text }}
                        >
                          {level}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-display mt-3 text-sm font-extrabold text-[#241B4E]">
                      {title}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {desc}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={11} />
                        {lessons} lessons
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <FolderKanban size={11} />
                        {projects} projects
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {hours}h est.
                      </span>
                    </div>

                    <p
                      className="mt-4 text-[10px] font-extrabold tracking-wide"
                      style={{ color: c.text }}
                    >
                      INSIDE THIS COURSE
                    </p>

                    <ul className="mt-2 space-y-1.5">
                      {items.map((item, i) => (
                        <li
                          key={item.title}
                          className="flex items-center justify-between rounded-lg bg-[#FDFCFA] px-2.5 py-1.5"
                        >
                          <span className="flex items-center gap-2 text-xs font-medium text-[#241B4E]">
                            <span
                              className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                              style={{
                                backgroundColor: c.bg,
                                color: c.text,
                              }}
                            >
                              {i + 1}
                            </span>

                            {item.title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 px-2.5">
                      {items.map((item) => (
                        <span
                          key={item.title}
                          className="inline-flex items-center gap-2 text-[9px]"
                        >
                          <span className="inline-flex items-center gap-0.5 text-[#1AACDB] font-semibold">
                            <PlayCircle size={10} />
                            Video
                          </span>

                          {item.free ? (
                            <span
                              className="inline-flex items-center gap-0.5 font-semibold"
                              style={{ color: "#1FB671" }}
                            >
                              <Check size={10} />
                              Free
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-0.5 font-semibold"
                              style={{ color: "#E8A400" }}
                            >
                              <Lock size={10} />
                              Premium
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-center text-[10px] font-semibold text-slate-400">
                      + {more} more lessons ahead
                    </p>

                    <button
                      onClick={() => navigate("/login")}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                      style={{ background: HOME_GRADIENT }}
                    >
                      Start This Course <ArrowRight size={13} />
                    </button>

                    <p className="mt-2 text-center text-[9px] text-slate-400">
                      First lesson free · No card needed
                    </p>
                  </div>
                );
              }
            )}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
            style={{ background: HOME_GRADIENT }}
          >
            See the Full Curriculum <ArrowRight size={16} />
          </button>

          <p className="mt-3 text-xs text-slate-400">
            No installs &nbsp;·&nbsp; No card required &nbsp;·&nbsp; Any device
            &nbsp;·&nbsp; Taught by kids
          </p>
        </div>
      </section>

      {/* ---------------- Player vs Builder ---------------- */}
      <section className="py-20 px-8 bg-white">
        <div className="mx-auto max-w-6xl relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full text-white text-xs font-bold shadow-lg"
            style={{ background: HOME_GRADIENT }}
          >
            VS
          </div>

          <div
            className="rounded-2xl border-2 bg-white p-8 shadow-sm"
            style={{ borderColor: PALETTE[3].border }}
          >
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 tracking-wide">
              A TYPICAL AFTERNOON
            </span>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: PALETTE[3].bg }}
              >
                🎮
              </span>

              {[0, 1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: PALETTE[3].border }}
                />
              ))}
            </div>

            <h3 className="font-display mt-4 text-2xl font-extrabold text-[#241B4E]">
              Consuming someone else's{" "}
              <span style={{ color: "#E8A400" }}>work.</span>
            </h3>

            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              Hours of games, videos, and feeds — all built by someone else's
              decisions, someone else's code.
            </p>

            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              It's not wasted time, but it's not their time either.
            </p>
          </div>

          <div
            className="rounded-2xl p-8 shadow-lg text-white"
            style={{ backgroundColor: "#241B4E" }}
          >
            <span
              className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wide"
              style={{ color: "#B9A6FF" }}
            >
              THE SHIFT
            </span>

            <div
              className="mt-4 rounded-lg bg-black/30 px-3 py-2 font-mono text-xs flex items-center gap-1.5"
              style={{ color: "#8B5CF6" }}
            >
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-2">creator = "you"</span>
              <span className="animate-pulse">|</span>
            </div>

            <h3 className="font-display mt-4 text-2xl font-extrabold">
              Making{" "}
              <span style={{ color: "#7FD8F5" }}>their own</span> work.
            </h3>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400 shrink-0" />
                Builds something they chose to build
              </li>

              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400 shrink-0" />
                Learns a skill that compounds with age
              </li>

              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400 shrink-0" />
                Starts thinking like a creator, not just a user
              </li>
            </ul>

            <p className="mt-4 text-xs text-white/50">
              No installs &nbsp;·&nbsp; No card required &nbsp;·&nbsp; Any device
              &nbsp;·&nbsp; Taught by kids
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: HOME_GRADIENT }}
            >
              Get Full Year Access
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Price strip ---------------- */}
      <div
        className="border-y-2 py-4 px-8 text-center"
        style={{
          borderColor: PALETTE[2].border,
          backgroundColor: "#FDFCFA",
        }}
      >
        <p className="text-sm font-semibold text-slate-500">
          Everything above, for a full year, at{" "}
          <span
            className="font-extrabold"
            style={{ color: "#8B5CF6" }}
          >
            ₹1,499/year.
          </span>
        </p>
      </div>

      {/* ---------------- Bonus pack ---------------- */}
      <section
        className="px-8 py-20"
        style={{ backgroundColor: "#F5EEFF" }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm"
            style={{ color: "#8B5CF6" }}
          >
            <Gift size={12} />
            BUNDLED IN, NO EXTRA COST
          </span>

          <h2 className="font-display mt-4 text-2xl md:text-3xl font-extrabold text-[#241B4E]">
            It's more than{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: HOME_GRADIENT }}
            >
              just the courses.
            </span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {BONUS_ITEMS.map(
              ({
                icon: Icon,
                tag,
                title,
                desc,
                footer,
                colorIndex,
                mockup,
              }) => {
                const c = PALETTE[colorIndex];

                return (
                  <div
                    key={title}
                    className="rounded-2xl border-2 bg-white p-5"
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: c.bg,
                          color: c.text,
                        }}
                      >
                        <Icon size={15} />
                      </span>

                      <div>
                        <p className="text-xs font-bold text-[#241B4E]">
                          {title}
                        </p>

                        <p
                          className="text-[10px] font-semibold"
                          style={{ color: c.text }}
                        >
                          {tag}
                        </p>
                      </div>
                    </div>

                    {mockup === "timetable" && (
                      <div
                        className="mt-3 rounded-lg p-2.5 text-[8px] text-white"
                        style={{ backgroundColor: "#241B4E" }}
                      >
                        {["Mon", "Tue", "Wed", "Thu"].map((d, i) => (
                          <div
                            key={d}
                            className="flex items-center justify-between py-0.5"
                          >
                            <span className="text-white/50">{d}</span>

                            <span
                              style={{
                                color: PALETTE[i % PALETTE.length].text,
                              }}
                            >
                              {["Math", "Science", "Python", "English"][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {mockup === "notes" && (
                      <div
                        className="mt-3 rounded-lg p-2.5"
                        style={{ backgroundColor: "#241B4E" }}
                      >
                        <p className="text-[8px] font-bold text-white/70">
                          MY NOTEBOOK
                        </p>

                        {[
                          "Still confused: loops",
                          "print() finally clicked",
                          "Idea: a birthday card app",
                        ].map((n) => (
                          <p
                            key={n}
                            className="mt-1 text-[8px] text-white/80"
                          >
                            • {n}
                          </p>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                      {desc}
                    </p>

                    {footer && (
                      <p
                        className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold"
                        style={{ color: c.text }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: c.solid }}
                        />
                        {footer}
                      </p>
                    )}

                    {mockup === "notes" && (
                      <button
                        onClick={() => navigate("/notes")}
                        className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold"
                        style={{ color: c.text }}
                      >
                        Open My Notebook <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {[
              {
                icon: Calendar,
                label: "Weekend class included",
                i: 4,
              },
              {
                icon: Table2,
                label: "Planner tool, always free",
                i: 2,
              },
              {
                icon: NotebookPen,
                label: "Notebook tool, always free",
                i: 5,
              },
            ].map(({ icon: Icon, label, i }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-3 py-1.5"
                style={{
                  borderColor: PALETTE[i].border,
                  color: PALETTE[i].text,
                }}
              >
                <Icon size={13} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section className="px-8 py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white border-2 px-3 py-1 text-[11px] font-bold shadow-sm"
            style={{
              borderColor: PALETTE[2].border,
              color: PALETTE[2].text,
            }}
          >
            <Sparkles size={12} />
            ONE PRICE, EVERYTHING INCLUDED
          </span>

          <h2 className="font-display mt-4 text-2xl md:text-3xl font-extrabold text-[#241B4E]">
            No Tiers. No Upsells. Just Access.
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            One payment covers the whole year, on any device, with nothing
            else to buy later.
          </p>

          <div
            className="mt-8 rounded-3xl border-2 bg-white p-8 text-left shadow-sm"
            style={{ borderColor: PALETTE[2].border }}
          >
            <p className="font-display text-4xl font-extrabold text-[#241B4E]">
              ₹1,499{" "}
              <span className="text-base font-semibold text-slate-400">
                /year
              </span>
            </p>

            <ul className="mt-5 space-y-2.5">
              {PLAN_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-[#241B4E]"
                >
                  <Check
                    size={15}
                    style={{ color: "#8B5CF6" }}
                    className="shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: HOME_GRADIENT }}
            >
              Start Free Trial
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              No installs · No card required · Any device · Taught by kids
            </p>

            <p className="mt-1 text-center text-[10px] text-slate-400">
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Why CodeVista is different ---------------- */}
      <section
        className="px-8 py-16 text-center"
        style={{ backgroundColor: "#F5EEFF" }}
      >
        <span
          className="text-[11px] font-extrabold tracking-wide"
          style={{ color: "#8B5CF6" }}
        >
          WHAT MAKES THIS DIFFERENT
        </span>

        <h2 className="font-display mx-auto mt-3 max-w-xl text-2xl md:text-3xl font-extrabold text-[#241B4E]">
          Most kids' coding platforms are just{" "}
          <span
            className="underline decoration-4"
            style={{
              color: "#8B5CF6",
              textDecorationColor: "#8B5CF6",
            }}
          >
            adult courses
          </span>{" "}
          with cartoon mascots slapped on.
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold">
          {WHY_STATS.map(({ icon: Icon, label, colorIndex }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5"
              style={{ color: PALETTE[colorIndex].text }}
            >
              <Icon size={13} />
              {label}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&h=500&q=85"
            alt="Happy children playing and learning together"
            className="h-28 w-full rounded-2xl object-cover shadow-sm sm:h-40"
          />

          <img
            src="https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=600&h=500&q=85"
            alt="Children enjoying a creative learning activity"
            className="h-28 w-full rounded-2xl object-cover shadow-sm sm:h-40"
          />

          <img
            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&h=500&q=85"
            alt="Child learning coding and programming"
            className="h-28 w-full rounded-2xl object-cover shadow-sm sm:h-40"
          />
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="py-20 bg-[#FDFCFA]">
        <div className="mx-auto max-w-6xl px-8 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white border-2 px-3 py-1 text-[11px] font-bold shadow-sm"
            style={{
              borderColor: PALETTE[2].border,
              color: PALETTE[2].text,
            }}
          >
            <Sparkles size={12} />
            IN THEIR OWN WORDS
          </span>

          <h2 className="font-display mt-4 text-2xl md:text-3xl font-extrabold text-[#241B4E]">
            2,000+ Kids Are Already Building
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 px-8 pb-2">
          {TESTIMONIALS_KIDS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4 px-8">
          {TESTIMONIALS_PARENTS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="px-8 py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white border-2 px-3 py-1 text-[11px] font-bold shadow-sm"
            style={{
              borderColor: PALETTE[4].border,
              color: PALETTE[4].text,
            }}
          >
            <ShieldCheck size={12} />
            BEFORE YOU ASK
          </span>

          <h2 className="font-display mt-4 text-2xl md:text-3xl font-extrabold text-[#241B4E]">
            Quick Answers for Parents
          </h2>

          <div className="mt-8 space-y-3 text-left">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              const c = PALETTE[i % PALETTE.length];

              return (
                <div
                  key={f.q}
                  className="rounded-xl border-2 bg-white overflow-hidden"
                  style={{
                    borderColor: isOpen ? c.border : "#EEE7FF",
                  }}
                >
                  <button
                    onClick={() =>
                      setOpenFaq(isOpen ? null : i)
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-[#241B4E]"
                  >
                    {f.q}

                    <ChevronDown
                      size={16}
                      style={{
                        color: c.text,
                        transform: isOpen
                          ? "rotate(180deg)"
                          : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>

                  {isOpen && (
                    <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section
        className="px-8 py-14 text-center"
        style={{ backgroundColor: "#F5EEFF" }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#241B4E]">
          Their first Python project is{" "}
          <span style={{ color: "#8B5CF6" }}>one click</span> away.
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Join the 2,000+ kids already building with CodeVista. No installs,
          no pressure — just try it.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
          style={{ background: HOME_GRADIENT }}
        >
         Get Full Year Access
        </button>

        <p className="mt-3 text-[10px] text-slate-400">
          No installs · No card required · Any device · Taught by kids
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          ₹1,499/year · Secure payment via Razorpay
        </p>
      </section>

      <PublicFooter />
    </div>
  );
}