import React from "react";
import { useNavigate } from "react-router-dom";
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
import { getCurrentUser, initialsFromName } from "../utils/auth";

const NAV_MAIN = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { key: "courses", icon: BookOpen, label: "Courses", path: "/app/courses" },
  { key: "playground", icon: Code2, label: "Playground", path: "/playground" },
  { key: "turtle", icon: Palette, label: "Turtle Art Studio", path: "/turtle-art-studio" },
  { key: "achievements", icon: Award, label: "Achievements", path: "/achievements" },
  { key: "community", icon: Users, label: "Community", path: "/community" },
  { key: "help", icon: HelpCircle, label: "Help", path: "/help" },
];

const NAV_STUDY_TOOLS = [
  { key: "timetable", icon: Calendar, label: "My Timetable", path: "/my-timetable" },
  { key: "notes", icon: StickyNote, label: "My Notes", path: "/my-notes" },
];

export default function Sidebar({ active, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const user = getCurrentUser() || { name: "Guest", email: "Not signed in" };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-60" : "w-16"
      } shrink-0 border-r border-pk-border bg-white h-full overflow-y-auto transition-all duration-200 hidden md:flex md:flex-col`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <span className="text-pk-purple text-lg">{"</>"}</span>
            <span className="font-bold text-pk-text-dark">PythonKid</span>
          </div>
        )}
        <button onClick={() => setSidebarOpen((o) => !o)} className="text-slate-400 hover:text-slate-600">
          <ChevronLeft size={16} className={!sidebarOpen ? "rotate-180" : ""} />
        </button>
      </div>

      {sidebarOpen && (
        <div className="flex items-center gap-2 px-4 py-3 border-y border-pk-border">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-pk-orange-end">
            {initialsFromName(user.name)}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-pk-text-dark truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email || user.phone}</p>
          </div>
        </div>
      )}

      <nav className="px-2 py-3 space-y-0.5">
        {NAV_MAIN.map(({ key, icon: Icon, label, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left ${
              active === key
                ? "bg-orange-50 text-pk-orange-end font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={16} />
            {sidebarOpen && label}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">STUDY TOOLS</p>
      )}
      <nav className="px-2 space-y-0.5">
        {NAV_STUDY_TOOLS.map(({ key, icon: Icon, label, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left ${
              active === key
                ? "bg-orange-50 text-pk-orange-end font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={16} />
            {sidebarOpen && label}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">WEEKLY EVENTS</p>
      )}
      <nav className="px-2 space-y-0.5">
        <button
          onClick={() => navigate("/code-together")}
          className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left ${
            active === "code-together"
              ? "bg-orange-50 text-pk-orange-end font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span className="flex items-center gap-3">
            <Users2 size={16} />
            {sidebarOpen && "Code Together"}
          </span>
          {sidebarOpen && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-pk-orange-end">
              Today
            </span>
          )}
        </button>
      </nav>

      {sidebarOpen && (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wide text-slate-400">RESOURCES</p>
      )}
      <nav className="px-2 space-y-0.5">
        <button
          onClick={() => navigate("/python-help-guide")}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left ${
            active === "python-help-guide"
              ? "bg-orange-50 text-pk-orange-end font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileQuestion size={16} />
          {sidebarOpen && "Python Help Guide"}
        </button>
      </nav>

      <div className="mt-auto px-2 py-4 space-y-0.5 border-t border-pk-border">
        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left ${
            active === "profile"
              ? "bg-orange-50 text-pk-orange-end font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <User size={16} />
          {sidebarOpen && "Profile"}
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
        >
          <LogOut size={16} />
          {sidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
}