import React, { useEffect, useState } from "react";
import { Search, Video, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import {
  getCourses,
  getAllLessons,
  getCourseStatuses,
} from "../services/api";
import { getCurrentUser } from "../utils/auth";

const COURSES_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

// Icons used only for visual presentation.
// Course information itself comes from the database.
const COURSE_ICONS = ["🐍", "</>", "🎨", "🌐", "💻", "🚀", "🧩", "⭐"];

// Fixed look for the original courses; new courses fall back to
// an icon/color picked by position.
const COURSE_UI = {
  "python-starters": { icon: "🐍", colorIndex: 4 },
  "python-explorer": { icon: "</>", colorIndex: 2 },
  "python-creator": { icon: "🎨", colorIndex: 5 },
};

const STATUS_STYLE = {
  "Not Started": "bg-slate-100 text-slate-500",
  "In Progress": "bg-amber-50 text-amber-600",
  Completed: "bg-green-50 text-green-600",
};

// One request each for courses, lesson summaries and the learner status.
async function loadCatalog() {
  const [courseResponse, lessonResponse] = await Promise.all([
    getCourses(),
    getAllLessons(),
  ]);

  const lessonsByCourse = {};

  for (const lesson of lessonResponse.lessons || []) {
    (lessonsByCourse[lesson.courseId] ||= []).push(lesson);
  }

  const user = getCurrentUser() || {};
  const userId = user.id || user._id || user.userId || "";
  let statuses = {};

  if (userId) {
    try {
      statuses = (await getCourseStatuses(userId)).statuses || {};
    } catch (statusError) {
      console.error("Failed to load course statuses:", statusError);
    }
  }

  return {
    courses: courseResponse.courses || [],
    lessonsByCourse,
    statuses,
  };
}

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState({});
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD COURSES + LESSONS
  // =========================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const catalog = await loadCatalog();

        setCourses(catalog.courses);
        setCourseLessons(catalog.lessonsByCourse);
        setStatuses(catalog.statuses);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Unable to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    return (
      course.title?.toLowerCase().includes(searchText) ||
      course.description?.toLowerCase().includes(searchText) ||
      course.level?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // START COURSE
  // =========================

  const handleStartCourse = async (course) => {
    try {
      const lessons = courseLessons[course.courseId] || [];

      // If lessons are already loaded, open first lesson
      if (lessons.length > 0) {
        const firstLesson = [...lessons].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        )[0];

        navigate(
          `/lesson/${firstLesson.lessonId}`
        );

        return;
      }

      // If lessons haven't loaded for some reason,
      // open the course page instead.
      navigate(`/courses/${course.courseId}`);
    } catch (err) {
      console.error("Failed to start course:", err);
      navigate(`/courses/${course.courseId}`);
    }
  };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <AppLayout active="courses">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-3">📚</div>

            <p className="text-sm font-semibold text-[#241B4E]">
              Loading courses...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Getting your learning path ready.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (error) {
    return (
      <AppLayout active="courses">
        <div className="flex min-h-[400px] items-center justify-center px-6">
          <div className="text-center">
            <div className="text-3xl mb-3">😕</div>

            <p className="text-sm font-semibold text-[#241B4E]">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg px-4 py-2 text-xs font-bold text-white"
              style={{ background: COURSES_GRADIENT }}
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout active="courses">

      {/* =========================
          HEADER
      ========================= */}

      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <p
          className="text-[10px] font-bold tracking-wide"
          style={{ color: "#8B5CF6" }}
        >
          COURSES
        </p>

        <h1 className="text-lg font-extrabold text-[#241B4E]">
          Find Your Next Course
        </h1>

        <p className="text-xs text-slate-400">
          Explore Python, Web Development, and more courses
          at every skill level.
        </p>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="px-6 py-4">
        <div className="mx-auto max-w-2xl relative">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2"
            style={{
              "--tw-ring-color": "rgba(139,92,246,0.3)",
            }}
          />
        </div>
      </div>

      {/* =========================
          NO COURSES
      ========================= */}

      {filteredCourses.length === 0 && (
        <div className="px-6 pb-10">
          <div className="rounded-xl border-2 border-slate-200 bg-white p-10 text-center">

            <div className="text-3xl mb-3">
              🔍
            </div>

            <h3 className="font-bold text-[#241B4E]">
              No courses found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try searching for another course.
            </p>

          </div>
        </div>
      )}

      {/* =========================
          COURSE CARDS
      ========================= */}

      {filteredCourses.length > 0 && (
        <section className="px-6 pb-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {filteredCourses.map((course, index) => {

              const ui = COURSE_UI[course.courseId];
              const clr = PALETTE[ui ? ui.colorIndex : index % PALETTE.length];

              const icon =
                ui?.icon || COURSE_ICONS[index % COURSE_ICONS.length];

              const lessons =
                courseLessons[course.courseId] || [];

              // Use database lesson count when lessons
              // are available, otherwise use course field.
              const lessonCount =
                lessons.length > 0
                  ? lessons.length
                  : course.lessonsCount || 0;

              const projectCount =
                course.projectsCount || 0;

              const hours =
                course.hours || 0;

              return (
<div key={course.courseId} className="rounded-xl border-2 bg-white overflow-hidden flex flex-col" style={{ borderColor: clr.border }}>
                <div
                  className="flex flex-col"
                >

                  {/* =========================
                      COURSE INFORMATION
                  ========================= */}

                  <div className="p-4 flex-1">

                    <div className="flex items-start justify-between">

                      <span className="text-2xl">
                        {icon}
                      </span>

                      <div className="flex gap-1">

                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{
                            backgroundColor: clr.bg,
                            color: clr.text,
                          }}
                        >
                          {course.badge ||
                            (course.premium
                              ? "Premium"
                              : "Free")}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                          {course.level}
                        </span>

                      </div>
                    </div>

                    {/* STATUS */}

                    <span className={`mt-2 inline-block rounded px-2 py-0.5 text-[9px] font-semibold ${STATUS_STYLE[statuses[course.courseId]?.status] || STATUS_STYLE["Not Started"]}`}>
  {statuses[course.courseId]?.status || "Not Started"}
  </span>

                    {/* TITLE */}

                    <h3 className="mt-2 font-bold text-[#241B4E] line-clamp-1">
                      {course.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {course.description}
                    </p>

                    {/* COURSE STATS */}

                    <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400">

                      <span>
                        📘 {lessonCount} Lessons
                      </span>

                      <span>
                        📁 {projectCount} Projects
                      </span>

                      <span>
                        ⏱ {hours}h est.
                      </span>

                    </div>

                  </div>

                  {/* =========================
                      START BUTTON
                  ========================= */}

                  <button
                    onClick={() =>
                      handleStartCourse(course)
                    }
                    className="px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
                    style={{
                      background: COURSES_GRADIENT,
                    }}
                  >
                    ▶ Start Free Lesson
                  </button>

                </div>
                <div
                  className="border-t-2 flex-1" style={{ borderColor: clr.border }}
                >

                  {/* CURRICULUM HEADER */}

                  <div
                    className="px-3 py-2 border-b border-slate-100"
                    style={{
                      backgroundColor: clr.bg,
                    }}
                  >

                    <p
                      className="text-[10px] font-bold tracking-wide"
                      style={{
                        color: clr.text,
                      }}
                    >
                      WHAT'S INSIDE THIS COURSE
                    </p>

                  </div>

                  {/* LESSONS */}

                  {lessons.length === 0 ? (

                    <div className="px-3 py-6 text-center">

                      <p className="text-xs text-slate-400">
                        No lessons available yet.
                      </p>

                    </div>

                  ) : (

                    <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">

                      {[...lessons]
                        .sort(
                          (a, b) =>
                            (a.order || 0) -
                            (b.order || 0)
                        )
                        .map((lesson, lessonIndex) => (

                          <li
                            key={
                              lesson.lessonId ||
                              `${course.courseId}-${lessonIndex}`
                            }
                            className="flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-slate-50"
                            onClick={() =>
                              navigate(
                                `/lesson/${lesson.lessonId}`
                              )
                            }
                          >

                            {/* NUMBER */}

                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                              style={{
                                backgroundColor: clr.bg,
                                color: clr.text,
                              }}
                            >
                              {lesson.order ||
                                lessonIndex + 1}
                            </span>

                            {/* LESSON CONTENT */}

                            <div className="min-w-0">

                              <div className="flex items-center gap-1.5 flex-wrap">

                                <p className="text-xs font-semibold text-[#241B4E]">
                                  {lesson.title}
                                </p>

                                <span
                                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                                    lesson.type ===
                                    "Video"
                                      ? "bg-blue-50 text-blue-500"
                                      : "bg-purple-50 text-purple-500"
                                  }`}
                                >

                                  {lesson.type ===
                                  "Video" ? (
                                    <Video size={9} />
                                  ) : (
                                    <Folder size={9} />
                                  )}

                                  {lesson.type ||
                                    "Lesson"}

                                </span>

                              </div>

                              <p className="mt-0.5 text-[10px] text-slate-400 leading-relaxed">
                                {lesson.description}
                              </p>

                            </div>

                          </li>

                        ))}

                    </ul>

                  )}

                </div>
</div>
              );
            })}

          </div>
        </section>
      )}
    </AppLayout>
  );
}