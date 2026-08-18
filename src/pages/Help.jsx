import React, { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Award,
  Gauge,
  Users,
  Mail,
  MessageCircle,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const HELP_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const FAQS = [
  {
    q: "Where do I even start with Python?",
    a: "Start with 'Python Starters' — it's built for total beginners and walks through basic commands, data types, and core concepts in a kid-friendly way.",
  },
  {
    q: "What ages is CodeVista built for?",
    a: "CodeVista is designed for kids aged 7–14, with courses tailored to different stages: Python Starters (7–10), Python Explorer (8+), and Python Creator (11–13+).",
  },
  {
    q: "How can I see how far I've come?",
    a: "Your progress saves automatically as you go. Head to your Dashboard to see completed courses, earned achievements, and your current streak.",
  },
  {
    q: "What exactly are achievements?",
    a: "Achievements are rewards for completing lessons, courses, and coding challenges. Visit the Achievements page to see every badge and how close you are to unlocking it.",
  },
  {
    q: "Can I actually write code right in the browser?",
    a: "Yes! Every lesson comes with a built-in code editor so you can write and run real Python without installing anything.",
  },
  {
    q: "Stuck on something — where do I get help?",
    a: "Use this Help page, post a question in the Community section, or reach out to the support team using the contact details below.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Bite-Sized Lessons",
    desc: "Step-by-step lessons with a live code editor, so you learn by actually running Python, not just reading about it.",
    colorIndex: 4,
  },
  {
    icon: Award,
    title: "Achievements & Badges",
    desc: "Unlock badges and milestones as you work through courses and finish coding challenges.",
    colorIndex: 2,
  },
  {
    icon: Gauge,
    title: "Progress Tracking",
    desc: "See exactly where you stand with detailed stats and progress reports.",
    colorIndex: 5,
  },
  {
    icon: Users,
    title: "A Real Community",
    desc: "Share what you've built, ask questions, and connect with other young coders.",
    colorIndex: 3,
  },
];

const GUIDE_STEPS = [
  {
    title: "Pick a Course",
    desc: "New to programming? Start with Python Starters. Already know some basics? Jump straight into Python Explorer.",
  },
  {
    title: "Work Through the Lessons",
    desc: "Go at your own pace — each lesson has explanations, examples, and hands-on coding exercises to try.",
  },
  {
    title: "Unlock Achievements",
    desc: "Finish lessons and challenges to earn badges. Track everything on the Achievements page.",
  },
  {
    title: "Say Hi in the Community",
    desc: "Share your projects, ask questions, and see what other young coders are building.",
  },
];

const TABS = ["FAQs", "Features", "Contact"];

export default function Help() {
  const [activeTab, setActiveTab] = useState("FAQs");

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} style={{ color: "#8B5CF6" }} />
            <p
              className="text-[9px] font-bold tracking-wide"
              style={{ color: "#8B5CF6" }}
            >
              SUPPORT
            </p>
          </div>

          <h1 className="mt-1 text-2xl font-extrabold text-[#241B4E]">
            Help & Support
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Answers, guides, and ways to reach us if you're stuck
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex gap-6 border-b border-slate-200 text-xs font-semibold text-slate-400">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="border-b-2 pb-2 -mb-px"
                  style={
                    activeTab === tab
                      ? {
                          borderColor: "#8B5CF6",
                          color: "#8B5CF6",
                        }
                      : {
                          borderColor: "transparent",
                        }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "FAQs" && (
              <>
                <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                  Common Questions
                </h2>

                <div className="space-y-3">
                  {FAQS.map((f, i) => {
                    const clr = PALETTE[i % PALETTE.length];

                    return (
                      <div
                        key={f.q}
                        className="rounded-xl border-2 bg-white p-4"
                        style={{ borderColor: clr.border }}
                      >
                        <p
                          className="flex items-center gap-2 text-sm font-bold"
                          style={{ color: clr.text }}
                        >
                          <HelpCircle size={13} />
                          {f.q}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {f.a}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === "Features" && (
              <>
                <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                  What's Included
                </h2>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  {FEATURES.map(
                    ({ icon: Icon, title, desc, colorIndex }) => {
                      const clr = PALETTE[colorIndex];

                      return (
                        <div
                          key={title}
                          className="rounded-xl border-2 bg-white p-4"
                          style={{ borderColor: clr.border }}
                        >
                          <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                            <Icon
                              size={14}
                              style={{ color: clr.text }}
                            />
                            {title}
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {desc}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-sm font-bold text-[#241B4E]">
                    How to Get Started
                  </p>

                  <ol className="space-y-3">
                    {GUIDE_STEPS.map((s, i) => (
                      <li
                        key={s.title}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: "#F5EEFF",
                            color: "#8B5CF6",
                          }}
                        >
                          {i + 1}
                        </span>

                        <span>
                          <p
                            className="text-xs font-bold"
                            style={{ color: "#8B5CF6" }}
                          >
                            {s.title}
                          </p>

                          <p className="text-xs leading-relaxed text-slate-500">
                            {s.desc}
                          </p>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {activeTab === "Contact" && (
              <>
                <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                  Reach Out
                </h2>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                      <Mail
                        size={14}
                        style={{ color: "#8B5CF6" }}
                      />
                      Email Us
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Question or stuck on something? Send an email and
                      we'll reply within 24 hours.
                    </p>

                    <a
                      href="mailto:team@gokulamtech.com"
                      className="mt-1 block text-xs font-semibold"
                      style={{ color: "#8B5CF6" }}
                    >
                      team@gokulamtech.com
                    </a>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                      <MessageCircle
                        size={14}
                        style={{ color: "#1AACDB" }}
                      />
                      Ask the Community
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Get help from other students and show off what
                      you've built.
                    </p>

                    <a
                      href="/community"
                      className="mt-1 block text-xs font-semibold"
                      style={{ color: "#1AACDB" }}
                    >
                      Visit Community ↗
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-sm font-bold text-[#241B4E]">
                    Want to Go Further?
                  </p>

                  <p className="text-xs font-semibold text-[#241B4E]">
                    Python.org
                  </p>

                  <p className="text-xs text-slate-500">
                    The official Python docs and tutorials, for when
                    you're ready to go beyond the basics.
                  </p>

                  <a
                    href="https://python.org"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-xs font-semibold"
                    style={{ color: "#8B5CF6" }}
                  >
                    Visit Python.org ↗
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}