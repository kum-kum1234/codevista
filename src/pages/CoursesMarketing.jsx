import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import {
  Search,
  Rocket,
  Code2,
  Palette,
  Clock,
  BookOpen,
  FolderKanban,
  Play,
  Video,
  FileCheck2,
  Trophy,
  Download,
  Users,
  Gift,
  CheckCircle2,
  Smartphone,
  Monitor,
  ArrowRight,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Course data                                                             */
/* ---------------------------------------------------------------------- */

const COURSES = [
  {
    id: "python-starters",
    icon: Rocket,
    colorIndex: 0, // coral
    level: "Beginner",
    title: "Python Starters",
    description:
      "Get comfortable with Python, basic commands, and core data types. Perfect for beginners taking their first steps into programming.",
    lessonsCount: 10,
    projectsCount: 2,
    hours: 8,
    lessons: [
      {
        title: "What is Python & Getting Started",
        type: "Video",
        desc: "Learn what Python is, how to set up your coding environment, and run your first command.",
      },
      {
        title: "Printing with print()",
        type: "Video",
        desc: "Learn how to use the print() function to display messages and create simple text output.",
      },
      {
        title: "Variables",
        type: "Video",
        desc: "Learn how to store and use information with variables, the building blocks of programming.",
      },
      {
        title: "User Input",
        type: "Video",
        desc: "Learn how to get input from users and make your programs interactive.",
      },
      {
        title: "Basic Math in Python",
        type: "Video",
        desc: "Learn how to use Python as a calculator and perform math operations.",
      },
      {
        title: "Data Types Explained",
        type: "Video",
        desc: "Learn about different types of data in Python including strings, integers, floats, and booleans.",
      },
      {
        title: "Lists and Collections",
        type: "Video",
        desc: "Learn how to store and manage groups of data using Python lists, including adding, removing, and looping through items.",
      },
      {
        title: "Creating Your First Program",
        type: "Video",
        desc: "Put everything you've learned together to plan, write, and run your own complete Python program from scratch.",
      },
      {
        title: "Mini Project 1: Combining Input + Print + Variables",
        type: "Project",
        desc: "Build short scripts using everything learned so far.",
      },
      {
        title: "Mini Project 2: Silly Sentence Maker",
        type: "Project",
        desc: "Create funny sentences using string variables and input.",
      },
    ],
  },
  {
    id: "python-explorer",
    icon: Code2,
    colorIndex: 1, // sky
    level: "Intermediate",
    title: "Python Explorer",
    description:
      "Dive into logic, data structures, and decision-making in code. Perfect for kids who already know Python basics.",
    lessonsCount: 7,
    projectsCount: 2,
    hours: 7,
    lessons: [
      {
        title: "Lists & Tuples",
        type: "Video",
        desc: "Learn how to group data together using lists and tuples.",
      },
      {
        title: "Sets & Dictionaries",
        type: "Video",
        desc: "Learn how to use sets for unique collections and dictionaries for key-value pairs.",
      },
      {
        title: "If, Elif, Else",
        type: "Video",
        desc: "Learn how to make decisions in your code using conditional statements.",
      },
      {
        title: "Comparing Values & Conditions",
        type: "Video",
        desc: "Learn how to compare values and combine conditions using logical operators.",
      },
      {
        title: "Loops - For & While",
        type: "Video",
        desc: "Learn how to repeat code with loops to make your programs more efficient and powerful.",
      },
      {
        title: "Functions - Make Your Own Commands",
        type: "Video",
        desc: "Learn how to create your own reusable functions for organizing code better.",
      },
      {
        title: "Parameters & Return Values",
        type: "Video",
        desc: "Learn how to send data into functions and get results back.",
      },
      {
        title: "Mini Project 1: Build a Calculator",
        type: "Project",
        desc: "Create a multi-function calculator app using custom functions.",
      },
      {
        title: "Mini Project 2: Guess the Number Game",
        type: "Project",
        desc: "Create a fun number-guessing game that uses loops and conditionals.",
      },
    ],
  },
  {
    id: "python-creator",
    icon: Palette,
    colorIndex: 4, // grape
    level: "Advanced",
    title: "Python Creator - Make Art with Code",
    description:
      "Learn to create beautiful artwork using Python's Turtle Graphics. Designed for ages 11-14, this course teaches how to draw shapes, patterns, and animations with code. Create spirals, stars, and everything in between.",
    lessonsCount: 7,
    projectsCount: 1,
    hours: 7,
    lessons: [
      {
        title: "Meet Turtle and Draw Lines",
        type: "Video",
        desc: "Learn the basics of turtle graphics and draw your first lines and shapes.",
      },
      {
        title: "Drawing Shapes with Loops",
        type: "Video",
        desc: "Learn how to use loops to create squares, triangles, hexagons and other shapes efficiently.",
      },
      {
        title: "Adding Color, Speed & Pen Styles",
        type: "Video",
        desc: "Learn how to add colors, change pen size, and control drawing speed to make your art more vibrant and dynamic.",
      },
      {
        title: "Drawing Spirals and Stars",
        type: "Video",
        desc: "Learn to create mesmerizing spirals and beautiful star shapes using loops and angles.",
      },
      {
        title: "Drawing with Math (Patterns and Angles)",
        type: "Video",
        desc: "Learn how to use mathematical principles to create complex and beautiful patterns.",
      },
      {
        title: "Making Name Art and Initials",
        type: "Video",
        desc: "Learn how to draw letters, spell your name, and create personalized art with turtle graphics.",
      },
      {
        title: "Mini Project: Turtle Art Gallery",
        type: "Project",
        desc: "Create a personal art gallery showcasing everything you've learned about Python turtle graphics.",
      },
    ],
  },
];

const CHILD_GETS = [
  {
    icon: BookOpen,
    title: "3 Courses + More Coming",
    desc: "New course released every month, designed specifically for kids",
  },
  {
    icon: Trophy,
    title: "Fun Projects & Games",
    desc: "Build exciting games and interactive applications",
  },
  {
    icon: Download,
    title: "Downloadable Certificate",
    desc: "Official completion certificate to showcase skills",
  },
  {
    icon: Users,
    title: "Child-Friendly Dashboard",
    desc: "Easy-to-use interface designed for young learners",
  },
  {
    icon: Clock,
    title: "Annual Access",
    desc: "One payment, a full year of access, learn anytime at your own pace",
  },
  {
    icon: Gift,
    title: "Bonus Content",
    desc: "Future mini-projects and coding helpdesk access",
  },
];

/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

export default function CoursesMarketing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("desktop");

  const filtered = COURSES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="courses" />

      {/* ---------------- Hero ---------------- */}
      <section
        className="px-8 py-12 text-center"
        style={{ background: "linear-gradient(135deg, #FFF1EC 0%, #FFF8E1 50%, #F5EEFF 100%)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#FF5A36] shadow-sm">
          <BookOpen size={12} /> Python courses for kids aged 6-14
        </span>
        <h1 className="font-display mt-4 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
          Explore Our Coding{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
          >
            Courses
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Discover premium Python programming courses designed for kids aged 8–14 and all skill
          levels.
        </p>
      </section>

      {/* ---------------- Course grid ---------------- */}
      <section className="bg-[#FDFCFA] px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative mb-6 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-full border-2 border-[#F0EAFF] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const c = PALETTE[course.colorIndex];
              const Icon = course.icon;
              return (
                <div key={course.id} className="flex flex-col">
                  {/* Card */}
                  <div
                    className="rounded-3xl border-2 bg-white p-4 shadow-sm"
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="flex gap-1.5">
                        <span className="flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#E8A400]">
                          Premium
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ backgroundColor: c.bg, color: c.text }}
                        >
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <span className="mt-3 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      Not Started
                    </span>

                    <h3 className="font-display mt-2 font-bold text-[#241B4E] leading-snug">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        <BookOpen size={11} style={{ color: c.text }} /> {course.lessonsCount} lessons
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        <FolderKanban size={11} style={{ color: c.text }} /> {course.projectsCount} projects
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        <Clock size={11} /> {course.hours}h est.
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/signup")}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: c.solid }}
                    >
                      <Play size={12} /> Start Free Lesson{course.id !== "python-starters" ? "" : "s"}
                    </button>
                  </div>

                  {/* Lesson list */}
                  <p
                    className="mt-4 mb-2 text-[10px] font-extrabold tracking-wide"
                    style={{ color: c.text }}
                  >
                    WHAT THEY'LL LEARN — ALL LESSONS
                  </p>
                  <div className="space-y-2.5">
                    {course.lessons.map((lesson, i) => (
                      <div
                        key={lesson.title}
                        className="flex gap-2.5 rounded-2xl border-2 bg-white p-3"
                        style={{ borderColor: c.border }}
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: c.bg, color: c.text }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-bold text-[#241B4E]">{lesson.title}</p>
                            <span
                              className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                              style={
                                lesson.type === "Video"
                                  ? { backgroundColor: PALETTE[1].bg, color: PALETTE[1].text }
                                  : { backgroundColor: PALETTE[4].bg, color: PALETTE[4].text }
                              }
                            >
                              {lesson.type === "Video" ? (
                                <Video size={9} />
                              ) : (
                                <FileCheck2 size={9} />
                              )}
                              {lesson.type}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                            {lesson.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-slate-400">
              No courses match "{query}". Try a different search.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- Live demo ---------------- */}
      <section
        className="px-8 py-14 text-center"
        style={{ background: "linear-gradient(135deg, #EAF8FE 0%, #FFF8E1 50%, #FFEEF6 100%)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#1AACDB] shadow-sm">
          <Play size={11} /> LIVE DEMO — REAL LESSON, RIGHT NOW
        </span>
        <h2 className="font-display mt-4 text-2xl md:text-3xl font-extrabold text-[#241B4E]">
          See exactly <span style={{ color: "#FF5A36" }}>how</span> your child will learn.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          No signup. No fluff. Watch a real lesson — video, concept, practice, resources and
          certificate.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
            <CheckCircle2 size={12} style={{ color: PALETTE[2].text }} /> No Setup Required
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
            <Smartphone size={12} style={{ color: PALETTE[1].text }} /> Works on Any Device
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
            <Gift size={12} style={{ color: PALETTE[5].text }} /> For Kids Age 8-14
          </span>
        </div>

        {/* Desktop / Mobile toggle */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400">
          <button
            onClick={() => setView("desktop")}
            className="flex items-center gap-1.5"
            style={view === "desktop" ? { color: "#FF5A36" } : undefined}
          >
            <Monitor size={13} /> Desktop view
          </button>
          <button
            onClick={() => setView("mobile")}
            className="flex items-center gap-1.5"
            style={view === "mobile" ? { color: "#FF5A36" } : undefined}
          >
            <Smartphone size={13} /> Mobile view
          </button>
        </div>

        {/* Mock browser / phone frame */}
        <div className="mt-4 flex items-start justify-center gap-6">
          {(view === "desktop" || true) && (
            <div className="hidden md:block w-[520px] rounded-2xl border-2 border-[#F0EAFF] bg-white shadow-md overflow-hidden text-left">
              <div className="flex items-center gap-1.5 border-b border-[#F0EAFF] bg-slate-50 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PALETTE[5].solid }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PALETTE[3].solid }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PALETTE[2].solid }} />
                <span className="ml-2 flex-1 truncate rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-400">
                  .io/lessons/what-is-python
                </span>
              </div>
              <div className="flex gap-3 justify-center border-b border-[#F0EAFF] py-1.5 text-[10px] font-bold text-slate-400">
                <span>Watch</span>
                <span>Lesson</span>
                <span>Practice</span>
                <span>Resources</span>
                <span style={{ color: "#FF5A36", borderBottom: "2px solid #FF5A36", paddingBottom: 4 }}>
                  Certificate
                </span>
              </div>
              <div className="flex">
                <div className="relative flex h-40 w-1/2 items-center justify-center bg-[#241B4E]">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "#FF5A36" }}
                  >
                    <Play size={14} />
                  </span>
                  <p className="absolute bottom-2 left-2 text-[9px] text-white/80">
                    What is Python &amp; Getting Started
                  </p>
                </div>
                <div className="w-1/2 border-l border-[#F0EAFF] p-3">
                  <div
                    className="rounded-xl border-2 border-dashed p-2 text-center"
                    style={{ borderColor: PALETTE[0].border, backgroundColor: PALETTE[0].bg }}
                  >
                    <FileCheck2 size={16} className="mx-auto" style={{ color: PALETTE[0].text }} />
                    <p className="mt-1 text-[10px] font-bold text-[#241B4E]">
                      Certificate of Achievement
                    </p>
                    <p className="text-[8px] text-slate-400">This certifies that</p>
                    <p className="text-[9px] font-bold" style={{ color: PALETTE[0].text }}>
                      Arjun Sharma
                    </p>
                    <p className="text-[8px] text-slate-400">has successfully completed</p>
                    <p className="text-[9px] font-semibold text-[#241B4E]">Python Starters</p>
                    <div className="mt-1.5 flex justify-center gap-1">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                        style={{ backgroundColor: PALETTE[1].bg, color: PALETTE[1].text }}
                      >
                        LinkedIn
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                        style={{ backgroundColor: PALETTE[5].bg, color: PALETTE[5].text }}
                      >
                        PDF
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                        style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
                      >
                        Share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-32 rounded-[28px] border-4 border-[#241B4E] bg-white shadow-md overflow-hidden text-left">
            <div className="flex h-24 items-center justify-center bg-[#241B4E]">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "#FF5A36" }}
              >
                <Play size={10} />
              </span>
            </div>
            <div className="p-1.5">
              <div
                className="rounded-lg border-2 border-dashed p-1 text-center"
                style={{ borderColor: PALETTE[0].border, backgroundColor: PALETTE[0].bg }}
              >
                <p className="text-[6px] font-bold text-[#241B4E]">Certificate of Achievement</p>
                <p className="text-[5px] font-bold" style={{ color: PALETTE[0].text }}>
                  Arjun Sharma
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Your child can do this today — in under 30 minutes.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
        >
          Start Learning Today <ArrowRight size={14} />
        </button>
      </section>

      {/* ---------------- What your child gets ---------------- */}
      <section className="px-8 py-14">
        <h2 className="font-display text-center text-xl font-extrabold text-[#241B4E] mb-8">
          What Your Child Gets:
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHILD_GETS.map(({ icon: Icon, title, desc }, i) => {
            const c = PALETTE[i % PALETTE.length];
            return (
              <div
                key={title}
                className="rounded-2xl border-2 p-4"
                style={{ borderColor: c.border }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  <Icon size={18} />
                </span>
                <p className="mt-3 text-sm font-bold text-[#241B4E]">{title}</p>
                <p className="mt-1 text-xs text-slate-400 leading-snug">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}