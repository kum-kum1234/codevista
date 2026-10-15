import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Lock,
  Search,
  BookOpen,
  Code2,
  Puzzle,
  Clock3,
  GraduationCap,
  CheckCircle2,
  Target,
  Flame,
  Folder,
  Zap,
  Terminal,
  Medal,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import { getCurrentUser } from "../utils/auth";
import { getUserAchievements } from "../services/api";

const ACHIEVEMENTS_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = ["Achievements", "Progress Report"];

// Where each kind of achievement is earned.
const EARN_ROUTES = {
  lessonsDone: "/courses",
  exercisesDone: "/courses",
  perfectQuizzes: "/courses",
  beginnerCoursesCompleted: "/courses",
  currentStreak: "/courses",
  codeRuns: "/playground",
  projectsCreated: "/playground",
  projectsSaved: "/playground",
  gamesCreated: "/playground",
  dataAnalysisProjects: "/playground",
  visualArtProjects: "/turtle-art-studio",
  commentsMade: "/community",
  collaborations: "/code-together",
};

function getEarnRoute(item) {
  return EARN_ROUTES[item?.criteriaType] || "/courses";
}

const FILTERS = ["All", "Unlocked", "Locked"];

// =====================================================
// ICON MAPPING
// Icon names come from MongoDB.
// =====================================================

const ICONS = {
  award: Award,
  book: BookOpen,
  code: Code2,
  puzzle: Puzzle,
  clock: Clock3,
  target: Target,
  flame: Flame,
  folder: Folder,
  zap: Zap,
  terminal: Terminal,
  medal: Medal,
};

// =====================================================
// COMPONENT
// =====================================================

