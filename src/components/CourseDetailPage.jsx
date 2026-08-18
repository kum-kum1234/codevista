import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, Play, Lock, Video, Code2 } from "lucide-react";
import AppLayout from "./AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const DASH_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

// Map course level to the same PALETTE indices Dashboard uses for course cards
// (Beginner -> 4, Intermediate -> 2, Advanced -> 5) so colors stay consistent app-wide.
const LEVEL_COLOR_INDEX = {
  Beginner: 4,
  Intermediate: 2,
  Advanced: 5,
};

export default function CourseDetailPage({
  active,
  badge = "Premium",
  title,
  description,
  videos,
  lessonCount,
  level,
  whatYoullLearn = [],
  requirements = [],
  lessons = [],
}) {
  const navigate = useNavigate();
  const clr = PALETTE[LEVEL_COLOR_INDEX[level] ?? 4];

  return (
    <AppLayout active={active}>
      <div className="px-6 py-6">
        {/* Header */}
        <div
          className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5"
          style={{ borderColor: "#F0E6FF", backgroundColor: "#F5EEFF" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#241B4E]">{title}</h1>
              <span
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: clr.bg, borderColor: clr.border, color: clr.text }}
              >
                🔒 {badge}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">{description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                <Clock size={12} /> {videos}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                <BookOpen size={12} /> {lessonCount}
              </span>
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: clr.bg, color: clr.text }}
              >
                {level}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 min-w-[180px]">
            <p className="text-xs font-bold text-[#241B4E]">Your Adventure</p>
            <p className="text-[10px] font-semibold mt-1" style={{ color: "#8B5CF6" }}>
              PROGRESS
            </p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 w-0 rounded-full" style={{ background: DASH_GRADIENT }} />
            </div>
            <p className="text-[9px] text-slate-400 mt-1">0%</p>
            <button
              onClick={() => lessons[0] && !lessons[0].locked && navigate(lessons[0].path || "#")}
              className="mt-2 w-full rounded-lg px-3 py-2 text-xs font-semibold text-white hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ background: DASH_GRADIENT }}
            >
              <Play size={12} /> Start First Lesson
            </button>
          </div>
        </div>

        {/* Content + sidebar */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-extrabold text-[#241B4E] mb-3">Course Content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lessons.map((lesson, i) => (
                <div
                  key={lesson.title}
                  className={`rounded-xl bg-white p-4 ${i === 0 ? "border-2" : "border border-slate-200"}`}
                  style={i === 0 ? { borderColor: "#8B5CF6" } : undefined}
                >
                  {i === 0 && (
                    <span
                      className="inline-block mb-2 rounded px-2 py-0.5 text-[9px] font-bold"
                      style={{ backgroundColor: "#F5EEFF", color: "#8B5CF6" }}
                    >
                      Next up
                    </span>
                  )}
                  <div className="flex items-start gap-2">
                    {lesson.locked ? (
                      <Lock size={14} className="mt-0.5 text-slate-300 shrink-0" />
                    ) : (
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                        style={{ background: DASH_GRADIENT }}
                      >
                        {i + 1}
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#241B4E]">{lesson.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">{lesson.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {lesson.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video size={10} /> Video
                        </span>
                        <span className="flex items-center gap-1">
                          <Code2 size={10} /> Code Lab
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => !lesson.locked && navigate(lesson.path || "#")}
                    disabled={lesson.locked}
                    className="mt-3 w-full rounded-lg px-3 py-2 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-90"
                    style={{ background: DASH_GRADIENT }}
                  >
                    {lesson.locked ? <>🔒 Unlock Lesson</> : <>▶ Start Lesson</>}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold text-[#241B4E] mb-2">About this Course</p>
              <p className="text-[10px] font-bold text-slate-500 mb-1.5">What you'll learn</p>
              <ul className="space-y-1.5 mb-3">
                {whatYoullLearn.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[10px] text-slate-500">
                    <span className="text-green-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-bold text-slate-500 mb-1.5">Requirements</p>
              <ul className="space-y-1.5">
                {requirements.map((item) => (
                  <li key={item} className="text-[10px] text-slate-500">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border p-4" style={{ borderColor: "#E5D4FF", backgroundColor: "#F5EEFF" }}>
              <p className="text-[10px] font-bold" style={{ color: "#8B5CF6" }}>
                🔒 Premium Content
              </p>
              <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                Try the first lesson free! Subscribe to access all remaining lessons in this course.
              </p>
            </div>

            <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#241B4E] hover:bg-slate-50">
              Try First Lesson Free
            </button>
            <button
              className="w-full rounded-lg px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
              style={{ background: DASH_GRADIENT }}
            >
              Get Full Access — ₹1,499
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}