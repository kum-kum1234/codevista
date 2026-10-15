import React, { useEffect, useState } from "react";
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
import {
  getProfile,
  getUserAchievements,
  updateProfile,
  updateProfileNotifications,
  createStripeCheckoutSession,
  getPaymentStatus,
} from "../services/api";
import {
  enableBrowserNotifications,
  disableBrowserNotifications,
} from "../utils/notifications";

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
  const initialUser = getCurrentUser() || {
    name: "Guest",
    email: "",
    provider: "email",
    accountType: "Free",
  };

  const [user, setUser] = useState(initialUser);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState(initialUser.name || "");
  const [mobile, setMobile] = useState(initialUser.phone || "");
  const [selectedAccountType, setSelectedAccountType] = useState(
    initialUser.accountType === "Premium" ? "Premium" : "Free"
  );
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    achievements: true,
    weeklyReport: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);

  const userId =
    initialUser?.id ||
    initialUser?._id ||
    initialUser?.userId ||
    initialUser?.email ||
    initialUser?.phone ||
    "guest";

  // Earned badges come from the achievements backend.
  useEffect(() => {
    let mounted = true;

    getUserAchievements(userId)
      .then((data) => {
        if (mounted) {
          setEarnedBadges((data?.badges || []).filter((badge) => badge.unlocked));
        }
      })
      .catch(() => {
        if (mounted) setEarnedBadges([]);
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile(userId);
        const loadedProfile = response?.profile || response;

        if (!mounted || !loadedProfile) return;

        setProfile(loadedProfile);

        const nextUser = {
          ...initialUser,
          name: loadedProfile.name || initialUser.name || "Guest",
          email: loadedProfile.email || initialUser.email || "",
          phone: loadedProfile.phone || "",
          provider: loadedProfile.provider || initialUser.provider || "email",
          accountType:
            loadedProfile.accountType || initialUser.accountType || "Free",
        };

        setUser(nextUser);
        setFullName(nextUser.name);
        setMobile(nextUser.phone);
        setSelectedAccountType(
          nextUser.accountType === "Premium" ? "Premium" : "Free"
        );

        setNotifications({
          courseUpdates:
            loadedProfile.notifications?.courseUpdates ?? true,
          achievements:
            loadedProfile.notifications?.achievements ?? true,
          weeklyReport:
            loadedProfile.notifications?.weeklyReport ?? true,
        });

        setCurrentUser(nextUser);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  function showSuccessToast(title, message) {
    setToast({
      type: "success",
      title,
      message,
    });

    window.setTimeout(() => setToast(null), 4000);
  }

  function showErrorToast(title, message) {
    setToast({
      type: "error",
      title,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  async function handleSaveName() {
    const trimmedName = fullName.trim();
    if (!trimmedName || savingName) return;

    try {
      setSavingName(true);
      setError("");

      const response = await updateProfile(userId, {
        name: trimmedName,
      });

      const updatedProfile = response?.profile || response;
      setProfile(updatedProfile);

      const updated = {
        ...user,
        name: updatedProfile.name || trimmedName,
      };

      setCurrentUser(updated);
      setUser(updated);
      setFullName(updated.name);

      showSuccessToast(
        "Profile updated",
        "Your profile information has been updated successfully."
      );
    } catch (err) {
      setError(err.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePhone() {
    const trimmedMobile = mobile.trim();

    if (!trimmedMobile || savingPhone) return;

    try {
      setSavingPhone(true);
      setError("");

      const response = await updateProfile(userId, {
        phone: trimmedMobile,
      });

      const updatedProfile = response?.profile || response;

      setProfile(updatedProfile);

      const updated = {
        ...user,
        phone: updatedProfile.phone || trimmedMobile,
      };

      setCurrentUser(updated);
      setUser(updated);
      setMobile(updated.phone);

      showSuccessToast(
        "Profile updated",
        "Your profile information has been updated successfully."
      );
    } catch (err) {
      if (err.code === "PHONE_ALREADY_REGISTERED") {
        showErrorToast(
          "Phone number already registered",
          "An account is already registered using this number."
        );
      } else {
        setError(err.message || "Failed to update phone");
      }
    } finally {
      setSavingPhone(false);
    }
  }
async function handleUpgradeToPremium() {
  if (paymentLoading || accountType === "Premium") {
    return;
  }

  try {
    setPaymentLoading(true);
    setError("");

    const response =
      await createStripeCheckoutSession(userId);

    if (!response?.url) {
      throw new Error(
        "Stripe checkout could not be created."
      );
    }

    window.location.href = response.url;
  } catch (err) {
    console.error(
      "Stripe payment error:",
      err
    );

    setPaymentLoading(false);

    if (err.code === "ALREADY_PREMIUM") {
      showSuccessToast(
        "Premium account",
        "This account already has Premium access."
      );
    } else {
      setError(
        err.message ||
          "Unable to start payment."
      );
    }
  }
}
  async function toggleNotification(key) {
    if (savingNotification) return;

    const nextValue = !notifications[key];
    const nextNotifications = {
      ...notifications,
      [key]: nextValue,
    };

    try {
      setSavingNotification(true);
      setError("");

      const response = await updateProfileNotifications(
        userId,
        nextNotifications
      );

      const updatedProfile = response?.profile || response;
      if (updatedProfile) setProfile(updatedProfile);

      // The browser has one push subscription for the user.
      // The three switches only control which notification types are allowed.
      if (nextValue) {
        await enableBrowserNotifications(userId);
      } else {
        const anyNotificationEnabled = Object.values(nextNotifications).some(Boolean);
        if (!anyNotificationEnabled) {
          await disableBrowserNotifications(userId);
        }
      }

      setNotifications(nextNotifications);
    } catch (err) {
      console.error("Notification update failed:", err);
      setError(
        err.message ||
          "Failed to update notification settings. Please allow browser notifications and try again."
      );
    } finally {
      setSavingNotification(false);
    }
  }

  const isGoogle = user.provider === "google";

  const overallProgress = profile?.overallProgress ?? 0;
  const achievementsCount = profile?.achievementsCount ?? 0;
  const streak = profile?.streak ?? 0;
  const accountType =
    profile?.accountType ||
    user.accountType ||
    selectedAccountType ||
    "Free";

  const subscription = profile?.subscription || {
    plan: accountType,
    description: "",
    benefits: [],
    price: 0,
    period: "per annum",
    status: "active",
  };

  const notificationItems = [
    {
      key: "courseUpdates",
      label: "Course updates",
      desc: "Receive notifications about course updates and new content",
    },
    {
      key: "achievements",
      label: "Achievement notifications",
      desc: "Receive notifications when you earn new achievements",
    },
    {
      key: "weeklyReport",
      label: "Weekly progress report",
      desc: "Receive a weekly email with your learning progress",
    },
  ];

  return (
    <AppLayout active="profile">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] w-[435px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-[#241B4E]">{toast.title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{toast.message}</p>
            </div>
            <button type="button" onClick={() => setToast(null)} className="shrink-0 text-slate-400 hover:text-slate-600" aria-label="Close notification">×</button>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto mt-3 max-w-5xl px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        </div>
      )}

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
            <p className="text-[10px] text-slate-400">{accountType} Account</p>
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
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 mb-6 text-xs text-slate-400">
              Loading profile...
            </div>
          )}

          {/* Overall progress */}
          <div className="rounded-xl border border-slate-200 p-4 mb-6" style={{ backgroundColor: "#F5EEFF" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#241B4E]">Overall Progress</p>
              <span className="text-xs font-bold" style={{ color: "#8B5CF6" }}>{overallProgress}%</span>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                <Trophy size={11} /> {achievementsCount} Achievement{achievementsCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                <Flame size={11} /> {streak} day{streak === 1 ? "" : "s"} streak
              </span>
            </div>

            <div className="mb-3">
              <p className="text-[10px] font-bold text-slate-500 mb-1.5">Badges</p>
              {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map((badge) => (
                    <button
                      key={badge.achievementId}
                      type="button"
                      onClick={() => navigate("/achievements")}
                      title={badge.description}
                      className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#8B5CF6] hover:bg-purple-50"
                    >
                      <Award size={11} /> {badge.title}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  No badges earned yet — keep learning to earn your first one.
                </p>
              )}
            </div>
            <button
  type="button"
  onClick={handleUpgradeToPremium}
  disabled={paymentLoading || accountType === "Premium"}
  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
  style={{ background: PROFILE_GRADIENT }}
>
  <Lock size={13} />

  {paymentLoading
    ? "Opening Payment..."
    : accountType === "Premium"
      ? "Premium Active"
      : "Upgrade to Premium"}
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
              {!user.phone && (
              <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 mb-6">
                <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-yellow-700">Complete your profile</p>
                  <p className="text-xs text-yellow-600">
                    Missing: Mobile number. Fill in the fields below to get the best experience.
                  </p>
                </div>
              </div>
              )}

              {/* How you're registered */}
              <p className="text-xs font-bold text-[#241B4E] mb-2">How you're registered</p>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 mb-6">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 text-xs font-bold">
                  {isGoogle ? "G" : (user.provider || "E").slice(0, 1).toUpperCase()}
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
                    <select
                      value={selectedAccountType}
                      onChange={(e) => setSelectedAccountType(e.target.value)}
                      className="mt-1 mb-4 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#241B4E] outline-none focus:ring-2"
                      style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                    >
                      <option value="Free">Free Account</option>
                      <option value="Premium">Premium Account</option>
                    </select>

                    <button
                      onClick={handleSaveName}
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                      style={{ background: PROFILE_GRADIENT }}
                    >
                      {savingName ? "Saving..." : "Save Name"}
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
                      {user.phone ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600">
                          <Check size={10} /> Saved
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[9px] font-bold text-yellow-600">
                          Missing
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      {user.phone
                        ? "Your mobile number is saved on your account."
                        : "Add your mobile number to secure your account."}
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
                      onClick={handleSavePhone}
                      disabled={
                        !mobile.trim() ||
                        mobile.trim() === (user.phone || "") ||
                        savingPhone
                      }
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      style={
                        !mobile.trim() || mobile.trim() === (user.phone || "") || savingPhone
                          ? undefined
                          : { background: PROFILE_GRADIENT }
                      }
                    >
                      {savingPhone
                        ? "Saving..."
                        : user.phone
                        ? "Update Phone"
                        : "Save Phone"}
                    </button>
                  </div>

                  {/* Notification settings */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="font-bold text-[#241B4E]">Notification Settings</p>
                    <p className="text-xs text-slate-400 mb-4">Control what notifications you receive.</p>
                   {savingNotification && (
                     <p className="mb-3 text-xs text-[#8B5CF6]">Updating notification settings...</p>
                   )}

                    {notificationItems.map(({ key, label, desc }, i, arr) => (
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
                          disabled={savingNotification}
                          aria-label={`Turn ${label} ${notifications[key] ? "off" : "on"}`}
                          className="relative h-6 w-11 shrink-0 rounded-full overflow-hidden transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <p className="text-xs font-bold text-yellow-700">{subscription.plan || accountType} Account</p>
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
  type="button"
  onClick={handleUpgradeToPremium}
  disabled={paymentLoading || accountType === "Premium"}
  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
  style={{ background: PROFILE_GRADIENT }}
>
  {paymentLoading
    ? "Opening Payment..."
    : accountType === "Premium"
      ? "Premium Active"
      : "Upgrade to Premium"}
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