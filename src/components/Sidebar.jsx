import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Palette,
  Award,
  Users,
  HelpCircle,
  Calendar,
  StickyNote,
  Users2,
  FileQuestion,
  User,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import {
  getCurrentUser,
  clearCurrentUser,
  initialsFromName,
  authFetch,
} from "../utils/auth";

const SIDEBAR_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const NAV_MAIN = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "courses",
    icon: BookOpen,
    label: "Courses",
    path: "/app/courses",
  },
  {
    key: "playground",
    icon: Code2,
    label: "Playground",
    path: "/playground",
  },
  {
    key: "turtle",
    icon: Palette,
    label: "Turtle Art Studio",
    path: "/turtle-art-studio",
  },
  {
    key: "achievements",
    icon: Award,
    label: "Achievements",
    path: "/achievements",
  },
  {
    key: "community",
    icon: Users,
    label: "Community",
    path: "/community",
  },
  {
    key: "help",
    icon: HelpCircle,
    label: "Help",
    path: "/help",
  },
];

const NAV_STUDY_TOOLS = [
  {
    key: "timetable",
    icon: Calendar,
    label: "My Timetable",
    path: "/my-timetable",
  },
  {
    key: "notes",
    icon: StickyNote,
    label: "My Notes",
    path: "/my-notes",
  },
];

