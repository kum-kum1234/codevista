import React, { useState } from "react";
import {
  Award,
  Lock,
  Search,
  BookOpen,
  Code2,
  Puzzle,
  Clock3,
  GraduationCap,
  CheckCircle2,
  Target,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import { getCurrentUser } from "../utils/auth";

const ACHIEVEMENTS_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const BADGES = [
  { title: "First Coder", rarity: "Common" },
  { title: "Quick Learner", rarity: "Common" },
  { title: "Lesson Champion", rarity: "Rare" },
  { title: "Code Warrior", rarity: "Rare" },
  { title: "Python Pioneer", rarity: "Rare" },
  { title: "Playground Pro", rarity: "Rare" },
  { title: "Bug Buster", rarity: "Rare" },
  { title: "Project Creator", rarity: "Rare" },
  { title: "Streak Hero", rarity: "Rare" },
  { title: "Community Star", rarity: "Legendary" },
];

const ACHIEVEMENTS = [
  { title: "First Steps", desc: "Finish your very first lesson", unlocked: false },
  { title: "Getting Started", desc: "Complete 5 lessons", unlocked: false },
  { title: "Python Beginner", desc: "Complete 10 lessons", unlocked: false },
  { title: "Code Master", desc: "Complete 25 lessons", unlocked: false },
  { title: "Python Ninja", desc: "Finish every beginner course", unlocked: false },
  { title: "Code Explorer", desc: "Run 25 code examples in the playground", unlocked: false },
  { title: "Bug Hunter", desc: "Fix 5 coding errors on your own", unlocked: false },
  { title: "Project Creator", desc: "Build and save your first project", unlocked: false },
  { title: "Helping Hand", desc: "Comment on 5 other students' projects", unlocked: false },
  { title: "Streak Hero", desc: "Log in 7 days in a row", unlocked: false },
  { title: "Python Artist", desc: "Create a visual art piece with Python", unlocked: false },
  { title: "Game Designer", desc: "Build a working game in Python", unlocked: false },
  { title: "Data Wizard", desc: "Complete 5 data analysis projects", unlocked: false },
  { title: "Quiz Champion", desc: "Score perfectly on 5 quizzes", unlocked: false },
  { title: "Team Player", desc: "Collaborate on a project with another student", unlocked: false },
];

const TABS = ["Achievements", "Progress Report"];
const FILTERS = ["All", "Unlocked", "Locked"];

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("Achievements");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const user = getCurrentUser() || { name: "Guest" };
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filtered = ACHIEVEMENTS.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Unlocked" && a.unlocked) ||
      (filter === "Locked" && !a.unlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout active="achievements">
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 shrink-0">
        <Award size={16} style={{ color: "#8B5CF6" }} />
        <div className="leading-tight">
          <p className="text-[9px] font-bold tracking-wide" style={{ color: "#8B5CF6" }}>ACHIEVEMENTS</p>
          <p className="text-sm font-bold text-[#241B4E]">Track Your Progress</p>
          <p className="text-[10px] text-slate-400">Keep going — there's a lot more to unlock</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Stats row */}
        <div className="mx-auto max-w-4xl grid grid-cols-4 gap-3 mb-4">
          {[
            { value: "0", label: "Unlocked" },
            { value: "15", label: "Total" },
            { value: "0", label: "Badges" },
            { value: "0%", label: "Done" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-lg font-extrabold text-[#241B4E]">{s.value}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-200 mb-4 text-xs font-semibold text-slate-400">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 pb-2 border-b-2 -mb-px"
                style={
                  activeTab === tab
                    ? { borderColor: "#8B5CF6", color: "#8B5CF6" }
                    : { borderColor: "transparent" }
                }
              >
                <Award size={13} /> {tab}
              </button>
            ))}
          </div>

          {activeTab === "Achievements" ? (
            <>
              {/* Secondary stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { icon: BookOpen, value: "0", label: "Lessons Done" },
                  { icon: Code2, value: "0", label: "Code Runs" },
                  { icon: Puzzle, value: "0", label: "Exercises Done" },
                  { icon: Clock3, value: "—", label: "Last Active" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                    <Icon size={14} style={{ color: "#8B5CF6" }} />
                    <div>
                      <p className="text-sm font-bold text-[#241B4E]">{value}</p>
                      <p className="text-[9px] text-slate-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex items-center justify-between mb-2">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#241B4E]">
                  🏅 Badge Collection
                </p>
                <span className="text-[10px] text-slate-400">0/10 earned</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {BADGES.map((b, i) => {
                  const clr = PALETTE[i % PALETTE.length];
                  return (
                    <div key={b.title} className="rounded-xl border-2 bg-white p-5 text-center" style={{ borderColor: clr.border }}>
                      <div
                        className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ backgroundColor: clr.bg, color: clr.text }}
                      >
                        <Lock size={22} />
                      </div>
                      <p className="text-sm font-bold text-[#241B4E]">{b.title}</p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold ${
                          b.rarity === "Legendary"
                            ? "bg-yellow-50 text-yellow-600"
                            : b.rarity === "Rare"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {b.rarity}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Achievements search + filter */}
              <p className="text-center text-[10px] font-bold tracking-wide text-slate-400 mb-2">
                ALL ACHIEVEMENTS
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search achievements..."
                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs outline-none focus:ring-2"
                    style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                  />
                </div>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold"
                    style={
                      filter === f
                        ? { background: ACHIEVEMENTS_GRADIENT, color: "white" }
                        : { border: "1px solid #E2E8F0", color: "#64748B" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((a) => (
                  <div
                    key={a.title}
                    className="rounded-xl border p-5"
                    style={
                      a.unlocked
                        ? { borderColor: "#DFCBFF", backgroundColor: "#F5EEFF" }
                        : { borderColor: "#E2E8F0", backgroundColor: "white" }
                    }
                  >
                    {a.unlocked ? (
                      <CheckCircle2 size={20} className="mb-3" style={{ color: "#8B5CF6" }} />
                    ) : (
                      <Lock size={20} className="text-slate-300 mb-3" />
                    )}
                    <p className="text-sm font-bold text-[#241B4E]">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-400 leading-snug">{a.desc}</p>
                    <p
                      className={`mt-2 text-[10px] ${a.unlocked ? "font-semibold" : "italic text-slate-300"}`}
                      style={a.unlocked ? { color: "#8B5CF6" } : undefined}
                    >
                      {a.unlocked ? "Unlocked!" : "Keep going to unlock this"}
                    </p>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-400">
                      No {filter !== "All" ? filter.toLowerCase() : ""} achievements found.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Report card header */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #DFCBFF" }}>
                <div className="px-6 py-5 flex items-center justify-between" style={{ background: ACHIEVEMENTS_GRADIENT }}>
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-white/80">
                      <GraduationCap size={13} /> CODEVISTA ACADEMY
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">Progress Report Card</h2>
                    <p className="text-xs text-white/70">{today}</p>
                  </div>
                  <div className="rounded-xl bg-white/15 px-4 py-2 text-right">
                    <p className="text-[9px] font-bold tracking-wide text-white/70">STUDENT</p>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4" style={{ backgroundColor: "#F5EEFF" }}>
                  {[
                    { icon: CheckCircle2, value: "0", label: "Lessons Done", colorIndex: 2 },
                    { icon: Code2, value: "0", label: "Code Runs", colorIndex: 4 },
                    { icon: Target, value: "0", label: "Exercises Done", colorIndex: 3 },
                    { icon: Clock3, value: "—", label: "Last Active", colorIndex: 0 },
                  ].map(({ icon: Icon, value, label, colorIndex }) => {
                    const clr = PALETTE[colorIndex];
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ backgroundColor: clr.bg, color: clr.text }}
                        >
                          <Icon size={15} />
                        </span>
                        <div>
                          <p className="text-lg font-extrabold text-[#241B4E]">{value}</p>
                          <p className="text-[10px] text-slate-500">{label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lessons visited */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <BookOpen size={36} className="mx-auto text-slate-200" />
                <p className="mt-3 text-base font-bold text-[#241B4E]">No lessons visited yet</p>
                <p className="mt-1 text-xs text-slate-400">Start a course and come back to see your report card!</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </AppLayout>
  );
}