import React, { useState } from "react";
import { Search, Video, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const COURSES_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const COURSES = [
  {
    id: "python-starters",
    icon: "🐍",
    badge1: "Premium",
    badge2: "Beginner",
    status: "Not Started",
    title: "Python Starters",
    description:
      "Your first steps into code — variables, basic commands, and core data types, explained the way a kid would explain it to a friend.",
    lessons: "10 Lessons",
    projects: "2 Projects",
    duration: "4h est.",
    colorIndex: 4,
    curriculum: [
      { title: "What is Python & Getting Started", type: "Video", description: "What Python actually is, how to set up your coding space, and how to run your first command." },
      { title: "Printing with print()", type: "Video", description: "How to use print() to show messages and text on screen." },
      { title: "Variables", type: "Video", description: "How to store and reuse information with variables — the building blocks of every program." },
      { title: "User Input", type: "Video", description: "How to get input from a person and use it to make programs interactive." },
      { title: "Basic Math in Python", type: "Video", description: "Turn Python into a calculator and try out different math operations." },
      { title: "Data Types Explained", type: "Video", description: "Strings, integers, floats, and booleans — what they are and when to use each." },
      { title: "Lists and Collections", type: "Video", description: "How to store and manage groups of data with lists — adding, removing, and looping through items." },
      { title: "Creating Your First Program", type: "Video", description: "Put it all together — plan, write, and run a full Python program from scratch." },
      { title: "Mini Project 1: Combining Input + Print + Variables", type: "Project", description: "Build short scripts that pull together everything learned so far." },
      { title: "Mini Project 2: Silly Sentence Maker", type: "Project", description: "Make funny sentences using string variables and input." },
    ],
  },
  {
    id: "python-explorer",
    icon: "</>",
    badge1: "Premium",
    badge2: "Intermediate",
    status: "Not Started",
    title: "Python Explorer",
    description:
      "Once the basics click, this is where real logic and decision-making come in. Best for kids who already know the fundamentals.",
    lessons: "8 Lessons",
    projects: "2 Projects",
    duration: "6h est.",
    colorIndex: 2,
    curriculum: [
      { title: "Lists & Tuples", type: "Video", description: "How to group related pieces of data using lists and tuples." },
      { title: "Sets & Dictionaries", type: "Video", description: "Sets for unique collections, dictionaries for key-value pairs." },
      { title: "If, Elif, Else", type: "Video", description: "How to make your code branch and decide using conditional statements." },
      { title: "Comparing Values & Conditions", type: "Video", description: "Comparing values and combining conditions with logical operators." },
      { title: "Loops - For & While", type: "Video", description: "Repeat work with loops to make programs shorter and more powerful." },
      { title: "Functions - Make Your Own Commands", type: "Video", description: "Build your own reusable functions to keep code organized." },
      { title: "Parameters & Return Values", type: "Video", description: "Send data into functions and get results back out." },
      { title: "Mini Project 1: Build a Calculator", type: "Project", description: "A multi-function calculator app built entirely with custom functions." },
      { title: "Mini Project 2: Guess the Number Game", type: "Project", description: "A number-guessing game that uses loops and conditionals." },
    ],
  },
  {
    id: "python-creator",
    icon: "🎨",
    badge1: "Premium",
    badge2: "Advanced",
    status: "Not Started",
    title: "Python Creator - Make Art with Code",
    description:
      "Turtle Graphics turns code into art. Best for ages 11-13+ — draw shapes, patterns, and animations, even spell out your own name.",
    lessons: "7 Lessons",
    projects: "1 Project",
    duration: "5h est.",
    colorIndex: 5,
    curriculum: [
      { title: "Meet Turtle and Draw Lines", type: "Video", description: "The basics of turtle graphics — draw your first lines and shapes." },
      { title: "Drawing Shapes with Loops", type: "Video", description: "Use loops to build squares, triangles, hexagons, and more, efficiently." },
      { title: "Adding Color, Speed & Pen Styles", type: "Video", description: "Add color, adjust pen size, and control drawing speed for more dynamic art." },
      { title: "Drawing Spirals and Stars", type: "Video", description: "Build mesmerizing spirals and star shapes using loops and angles." },
      { title: "Drawing with Math (Patterns and Angles)", type: "Video", description: "Use simple math to create complex, beautiful patterns." },
      { title: "Making Name Art and Initials", type: "Video", description: "Draw letters, spell your name, and make personalized art with turtle graphics." },
      { title: "Mini Project: Turtle Art Gallery", type: "Project", description: "A personal gallery showcasing everything learned in this course." },
    ],
  },
];

export default function Courses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout active="courses">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <p className="text-[10px] font-bold tracking-wide" style={{ color: "#8B5CF6" }}>COURSES</p>
        <h1 className="text-lg font-extrabold text-[#241B4E]">Find Your Next Course</h1>
        <p className="text-xs text-slate-400">Python courses for kids ages 8–14, at every skill level.</p>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="mx-auto max-w-2xl relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2"
            style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
          />
        </div>
      </div>

      {/* Course cards */}
      <section className="px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const clr = PALETTE[c.colorIndex];
            return (
              <div key={c.title} className="rounded-xl border-2 bg-white overflow-hidden flex flex-col" style={{ borderColor: clr.border }}>
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
                  onClick={() => navigate(`/courses/${c.id}`)}
                  className="px-4 py-2.5 text-xs font-bold text-white hover:opacity-90"
                  style={{ background: COURSES_GRADIENT }}
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
          {filtered.map((c) => {
            const clr = PALETTE[c.colorIndex];
            return (
              <div key={c.title} className="rounded-xl border-2 bg-white overflow-hidden" style={{ borderColor: clr.border }}>
                <div className="px-3 py-2 border-b border-slate-100" style={{ backgroundColor: clr.bg }}>
                  <p className="text-[10px] font-bold tracking-wide" style={{ color: clr.text }}>
                    WHAT'S INSIDE THIS COURSE
                  </p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {c.curriculum.map((lesson, i) => (
                    <li key={lesson.title} className="flex items-start gap-2 px-3 py-2.5">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: clr.bg, color: clr.text }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-semibold text-[#241B4E]">{lesson.title}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                              lesson.type === "Video"
                                ? "bg-blue-50 text-blue-500"
                                : "bg-purple-50 text-purple-500"
                            }`}
                          >
                            {lesson.type === "Video" ? <Video size={9} /> : <Folder size={9} />}
                            {lesson.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-400 leading-relaxed">
                          {lesson.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
}