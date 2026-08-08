import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  X,
  Play,
  Video,
  Gamepad2,
  ListChecks,
  Star,
  Clock,
} from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const DASH_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const COURSES = [
  {
    badge1: "Premium",
    badge2: "Beginner",
    status: "Not Started",
    icon: "🐍",
    title: "Python Starters",
    description:
      "The first steps into code — variables, printing, and basic commands, explained the way a kid would explain it to a friend.",
    lessons: "10 Lessons",
    projects: "2 Projects",
    duration: "4h est.",
    colorIndex: 4,
  },
  {
    badge1: "Premium",
    badge2: "Intermediate",
    status: "Not Started",
    icon: "</>",
    title: "Python Explorer",
    description:
      "Once the basics click, this is where you start making real decisions in code — logic, structure, and problem-solving.",
    lessons: "8 Lessons",
    projects: "2 Projects",
    duration: "6h est.",
    colorIndex: 2,
  },
  {
    badge1: "Premium",
    badge2: "Advanced",
    status: "Not Started",
    icon: "🎨",
    title: "Python Creator - Make Art with Code",
    description:
      "Turtle Graphics turns your code into art. Draw spirals, shapes, patterns, and animations — even write your name with Python!",
    lessons: "7 Lessons",
    projects: "3 Projects",
    duration: "5h est.",
    colorIndex: 5,
  },
];

const FEATURES = [
  {
    icon: Video,
    title: "Bite-Sized Lessons",
    description: "Short, focused videos that explain one idea at a time — nothing overwhelming, nothing boring.",
    colorIndex: 2,
  },
  {
    icon: Gamepad2,
    title: "Learn by Building",
    description: "Every concept turns into a real project, not just a quiz — you learn Python by actually using it.",
    colorIndex: 4,
  },
  {
    icon: ListChecks,
    title: "One Clear Path",
    description: "Courses build on each other in order, so you always know exactly what's next.",
    colorIndex: 5,
  },
];