export default function Sidebar({
  active,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  // Logout popup state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = getCurrentUser() || {
    name: "Guest",
    email: "Not signed in",
  };

  // ======================================================
  // OPEN LOGOUT POPUP
  // ======================================================

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // ======================================================
  // CANCEL LOGOUT
  // ======================================================

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // ======================================================
  // CONFIRM LOGOUT
  // ======================================================

  const handleConfirmLogout = async () => {
    try {
      const currentUser = getCurrentUser();

      // --------------------------------------------------
      // Call backend logout API
      // --------------------------------------------------

      if (currentUser?.userId) {
        try {
          const response = await authFetch(
            `${API_URL}/auth/logout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: currentUser.userId,
              }),
            }
          );

          const data = await response.json();

          console.log("Logout API response:", data);
        } catch (apiError) {
          console.error("Logout API error:", apiError);

          // Even if backend logout fails,
          // frontend authentication will still be cleared.
        }
      }

      // --------------------------------------------------
      // CLEAR FRONTEND LOGIN SESSION
      // --------------------------------------------------

      clearCurrentUser();

      // Extra safety
      localStorage.removeItem("pythonkid_user");

      // Close popup
      setShowLogoutModal(false);

      // --------------------------------------------------
      // REDIRECT TO MAIN HOME PAGE
      // --------------------------------------------------

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);

      // Always clear frontend authentication
      clearCurrentUser();
      localStorage.removeItem("pythonkid_user");

      // Close popup
      setShowLogoutModal(false);

      // Go to Home even if something unexpected happens
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <>
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } shrink-0 border-r border-slate-200 bg-white h-full overflow-y-auto transition-all duration-200 hidden md:flex md:flex-col`}
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="flex items-center justify-between px-4 py-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black text-white"
                style={{
                  background: SIDEBAR_GRADIENT,
                }}
              >
                {"</>"}
              </span>

              <span className="font-bold text-[#241B4E]">
                CodeVista
              </span>
            </div>
          )}

          <button
            onClick={() =>
              setSidebarOpen((open) => !open)
            }
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft
              size={16}
              className={
                !sidebarOpen ? "rotate-180" : ""
              }
            />
          </button>
        </div>

        {/* ==================================================
            USER
        ================================================== */}

        {sidebarOpen && (
          <div className="flex items-center gap-2 px-4 py-3 border-y border-slate-200">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{
                background: SIDEBAR_GRADIENT,
              }}
            >
              {initialsFromName(user.name)}
            </span>

            <div className="min-w-0">
              <p className="font-semibold text-[#241B4E] truncate">
                {user.name}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {user.email || user.phone}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            MAIN NAVIGATION
        ================================================== */}

        <nav className="px-2 py-3 space-y-0.5">
          {NAV_MAIN.map(
            ({
              key,
              icon: Icon,
              label,
              path,
            }) => (
              <button
                key={key}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left"
                style={
                  active === key
                    ? {
                        backgroundColor: "#F5EEFF",
                        color: "#8B5CF6",
                        fontWeight: 600,
                      }
                    : {
                        color: "#475569",
                      }
                }
              >
                <Icon size={16} />

                {sidebarOpen && label}
              </button>
            )
          )}
        </nav>

        {/* ==================================================
            STUDY TOOLS
        ================================================== */}

        {sidebarOpen && (
          <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">
            STUDY TOOLS
          </p>
        )}

        <nav className="px-2 space-y-0.5">
          {NAV_STUDY_TOOLS.map(
            ({
              key,
              icon: Icon,
              label,
              path,
            }) => (
              <button
                key={key}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left"
                style={
                  active === key
                    ? {
                        backgroundColor: "#F5EEFF",
                        color: "#8B5CF6",
                        fontWeight: 600,
                      }
                    : {
                        color: "#475569",
                      }
                }
              >
                <Icon size={16} />

                {sidebarOpen && label}
              </button>
            )
          )}
        </nav>

        {/* ==================================================
            WEEKLY EVENTS
        ================================================== */}

        {/* {sidebarOpen && (
          <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">
            WEEKLY EVENTS
          </p>
        )}

        <nav className="px-2 space-y-0.5">
          <button
            onClick={() =>
              navigate("/code-together")
            }
            className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left"
            style={
              active === "code-together"
                ? {
                    backgroundColor: "#F5EEFF",
                    color: "#8B5CF6",
                    fontWeight: 600,
                  }
                : {
                    color: "#475569",
                  }
            }
          >
            <span className="flex items-center gap-3">
              <Users2 size={16} />

              {sidebarOpen && "Code Together"}
            </span>

            {sidebarOpen && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "#EAF8FE",
                  color: "#1AACDB",
                }}
              >
                Today
              </span>
            )}
          </button>
        </nav> */}

        {/* ==================================================
            RESOURCES
        ================================================== */}

        {sidebarOpen && (
          <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">
            RESOURCES
          </p>
        )}

        <nav className="px-2 space-y-0.5">
          <button
            onClick={() =>
              navigate("/python-help-guide")
            }
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left"
            style={
              active === "python-help-guide"
                ? {
                    backgroundColor: "#F5EEFF",
                    color: "#8B5CF6",
                    fontWeight: 600,
                  }
                : {
                    color: "#475569",
                  }
            }
          >
            <FileQuestion size={16} />

            {sidebarOpen && "Python Help Guide"}
          </button>
        </nav>

        {/* ==================================================
            BOTTOM SECTION
        ================================================== */}

        <div className="mt-auto px-2 py-4 space-y-0.5 border-t border-slate-200">
          {/* PROFILE */}

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left"
            style={
              active === "profile"
                ? {
                    backgroundColor: "#F5EEFF",
                    color: "#8B5CF6",
                    fontWeight: 600,
                  }
                : {
                    color: "#475569",
                  }
            }
          >
            <User size={16} />

            {sidebarOpen && "Profile"}
          </button>

          {/* LOGOUT */}

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={16} />

            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ==================================================
          LOGOUT CONFIRMATION MODAL
      ================================================== */}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            {/* Icon */}

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <LogOut
                size={22}
                className="text-red-500"
              />
            </div>

            {/* Title */}

            <h2 className="text-center text-lg font-bold text-[#241B4E]">
              Logout
            </h2>

            {/* Message */}

            <p className="mt-2 text-center text-sm text-slate-500">
              Are you sure you want to logout?
            </p>

            <p className="mt-1 text-center text-xs text-slate-400">
              You will need to login again to access
              your dashboard.
            </p>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">
              {/* Cancel */}

              <button
                onClick={handleCancelLogout}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              {/* Logout */}

              <button
                onClick={handleConfirmLogout}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  background: SIDEBAR_GRADIENT,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}