import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  MessageCircle,
  Trophy,
  HelpCircle,
  ChevronDown,
  X,
  Crown,
  Sparkles,
  Heart,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { getCurrentUser, initialsFromName } from "../utils/auth";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const COMMUNITY_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = [
  {
    key: "feed",
    label: "Community Feed",
    icon: MessageCircle,
    badge: true,
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
  },
  {
    key: "help",
    label: "Get Help",
    icon: HelpCircle,
  },
];

const FILTER_CATEGORIES = [
  "All Categories",
  "Discussion",
  "Help",
  "Showcase",
  "Announcement",
];

const POST_TYPES = [
  "General",
  "Achievement",
  "Question",
  "Project Showcase",
];

const POST_CATEGORIES = [
  "Discussion",
  "Help",
  "Showcase",
  "Announcement",
];

const TYPE_STYLES = {
  General: {
    bg: "#FF5A36",
    label: "general",
  },
  Achievement: {
    bg: "#EC4899",
    label: "achievement",
  },
  Question: {
    bg: "#1AACDB",
    label: "question",
  },
  "Project Showcase": {
    bg: "#8B5CF6",
    label: "showcase",
  },
};

const HELP_GUIDELINES = [
  "Be specific about your problem",
  "Include your code snippet",
  "Explain what you expected vs what happened",
  "Be patient and respectful",
];

const INITIAL_POSTS = [
  {
    id: "seed-1",
    name: "Noah Rossen",
    initials: "NR",
    date: "6/19/2025",
    type: "General",
    category: "Discussion",
    title: "My first week with Python basics",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 25,
    comments: 1,
  },
  {
    id: "seed-2",
    name: "Olivia Martinez",
    initials: "OM",
    date: "6/19/2025",
    type: "General",
    category: "Discussion",
    title: "What the community has taught me so far",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 25,
    comments: 1,
  },
  {
    id: "seed-3",
    name: "Noah Rossen",
    initials: "NR",
    date: "6/19/2025",
    type: "Question",
    category: "Help",
    title: "Stuck on a loop, could use a second pair of eyes",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 5,
    comments: 2,
  },
  {
    id: "seed-4",
    name: "Rachana Soni",
    initials: "RS",
    date: "6/19/2025",
    type: "General",
    category: "Discussion",
    title: "What the community has taught me so far",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 25,
    comments: 1,
  },
  {
    id: "seed-5",
    name: "Rachana Soni",
    initials: "RS",
    date: "6/19/2025",
    type: "Project Showcase",
    category: "Showcase",
    title: "Built my first turtle art project!",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 5,
    comments: 3,
  },
  {
    id: "seed-6",
    name: "Rajya",
    initials: "R",
    date: "6/19/2025",
    type: "Achievement",
    category: "Discussion",
    title: "What the community has taught me so far",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 25,
    comments: 2,
  },
  {
    id: "seed-7",
    name: "Rajya",
    initials: "R",
    date: "6/19/2025",
    type: "General",
    category: "Discussion",
    title: "What the community has taught me so far",
    content:
      "Documenting my Python journey here — new discoveries and new mistakes, every single day.",
    tags: ["python", "learning"],
    likes: 5,
    comments: 3,
  },
];