const TESTIMONIALS = [
  { name: "Arjan P.", age: "Age 10 · Bengaluru", quote: "Finished it in a month — genuinely fun, never boring." },
  { name: "Dhruv A.", age: "Age 9 · Mumbai", quote: "Used what I learned here for my school science fair project." },
  { name: "Advait K.", age: "Age 11 · Pune", quote: "The turtle drawing lessons are incredible — I made a spiral galaxy." },
  { name: "Krish S.", age: "Age 8 · Delhi", quote: "My first real 'aha' moment was building a calculator that actually works." },
  { name: "Shaurya B.", age: "Age 12 · Chennai", quote: "Building a quiz app for my whole school — my teacher wants to use it!" },
  { name: "Kabir R.", age: "Age 10 · Jaipur", quote: "My friends think I'm a coding wizard now. I just tell them to keep going." },
  { name: "Arnav M.", age: "Age 9 · Hyderabad", quote: "Every lesson builds on the last — it just makes sense to me." },
  { name: "Reyansh G.", age: "Age 11 · Kolkata", quote: "My dad codes for work now we code together on weekends." },
  { name: "Viaan K.", age: "Age 10 · Indore", quote: "The lessons are short but they pack a punch, even in 20 minutes." },
  { name: "Ananya S.", age: "Age 9 · Ahmedabad", quote: "It explains things step by step — even the hard parts feel easy." },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const user = getCurrentUser() || { name: "Guest", email: "Not signed in" };
  const firstName = user.name.split(" ")[0];

  return (
    <AppLayout active="dashboard">
      {/* Secure account bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-6 py-2.5 border-b border-slate-200 text-xs">
        <span className="flex items-center gap-2 text-slate-500">
          🔒 Secure your account: add a phone number to enable OTP sign-in from any device.
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg px-3 py-1.5 font-semibold text-white hover:opacity-90"
            style={{ background: DASH_GRADIENT }}
          >
            Add Phone
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6" style={{ backgroundColor: "#F5EEFF" }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#241B4E]">Hey, {firstName}! 👋</h1>
            <span
              className="rounded-full bg-white border px-2 py-0.5 text-[10px] font-bold"
              style={{ borderColor: PALETTE[4].border, color: PALETTE[4].text }}
            >
              🔥 7-day streak
            </span>
          </div>
          <p className="text-slate-500 mt-1">Pick up right where you left off — or start something new.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center gap-2"
            style={{ background: DASH_GRADIENT }}
          >
            <Play size={14} /> Continue Learning
          </button>
          <button
            onClick={() => navigate("/playground")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#241B4E] hover:bg-slate-50 flex items-center gap-2"
          >
            <Code2 size={14} /> Playground
          </button>
        </div>
      </div>

      {/* Playground preview */}
      <section className="px-6 py-8">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">Give This a Try Right Now</h2>

        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-2 text-white text-xs font-semibold"
            style={{ background: DASH_GRADIENT }}
          >
            <span className="flex items-center gap-2">✨ A Quick Example to Play With</span>
          </div>

          <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
            <span className="text-[10px] text-slate-400">Python 3.11</span>
            <button className="flex items-center gap-1 rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white">
              <Play size={11} /> Run
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <pre className="bg-[#1e1e1e] text-slate-300 text-xs p-4 overflow-x-auto leading-relaxed font-mono">
{`# Welcome to Python! Let's talk about variables.

# Step 1: Store your name in a variable
name = "Code Explorer"

# Step 2: Print a greeting using your name
print("Hello,", name)

# Step 3: Try changing this to your own name!
my_name = "Aryan"
print("My name is", my_name)
print("Nice to meet you,", my_name, "!")

# Step 4: Now build a full sentence
age = 11
print(f"{my_name} is {age} years old.")`}
            </pre>
            <div className="bg-black text-slate-500 text-xs p-4 font-mono">
              Run the code to see your output here...
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/playground")}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            style={{ background: DASH_GRADIENT }}
          >
            Open Full Playground →
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Run the snippet above, or head to the full playground for more room to experiment.
          </p>
        </div>
      </section>

      {/* Learning path */}
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-[#241B4E]">Your Learning Path</h2>
          <a href="#" className="text-xs font-semibold" style={{ color: "#8B5CF6" }}>
            View All Courses →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COURSES.map((c) => {
            const clr = PALETTE[c.colorIndex];
            return (
              <div
                key={c.title}
                className="rounded-xl border-2 bg-white overflow-hidden flex flex-col"
                style={{ borderColor: clr.border }}
              >
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex gap-1">
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ backgroundColor: clr.bg, color: clr.text }}
                      >
                        {c.badge1}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                        {c.badge2}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                    {c.status}
                  </span>
                  <h3 className="mt-2 font-bold text-[#241B4E]">{c.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{c.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400">
                    <span>📘 {c.lessons}</span>
                    <span>📁 {c.projects}</span>
                    <span>⏱ {c.duration}</span>
                  </div>
                </div>
                <button
                  className="px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
                  style={{ background: DASH_GRADIENT }}
                >
                  ▶ Start Free Lesson
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Kids Love CodeVista */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">Why It Actually Sticks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, colorIndex }) => {
            const clr = PALETTE[colorIndex];
            return (
              <div key={title} className="rounded-xl border-2 bg-white p-4" style={{ borderColor: clr.border }}>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg mb-2"
                  style={{ backgroundColor: clr.bg, color: clr.text }}
                >
                  <Icon size={16} />
                </span>
                <h3 className="font-bold text-[#241B4E]">{title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate section */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm rounded-xl border-4 p-5 text-center shadow-md"
              style={{ borderColor: "#8B5CF6", backgroundColor: "#F5EEFF" }}
            >
              <p className="text-[10px] font-bold" style={{ color: "#8B5CF6" }}>CodeVista</p>
              <p className="mt-1 text-[9px] tracking-wide text-slate-400">CERTIFICATE OF COMPLETION</p>
              <p className="mt-4 text-[9px] text-slate-400">This certificate is proudly presented to</p>
              <p className="mt-1 text-lg font-bold text-[#241B4E]" style={{ fontFamily: "cursive" }}>
                {user.name}
              </p>
              <p className="mt-4 text-[10px] font-bold tracking-wide text-[#241B4E]">
                CERTIFIED CODE BUILDER
              </p>
              <span
                className="mt-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs"
                style={{ background: DASH_GRADIENT }}
              >
                ✓
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs"
                style={{ background: DASH_GRADIENT }}
              >
                🏆
              </span>
              <h2 className="text-lg font-extrabold text-[#241B4E]">Earn Your Certificate</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Finish the courses and walk away with an official{" "}
              <span className="font-semibold" style={{ color: "#8B5CF6" }}>Certified Code Builder</span>{" "}
              certificate — something real to show friends, family, and teachers.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold text-[#241B4E] mb-2">What gets you there:</p>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> The fundamentals: variables, conditionals, loops, functions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Problem-solving through real coding challenges
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Building your own games and interactive programs
                </li>
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3" style={{ backgroundColor: "#EAF8FE" }}>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#8B5CF6" }}
              >
                🎖
              </span>
              <div>
                <p className="text-xs font-bold text-[#241B4E]">A badge worth showing off</p>
                <p className="text-[10px] text-slate-500">Displays right on your profile once you earn it</p>
              </div>
            </div>

            <button
              className="mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center gap-2"
              style={{ background: DASH_GRADIENT }}
            >
              ▶ Start Earning Your Certificate
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-8 pb-16">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">What Other Kids Say</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="min-w-[220px] shrink-0 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-xs font-bold text-[#241B4E]">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.age}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Founders */}
      <section className="px-6 py-16" style={{ backgroundColor: "#F5EEFF" }}>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "#8B5CF6" }}>
            ♡ OUR STORY
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#241B4E]">Meet the Founders</h2>
          <p className="mt-2 text-slate-500">Two brothers who taught themselves Python — then built this for everyone else.</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-xs overflow-hidden">
                Photo
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#241B4E]">Sahaj &amp; Sujas</h3>
                <p className="text-sm font-semibold" style={{ color: "#8B5CF6" }}>11-year-old Co-Founders</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["🏅 Published Authors", "🏆 Olympiad Winners", "🚀 Young Entrepreneurs", "🎓 Oxford Summer School Scholar, UK"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border px-3 py-1 text-[10px] font-semibold"
                      style={{ borderColor: "rgba(139,92,246,0.3)", backgroundColor: "#F5EEFF", color: "#8B5CF6" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Hey! We're Sahaj and Sujas — twin brothers who don't look alike, dress alike, or eat
                alike... but we do share one big thing in common: we love coding! As of June 2025,
                we're 11 years old.
              </p>
              <p>
                We were born in Bangalore and have lived in five cities across India — Udupi-Manipal,
                Hyderabad, Indore, Noida, and now back in Bangalore.
              </p>
              <p>
                We've each published two books on Bribooks, won medals at Olympiads, and we were both
                selected as Oxford Summer School Scholars, UK — among only two chosen from all of
                India for 2026!
              </p>
              <p>
                We started learning Python in grade 4 and built CodeVista so other kids like us could
                learn it the way we wish someone had taught us.
              </p>
              <p className="font-semibold" style={{ color: "#8B5CF6" }}>
                Hope you enjoy it. Happy coding! — Sahaj &amp; Sujas
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                No downloads &nbsp;·&nbsp; No setup &nbsp;·&nbsp; Works on any device &nbsp;·&nbsp; Made by kids, for kids
              </p>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: DASH_GRADIENT }}
              >
                🚀 Keep Learning
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}