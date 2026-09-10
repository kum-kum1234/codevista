import React, { useEffect, useState } from "react";
import { Search, Video, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import {
  getCourses,
  getLessonsByCourse,
} from "../services/api";

const COURSES_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

// Keep the same icons/colors that your old page used.
// These are only UI values, not course data.
const COURSE_UI = {
  "python-starters": {
    icon: "🐍",
    colorIndex: 4,
  },

  "python-explorer": {
    icon: "</>",
    colorIndex: 2,
  },

  "python-creator": {
    icon: "🎨",
    colorIndex: 5,
  },
};

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [search, setSearch] = useState("");

  // =========================
  // GET COURSES FROM API
  // =========================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();

        const fetchedCourses =
          response?.courses || [];

        setCourses(fetchedCourses);

        // Get lessons for every course
        const lessonData = {};

        await Promise.all(
          fetchedCourses.map(async (course) => {
            try {
              const lessonResponse =
                await getLessonsByCourse(
                  course.courseId
                );

              lessonData[course.courseId] =
                lessonResponse?.lessons || [];
            } catch (error) {
              console.error(
                `Failed to load lessons for ${course.courseId}`,
                error
              );

              lessonData[course.courseId] = [];
            }
          })
        );

        setLessons(lessonData);
      } catch (error) {
        console.error(
          "Failed to load courses",
          error
        );
      }
    };

    loadCourses();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filtered = courses.filter((c) =>
    c.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AppLayout active="courses">

      {/* Header */}

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
          Python courses for kids ages 8–14, at every skill level.
        </p>

      </div>

      {/* Search */}

      <div className="px-6 py-4">

        <div className="mx-auto max-w-2xl relative">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2"
            style={{
              "--tw-ring-color":
                "rgba(139,92,246,0.3)",
            }}
          />

        </div>

      </div>

      {/* Course cards */}

      <section className="px-6 pb-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {filtered.map((c, index) => {

            // Keep existing course UI values.
            // New courses automatically get a visual fallback.
            const ui =
              COURSE_UI[c.courseId] || {
                icon: "🌐",
                colorIndex:
                  index % PALETTE.length,
              };

            const clr =
              PALETTE[ui.colorIndex];

            const courseLessons =
              lessons[c.courseId] || [];

            return (
              <div
                key={c.courseId}
                className="rounded-xl border-2 bg-white overflow-hidden flex flex-col"
                style={{
                  borderColor:
                    clr.border,
                }}
              >

                <div className="p-4 flex-1">

                  <div className="flex items-start justify-between">

                    <span className="text-2xl">
                      {ui.icon}
                    </span>

                    <div className="flex gap-1">

                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{
                          backgroundColor:
                            clr.bg,
                          color:
                            clr.text,
                        }}
                      >
                        {c.badge}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                        {c.level}
                      </span>

                    </div>

                  </div>

                  <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                    Not Started
                  </span>

                  <h3 className="mt-2 font-bold text-[#241B4E]">
                    {c.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400">

                    <span>
                      📘 {c.lessonsCount} Lessons
                    </span>

                    <span>
                      📁 {c.projectsCount} Projects
                    </span>

                    <span>
                      ⏱ {c.hours}h est.
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/courses/${c.courseId}`
                    )
                  }
                  className="px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
                  style={{
                    background:
                      COURSES_GRADIENT,
                  }}
                >
                  ▶ Start Free Lesson
                </button>

              </div>
            );
          })}

        </div>

      </section>

      {/* Curriculum lists */}

      <section className="px-6 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {filtered.map((c, index) => {

            const ui =
              COURSE_UI[c.courseId] || {
                icon: "🌐",
                colorIndex:
                  index % PALETTE.length,
              };

            const clr =
              PALETTE[ui.colorIndex];

            const courseLessons =
              lessons[c.courseId] || [];

            return (
              <div
                key={c.courseId}
                className="rounded-xl border-2 bg-white overflow-hidden"
                style={{
                  borderColor:
                    clr.border,
                }}
              >

                <div
                  className="px-3 py-2 border-b border-slate-100"
                  style={{
                    backgroundColor:
                      clr.bg,
                  }}
                >

                  <p
                    className="text-[10px] font-bold tracking-wide"
                    style={{
                      color:
                        clr.text,
                    }}
                  >
                    WHAT'S INSIDE THIS COURSE
                  </p>

                </div>

                <ul className="divide-y divide-slate-100">

                  {courseLessons.map(
                    (lesson, i) => (

                      <li
                        key={
                          lesson.lessonId ||
                          lesson.title
                        }
                        className="flex items-start gap-2 px-3 py-2.5"
                      >

                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor:
                              clr.bg,
                            color:
                              clr.text,
                          }}
                        >
                          {lesson.order ||
                            i + 1}
                        </span>

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
                                <Video
                                  size={9}
                                />
                              ) : (
                                <Folder
                                  size={9}
                                />
                              )}

                              {lesson.type}

                            </span>

                          </div>

                          <p className="mt-0.5 text-[10px] text-slate-400 leading-relaxed">
                            {lesson.description}
                          </p>

                        </div>

                      </li>

                    )
                  )}

                </ul>

              </div>
            );
          })}

        </div>

      </section>

    </AppLayout>
  );
}