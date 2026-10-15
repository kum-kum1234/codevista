import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  BookOpen,
  Play,
  Video,
  Code2,
  ArrowLeft,
} from "lucide-react";
import AppLayout from "./AppLayout";
import { PALETTE } from "../theme/playfulPalette";
/*import {
  createCourseCheckoutSession,
  getCoursePurchaseStatus,
} from "../services/api";
*/
const DASH_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

// Map course level to the same PALETTE indices Dashboard uses
const LEVEL_COLOR_INDEX = {
  Beginner: 4,
  Intermediate: 2,
  Advanced: 5,
};

export default function CourseDetailPage({
  active,
  courseId,
  badge = "Premium",
  title,
  description,
  videos,
  lessonCount,
  level,
  whatYoullLearn = [],
  requirements = [],
  lessons = [],
  progress = 0,
  completedLessonIds = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Go back to wherever the user came from (e.g. Dashboard); fall back to
  // the dashboard when the page was opened directly.
  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  const clr =
    PALETTE[LEVEL_COLOR_INDEX[level] ?? 4];

  // =====================================================
  // START FIRST LESSON
  // =====================================================

  const handleStartFirstLesson = () => {
    const firstLesson = lessons[0];

    if (!firstLesson) {
      return;
    }

    if (
      !firstLesson.locked &&
      firstLesson.path
    ) {
      navigate(firstLesson.path);
    }
  };
/*
  // =====================================================
  // COURSE PURCHASE
  // =====================================================

  const handleCoursePurchase = async () => {
    if (coursePaymentLoading) {
      return;
    }

    if (courseAccess) {
      return;
    }

    if (!userId) {
      alert(
        "Please log in before purchasing this course."
      );

      return;
    }

    if (!courseId) {
      alert(
        "Course information is missing."
      );

      return;
    }

    try {
      setCoursePaymentLoading(true);

      const response =
        await createCourseCheckoutSession(
          userId,
          courseId
        );

      if (!response?.url) {
        throw new Error(
          "Stripe checkout could not be created."
        );
      }

      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error(
        "Course payment error:",
        error
      );

      setCoursePaymentLoading(false);

      if (
        error?.code ===
        "COURSE_ALREADY_PURCHASED"
      ) {
        setCourseAccess(true);
        setAccessType("Course Purchase");

        return;
      }

      if (
        error?.code ===
        "ALREADY_PREMIUM"
      ) {
        setCourseAccess(true);
        setAccessType("Premium");

        return;
      }

      alert(
        error?.message ||
          "Unable to start course payment."
      );
    }
  };
*/
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AppLayout active={active}>
      <div className="px-6 py-6">

        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-purple-600"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5"
          style={{
            borderColor: "#F0E6FF",
            backgroundColor: "#F5EEFF",
          }}
        >
          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-lg font-extrabold text-[#241B4E]">
                {title}
              </h1>
          {/*
              <span
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: clr.bg,
                  borderColor: clr.border,
                  color: clr.text,
                }}
              >
                🔒 {badge}
              </span>
*/}
            </div>

            <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
              {description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                <Clock size={12} />
                {videos}
              </span>

              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                <BookOpen size={12} />
                {lessonCount}{" "}
                {lessonCount === 1 ? "lesson" : "lessons"}
              </span>

              <span
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: clr.bg,
                  color: clr.text,
                }}
              >
                {level}
              </span>

            </div>

          </div>

          {/* =================================================
              YOUR ADVENTURE
          ================================================= */}

          <div className="rounded-xl border border-slate-200 bg-white p-3 min-w-[180px]">

            <p className="text-xs font-bold text-[#241B4E]">
              Your Adventure
            </p>

            <p
              className="text-[10px] font-semibold mt-1"
              style={{ color: "#8B5CF6" }}
            >
              PROGRESS
            </p>

            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">

              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${safeProgress}%`,
                  background: DASH_GRADIENT,
                }}
              />

            </div>

            <p className="text-[9px] text-slate-400 mt-1">
              {safeProgress}%
            </p>

            <button
              onClick={handleStartFirstLesson}
              disabled={!lessons[0]?.path}
              title={
                lessons[0]?.path
                  ? undefined
                  : "No lessons available yet"
              }
              className="mt-2 w-full rounded-lg px-3 py-2 text-xs font-semibold text-white hover:opacity-90 flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: DASH_GRADIENT,
              }}
            >
              <Play size={12} />
              Start First Lesson
            </button>

          </div>

        </div>

        {/* =================================================
            CONTENT + SIDEBAR
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =================================================
              COURSE CONTENT
          ================================================= */}

          <div className="lg:col-span-2">

            <h2 className="text-sm font-extrabold text-[#241B4E] mb-3">
              Course Content
            </h2>

            {lessons.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                Lessons for this course are coming soon.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {lessons.map((lesson, i) => {

                // All lessons are free and unlocked
                  const canOpenLesson = true;

                return (
                  <div
                    key={
                      lesson.lessonId ||
                      lesson.title ||
                      i
                    }
                    className={`rounded-xl bg-white p-4 ${
                      i === 0
                        ? "border-2"
                        : "border border-slate-200"
                    }`}
                    style={
                      i === 0
                        ? {
                            borderColor:
                              "#8B5CF6",
                          }
                        : undefined
                    }
                  >

                    {i === 0 && (
                      <span
                        className="inline-block mb-2 rounded px-2 py-0.5 text-[9px] font-bold"
                        style={{
                          backgroundColor:
                            "#F5EEFF",
                          color: "#8B5CF6",
                        }}
                      >
                        Next up
                      </span>
                    )}

                    <div className="flex items-start gap-2">

                      {(
                        <span
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                          style={{
                            background:
                              completedLessonIds.includes(lesson.lessonId)
                                ? "#16A34A"
                                : DASH_GRADIENT,
                          }}
                        >
                          {completedLessonIds.includes(lesson.lessonId)
                            ? "✓"
                            : i + 1}
                        </span>
                      )}

                      <div>

                        <p className="text-xs font-bold text-[#241B4E]">
                          {lesson.title}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                          {lesson.description}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-[9px] text-slate-400">

                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {lesson.duration}
                          </span>

                          <span className="flex items-center gap-1">
                            <Video size={10} />
                            Video
                          </span>

                          <span className="flex items-center gap-1">
                            <Code2 size={10} />
                            Code Lab
                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        canOpenLesson &&
                        lesson.path &&
                        navigate(lesson.path)
                      }
                      disabled={!canOpenLesson}
                      className="mt-3 w-full rounded-lg px-3 py-2 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-90"
                      style={{
                        background:
                          DASH_GRADIENT,
                      }}
                    >
                      {!canOpenLesson ? (
                        <>
                          🔒 Unlock Lesson
                        </>
                      ) : (
                        <>
                          ▶ Start Lesson
                        </>
                      )}
                    </button>

                  </div>
                );
              })}

            </div>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <div className="space-y-4">

            {/* ABOUT COURSE */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <p className="text-xs font-bold text-[#241B4E] mb-2">
                About this Course
              </p>

              <p className="text-[10px] font-bold text-slate-500 mb-1.5">
                What you'll learn
              </p>

              <ul className="space-y-1.5 mb-3">

                {whatYoullLearn.map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-[10px] text-slate-500"
                    >
                      <span className="text-green-500 mt-0.5">
                        ✓
                      </span>

                      {item}
                    </li>
                  )
                )}

              </ul>

              {requirements.length > 0 && (
                <>
                  <p className="text-[10px] font-bold text-slate-500 mb-1.5">
                    Requirements
                  </p>

                  <ul className="space-y-1.5">

                    {requirements.map(
                      (item) => (
                        <li
                          key={item}
                          className="text-[10px] text-slate-500"
                        >
                          • {item}
                        </li>
                      )
                    )}

                  </ul>
                </>
              )}

            </div>

            {/* PREMIUM CONTENT */}
            {/*
            <div
              className="rounded-xl border p-4"
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
                🔒 Premium Content
              </p>

              <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                Try the first lesson free! Subscribe to access all remaining lessons in this course.
              </p>

            </div>
         */}
            {/* TRY FIRST LESSON */}
           {/*
            <button
              onClick={handleStartFirstLesson}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#241B4E] hover:bg-slate-50"
            >
              Try First Lesson Free
            </button>
*/}
            {/* =================================================
                STRIPE COURSE PURCHASE BUTTON
            ================================================= */}
{/*
            <button
              onClick={handleCoursePurchase}
              disabled={
                coursePaymentLoading ||
                courseAccess ||
                accessLoading
              }
              className="w-full rounded-lg px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: DASH_GRADIENT,
              }}
            >
              {coursePaymentLoading
                ? "Opening Stripe..."
                : accessLoading
                ? "Checking Access..."
                : courseAccess
                ? accessType === "Premium"
                  ? "Premium Access Active"
                  : "Full Access Unlocked"
                : "Get Full Access — ₹1,499"}
            </button>
*/}
          </div>

        </div>

      </div>
    </AppLayout>
  );
}