import React, { useEffect, useState } from "react";
import CodeRunner from "../components/CodeRunner";
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
import { getCurrentUser, authFetch } from "../utils/auth";
import { API_URL } from "../config";
import { getCourses, getCourseStatuses } from "../services/api";

const STATUS_STYLE = {
  "Not Started": "bg-slate-100 text-slate-500",
  "In Progress": "bg-amber-50 text-amber-600",
  Completed: "bg-green-50 text-green-600",
};
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const DASH_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const FEATURES = [
  {
    icon: Video,
    title: "Bite-Sized Lessons",
    description:
      "Short, focused videos that explain one idea at a time — nothing overwhelming, nothing boring.",
    colorIndex: 2,
  },
  {
    icon: Gamepad2,
    title: "Learn by Building",
    description:
      "Every concept turns into a real project, not just a quiz — you learn Python by actually using it.",
    colorIndex: 4,
  },
  {
    icon: ListChecks,
    title: "One Clear Path",
    description:
      "Courses build on each other in order, so you always know exactly what's next.",
    colorIndex: 5,
  },
];

const TESTIMONIALS = [
  {
    name: "Arjan P.",
    age: "Age 10 · Bengaluru",
    quote: "Finished it in a month — genuinely fun, never boring.",
  },
  {
    name: "Dhruv A.",
    age: "Age 9 · Mumbai",
    quote:
      "Used what I learned here for my school science fair project.",
  },
  {
    name: "Advait K.",
    age: "Age 11 · Pune",
    quote:
      "The turtle drawing lessons are incredible — I made a spiral galaxy.",
  },
  {
    name: "Krish S.",
    age: "Age 8 · Delhi",
    quote:
      "My first real 'aha' moment was building a calculator that actually works.",
  },
  {
    name: "Shaurya B.",
    age: "Age 12 · Chennai",
    quote:
      "Building a quiz app for my whole school — my teacher wants to use it!",
  },
  {
    name: "Kabir R.",
    age: "Age 10 · Jaipur",
    quote:
      "My friends think I'm a coding wizard now. I just tell them to keep going.",
  },
  {
    name: "Arnav M.",
    age: "Age 9 · Hyderabad",
    quote:
      "Every lesson builds on the last — it just makes sense to me.",
  },
  {
    name: "Reyansh G.",
    age: "Age 11 · Kolkata",
    quote:
      "My dad codes for work now we code together on weekends.",
  },
  {
    name: "Viaan K.",
    age: "Age 10 · Indore",
    quote:
      "The lessons are short but they pack a punch, even in 20 minutes.",
  },
  {
    name: "Ananya S.",
    age: "Age 9 · Ahmedabad",
    quote:
      "It explains things step by step — even the hard parts feel easy.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // COURSE STATE
  // =========================

  const [courses, setCourses] = useState([]);
  const [hidePhoneBar, setHidePhoneBar] = useState(() => {
    try {
      return localStorage.getItem("hidePhoneBar") === "1";
    } catch {
      return false;
    }
  });
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseStatuses, setCourseStatuses] = useState({});
  const [dashboardProgress, setDashboardProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // =========================
  // CURRENT USER
  // =========================

  const user = getCurrentUser() || {
    name: "Guest",
    email: "Not signed in",
  };

  const firstName = user.name.split(" ")[0];

  const userId =
    user.id ||
    user._id ||
    user.userId ||
    "";

  // =========================
  // FETCH COURSES
  // =========================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);

        const data = await getCourses();

        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // =========================
  // FETCH COURSE STATUSES
  // =========================

  useEffect(() => {
    if (!userId) {
      setCourseStatuses({});
      return;
    }

    getCourseStatuses(userId)
      .then((data) => setCourseStatuses(data.statuses || {}))
      .catch((error) =>
        console.error("Error fetching course statuses:", error)
      );
  }, [userId]);

  // =========================
  // FETCH LEARNING PROGRESS
  // =========================

  useEffect(() => {
    const fetchDashboardProgress = async () => {
      if (!userId) {
        setDashboardProgress(null);
        setLoadingProgress(false);
        return;
      }

      try {
        setLoadingProgress(true);

        const response = await authFetch(
          `${API_URL}/progress/${userId}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch dashboard progress"
          );
        }

        const data = await response.json();

        setDashboardProgress(data?.data || data || null);
      } catch (error) {
        console.error(
          "Error fetching dashboard progress:",
          error
        );
        setDashboardProgress(null);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchDashboardProgress();
  }, [userId]);

  // =========================
  // LEARNING PROGRESS DATA
  // =========================

  const continueLearning =
    dashboardProgress?.continueLearning || null;

  const learningStreak =
    dashboardProgress?.streak ??
    continueLearning?.streak ??
    0;

  const currentCourse =
    continueLearning?.courseId
      ? continueLearning
      : null;

  const hasProgress =
    Number(continueLearning?.progress || 0) > 0;

  const handleContinueLearning = () => {
    if (!currentCourse?.courseId) {
      if (courses.length > 0 && courses[0]?.courseId) {
        navigate(`/courses/${courses[0].courseId}`);
      } else {
        navigate("/courses");
      }
      return;
    }

    if (
      hasProgress &&
      currentCourse.currentLessonId
    ) {
      navigate(
        `/lesson/${currentCourse.currentLessonId}`
      );
      return;
    }

    navigate(
      `/courses/${currentCourse.courseId}`
    );
  };

  // =========================
  // CERTIFICATE COURSE
  // =========================

  const certificateCourse = courses[0];

  const handleStartCertificate = () => {
    if (!certificateCourse?.courseId) return;

    navigate(`/courses/${certificateCourse.courseId}`);
  };

  return (
    <AppLayout active="dashboard">

      {/* =========================
          SECURE ACCOUNT BAR
      ========================= */}

      {!user.phone && !hidePhoneBar && (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-6 py-2.5 border-b border-slate-200 text-xs">
        <span className="flex items-center gap-2 text-slate-500">
          🔒 Secure your account: add a phone number to enable OTP sign-in from any device.
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg px-3 py-1.5 font-semibold text-white hover:opacity-90"
            style={{ background: DASH_GRADIENT }}
          >
            Add Phone
          </button>

          <button
            onClick={() => {
              setHidePhoneBar(true);
              try {
                localStorage.setItem("hidePhoneBar", "1");
              } catch {}
            }}
            aria-label="Dismiss"
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      )}

      {/* =========================
    WELCOME
========================= */}

<div
  className="flex flex-wrap items-center justify-between gap-4 px-6 py-6"
  style={{ backgroundColor: "#F5EEFF" }}
>
  <div>
    <div className="flex items-center gap-2 flex-wrap">

      <h1 className="text-xl font-extrabold text-[#241B4E]">
        Hey, {firstName}! 👋
      </h1>

      <span
        className="rounded-full bg-white border px-2 py-0.5 text-[10px] font-bold"
        style={{
          borderColor: PALETTE[4].border,
          color: PALETTE[4].text,
        }}
      >
        🔥 {learningStreak}-day streak
      </span>

    </div>

    <p className="text-slate-500 mt-1">
      Pick up right where you left off — or start something new.
    </p>

    {/* Dynamic Current Course Progress */}
    {currentCourse && (
      <div className="mt-3 w-full max-w-md">

        <div className="flex items-center justify-between text-xs">

          <span className="font-semibold text-slate-600">
            {currentCourse.courseTitle}
          </span>

          <span className="font-bold text-orange-500">
            {currentCourse.completedLessons || 0}/
            {currentCourse.totalLessons || 0}
            {" · "}
            {currentCourse.progress || 0}%
          </span>

        </div>

        <div className="mt-1 h-1.5 w-full rounded-full bg-orange-100">

          <div
            className="h-1.5 rounded-full bg-orange-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  Number(currentCourse.progress || 0)
                )
              )}%`,
            }}
          />

        </div>

      </div>
    )}

  </div>

  <div className="flex items-center gap-3">

    <button
      onClick={handleContinueLearning}
      disabled={loadingProgress}
      className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: DASH_GRADIENT }}
    >
      <Play size={14} />

      {hasProgress
        ? "Resume"
        : "Continue Learning"}
    </button>

    <button
      onClick={() => navigate("/playground")}
      className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#241B4E] hover:bg-slate-50 flex items-center gap-2"
    >
      <Code2 size={14} />
      Playground
    </button>

  </div>
</div>
      {/* =========================
          PLAYGROUND PREVIEW
      ========================= */}

      <section className="px-6 py-8">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">
          Give This a Try Right Now
        </h2>

        <CodeRunner
          initialCode={`# Welcome to Python! Let's talk about variables.

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
        />

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/playground")}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            style={{ background: DASH_GRADIENT }}
          >
            Open Full Playground →
          </button>

          <p className="mt-2 text-xs text-slate-400">
            Run the snippet above, or head to the full playground for more room
            to experiment.
          </p>
        </div>
      </section>

      {/* =========================
          LEARNING PATH
      ========================= */}

      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-[#241B4E]">
            Your Learning Path
          </h2>

          <button
            onClick={() => navigate("/courses")}
            className="text-xs font-semibold"
            style={{ color: "#8B5CF6" }}
          >
            View All Courses →
          </button>
        </div>

        {/* Loading */}
        {loadingCourses ? (
          <div className="rounded-xl border-2 border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              Loading courses...
            </p>
          </div>
        ) : courses.length === 0 ? (
          /* No Courses */
          <div className="rounded-xl border-2 border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              No courses available.
            </p>
          </div>
        ) : (
          /* Courses */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((c, index) => {

              // Give cards different border colors
              // while keeping the original design.
              const colorIndexes = [4, 2, 5];

              const clr =
                PALETTE[
                  colorIndexes[index % colorIndexes.length]
                ];

              return (
                <div
                  key={c.courseId}
                  className="rounded-xl border-2 bg-white overflow-hidden flex flex-col"
                  style={{ borderColor: clr.border }}
                >
                  <div className="p-4 flex-1">

                    {/* Course Header */}
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">
                        {c.title?.toLowerCase().includes("python")
                          ? "🐍"
                          : c.title?.toLowerCase().includes("web")
                          ? "</>"
                          : "💻"}
                      </span>

                      <div className="flex gap-1">

                        {/* Premium / Free */}
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{
                            backgroundColor: clr.bg,
                            color: clr.text,
                          }}
                        >
                          {c.premium ? "Premium" : "Free"}
                        </span>

                        {/* Level */}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                          {c.level}
                        </span>
                      </div>
                    </div>

                    {/* Course Status */}
                    <span
                      className={`mt-2 inline-block rounded px-2 py-0.5 text-[9px] font-semibold ${
                        STATUS_STYLE[courseStatuses[c.courseId]?.status] ||
                        STATUS_STYLE["Not Started"]
                      }`}
                    >
                      {courseStatuses[c.courseId]?.status || "Not Started"}
                    </span>

                    {/* Course Title */}
                    <h3 className="mt-2 font-bold text-[#241B4E]">
                      {c.title}
                    </h3>

                    {/* Course Description */}
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Course Information */}
                    <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400">

                      <span>
                        📘 {c.lessonsCount || 0} Lessons
                      </span>

                      <span>
                        📁 {c.projectsCount || 0} Projects
                      </span>

                      <span>
                        ⏱ {c.hours || 0}h est.
                      </span>

                    </div>
                  </div>

                  {/* Start Course */}
                  <button
                    onClick={() =>
                      navigate(`/courses/${c.courseId}`)
                    }
                    className="px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
                    style={{ background: DASH_GRADIENT }}
                  >
                    ▶ Start Free Lesson
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================
          WHY IT ACTUALLY STICKS
      ========================= */}

      <section className="px-6 py-6">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">
          Why It Actually Sticks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(
            ({ icon: Icon, title, description, colorIndex }) => {
              const clr = PALETTE[colorIndex];

              return (
                <div
                  key={title}
                  className="rounded-xl border-2 bg-white p-4"
                  style={{ borderColor: clr.border }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg mb-2"
                    style={{
                      backgroundColor: clr.bg,
                      color: clr.text,
                    }}
                  >
                    <Icon size={16} />
                  </span>

                  <h3 className="font-bold text-[#241B4E]">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* =========================
          CERTIFICATE SECTION
      ========================= */}

      <section className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Certificate Preview */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm rounded-xl border-4 p-5 text-center shadow-md"
              style={{
                borderColor: "#8B5CF6",
                backgroundColor: "#F5EEFF",
              }}
            >
              <p
                className="text-[10px] font-bold"
                style={{ color: "#8B5CF6" }}
              >
                CodeVista
              </p>

              <p className="mt-1 text-[9px] tracking-wide text-slate-400">
                CERTIFICATE OF COMPLETION
              </p>

              <p className="mt-4 text-[9px] text-slate-400">
                This certificate is proudly presented to
              </p>

              <p
                className="mt-1 text-lg font-bold text-[#241B4E]"
                style={{ fontFamily: "cursive" }}
              >
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

          {/* Certificate Information */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs"
                style={{ background: DASH_GRADIENT }}
              >
                🏆
              </span>

              <h2 className="text-lg font-extrabold text-[#241B4E]">
                Earn Your Certificate
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Finish the courses and walk away with an official{" "}
              <span
                className="font-semibold"
                style={{ color: "#8B5CF6" }}
              >
                Certified Code Builder
              </span>{" "}
              certificate — something real to show friends, family,
              and teachers.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold text-[#241B4E] mb-2">
                What gets you there:
              </p>

              <ul className="space-y-1.5 text-xs text-slate-500">

                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  The fundamentals: variables, conditionals, loops,
                  functions
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Problem-solving through real coding challenges
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Building your own games and interactive programs
                </li>

              </ul>
            </div>

            <div
              className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3"
              style={{ backgroundColor: "#EAF8FE" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(139,92,246,0.12)",
                  color: "#8B5CF6",
                }}
              >
                🎖
              </span>

              <div>
                <p className="text-xs font-bold text-[#241B4E]">
                  A badge worth showing off
                </p>

                <p className="text-[10px] text-slate-500">
                  Displays right on your profile once you earn it
                </p>
              </div>
            </div>

            <button
              onClick={handleStartCertificate}
              disabled={!certificateCourse?.courseId}
              className="mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: DASH_GRADIENT }}
            >
              ▶ Start Earning Your Certificate
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          TESTIMONIALS
      ========================= */}

      <section className="px-6 py-8 pb-16">
        <h2 className="text-lg font-extrabold text-[#241B4E] mb-3">
          What Other Kids Say
        </h2>

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
                  <p className="text-xs font-bold text-[#241B4E]">
                    {t.name}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {t.age}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          MEET OUR FOUNDERS
          Currently commented out
      ========================= */}

      {/*
      <section
        className="px-6 py-16"
        style={{ backgroundColor: "#F5EEFF" }}
      >
        <div className="mx-auto max-w-3xl text-center">

          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold"
            style={{ color: "#8B5CF6" }}
          >
            ✦ HOW IT STARTED
          </span>

          <h2 className="mt-2 text-3xl font-extrabold text-[#241B4E]">
            The Team Behind CodeVista
          </h2>

          <p className="mt-2 text-slate-500">
            A teacher and an engineer who thought coding class could
            be a lot less boring.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">

            <div className="flex flex-col sm:flex-row gap-6">

              <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-xs overflow-hidden">
                Photo
              </div>

              <div>

                <h3 className="text-xl font-extrabold text-[#241B4E]">
                  Meera Iyer &amp; Rohan Fernandes
                </h3>

                <p
                  className="text-sm font-semibold"
                  style={{ color: "#8B5CF6" }}
                >
                  Co-Founders
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {[
                    "👩‍🏫 Former Middle School Teacher",
                    "👨‍💻 Ex-Software Engineer",
                    "🏫 8 Years in EdTech",
                    "🇮🇳 Built &amp; Based in India",
                  ].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border px-3 py-1 text-[10px] font-semibold"
                      style={{
                        borderColor: "rgba(139,92,246,0.3)",
                        backgroundColor: "#F5EEFF",
                        color: "#8B5CF6",
                      }}
                    >
                      {label}
                    </span>
                  ))}

                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">

              <p>
                Meera spent eight years teaching computer science to
                middle schoolers before she ever wrote a line of code
                professionally. Rohan spent a decade writing code
                professionally before he ever taught anyone. Between
                the two of them, they'd seen both sides of the same
                problem.
              </p>

              <p>
                Most coding platforms for kids were built by people
                who'd never actually stood in front of a classroom of
                restless 10-year-olds. They were technically correct
                and completely unengaging — Meera watched kids' eyes
                glaze over every single week.
              </p>

              <p>
                So they built CodeVista together: Rohan handled the
                technical foundation, Meera made sure every lesson
                actually made sense to a kid hearing the concept for
                the first time. Neither part works without the other.
              </p>

              <p>
                The goal was never to make coding look impressive. It
                was to make it feel doable — one small win at a time,
                until a kid stops asking "can I do this?" and starts
                asking "what's next?"
              </p>

              <p
                className="font-semibold"
                style={{ color: "#8B5CF6" }}
              >
                Glad you're here. — Meera &amp; Rohan
              </p>

            </div>

            <div className="mt-6 text-center">

              <p className="text-xs text-slate-400">
                No downloads &nbsp;·&nbsp; No setup &nbsp;·&nbsp;
                Works on any device &nbsp;·&nbsp; Built by educators
              </p>

              <button
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: DASH_GRADIENT }}
              >
                🚀 Pick Up Where You Left Off
              </button>

            </div>
          </div>
        </div>
      </section>
      */}

    </AppLayout>
  );
}