export default function Achievements() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("Achievements");

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [achievements, setAchievements] =
    useState([]);

  const [badges, setBadges] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [summary, setSummary] =
    useState({
      unlocked: 0,
      total: 0,
      badges: 0,
      donePercentage: 0,
      lessonsDone: 0,
      codeRuns: 0,
      exercisesDone: 0,
      lastActive: null,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // USER
  // =====================================================

  const user =
    getCurrentUser() || {
      name: "Guest",
    };

  const userId =
    user?.id ||
    user?._id ||
    user?.userId ||
    user?.email ||
    user?.phone ||
    "";

  // =====================================================
  // DATE
  // =====================================================

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  // =====================================================
  // LOAD USER ACHIEVEMENT DATA
  // =====================================================

  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId) {
        setAchievements([]);
        setBadges([]);
        setStats(null);

        setSummary({
          unlocked: 0,
          total: 0,
          badges: 0,
          donePercentage: 0,
          lessonsDone: 0,
          codeRuns: 0,
          exercisesDone: 0,
          lastActive: null,
        });

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getUserAchievements(
            userId
          );

        const achievementData =
          response?.achievements || [];

        const badgeData =
          response?.badges || [];

        const statsData =
          response?.stats || null;

        const summaryData =
          response?.summary || {};

        setAchievements(
          achievementData
        );

        setBadges(badgeData);

        setStats(statsData);

        setSummary({
          unlocked:
            Number(
              summaryData.unlocked || 0
            ),
          total:
            Number(
              summaryData.total || 0
            ),
          badges:
            Number(
              summaryData.badges || 0
            ),
          donePercentage:
            Number(
              summaryData.donePercentage ||
                0
            ),
          lessonsDone:
            Number(
              summaryData.lessonsDone ||
                0
            ),
          codeRuns:
            Number(
              summaryData.codeRuns || 0
            ),
          exercisesDone:
            Number(
              summaryData.exercisesDone ||
                0
            ),
          lastActive:
            summaryData.lastActive ||
            null,
        });
      } catch (err) {
        console.error(
          "Failed to load achievements:",
          err
        );

        setError(
          "Couldn't load your achievements. Please try again."
        );

        setAchievements([]);
        setBadges([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  // =====================================================
  // FILTER ACHIEVEMENTS
  // =====================================================

  const filteredAchievements =
    useMemo(() => {
      return achievements.filter(
        (achievement) => {
          const title =
            achievement?.title || "";

          const matchesSearch =
            title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesFilter =
            filter === "All" ||
            (filter === "Unlocked" &&
              achievement.unlocked) ||
            (filter === "Locked" &&
              !achievement.unlocked);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      achievements,
      filter,
      search,
    ]);

  // =====================================================
  // ICON HELPER
  // =====================================================

  function getIcon(iconName) {
    return (
      ICONS[
        String(iconName || "")
          .toLowerCase()
      ] || Award
    );
  }

  // =====================================================
  // DATE FORMATTER
  // =====================================================

  function formatLastActive(value) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <AppLayout active="achievements">
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div
              className="mx-auto mb-3 h-8 w-8 rounded-full border-4 border-slate-200 border-t-purple-500 animate-spin"
            />

            <p className="text-sm font-semibold text-slate-500">
              Loading your achievements...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <AppLayout active="achievements">
      <div className="h-full flex flex-col bg-white overflow-y-auto">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 shrink-0">
          <Award
            size={16}
            style={{
              color: "#8B5CF6",
            }}
          />

          <div className="leading-tight">
            <p
              className="text-[9px] font-bold tracking-wide"
              style={{
                color: "#8B5CF6",
              }}
            >
              ACHIEVEMENTS
            </p>

            <p className="text-sm font-bold text-[#241B4E]">
              Track Your Progress
            </p>

            <p className="text-[10px] text-slate-400">
              Keep going — there's a lot more to unlock
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* =================================================
              TOP STATS
          ================================================== */}

          <div className="mx-auto max-w-4xl grid grid-cols-4 gap-3 mb-4">
            {[
              {
                value:
                  summary.unlocked,
                label: "Unlocked",
              },
              {
                value:
                  summary.total,
                label: "Total to Unlock",
              },
              {
                value:
                  summary.badges,
                label: "Badges Earned",
              },
              {
                value: `${summary.donePercentage}%`,
                label: "Completed",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center"
              >
                <p className="text-lg font-extrabold text-[#241B4E]">
                  {item.value}
                </p>

                <p className="text-[10px] text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-4xl">
            {/* =================================================
                TABS
            ================================================== */}

            <div className="flex gap-6 border-b border-slate-200 mb-4 text-xs font-semibold text-slate-400">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className="flex items-center gap-1.5 pb-2 border-b-2 -mb-px"
                  style={
                    activeTab === tab
                      ? {
                          borderColor:
                            "#8B5CF6",
                          color:
                            "#8B5CF6",
                        }
                      : {
                          borderColor:
                            "transparent",
                        }
                  }
                >
                  <Award size={13} />

                  {tab}
                </button>
              ))}
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {activeTab === "Achievements" ? (
              <>
                {/* =================================================
                    SECONDARY STATS
                ================================================== */}

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      icon: BookOpen,
                      value:
                        summary.lessonsDone,
                      label:
                        "Lessons Done",
                    },
                    {
                      icon: Code2,
                      value:
                        summary.codeRuns,
                      label: "Code Runs",
                    },
                    {
                      icon: Puzzle,
                      value:
                        summary.exercisesDone,
                      label:
                        "Exercises Done",
                    },
                    {
                      icon: Clock3,
                      value:
                        formatLastActive(
                          summary.lastActive
                        ),
                      label:
                        "Last Active",
                    },
                  ].map(
                    ({
                      icon: Icon,
                      value,
                      label,
                    }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <Icon
                          size={14}
                          style={{
                            color:
                              "#8B5CF6",
                          }}
                        />

                        <div>
                          <p className="text-sm font-bold text-[#241B4E]">
                            {value}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            {label}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* =================================================
                    BADGES
                ================================================== */}

                <div className="flex items-center justify-between mb-2">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-[#241B4E]">
                    🏅 Badge Collection
                  </p>

                  <span className="text-[10px] text-slate-400">
                    {summary.badges}/
                    {badges.length} earned
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {badges.map(
                    (badge, index) => {
                      const clr =
                        PALETTE[
                          index %
                            PALETTE.length
                        ];

                      const Icon =
                        getIcon(
                          badge.icon
                        );

                      return (
                        <div
                          key={
                            badge.achievementId ||
                            badge._id ||
                            badge.title
                          }
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            navigate(getEarnRoute(badge))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            navigate(getEarnRoute(badge))
                          }
                          className="cursor-pointer rounded-xl border-2 bg-white p-5 text-center transition-shadow hover:shadow-md"
                          style={{
                            borderColor:
                              badge.unlocked
                                ? clr.border
                                : "#E2E8F0",
                            backgroundColor:
                              badge.unlocked
                                ? clr.bg
                                : "white",
                          }}
                        >
                          <div
                            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
                            style={{
                              backgroundColor:
                                badge.unlocked
                                  ? clr.bg
                                  : "#F8FAFC",
                              color:
                                badge.unlocked
                                  ? clr.text
                                  : "#CBD5E1",
                            }}
                          >
                            {badge.unlocked ? (
                              <Icon
                                size={22}
                              />
                            ) : (
                              <Lock
                                size={22}
                              />
                            )}
                          </div>

                          <p className="text-sm font-bold text-[#241B4E]">
                            {badge.title}
                          </p>

                          <span
                            className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold ${
                              badge.rarity ===
                              "Legendary"
                                ? "bg-yellow-50 text-yellow-600"
                                : badge.rarity ===
                                  "Rare"
                                ? "bg-purple-50 text-purple-500"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {badge.rarity}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* =================================================
                    SEARCH + FILTER
                ================================================== */}

                <p className="text-center text-[10px] font-bold tracking-wide text-slate-400 mb-2">
                  ALL ACHIEVEMENTS
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search achievements..."
                      className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs outline-none focus:ring-2"
                      style={{
                        "--tw-ring-color":
                          "rgba(139,92,246,0.3)",
                      }}
                    />
                  </div>

                  {FILTERS.map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() =>
                          setFilter(item)
                        }
                        className="rounded-lg px-3 py-2 text-xs font-semibold"
                        style={
                          filter === item
                            ? {
                                background:
                                  ACHIEVEMENTS_GRADIENT,
                                color:
                                  "white",
                              }
                            : {
                                border:
                                  "1px solid #E2E8F0",
                                color:
                                  "#64748B",
                              }
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                {/* =================================================
                    ACHIEVEMENTS GRID
                ================================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredAchievements.map(
                    (achievement) => {
                      const Icon =
                        getIcon(
                          achievement.icon
                        );

                      return (
                        <div
                          key={
                            achievement.achievementId ||
                            achievement._id ||
                            achievement.title
                          }
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            navigate(getEarnRoute(achievement))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            navigate(getEarnRoute(achievement))
                          }
                          className="cursor-pointer rounded-xl border p-5 transition-shadow hover:shadow-md"
                          style={
                            achievement.unlocked
                              ? {
                                  borderColor:
                                    "#DFCBFF",
                                  backgroundColor:
                                    "#F5EEFF",
                                }
                              : {
                                  borderColor:
                                    "#E2E8F0",
                                  backgroundColor:
                                    "white",
                                }
                          }
                        >
                          {achievement.unlocked ? (
                            <Icon
                              size={20}
                              className="mb-3"
                              style={{
                                color:
                                  "#8B5CF6",
                              }}
                            />
                          ) : (
                            <Lock
                              size={20}
                              className="text-slate-300 mb-3"
                            />
                          )}

                          <p className="text-sm font-bold text-[#241B4E]">
                            {achievement.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400 leading-snug">
                            {
                              achievement.description
                            }
                          </p>

                          <p
                            className={`mt-2 text-[10px] ${
                              achievement.unlocked
                                ? "font-semibold"
                                : "italic text-slate-300"
                            }`}
                            style={
                              achievement.unlocked
                                ? {
                                    color:
                                      "#8B5CF6",
                                  }
                                : undefined
                            }
                          >
                            {achievement.unlocked
                              ? "Unlocked!"
                              : "Keep going to unlock this"}
                          </p>

                          {!achievement.unlocked &&
                            Number(
                              achievement
                                .criteriaValue
                            ) > 0 && (
                              <p className="mt-1 text-[9px] text-slate-300">
                                {
                                  achievement.currentValue
                                }{" "}
                                /{" "}
                                {
                                  achievement.criteriaValue
                                }
                              </p>
                            )}
                        </div>
                      );
                    }
                  )}

                  {filteredAchievements.length ===
                    0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center">
                      <p className="text-sm font-semibold text-slate-400">
                        No{" "}
                        {filter !==
                        "All"
                          ? filter.toLowerCase()
                          : ""}{" "}
                        achievements found.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* =================================================
                    PROGRESS REPORT HEADER
                ================================================== */}

                <div
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    border:
                      "1px solid #DFCBFF",
                  }}
                >
                  <div
                    className="px-6 py-5 flex items-center justify-between"
                    style={{
                      background:
                        ACHIEVEMENTS_GRADIENT,
                    }}
                  >
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-white/80">
                        <GraduationCap
                          size={13}
                        />

                        CODEVISTA ACADEMY
                      </p>

                      <h2 className="mt-1 text-2xl font-extrabold text-white">
                        Progress Report Card
                      </h2>

                      <p className="text-xs text-white/70">
                        {today}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/15 px-4 py-2 text-right">
                      <p className="text-[9px] font-bold tracking-wide text-white/70">
                        STUDENT
                      </p>

                      <p className="text-sm font-bold text-white">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      REPORT STATS
                  ================================================== */}

                  <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4"
                    style={{
                      backgroundColor:
                        "#F5EEFF",
                    }}
                  >
                    {[
                      {
                        icon:
                          CheckCircle2,
                        value:
                          summary.lessonsDone,
                        label:
                          "Lessons Done",
                        colorIndex: 2,
                      },
                      {
                        icon: Code2,
                        value:
                          summary.codeRuns,
                        label:
                          "Code Runs",
                        colorIndex: 4,
                      },
                      {
                        icon: Target,
                        value:
                          summary.exercisesDone,
                        label:
                          "Exercises Done",
                        colorIndex: 3,
                      },
                      {
                        icon: Clock3,
                        value:
                          formatLastActive(
                            summary.lastActive
                          ),
                        label:
                          "Last Active",
                        colorIndex: 0,
                      },
                    ].map(
                      ({
                        icon: Icon,
                        value,
                        label,
                        colorIndex,
                      }) => {
                        const clr =
                          PALETTE[
                            colorIndex %
                              PALETTE.length
                          ];

                        return (
                          <div
                            key={label}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="flex h-9 w-9 items-center justify-center rounded-full"
                              style={{
                                backgroundColor:
                                  clr.bg,
                                color:
                                  clr.text,
                              }}
                            >
                              <Icon
                                size={15}
                              />
                            </span>

                            <div>
                              <p className="text-lg font-extrabold text-[#241B4E]">
                                {value}
                              </p>

                              <p className="text-[10px] text-slate-500">
                                {label}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* =================================================
                    LESSON ACTIVITY
                ================================================== */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <BookOpen
                    size={36}
                    className="mx-auto text-slate-200"
                  />

                  {summary.lessonsDone ===
                  0 ? (
                    <>
                      <p className="mt-3 text-base font-bold text-[#241B4E]">
                        No lessons visited yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Start a course and come back to see your report card!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-base font-bold text-[#241B4E]">
                        Your learning journey is underway
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        You have completed{" "}
                        {summary.lessonsDone}{" "}
                        lesson
                        {summary.lessonsDone ===
                        1
                          ? ""
                          : "s"}
                        .
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
