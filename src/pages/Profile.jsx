import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Trophy,
  Flame,
  Lock,
  AlertTriangle,
  User as UserIcon,
  BookOpen,
  Award,
  Folder,
  Star,
  Shield,
  Phone,
  Mail,
  Check,
  ChevronLeft,
} from "lucide-react";
import { getCurrentUser, setCurrentUser, initialsFromName } from "../utils/auth";

const PROFILE_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = [
  { key: "account", label: "Account", icon: UserIcon },
  { key: "courses", label: "My Courses", icon: BookOpen },
  { key: "certificates", label: "Certificates", icon: Award },
  { key: "projects", label: "My Projects", icon: Folder },
  { key: "achievements", label: "Achievements", icon: Star },
  { key: "security", label: "Security", icon: Shield },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser() || { name: "Guest", email: "", provider: "email", accountType: "Free" });
  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState(user.name);
  const [mobile, setMobile] = useState(user.phone || "");
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    achievements: true,
    weeklyReport: true,
  });

  function handleSaveName() {
    const updated = { ...user, name: fullName };
    setCurrentUser(updated);
    setUser(updated);
  }

  function toggleNotification(key) {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  }

  const isGoogle = user.provider === "google";

  return (
    <AppLayout active="profile">
      {/* Page-specific header with back + user summary */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} className="text-slate-400" />
          <div className="text-left">
            <p className="text-[10px] font-bold tracking-wide text-slate-400">MY PROFILE</p>
            <p className="text-sm font-bold text-[#241B4E]">{user.name}</p>
            <p className="text-[10px] text-slate-400">Free Account</p>
          </div>
        </button>

        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{ background: PROFILE_GRADIENT }}
        >
          {initialsFromName(user.name)}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Overall progress */}
          <div className="rounded-xl border border-slate-200 p-4 mb-6" style={{ backgroundColor: "#F5EEFF" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#241B4E]">Overall Progress</p>
              <span className="text-xs font-bold" style={{ color: "#8B5CF6" }}>0%</span>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                <Trophy size={11} /> 0 Achievements
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                <Flame size={11} /> 1 day streak
              </span>
            </div>
            <button
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: PROFILE_GRADIENT }}
            >
              <Lock size={13} /> Upgrade to Premium
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-6 border-b border-slate-200 mb-6 text-xs font-semibold text-slate-400">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 pb-3 border-b-2 -mb-px"
                style={
                  activeTab === key
                    ? { borderColor: "#8B5CF6", color: "#8B5CF6" }
                    : { borderColor: "transparent" }
                }
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "account" && (
            <>
              {/* Complete profile banner */}
              <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 mb-6">
                <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-yellow-700">Complete your profile</p>
                  <p className="text-xs text-yellow-600">
                    Missing: Mobile number. Fill in the fields below to get the best experience.
                  </p>
                </div>
              </div>

              {/* How you're registered */}
              <p className="text-xs font-bold text-[#241B4E] mb-2">How you're registered</p>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 mb-6">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 text-xs font-bold">
                  G
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#241B4E]">
                    {isGoogle ? "Google Account" : user.provider === "phone" ? "Phone Account" : "Email Account"}
                  </p>
                  <p className="text-[10px] text-slate-400">via {user.provider || "email"}</p>
                </div>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                  Primary
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left / main column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Account information */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="font-bold text-[#241B4E]">Account Information</p>
                    <p className="text-xs text-slate-400 mb-4">
                      Manage your personal information and account settings.
                    </p>

                    <label className="text-xs font-semibold text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2"
                      style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                    />

                    <label className="text-xs font-semibold text-slate-500">Account Type</label>
                    <input
                      type="text"
                      value={user.accountType || "Free"}
                      disabled
                      className="mt-1 mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                    />

                    <button
                      onClick={handleSaveName}
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                      style={{ background: PROFILE_GRADIENT }}
                    >
                      Save Name
                    </button>
                  </div>

                  {/* Email address */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="font-bold text-[#241B4E]">Email Address</p>
                    <p className="text-xs text-slate-400 mb-4">
                      Change your sign-in email. A verification code will be sent to the new address.
                    </p>
                    {isGoogle ? (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-xs text-yellow-700">
                        Email change is not available for Google sign-in accounts. Contact support if you
                        need to update your email.
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm text-[#241B4E]">{user.email || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile number */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="flex items-center gap-2 font-bold text-[#241B4E]">
                      <Phone size={14} /> Mobile Number
                      <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[9px] font-bold text-yellow-600">
                        Missing
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      Verify your number to enable phone login. An SMS code will be sent.
                    </p>

                    <label className="text-xs font-semibold text-slate-500">Mobile Number</label>
                    <div className="mt-1 mb-3 flex">
                      <span className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full rounded-r-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2"
                        style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                      />
                    </div>
                    <button
                      disabled={!mobile}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-400 disabled:opacity-60"
                    >
                      Update Phone
                    </button>
                  </div>

                  {/* Notification settings */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="font-bold text-[#241B4E]">Notification Settings</p>
                    <p className="text-xs text-slate-400 mb-4">Control what notifications you receive.</p>

                    {[
                      { key: "courseUpdates", label: "Course updates", desc: "Receive notifications about course updates and new content" },
                      { key: "achievements", label: "Achievement notifications", desc: "Receive notifications when you earn new achievements" },
                      { key: "weeklyReport", label: "Weekly progress report", desc: "Receive a weekly email with your learning progress" },
                    ].map(({ key, label, desc }, i, arr) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between py-3 ${
                          i !== arr.length - 1 ? "border-b border-slate-200" : ""
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#241B4E]">{label}</p>
                          <p className="text-xs text-slate-400">{desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotification(key)}
                          className="relative h-6 w-11 shrink-0 rounded-full overflow-hidden transition-colors duration-200"
                          style={{ background: notifications[key] ? PROFILE_GRADIENT : "#E2E8F0" }}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              notifications[key] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column — subscription */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 h-fit">
                  <p className="font-bold text-[#241B4E]">Subscription</p>
                  <p className="text-xs text-slate-400 mb-4">Manage your CodeVista subscription</p>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 mb-4">
                    <p className="text-xs font-bold text-yellow-700">Free Account</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Upgrade to Premium for full access to all courses and features
                    </p>
                  </div>

                  <p className="text-xs font-bold text-[#241B4E] mb-2">Premium benefits:</p>
                  <ul className="space-y-2 text-xs text-slate-500 mb-4">
                    <li className="flex items-start gap-2">
                      <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                      Access to all courses and updates
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                      Project files and source code downloads
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                      Live coding sessions with instructors
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                      Certificates upon course completion
                    </li>
                  </ul>

                  <p className="text-center text-2xl font-extrabold" style={{ color: "#8B5CF6" }}>₹4,999</p>
                  <p className="text-center text-xs text-slate-400 mb-4">per annum</p>

                  <button
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    style={{ background: PROFILE_GRADIENT }}
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== "account" && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-400">
              {TABS.find((t) => t.key === activeTab)?.label} content goes here.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}