function Toast({
  tone,
  title,
  message,
  onClose,
}) {
  const isError = tone === "error";

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] w-80 rounded-xl p-4 shadow-lg"
      style={
        isError
          ? {
              backgroundColor: "#EC4899",
              color: "white",
            }
          : {
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
            }
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="text-sm font-bold"
            style={{
              color: isError
                ? "white"
                : "#241B4E",
            }}
          >
            {title}
          </p>

          <p
            className="mt-0.5 text-xs"
            style={{
              color: isError
                ? "rgba(255,255,255,0.9)"
                : "#64748B",
            }}
          >
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="shrink-0"
          style={{
            color: isError
              ? "white"
              : "#94A3B8",
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Community() {
  const [activeTab, setActiveTab] =
    useState("feed");

  const [posts, setPosts] =
    useState(INITIAL_POSTS);

  const [showPostModal, setShowPostModal] =
    useState(false);

  const [postTitle, setPostTitle] =
    useState("");

  const [postType, setPostType] =
    useState("General");

  const [postCategory, setPostCategory] =
    useState("Discussion");

  const [postContent, setPostContent] =
    useState("");

  const [postCode, setPostCode] =
    useState("");

  const [postTags, setPostTags] =
    useState("");

  const [
    typeDropdownOpen,
    setTypeDropdownOpen,
  ] = useState(false);

  const [
    categoryDropdownOpen,
    setCategoryDropdownOpen,
  ] = useState(false);

  const [
    questionDraft,
    setQuestionDraft,
  ] = useState("");

  const [
    showQuestionModal,
    setShowQuestionModal,
  ] = useState(false);

  const [
    filterCategoryOpen,
    setFilterCategoryOpen,
  ] = useState(false);

  const [
    selectedFilterCategory,
    setSelectedFilterCategory,
  ] = useState("All Categories");

  const [toast, setToast] =
    useState(null);

  const user =
    getCurrentUser() || { name: "Guest" };

  // ==============================
  // REAL-TIME COMMUNITY SIDEBAR DATA
  // ==============================

  const [
    communityStats,
    setCommunityStats,
  ] = useState({
    user: {
      id: "",
      username: "",
      xp: 0,
      level: 1,
      xpToNextLevel: 500,
      xpProgress: 0,
      posts: 0,
      streak: 0,
      lessons: 0,
      badges: 0,
      memberSince: "",
    },

    community: {
      activeMembers: 0,
      postsThisWeek: 0,
      questionsAnswered: 0,
      averageResponseTime: "0h",
    },

    topContributors: [],
  });

  useEffect(() => {
    const loadCommunityStats =
      async () => {
        try {
          const response =
            await fetch(
              "http://localhost:3002/api/community/stats",
              {
                method: "GET",
                credentials: "include",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to load community statistics"
            );
          }

          const data =
            await response.json();

          setCommunityStats(data);
        } catch (error) {
          console.error(
            "Community stats error:",
            error
          );
        }
      };

    loadCommunityStats();

    const interval =
      setInterval(
        loadCommunityStats,
        30000
      );

    return () =>
      clearInterval(interval);
  }, []);

  function showToast(
    tone,
    title,
    message
  ) {
    setToast({
      tone,
      title,
      message,
    });

    setTimeout(
      () => setToast(null),
      4000
    );
  }

  function resetPostForm() {
    setPostTitle("");
    setPostType("General");
    setPostCategory("Discussion");
    setPostContent("");
    setPostCode("");
    setPostTags("");
  }

  function handlePostSubmit(e) {
    e.preventDefault();

    if (
      !postTitle.trim() ||
      !postContent.trim()
    ) {
      showToast(
        "error",
        "Please fill required fields",
        "Title and content are required."
      );

      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      name: user.name,
      initials: initialsFromName(
        user.name
      ),
      date:
        new Date().toLocaleDateString(
          "en-US"
        ),
      type: postType,
      category: postCategory,
      title: postTitle.trim(),
      content: postContent.trim(),
      code: postCode.trim(),
      tags: postTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [
      newPost,
      ...prev,
    ]);

    resetPostForm();

    setShowPostModal(false);

    showToast(
      "success",
      "Post created",
      "Your post has been shared with the community!"
    );
  }

  function handleDeletePost(id) {
    setPosts((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );
  }

  function handleQuestionSubmit(e) {
    e.preventDefault();

    if (!questionDraft.trim()) {
      return;
    }

    // TODO: wire this up to a real POST /community/questions endpoint
    console.log(
      "New question:",
      questionDraft
    );

    setQuestionDraft("");

    setShowQuestionModal(false);

    showToast(
      "success",
      "Question submitted",
      "Your question has been posted to Get Help."
    );
  }

  const visiblePosts =
    selectedFilterCategory ===
    "All Categories"
      ? posts
      : posts.filter(
          (p) =>
            p.category ===
            selectedFilterCategory
        );

  return (
    <AppLayout active="community">
      <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">

        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 shrink-0">
          <Users
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
              LEARNING HUB
            </p>

            <p className="text-sm font-bold text-[#241B4E]">
              Community
            </p>

            <p className="text-[10px] text-slate-400">
              Swap progress, ask questions, meet other young coders
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl">

            {/* Tabs */}

            <div className="flex gap-6 border-b border-slate-200 mb-4 text-xs font-semibold text-slate-400">

              {TABS.map(
                ({
                  key,
                  label,
                  icon: Icon,
                  badge,
                }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setActiveTab(key)
                    }
                    className="flex items-center gap-1.5 pb-2 border-b-2 -mb-px"
                    style={
                      activeTab === key
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
                    <Icon size={13} />

                    {label}

                    {badge && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={{
                          backgroundColor:
                            activeTab === key
                              ? "#F5EEFF"
                              : "#F1F5F9",

                          color:
                            activeTab === key
                              ? "#8B5CF6"
                              : "#94A3B8",
                        }}
                      >
                        {posts.length}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Community Feed */}

            {activeTab === "feed" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Feed */}

                <div className="lg:col-span-2">

                  <button
                    onClick={() =>
                      setShowPostModal(true)
                    }
                    className="w-full flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 mb-2 text-left hover:border-slate-300"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                      {initialsFromName(
                        user.name
                      )}
                    </span>

                    <span className="flex-1 text-xs text-slate-400">
                      Share your progress, ask questions...
                    </span>
                  </button>

                  <div className="flex items-center gap-2 mb-2">

                    <div className="relative flex-1">

                      <Search
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs outline-none"
                      />
                    </div>

                    {/* Filter */}

                    <div className="relative">

                      <button
                        onClick={() =>
                          setFilterCategoryOpen(
                            (o) => !o
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"
                      >
                        {
                          selectedFilterCategory
                        }

                        <ChevronDown
                          size={13}
                          className={
                            filterCategoryOpen
                              ? "rotate-180 transition-transform"
                              : "transition-transform"
                          }
                        />
                      </button>

                      {filterCategoryOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() =>
                              setFilterCategoryOpen(
                                false
                              )
                            }
                          />

                          <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">

                            {FILTER_CATEGORIES.map(
                              (c) => (
                                <button
                                  key={c}
                                  onClick={() => {
                                    setSelectedFilterCategory(
                                      c
                                    );

                                    setFilterCategoryOpen(
                                      false
                                    );
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50"
                                  style={
                                    selectedFilterCategory ===
                                    c
                                      ? {
                                          color:
                                            "#8B5CF6",
                                          fontWeight:
                                            600,
                                        }
                                      : {
                                          color:
                                            "#241B4E",
                                        }
                                  }
                                >
                                  <span className="w-3">
                                    {
                                      selectedFilterCategory ===
                                      c
                                        ? "✓"
                                        : ""
                                    }
                                  </span>

                                  {c}
                                </button>
                              )
                            )}

                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mb-2">
                    Showing{" "}
                    {
                      visiblePosts.length
                    }{" "}
                    posts
                  </p>

                  <div className="space-y-3">

                    {visiblePosts.map(
                      (p) => {
                        const badge =
                          TYPE_STYLES[
                            p.type
                          ] ||
                          TYPE_STYLES.General;

                        const isOwn =
                          p.name ===
                          user.name;

                        return (
                          <div
                            key={p.id}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <div className="flex items-start justify-between">

                              <div className="flex items-center gap-2">

                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                  {
                                    p.initials
                                  }
                                </span>

                                <div>

                                  <p className="text-xs font-bold text-[#241B4E]">
                                    {p.name}

                                    <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                                      Level 1
                                    </span>
                                  </p>

                                  <p className="text-[10px] text-slate-400">
                                    {p.date} ·{" "}
                                    {
                                      p.category.toLowerCase()
                                    }
                                  </p>
                                </div>
                              </div>

                              <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                                style={{
                                  backgroundColor:
                                    badge.bg,
                                }}
                              >
                                {
                                  badge.label
                                }
                              </span>

                            </div>

                            <p className="mt-2 text-xs font-bold text-[#241B4E]">
                              {p.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                p.content
                              }
                            </p>

                            {p.code && (
                              <pre className="mt-2 rounded-lg bg-[#12102A] text-[10px] text-slate-200 p-2.5 overflow-x-auto font-mono">
                                {p.code}
                              </pre>
                            )}

                            {p.tags.length >
                              0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">

                                {p.tags.map(
                                  (t) => (
                                    <span
                                      key={t}
                                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500"
                                    >
                                      #{t}
                                    </span>
                                  )
                                )}

                              </div>
                            )}

                            <div className="mt-2 flex items-center justify-between">

                              <div className="flex gap-4 text-[10px] text-slate-400">

                                <span className="flex items-center gap-1">
                                  <Heart
                                    size={11}
                                  />
                                  {
                                    p.likes
                                  }
                                </span>

                                <span className="flex items-center gap-1">
                                  <MessageSquare
                                    size={11}
                                  />
                                  {
                                    p.comments
                                  }
                                </span>

                              </div>

                              {isOwn && (
                                <button
                                  onClick={() =>
                                    handleDeletePost(
                                      p.id
                                    )
                                  }
                                  className="text-red-400 hover:text-red-500"
                                  title="Delete post"
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>
                              )}

                            </div>
                          </div>
                        );
                      }
                    )}

                    {visiblePosts.length ===
                      0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                        No posts in this category yet.
                      </div>
                    )}

                  </div>
                </div>

                {/* RIGHT SIDEBAR - DYNAMIC DATA */}

                <div className="space-y-4">

                  {/* User Profile */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">

                    <span
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white font-bold"
                      style={{
                        background:
                          COMMUNITY_GRADIENT,
                      }}
                    >
                      {initialsFromName(
                        user.name
                      )}
                    </span>

                    <p className="mt-2 text-sm font-bold text-[#241B4E]">
                      {user.name}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      @
                      {communityStats
                        .user
                        .username ||
                        user.name
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            ""
                          )}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-yellow-500">
                      ⭐ Level{" "}
                      {
                        communityStats
                          .user
                          .level
                      }{" "}
                      ·{" "}
                      {
                        communityStats
                          .user
                          .xp
                      }{" "}
                      XP
                    </p>

                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">

                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                communityStats
                                  .user
                                  .xpProgress
                              ) || 0,
                              0
                            ),
                            100
                          )}%`,
                          background:
                            COMMUNITY_GRADIENT,
                        }}
                      />

                    </div>

                    <p className="text-[9px] text-slate-400 mt-1">
                      {
                        communityStats
                          .user
                          .xpToNextLevel
                      }{" "}
                      XP to next level
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">

                      {/* Posts */}

                      <div
                        className="rounded-lg py-2"
                        style={{
                          backgroundColor:
                            "#F5EEFF",
                        }}
                      >
                        <p
                          className="text-sm font-bold"
                          style={{
                            color:
                              "#8B5CF6",
                          }}
                        >
                          {
                            communityStats
                              .user
                              .posts
                          }
                        </p>

                        <p className="text-[9px] text-slate-500">
                          Posts
                        </p>
                      </div>

                      {/* Streak */}

                      <div
                        className="rounded-lg py-2"
                        style={{
                          backgroundColor:
                            "#EAF8FE",
                        }}
                      >
                        <p
                          className="text-sm font-bold"
                          style={{
                            color:
                              "#1AACDB",
                          }}
                        >
                          {
                            communityStats
                              .user
                              .streak
                          }
                        </p>

                        <p className="text-[9px] text-slate-500">
                          Day Streak
                        </p>
                      </div>

                      {/* Lessons */}

                      <div className="rounded-lg bg-green-50 py-2">

                        <p className="text-sm font-bold text-green-600">
                          {
                            communityStats
                              .user
                              .lessons
                          }
                        </p>

                        <p className="text-[9px] text-slate-500">
                          Lessons
                        </p>

                      </div>

                      {/* Badges */}

                      <div
                        className="rounded-lg py-2"
                        style={{
                          backgroundColor:
                            "#FFF1EC",
                        }}
                      >
                        <p
                          className="text-sm font-bold"
                          style={{
                            color:
                              "#FF5A36",
                          }}
                        >
                          {
                            communityStats
                              .user
                              .badges
                          }
                        </p>

                        <p className="text-[9px] text-slate-500">
                          Badges
                        </p>
                      </div>

                    </div>

                    <p className="mt-2 text-[9px] text-slate-400">

                      🚩 Member since{" "}

                      {communityStats
                        .user
                        .memberSince
                        ? new Date(
                            communityStats
                              .user
                              .memberSince
                          ).toLocaleDateString(
                            "en-US"
                          )
                        : "Loading..."}

                    </p>

                  </div>

                  {/* Top Contributors */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="flex items-center gap-1.5 text-xs font-bold text-[#241B4E] mb-3">
                      🏆 Top Contributors
                    </p>

                    {communityStats
                      .topContributors
                      ?.length > 0 ? (
                      <div className="space-y-2">

                        {communityStats
                          .topContributors
                          .slice(0, 5)
                          .map(
                            (
                              contributor,
                              index
                            ) => (
                              <div
                                key={
                                  contributor.id ||
                                  index
                                }
                                className="flex items-center justify-between"
                              >

                                <div className="flex items-center gap-2">

                                  <span
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                    style={{
                                      background:
                                        COMMUNITY_GRADIENT,
                                    }}
                                  >
                                    {initialsFromName(
                                      contributor.name ||
                                        "U"
                                    )}
                                  </span>

                                  <div>

                                    <p className="text-[10px] font-semibold text-[#241B4E]">
                                      {
                                        contributor.name
                                      }
                                    </p>

                                    <p className="text-[8px] text-slate-400">
                                      Level{" "}
                                      {
                                        contributor.level
                                      }
                                    </p>

                                  </div>
                                </div>

                                <span className="text-[10px] font-bold text-[#8B5CF6]">
                                  {
                                    contributor.xp
                                  }{" "}
                                  XP
                                </span>

                              </div>
                            )
                          )}

                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400">
                        No contributors yet
                      </p>
                    )}

                  </div>

                  {/* Community at a Glance */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs font-bold text-[#241B4E] mb-2">
                      Community at a Glance
                    </p>

                    <div className="flex items-center justify-between py-1 text-xs">

                      <span className="text-slate-500">
                        Active Members
                      </span>

                      <span className="font-bold text-[#241B4E]">
                        {
                          communityStats
                            .community
                            .activeMembers
                        }
                      </span>

                    </div>

                    <div className="flex items-center justify-between py-1 text-xs">

                      <span className="text-slate-500">
                        Posts This Week
                      </span>

                      <span className="font-bold text-[#241B4E]">
                        {
                          communityStats
                            .community
                            .postsThisWeek
                        }
                      </span>

                    </div>

                    <div className="flex items-center justify-between py-1 text-xs">

                      <span className="text-slate-500">
                        Questions Answered
                      </span>

                      <span className="font-bold text-[#241B4E]">
                        {
                          communityStats
                            .community
                            .questionsAnswered
                        }
                      </span>

                    </div>

                    <div className="flex items-center justify-between py-1 text-xs">

                      <span className="text-slate-500">
                        Avg. Response Time
                      </span>

                      <span className="font-bold text-[#241B4E]">
                        {
                          communityStats
                            .community
                            .averageResponseTime
                        }
                      </span>

                    </div>

                  </div>

                  {/* This Week's Challenges */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs font-bold text-[#241B4E] mb-2">
                      This Week's Challenges
                    </p>

                    <div
                      className="rounded-lg p-2 mb-2"
                      style={{
                        backgroundColor:
                          "#F5EEFF",
                      }}
                    >

                      <p
                        className="text-xs font-bold"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Python Puzzle Week
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Crack 5 coding puzzles and earn a special badge.
                      </p>

                      <p
                        className="text-[9px] mt-1"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        3 days left
                      </p>

                    </div>

                    <div className="rounded-lg bg-green-50 p-2">

                      <p className="text-xs font-bold text-green-600">
                        Helper Hero
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Answer 5 questions from other members this week.
                      </p>

                      <p className="text-[9px] text-green-600 mt-1">
                        5 days left
                      </p>

                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Leaderboard */}

            {activeTab ===
              "leaderboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E] mb-4">
                    <Crown
                      size={16}
                      style={{
                        color:
                          "#E8A400",
                      }}
                    />

                    Points Leaderboard
                  </p>

                  <div className="flex flex-col items-center justify-center py-10 text-center">

                    <Trophy
                      size={32}
                      className="text-slate-200"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-400">
                      No rankings yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400 max-w-[220px]">
                      Earn XP by completing lessons and posting in the community to climb the leaderboard.
                    </p>

                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="text-sm font-bold text-[#241B4E] mb-4">
                    Achievement Showcase
                  </p>

                  <div className="flex flex-col items-center justify-center py-10 text-center">

                    <Sparkles
                      size={32}
                      className="text-slate-200"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                      Recent community achievements will appear here!
                    </p>

                  </div>
                </div>

              </div>
            )}

            {/* Get Help */}

            {activeTab === "help" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="rounded-xl border border-slate-200 bg-white p-6">

                  <p className="text-base font-bold text-[#241B4E]">
                    Ask for Help
                  </p>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Stuck on a coding problem? Our community and instructors are here to help!
                  </p>

                  <button
                    onClick={() =>
                      setShowQuestionModal(
                        true
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                    style={{
                      background:
                        COMMUNITY_GRADIENT,
                    }}
                  >
                    <HelpCircle
                      size={14}
                    />

                    Ask a Question
                  </button>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">

                  <p className="text-base font-bold text-[#241B4E] mb-3">
                    Help Guidelines
                  </p>

                  <p className="text-xs font-bold text-[#241B4E] mb-2">
                    When asking for help:
                  </p>

                  <ul className="space-y-1.5">

                    {HELP_GUIDELINES.map(
                      (g) => (
                        <li
                          key={g}
                          className="flex items-start gap-2 text-xs text-slate-500"
                        >
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />

                          {g}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* Create Post Modal */}

        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <p className="text-base font-bold text-[#241B4E]">
                  Create a Post
                </p>

                <button
                  onClick={() => {
                    setShowPostModal(
                      false
                    );

                    resetPostForm();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>

              </div>

              <form
                onSubmit={
                  handlePostSubmit
                }
                className="px-5 py-4 space-y-3"
              >

                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) =>
                    setPostTitle(
                      e.target.value
                    )
                  }
                  placeholder="Post title..."
                  className="w-full rounded-xl border-2 px-3 py-2.5 text-sm outline-none"
                  style={{
                    borderColor:
                      !postTitle.trim() &&
                      postTitle !== ""
                        ? "#EC4899"
                        : "#E2E8F0",
                  }}
                />

                <div className="grid grid-cols-2 gap-3">

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setTypeDropdownOpen(
                          (o) => !o
                        )
                      }
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-[#241B4E]"
                    >
                      {postType}

                      <ChevronDown
                        size={14}
                        className={
                          typeDropdownOpen
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      />
                    </button>

                    {typeDropdownOpen && (
                      <>

                        <div
                          className="fixed inset-0 z-10"
                          onClick={() =>
                            setTypeDropdownOpen(
                              false
                            )
                          }
                        />

                        <div className="absolute left-0 z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">

                          {POST_TYPES.map(
                            (t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => {
                                  setPostType(
                                    t
                                  );

                                  setTypeDropdownOpen(
                                    false
                                  );
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                                style={
                                  postType ===
                                  t
                                    ? {
                                        backgroundColor:
                                          "#FF5A36",
                                        color:
                                          "white",
                                        fontWeight:
                                          600,
                                      }
                                    : {
                                        color:
                                          "#241B4E",
                                      }
                                }
                              >
                                <span className="w-3">
                                  {
                                    postType ===
                                    t
                                      ? "✓"
                                      : ""
                                  }
                                </span>

                                {t}
                              </button>
                            )
                          )}

                        </div>
                      </>
                    )}

                  </div>

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setCategoryDropdownOpen(
                          (o) => !o
                        )
                      }
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-[#241B4E]"
                    >
                      {postCategory}

                      <ChevronDown
                        size={14}
                        className={
                          categoryDropdownOpen
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      />
                    </button>

                    {categoryDropdownOpen && (
                      <>

                        <div
                          className="fixed inset-0 z-10"
                          onClick={() =>
                            setCategoryDropdownOpen(
                              false
                            )
                          }
                        />

                        <div className="absolute left-0 z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">

                          {POST_CATEGORIES.map(
                            (c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setPostCategory(
                                    c
                                  );

                                  setCategoryDropdownOpen(
                                    false
                                  );
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                                style={
                                  postCategory ===
                                  c
                                    ? {
                                        backgroundColor:
                                          "#FF5A36",
                                        color:
                                          "white",
                                        fontWeight:
                                          600,
                                      }
                                    : {
                                        color:
                                          "#241B4E",
                                      }
                                }
                              >
                                <span className="w-3">
                                  {
                                    postCategory ===
                                    c
                                      ? "✓"
                                      : ""
                                  }
                                </span>

                                {c}
                              </button>
                            )
                          )}

                        </div>
                      </>
                    )}

                  </div>

                </div>

                <textarea
                  value={postContent}
                  onChange={(e) =>
                    setPostContent(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="What's on your mind? Share your coding journey, ask for help, or celebrate achievements..."
                  className="w-full resize-none rounded-xl border-2 px-3 py-2.5 text-sm outline-none"
                  style={{
                    borderColor:
                      !postContent.trim() &&
                      postContent !== ""
                        ? "#EC4899"
                        : "#E2E8F0",
                  }}
                />

                <textarea
                  value={postCode}
                  onChange={(e) =>
                    setPostCode(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Code snippet (optional)..."
                  spellCheck={false}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-mono outline-none"
                />

                <input
                  type="text"
                  value={postTags}
                  onChange={(e) =>
                    setPostTags(
                      e.target.value
                    )
                  }
                  placeholder="Tags (comma separated)..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

                <div className="flex items-center justify-end gap-2 pt-1">

                  <button
                    type="button"
                    onClick={() => {
                      setShowPostModal(
                        false
                      );

                      resetPostForm();
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                    style={{
                      backgroundColor:
                        "#FF5A36",
                    }}
                  >
                    Share Post
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* Ask Question Modal */}

        {showQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <p className="text-sm font-bold text-[#241B4E]">
                  Ask a Question
                </p>

                <button
                  onClick={() =>
                    setShowQuestionModal(
                      false
                    )
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>

              </div>

              <form
                onSubmit={
                  handleQuestionSubmit
                }
                className="px-5 py-4"
              >

                <label className="text-xs font-semibold text-slate-500">
                  What are you stuck on?
                </label>

                <textarea
                  value={questionDraft}
                  onChange={(e) =>
                    setQuestionDraft(
                      e.target.value
                    )
                  }
                  autoFocus
                  rows={5}
                  placeholder="Describe your problem — include any error message or code you're working with..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
                  style={{
                    "--tw-ring-color":
                      "rgba(139,92,246,0.3)",
                  }}
                />

                <div className="mt-4 flex items-center justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowQuestionModal(
                        false
                      )
                    }
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      !questionDraft.trim()
                    }
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    style={{
                      background:
                        COMMUNITY_GRADIENT,
                    }}
                  >
                    Submit Question
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* Toast */}

        {toast && (
          <Toast
            tone={toast.tone}
            title={toast.title}
            message={toast.message}
            onClose={() =>
              setToast(null)
            }
          />
        )}

      </div>
    </AppLayout>
  );
}