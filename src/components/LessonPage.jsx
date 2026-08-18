import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Video,
  BookOpen,
  Dumbbell,
  ClipboardList,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Download,
  Eye,
  Code2,
} from "lucide-react";
import AppLayout from "./AppLayout";
import CodeRunner from "./CodeRunner";
import { PALETTE } from "../theme/playfulPalette";

const DASH_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = [
  { key: "watch", label: "Watch", icon: Video },
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "practice", label: "Practice", icon: Dumbbell },
  { key: "summary", label: "Summary", icon: ClipboardList },
  { key: "complete", label: "Mark Complete", icon: CheckCircle2 },
];

function CodeBlock({ code, onOpenInLab }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between bg-[#12102A] px-3 py-1.5">
        <span className="text-[10px] font-semibold text-slate-400">python</span>
        <div className="flex items-center gap-2">
          {onOpenInLab && (
            <button
              onClick={() => onOpenInLab(code)}
              className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold text-white hover:opacity-90"
              style={{ background: DASH_GRADIENT }}
            >
              <Code2 size={11} /> Code Lab
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-800"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="bg-[#1a1830] text-slate-200 text-xs p-3 overflow-x-auto font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function OutputBlock({ text }) {
  return (
    <pre className="rounded-lg bg-black text-green-400 text-xs p-3 font-mono overflow-x-auto">
      {text}
    </pre>
  );
}

export default function LessonPage({ lesson }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("watch");
  const [labCode, setLabCode] = useState(lesson.codeLab?.initialCode || "");
  const labRef = useRef(null);

  const clr = PALETTE[4];

  function openInLab(code) {
    setLabCode(code);
    setActiveTab("practice");
    setTimeout(() => labRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <AppLayout active="dashboard">
      <div className="min-h-full bg-slate-50">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 font-semibold hover:opacity-80"
              style={{ color: "#8B5CF6" }}
            >
              <ChevronLeft size={13} /> Back to Lessons
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold" style={{ color: "#8B5CF6" }}>{lesson.courseName}</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-[#241B4E]">{lesson.title}</span>
          </div>
          <span className="font-bold text-[#241B4E]">{lesson.progressPercent ?? 0}%</span>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 border-b border-slate-200 bg-white px-4 py-2 flex-wrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={
                activeTab === key
                  ? { backgroundColor: clr.bg, color: clr.text, border: `1px solid ${clr.border}` }
                  : { color: "#94A3B8", border: "1px solid transparent" }
              }
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6">
          {/* Free preview banner */}
          <div
            className="flex items-center justify-between rounded-lg px-4 py-2 text-white text-xs font-semibold mb-4"
            style={{ background: DASH_GRADIENT }}
          >
            <span className="flex items-center gap-1.5"><Sparkles size={13} /> Free Preview — Lesson 1 only</span>
            <button className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] hover:bg-white/30">
              Unlock All — ₹1,499
            </button>
          </div>

          {/* Lesson header card */}
          <div className="rounded-xl border p-4 mb-4" style={{ borderColor: clr.border, backgroundColor: clr.bg }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[10px] font-bold" style={{ color: clr.text }}>{lesson.courseName}</p>
                <h1 className="text-base font-extrabold text-[#241B4E] mt-0.5">{lesson.title}</h1>
                <p className="mt-1 text-xs text-slate-500 max-w-md leading-relaxed">{lesson.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">⏱ {lesson.duration}</span>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">🎬 Video</span>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">📝 Exercise</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("watch")}
                className="rounded-lg px-4 py-2 text-xs font-bold text-white hover:opacity-90 flex items-center gap-1.5 shrink-0"
                style={{ background: DASH_GRADIENT }}
              >
                ▶ Watch
              </button>
            </div>
          </div>

          {/* ---------------- Watch tab ---------------- */}
          {activeTab === "watch" && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: "#8B5CF6" }}>
                <Video size={13} /> Watch the Lesson
              </p>
              <div
                className="rounded-xl overflow-hidden border-4 relative"
                style={{ borderImage: `${DASH_GRADIENT} 1` }}
              >
                {lesson.video?.thumbnail ? (
                  <img src={lesson.video.thumbnail} alt={lesson.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div
                    className="w-full aspect-video flex items-center justify-center text-white text-sm font-semibold"
                    style={{ background: DASH_GRADIENT }}
                  >
                    ▶ Video preview
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-2 text-xs font-semibold text-[#241B4E]">
                  {lesson.video?.caption}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Learn tab ---------------- */}
          {activeTab === "learn" && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold mb-3" style={{ color: "#8B5CF6" }}>
                <BookOpen size={13} /> Lesson Content
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">{lesson.title}</h2>
                {lesson.learn?.map((block, i) => {
                  if (block.type === "p") return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{block.text}</p>;
                  if (block.type === "h3") return <h3 key={i} className="mt-5 mb-2 text-sm font-extrabold" style={{ color: "#8B5CF6" }}>{block.text}</h3>;
                  if (block.type === "callouts")
                    return (
                      <div key={i} className="space-y-2 mb-3">
                        {block.items.map((item, j) => (
                          <div key={j} className="rounded-lg px-3 py-2 text-xs text-slate-600" style={{ backgroundColor: PALETTE[2].bg }}>
                            — {item}
                          </div>
                        ))}
                      </div>
                    );
                  if (block.type === "code")
                    return (
                      <div key={i} className="mb-3">
                        <CodeBlock code={block.code} onOpenInLab={openInLab} />
                      </div>
                    );
                  if (block.type === "output")
                    return (
                      <div key={i} className="mb-3">
                        <OutputBlock text={block.text} />
                      </div>
                    );
                  if (block.type === "numbered")
                    return (
                      <div key={i} className="space-y-2 mb-4">
                        {block.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs text-slate-600" style={{ backgroundColor: "#F5EEFF" }}>
                            <span
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white mt-0.5"
                              style={{ background: DASH_GRADIENT }}
                            >
                              {j + 1}
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    );
                  if (block.type === "mistake")
                    return (
                      <div key={i} className="mb-3">
                        <p className="text-xs font-bold mb-1.5" style={{ color: "#8B5CF6" }}>{block.title}</p>
                        <CodeBlock code={block.code} onOpenInLab={openInLab} />
                      </div>
                    );
                  return null;
                })}
              </div>
            </div>
          )}

          {/* ---------------- Practice tab ---------------- */}
          {activeTab === "practice" && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold mb-3" style={{ color: "#8B5CF6" }}>
                <Dumbbell size={13} /> Practice Exercises
              </p>
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 mb-6">
                {lesson.exercises?.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-xs font-bold text-[#241B4E]">Exercise {i + 1}: {ex.title}</p>
                      <p className="text-[10px] text-slate-400">Not started</p>
                    </div>
                    <button
                      onClick={() => openInLab(ex.code || lesson.codeLab?.initialCode)}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white hover:opacity-90 flex items-center gap-1"
                      style={{ background: DASH_GRADIENT }}
                    >
                      <ExternalLink size={11} /> Open in Code Lab
                    </button>
                  </div>
                ))}
              </div>

              <div ref={labRef} className="rounded-xl overflow-hidden border-2" style={{ borderColor: "#8B5CF6" }}>
                <div className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold" style={{ background: DASH_GRADIENT }}>
                  <Code2 size={13} /> Lesson Code Lab
                </div>
                <div className="p-3 bg-white">
                  <CodeRunner
                    title="Your first Python command"
                    initialCode={labCode}
                    minHeight={220}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Summary tab ---------------- */}
          {activeTab === "summary" && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold mb-3" style={{ color: "#8B5CF6" }}>
                <ClipboardList size={13} /> Lesson Summary
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-[#241B4E] mb-1">Lesson Notes</p>
                  <p className="text-[10px] text-slate-400 mb-3">Key concepts, topics & common mistakes — bundled PDF</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-[#241B4E] hover:bg-slate-50">
                      <Eye size={11} /> Preview
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white hover:opacity-90"
                      style={{ background: DASH_GRADIENT }}
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-[#241B4E] mb-1">Exercise Solutions</p>
                  <p className="text-[10px] text-slate-400 mb-3">Step-by-step solutions with code examples — bundled PDF</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-[#241B4E] hover:bg-slate-50">
                      <Eye size={11} /> Preview
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white hover:opacity-90"
                      style={{ background: DASH_GRADIENT }}
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "#E5D4FF", backgroundColor: "#F5EEFF" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "#8B5CF6" }}>✨ What You Learned Today</p>
                <ul className="space-y-1.5 mb-4">
                  {lesson.whatYouLearned?.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-green-500 mt-0.5">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: "#8B5CF6" }}>UP NEXT</p>
                    <p className="text-xs font-semibold text-[#241B4E]">{lesson.nextLesson?.title}</p>
                  </div>
                  <button
                    onClick={() => lesson.nextLesson?.path && navigate(lesson.nextLesson.path)}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-white hover:opacity-90 flex items-center gap-1.5"
                    style={{ background: DASH_GRADIENT }}
                  >
                    Continue <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Mark Complete tab ---------------- */}
          {activeTab === "complete" && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold mb-3" style={{ color: "#8B5CF6" }}>
                <CheckCircle2 size={13} /> Mark Complete
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-4 mb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-500">Exercise Progress</span>
                  <span className="font-bold text-[#241B4E]">0 of {lesson.exercises?.length ?? 0} done</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 w-0 rounded-full" style={{ background: DASH_GRADIENT }} />
                </div>
              </div>

              <div className="rounded-xl border p-4 mb-4" style={{ borderColor: "#FDE68A", backgroundColor: "#FFFBEB" }}>
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
                  <AlertTriangle size={13} /> Exercises not finished yet
                </p>
                <p className="text-[11px] text-amber-700 mb-3">
                  You have {lesson.exercises?.length ?? 0} exercises left. Head to the Practice tab to finish them, or skip
                  and mark complete now — you can always come back.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("practice")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#241B4E] hover:bg-slate-50"
                  >
                    Go back and try it
                  </button>
                  <button
                    className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90"
                    style={{ background: DASH_GRADIENT }}
                  >
                    Skip & mark complete
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-4 mb-3" style={{ borderColor: "#E5D4FF", backgroundColor: "#F5EEFF" }}>
                <p className="text-[10px] font-bold" style={{ color: "#8B5CF6" }}>COMING UP</p>
                <p className="text-xs font-semibold text-[#241B4E]">{lesson.nextLesson?.title}</p>
                <p className="text-[10px] text-slate-500">{lesson.nextLesson?.duration}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "#F5EEFF" }}>
                    <Code2 size={15} style={{ color: "#8B5CF6" }} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#241B4E]">Python Playground</p>
                    <p className="text-[10px] text-slate-400">Experiment with more code examples</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/playground")}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}