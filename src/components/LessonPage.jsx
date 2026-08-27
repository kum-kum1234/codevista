import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getLesson } from "../services/api";

const DASH_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = [
  { key: "watch", label: "Watch", icon: Video },
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "practice", label: "Practice", icon: Dumbbell },
  { key: "summary", label: "Summary", icon: ClipboardList },
  { key: "complete", label: "Mark Complete", icon: CheckCircle2 },
];

/* Convert YouTube watch URL into an embeddable URL */
function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const videoUrl = new URL(url);

    // Normal YouTube URL
    if (videoUrl.hostname.includes("youtube.com")) {
      const videoId = videoUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Short YouTube URL
    if (videoUrl.hostname === "youtu.be") {
      const videoId = videoUrl.pathname.substring(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return "";
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
    return "";
  }
}

function CodeBlock({ code, onOpenInLab }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between bg-[#12102A] px-3 py-1.5">
        <span className="text-[10px] font-semibold text-slate-400">
          python
        </span>

        <div className="flex items-center gap-2">
          {onOpenInLab && (
            <button
              onClick={() => onOpenInLab(code)}
              className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold text-white hover:opacity-90"
              style={{ background: DASH_GRADIENT }}
            >
              <Code2 size={11} />
              Code Lab
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

/*
 * The same exercise data is used in both Learn and Practice.
 * completedExercises comes from LessonPage so an exercise
 * becomes Passed immediately after successful execution.
 */
function ExerciseList({
  exercises = [],
  onOpenInLab,
  fallbackCode = "",
  completedExercises = [],
}) {
  if (!exercises.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-400">
          No practice exercises have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
      {exercises.map((ex, i) => {
        const exerciseTitle =
          ex.title || `Exercise ${i + 1}`;

        const exerciseId =
          ex.id || ex.exerciseId || i;

        const isCompleted =
          ex.completed ||
          completedExercises.includes(exerciseId);

        const exerciseCode =
          ex.code ||
          ex.starterCode ||
          fallbackCode;

        return (
          <div
            key={exerciseId}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#241B4E]">
                {exerciseTitle}
              </p>

              {ex.description && (
                <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
                  {ex.description}
                </p>
              )}

              <p
                className={`mt-1 text-[10px] font-semibold ${
                  isCompleted
                    ? "text-green-500"
                    : "text-slate-400"
                }`}
              >
                {isCompleted ? "Passed ✓" : "Not started"}
              </p>
            </div>

            <button
              onClick={() =>
                onOpenInLab(
                  exerciseCode,
                  exerciseId
                )
              }
              className="shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white hover:opacity-90 flex items-center gap-1"
              style={{ background: DASH_GRADIENT }}
            >
              <ExternalLink size={11} />
              Open in Code Lab
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function LessonPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("watch");

  const [labCode, setLabCode] = useState("");

  /*
   * Stores the ID of the exercise currently opened
   * inside Code Lab.
   */
  const [activeExerciseId, setActiveExerciseId] =
    useState(null);

  /*
   * Stores IDs of exercises successfully executed.
   */
  const [completedExercises, setCompletedExercises] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const labRef = useRef(null);

  const clr = PALETTE[4];

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getLesson(lessonId);

        setLesson(response.lesson);

        setLabCode(
          response.lesson?.codeLab?.initialCode || ""
        );

        /*
         * Load exercises already marked completed by backend.
         */
        const backendCompleted =
          (response.lesson?.exercises || [])
            .filter((exercise) => exercise.completed)
            .map(
              (exercise, index) =>
                exercise.id ||
                exercise.exerciseId ||
                index
            );

        setCompletedExercises(backendCompleted);
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  /*
   * Open a specific exercise in Code Lab.
   */
  function openInLab(code, exerciseId = null) {
    setLabCode(code || "");
    setActiveExerciseId(exerciseId);
    setActiveTab("practice");

    setTimeout(() => {
      labRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  /*
   * Called by CodeRunner when the currently selected
   * exercise runs successfully.
   */
  function markExerciseComplete() {
    if (activeExerciseId === null) {
      return;
    }

    setCompletedExercises((prev) => {
      if (prev.includes(activeExerciseId)) {
        return prev;
      }

      return [...prev, activeExerciseId];
    });
  }

  /*
   * Open a PDF in a new browser tab.
   */
  function openPdf(url) {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /*
   * Download a PDF.
   */
  async function downloadPdf(url, filename) {
    if (!url) return;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("PDF download failed");
      }

      const blob = await response.blob();
      const blobUrl =
        window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("PDF download failed:", error);

      /*
       * Cross-origin PDF servers may block fetch().
       * Open the PDF normally so the learner can
       * still view/save it from the browser.
       */
      openPdf(url);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading lesson...
        </p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            {error || "Lesson not found."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 rounded-lg px-4 py-2 text-xs font-semibold text-white"
            style={{ background: DASH_GRADIENT }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalExercises =
    lesson.exercises?.length || 0;

  const completedCount =
    completedExercises.length;

  const exerciseProgress =
    totalExercises > 0
      ? Math.min(
          100,
          Math.round(
            (completedCount / totalExercises) * 100
          )
        )
      : 0;

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
              <ChevronLeft size={13} />
              Back to Lessons
            </button>

            <span className="text-slate-300">
              /
            </span>

            <span
              className="font-semibold"
              style={{ color: "#8B5CF6" }}
            >
              {lesson.courseName || lesson.courseId}
            </span>

            <span className="text-slate-300">
              /
            </span>

            <span className="font-semibold text-[#241B4E]">
              {lesson.title}
            </span>
          </div>

          <span className="font-bold text-[#241B4E]">
            {lesson.progressPercent ?? exerciseProgress}%
          </span>
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
                  ? {
                      backgroundColor: clr.bg,
                      color: clr.text,
                      border: `1px solid ${clr.border}`,
                    }
                  : {
                      color: "#94A3B8",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6">

          {/* Free preview banner */}
          <div
            className="flex items-center justify-between rounded-lg px-4 py-2 text-white text-xs font-semibold mb-4"
            style={{ background: DASH_GRADIENT }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} />
              Free Preview — Lesson 1 only
            </span>

            <button className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] hover:bg-white/30">
              Unlock All — ₹1,499
            </button>
          </div>

          {/* Lesson header card */}
          <div
            className="rounded-xl border p-4 mb-4"
            style={{
              borderColor: clr.border,
              backgroundColor: clr.bg,
            }}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p
                  className="text-[10px] font-bold"
                  style={{ color: clr.text }}
                >
                  {lesson.courseName || lesson.courseId}
                </p>

                <h1 className="text-base font-extrabold text-[#241B4E] mt-0.5">
                  {lesson.title}
                </h1>

                <p className="mt-1 text-xs text-slate-500 max-w-md leading-relaxed">
                  {lesson.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">
                    ⏱ {lesson.duration}
                  </span>

                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">
                    🎬 Video
                  </span>

                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5">
                    📝 Exercise
                  </span>
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
              <p
                className="flex items-center gap-1.5 text-xs font-bold mb-2"
                style={{ color: "#8B5CF6" }}
              >
                <Video size={13} />
                Watch the Lesson
              </p>

              <div
                className="rounded-xl overflow-hidden border-4"
                style={{
                  borderImage: `${DASH_GRADIENT} 1`,
                }}
              >
                {getYouTubeEmbedUrl(lesson.video?.url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(
                      lesson.video.url
                    )}
                    title={
                      lesson.video?.caption ||
                      lesson.title
                    }
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : lesson.video?.thumbnail ? (
                  <img
                    src={lesson.video.thumbnail}
                    alt={lesson.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-video flex items-center justify-center text-white text-sm font-semibold"
                    style={{
                      background: DASH_GRADIENT,
                    }}
                  >
                    ▶ Video preview
                  </div>
                )}

                <div className="bg-white px-3 py-2 text-xs font-semibold text-[#241B4E]">
                  {lesson.video?.caption}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Learn tab ---------------- */}
          {activeTab === "learn" && (
            <div>
              <p
                className="flex items-center gap-1.5 text-xs font-bold mb-3"
                style={{ color: "#8B5CF6" }}
              >
                <BookOpen size={13} />
                Lesson Content
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">
                  {lesson.title}
                </h2>

                {lesson.learn?.map((block, i) => {
                  if (
                    block.type === "heading" ||
                    block.type === "h3"
                  ) {
                    return (
                      <h3
                        key={i}
                        className="mt-5 mb-2 text-lg font-extrabold text-[#241B4E]"
                        style={{
                          borderLeft:
                            "3px solid #F43F5E",
                          paddingLeft: "8px",
                        }}
                      >
                        {block.title || block.text}
                      </h3>
                    );
                  }

                  if (block.type === "subheading") {
                    return (
                      <h4
                        key={i}
                        className="mt-4 mb-2 text-sm font-extrabold"
                        style={{ color: "#F97316" }}
                      >
                        {block.title || block.text}
                      </h4>
                    );
                  }

                  if (
                    block.type === "paragraph" ||
                    block.type === "p"
                  ) {
                    return (
                      <p
                        key={i}
                        className="text-sm text-slate-600 leading-relaxed mb-3"
                      >
                        {block.content || block.text}
                      </p>
                    );
                  }

                  if (
                    block.type === "points" ||
                    block.type === "callouts"
                  ) {
                    return (
                      <div
                        key={i}
                        className="space-y-2 mb-4"
                      >
                        {(block.items || []).map(
                          (item, j) => (
                            <div
                              key={j}
                              className="rounded-lg px-3 py-2 text-xs text-slate-600"
                              style={{
                                backgroundColor:
                                  PALETTE[2].bg,
                              }}
                            >
                              → {item}
                            </div>
                          )
                        )}
                      </div>
                    );
                  }

                  if (block.type === "code") {
                    return (
                      <div key={i} className="mb-3">
                        <CodeBlock
                          code={block.code || ""}
                          onOpenInLab={openInLab}
                        />
                      </div>
                    );
                  }

                  if (block.type === "output") {
                    return (
                      <div key={i} className="mb-3">
                        <OutputBlock
                          text={
                            block.content ||
                            block.text ||
                            ""
                          }
                        />
                      </div>
                    );
                  }

                  if (
                    block.type ===
                      "numberedPoints" ||
                    block.type === "numbered"
                  ) {
                    return (
                      <div
                        key={i}
                        className="space-y-2 mb-4"
                      >
                        {(block.items || []).map(
                          (item, j) => (
                            <div
                              key={j}
                              className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs text-slate-600"
                              style={{
                                backgroundColor:
                                  "#FFF1EC",
                              }}
                            >
                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white mt-0.5"
                                style={{
                                  background:
                                    "#F97316",
                                }}
                              >
                                {j + 1}
                              </span>

                              <span>{item}</span>
                            </div>
                          )
                        )}
                      </div>
                    );
                  }

                  if (block.type === "mistake") {
                    return (
                      <div key={i} className="mb-3">
                        <p
                          className="text-xs font-bold mb-1.5"
                          style={{
                            color: "#F97316",
                          }}
                        >
                          {block.title}
                        </p>

                        <CodeBlock
                          code={block.code || ""}
                          onOpenInLab={openInLab}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Same exercises as Practice tab */}
              <div className="mt-6">
                <p
                  className="flex items-center gap-1.5 text-xs font-bold mb-3"
                  style={{ color: "#8B5CF6" }}
                >
                  <Dumbbell size={13} />
                  Practice: Test What You Learned
                </p>

                <ExerciseList
                  exercises={lesson.exercises || []}
                  onOpenInLab={openInLab}
                  fallbackCode={
                    lesson.codeLab?.initialCode || ""
                  }
                  completedExercises={
                    completedExercises
                  }
                />
              </div>
            </div>
          )}

          {/* ---------------- Practice tab ---------------- */}
          {activeTab === "practice" && (
            <div>
              <p
                className="flex items-center gap-1.5 text-xs font-bold mb-3"
                style={{ color: "#8B5CF6" }}
              >
                <Dumbbell size={13} />
                Practice Exercises
              </p>

              <ExerciseList
                exercises={lesson.exercises || []}
                onOpenInLab={openInLab}
                fallbackCode={
                  lesson.codeLab?.initialCode || ""
                }
                completedExercises={
                  completedExercises
                }
              />

              <div
                ref={labRef}
                className="mt-6 rounded-xl overflow-hidden border-2"
                style={{ borderColor: "#8B5CF6" }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold"
                  style={{ background: DASH_GRADIENT }}
                >
                  <Code2 size={13} />
                  {activeExerciseId !== null
                    ? "Practice Code Lab"
                    : lesson.codeLab?.title ||
                      "Lesson Code Lab"}
                </div>

                <div className="p-3 bg-white">
                  <CodeRunner
                    key={
                      activeExerciseId ??
                      "lesson-lab"
                    }
                    title={
                      activeExerciseId !== null
                        ? lesson.exercises?.find(
                            (ex, index) =>
                              (ex.id ||
                                ex.exerciseId ||
                                index) ===
                              activeExerciseId
                          )?.title ||
                          "Practice Exercise"
                        : lesson.codeLab?.title ||
                          lesson.title
                    }
                    initialCode={labCode}
                    minHeight={220}
                    onRunSuccess={
                      markExerciseComplete
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Summary tab ---------------- */}
          {activeTab === "summary" && (
            <div>
              <p
                className="flex items-center gap-1.5 text-xs font-bold mb-3"
                style={{ color: "#8B5CF6" }}
              >
                <ClipboardList size={13} />
                Lesson Summary
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                {/* Lesson Notes */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-[#241B4E] mb-1">
                    Lesson Notes
                  </p>

                  <p className="text-[10px] text-slate-400 mb-3">
                    Key concepts, topics & common mistakes — bundled PDF
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        openPdf(
                          lesson.summary?.notesPdfUrl
                        )
                      }
                      disabled={
                        !lesson.summary?.notesPdfUrl
                      }
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-[#241B4E] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye size={11} />
                      Preview
                    </button>

                    <button
                      onClick={() =>
                        downloadPdf(
                          lesson.summary?.notesPdfUrl,
                          `${lesson.lessonId}-notes.pdf`
                        )
                      }
                      disabled={
                        !lesson.summary?.notesPdfUrl
                      }
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          DASH_GRADIENT,
                      }}
                    >
                      <Download size={11} />
                      Download
                    </button>
                  </div>
                </div>

                {/* Exercise Solutions */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-[#241B4E] mb-1">
                    Exercise Solutions
                  </p>

                  <p className="text-[10px] text-slate-400 mb-3">
                    Step-by-step solutions with code examples — bundled PDF
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        openPdf(
                          lesson.summary
                            ?.solutionsPdfUrl
                        )
                      }
                      disabled={
                        !lesson.summary
                          ?.solutionsPdfUrl
                      }
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-[#241B4E] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye size={11} />
                      Preview
                    </button>

                    <button
                      onClick={() =>
                        downloadPdf(
                          lesson.summary
                            ?.solutionsPdfUrl,
                          `${lesson.lessonId}-solutions.pdf`
                        )
                      }
                      disabled={
                        !lesson.summary
                          ?.solutionsPdfUrl
                      }
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          DASH_GRADIENT,
                      }}
                    >
                      <Download size={11} />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* What You Learned */}
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: "#E5D4FF",
                  backgroundColor: "#F5EEFF",
                }}
              >
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: "#8B5CF6" }}
                >
                  ✨ What You Learned Today
                </p>

                <ul className="space-y-1.5 mb-4">
                  {lesson.whatYouLearned?.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-1.5 text-xs text-slate-600"
                      >
                        <span className="text-green-500 mt-0.5">
                          ✓
                        </span>
                        {item}
                      </li>
                    )
                  )}
                </ul>

                {/* Up Next */}
                {lesson.nextLesson?.title && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-[10px] font-bold"
                        style={{
                          color: "#8B5CF6",
                        }}
                      >
                        UP NEXT
                      </p>

                      <p className="text-xs font-semibold text-[#241B4E]">
                        {lesson.nextLesson.title}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        lesson.nextLesson?.path &&
                        navigate(
                          lesson.nextLesson.path
                        )
                      }
                      className="rounded-lg px-4 py-2 text-xs font-bold text-white hover:opacity-90 flex items-center gap-1.5"
                      style={{
                        background:
                          DASH_GRADIENT,
                      }}
                    >
                      Continue
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- Mark Complete tab ---------------- */}
          {activeTab === "complete" && (
            <div>
              <p
                className="flex items-center gap-1.5 text-xs font-bold mb-3"
                style={{ color: "#8B5CF6" }}
              >
                <CheckCircle2 size={13} />
                Mark Complete
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-4 mb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-500">
                    Exercise Progress
                  </span>

                  <span className="font-bold text-[#241B4E]">
                    {completedCount} of{" "}
                    {totalExercises} done
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${exerciseProgress}%`,
                      background:
                        DASH_GRADIENT,
                    }}
                  />
                </div>
              </div>

              <div
                className="rounded-xl border p-4 mb-4"
                style={{
                  borderColor: "#FDE68A",
                  backgroundColor: "#FFFBEB",
                }}
              >
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
                  <AlertTriangle size={13} />
                  Exercises not finished yet
                </p>

                <p className="text-[11px] text-amber-700 mb-3">
                  You have{" "}
                  {Math.max(
                    0,
                    totalExercises -
                      completedCount
                  )}{" "}
                  exercises left. Head to the Practice tab to finish them, or skip and mark complete now — you can always come back.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setActiveTab("practice")
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#241B4E] hover:bg-slate-50"
                  >
                    Go back and try it
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("summary")
                    }
                    className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90"
                    style={{
                      background:
                        DASH_GRADIENT,
                    }}
                  >
                    Skip & mark complete
                  </button>
                </div>
              </div>

              {/* Coming Up */}
              {lesson.nextLesson?.title && (
                <div
                  className="rounded-xl border p-4 mb-3"
                  style={{
                    borderColor: "#E5D4FF",
                    backgroundColor: "#F5EEFF",
                  }}
                >
                  <p
                    className="text-[10px] font-bold"
                    style={{
                      color: "#8B5CF6",
                    }}
                  >
                    COMING UP
                  </p>

                  <p className="text-xs font-semibold text-[#241B4E]">
                    {lesson.nextLesson.title}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    {lesson.nextLesson.duration}
                  </p>
                </div>
              )}

              {/* Python Playground */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        "#F5EEFF",
                    }}
                  >
                    <Code2
                      size={15}
                      style={{
                        color: "#8B5CF6",
                      }}
                    />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-[#241B4E]">
                      Python Playground
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Experiment with more code examples
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/playground")
                  }
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