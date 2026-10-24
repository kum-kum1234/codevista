import React, { useEffect, useMemo, useState } from "react";
import {
  Users2,
  Calendar,
  Clock,
  Video,
  Users,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Cake,
  Phone,
  GraduationCap,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import { getCurrentUser } from "../utils/auth";
import {
  getCodeTogether,
  registerCodeTogether,
  cancelCodeTogetherRegistration,
} from "../services/api";

// Shared styling used throughout the Code Together experience.
const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

// Calendar labels used by the registration month view.
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Weekly day names shown in the schedule grid.
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Move a date to the next occurrence of the configured weekly session day.
function getNextScheduledDay(date, scheduleDay) {
  const result = new Date(date);
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = dayMap[scheduleDay] ?? 6;
  const currentDay = result.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;

  result.setDate(result.getDate() + daysUntilTarget);
  return result;
}

// Parse a time string such as "4:00 PM" into a usable JavaScript time object.
function parseScheduleTime(timeValue) {
  if (!timeValue) return null;

  const match = String(timeValue)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes > 59) return null;

  if (meridiem === "AM") {
    if (hours === 12) hours = 0;
  } else if (meridiem === "PM") {
    if (hours !== 12) hours += 12;
  }

  if (hours > 23) return null;

  return { hours, minutes };
}

// Build the actual session date for a scheduled weekly session.
function getSessionDate(date, scheduleDay, timeValue) {
  const sessionDate = getNextScheduledDay(date, scheduleDay);
  const parsed = parseScheduleTime(timeValue);

  if (parsed) {
    sessionDate.setHours(parsed.hours, parsed.minutes, 0, 0);
  } else {
    sessionDate.setHours(0, 0, 0, 0);
  }

  return sessionDate;
}

// Convert a Date into a YYYY-MM-DD key for consistent comparisons and storage.
function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Check whether two dates fall on the same calendar day.
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Default form object used when a parent opens the registration modal.
function emptyForm(user) {
  return {
    studentName: user?.name || "",
    age: "",
    grade: "",
    parentContact: user?.email || user?.phone || "",
    experience: "",
  };
}

// Fallback content shipped when the API has not yet returned page content.
const EMPTY_CONTENT = {
  banner: {
    label: "",
    title: "",
    description: "",
  },
  schedule: {
    day: "",
    startTime: "",
    endTime: "",
    timezone: "",
    where: "",
    whoCanJoin: "",
  },
  joinSteps: [],
  zoom: {
    title: "",
    joinText: "",
    joinUrl: "",
    registeredHelpText: "",
    unregisteredHelpText: "",
  },
  whatWeDo: [],
  parents: {
    title: "",
    description: "",
  },
  experienceLevels: [],
};

export default function CodeTogether() {
  // Capture the current date once so the page stays stable during a single render.
  const today = useMemo(() => new Date(), []);

  // Read the signed-in user data once and derive the best ID for API calls.
  const currentUser = useMemo(() => getCurrentUser(), []);
  const userId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.userId ||
    currentUser?.email ||
    currentUser?.phone ||
    "";

  // Page content from the backend, plus dates the current user has already registered for.
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [registrations, setRegistrations] = useState([]);

  // Calendar month currently being displayed in the registration list.
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  // Registration modal and form state.
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(() => emptyForm(currentUser));
  const [errors, setErrors] = useState({});
  // Feedback and loading indicators used across the page.
  const [justRegistered, setJustRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  // Keep the current time updated so the upcoming session banner stays accurate.
  const [now, setNow] = useState(() => new Date());

  // Refresh the live clock every 30 seconds to keep session timing current.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  // Load the page content and the signed-in user's session registrations from the API.
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setPageError("");

        const data = await getCodeTogether(userId);

        if (cancelled) return;

        setContent(data?.content || EMPTY_CONTENT);

        const dateKeys = Array.isArray(data?.registrations)
          ? data.registrations.map((item) => item.dateKey)
          : [];

        setRegistrations(dateKeys);
      } catch (error) {
        if (!cancelled) {
          console.error("Code Together loading error:", error);
          setPageError(error.message || "Failed to load Code Together.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Pull the most relevant content from the backend with safe fallback values.
  const schedule = content.schedule || EMPTY_CONTENT.schedule;
  const zoom = content.zoom || EMPTY_CONTENT.zoom;

  // Determine the next session start and end time based on the configured weekly schedule.
  const { sessionStart, sessionEnd } = useMemo(() => {
    const scheduleDay = schedule.day || "Saturday";
    const startTime = schedule.startTime || "4:00 PM";
    const endTime = schedule.endTime || "5:00 PM";

    const candidateStart = getSessionDate(
      now,
      scheduleDay,
      startTime
    );

    const candidateEnd = getSessionDate(
      now,
      scheduleDay,
      endTime
    );

    // If today's scheduled session is currently live, use it.
    if (now >= candidateStart && now < candidateEnd) {
      return {
        sessionStart: candidateStart,
        sessionEnd: candidateEnd,
      };
    }

    // If today's/future occurrence has not started yet, use it.
    if (now < candidateStart) {
      return {
        sessionStart: candidateStart,
        sessionEnd: candidateEnd,
      };
    }

    // Today's session has ended, so move to the next occurrence.
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);

    return {
      sessionStart: getSessionDate(
        nextDay,
        scheduleDay,
        startTime
      ),
      sessionEnd: getSessionDate(
        nextDay,
        scheduleDay,
        endTime
      ),
    };
  }, [
    now,
    schedule.day,
    schedule.startTime,
    schedule.endTime,
  ]);

  // The upcoming session key and registration state used by the CTA and status message.
  const nextSessionKey = toDateKey(sessionStart);
  const isCurrentSession =
    now >= sessionStart && now < sessionEnd;
  const isNextSessionRegistered =
    registrations.includes(nextSessionKey);

  // Build the correct Zoom join text depending on whether the learner is already registered.
  const joinStatus = {
    state: isNextSessionRegistered ? "registered" : "unregistered",
    buttonText:
      zoom.joinText || "Click here to join Code Together",
    message: isNextSessionRegistered
      ? `Meeting time: ${schedule.startTime || "4:00 PM"} – ${
          schedule.endTime || "5:00 PM"
        } ${schedule.timezone || ""}. Zoom will show the current meeting status.`
      : zoomMessage(
          "unregistered",
          schedule,
          sessionStart
        ),
  };

  // Backward-compatible alias used by older UI logic and labels on the page.
  const isNextSaturdayRegistered =
    registrations.includes(nextSessionKey);

  // Toggle a registration for a selected scheduled date.
  async function handleToggle(dateKey) {
    if (!userId || saving) return;

    try {
      setSaving(true);
      setPageError("");

      if (registrations.includes(dateKey)) {
        await cancelCodeTogetherRegistration(userId, dateKey);
        setRegistrations((current) =>
          current.filter((key) => key !== dateKey)
        );
      }
    } catch (error) {
      console.error("Code Together cancellation error:", error);
      setPageError(
        error.message || "Failed to cancel registration."
      );
    } finally {
      setSaving(false);
    }
  }

  // Open the registration form, or cancel the current registration if already registered.
  function openRegisterForm() {
    if (isNextSaturdayRegistered) {
      handleToggle(nextSessionKey);
      return;
    }

    setForm(emptyForm(currentUser));
    setErrors({});
    setPageError("");
    setShowForm(true);
  }

  // Update a single field in the registration form and clear only that field's error.
  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  // Validate the registration form before submitting to the backend.
  function validate() {
    const next = {};

    if (!form.studentName.trim()) {
      next.studentName = "Please enter the student's name.";
    }

    const ageNum = Number(form.age);

    if (!String(form.age).trim()) {
      next.age = "Please enter an age.";
    } else if (
      !Number.isInteger(ageNum) ||
      ageNum < 5 ||
      ageNum > 18
    ) {
      next.age = "Age should be between 5 and 18.";
    }

    if (!form.grade.trim()) {
      next.grade = "Please enter a grade.";
    }

    if (!form.parentContact.trim()) {
      next.parentContact =
        "Please add an email or phone number.";
    }

    if (!form.experience) {
      next.experience = "Pick a coding experience level.";
    }

    return next;
  }

  // Submit the registration payload and update the local registrations list after success.
  async function handleSubmit(e) {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0 || !userId) {
      if (!userId) {
        setPageError("Please sign in before registering.");
      }
      return;
    }

    try {
      setSaving(true);
      setPageError("");

      await registerCodeTogether(userId, {
        dateKey: nextSessionKey,
        ...form,
      });

      setRegistrations((current) =>
        current.includes(nextSessionKey)
          ? current
          : [...current, nextSessionKey]
      );

      setShowForm(false);
      setJustRegistered(true);

      setTimeout(() => {
        setJustRegistered(false);
      }, 4000);
    } catch (error) {
      console.error("Code Together registration error:", error);
      setPageError(
        error.message || "Failed to register for Code Together."
      );
    } finally {
      setSaving(false);
    }
  }

  // Move the calendar month forward or backward in the registrations view.
  function changeMonth(delta) {
    setViewDate(
      (d) => new Date(d.getFullYear(), d.getMonth() + delta, 1)
    );
  }

  // Build the grid for the current month so scheduled dates can be highlighted.
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    ),
  ];

  // Filter the user's registrations down to upcoming dates only.
  const upcomingRegistrations = registrations
    .filter(
      (k) =>
        new Date(k + "T00:00:00") >=
        new Date(toDateKey(today) + "T00:00:00")
    )
    .sort();

  // Show a loading state while the page data is still being fetched.
  if (loading) {
    return (
      <AppLayout active="code-together">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-2xl border border-pk-border bg-white px-6 py-5 text-sm font-semibold text-slate-500">
            Loading Code Together...
          </div>
        </div>
      </AppLayout>
    );
  }

  // Pull the dynamic experience options and content cards from the backend.
  const experienceLevels = Array.isArray(content.experienceLevels)
    ? content.experienceLevels
    : [];
  const joinSteps = Array.isArray(content.joinSteps)
    ? content.joinSteps
    : [];
  const whatWeDo = Array.isArray(content.whatWeDo)
    ? content.whatWeDo
    : [];

  return (
    <AppLayout active="code-together">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Errors from API calls or form validation are surfaced here at the top of the page. */}
        {pageError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
            {pageError}
          </div>
        )}
        {/* Header banner that introduces the Code Together community section. */}
        <div className="flex items-start gap-4 rounded-2xl border border-pk-border bg-white p-5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: PALETTE[5].bg, color: PALETTE[5].text }}
          >
            <Users2 size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-wide" style={{ color: PALETTE[0].text }}>
              {content.banner?.label || ""}
            </p>
            <h1 className="text-lg font-bold text-[#241B4E]">{content.banner?.title || "Code Together"}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {content.banner?.description || ""}
            </p>
          </div>
        </div>

        {/* Weekly recurring session details and the register/cancel action. */}
        <div className="rounded-2xl border border-pk-border bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ background: GRADIENT }}
            >
              <Calendar size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">Weekly Schedule</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
            <ScheduleItem
              icon={Calendar}
              label="Day"
              value={`Every ${schedule.day}`}
            />
            <ScheduleItem
              icon={Clock}
              label="Time"
              value={`${schedule.startTime} – ${schedule.endTime} (${schedule.timezone})`}
            />
            <ScheduleItem
              icon={Video}
              label="Where"
              value={schedule.where}
            />
            <ScheduleItem
              icon={Users}
              label="Who can join"
              value={schedule.whoCanJoin}
            />
          </div>

          <div className="mt-6 pt-5 border-t border-pk-border flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {isNextSaturdayRegistered
                ? `You're registered for the upcoming ${schedule.day} session:`
                : `Register for the upcoming ${schedule.day} session:`}
            </p>
            <button
              onClick={openRegisterForm}
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
              style={
                isNextSaturdayRegistered
                  ? { backgroundColor: "#EF4444" }
                  : { background: GRADIENT }
              }
            >
              {saving
                ? "Saving..."
                : isNextSaturdayRegistered
                  ? "Cancel Registration"
                  : "Register for Code Together"}
            </button>
          </div>

          {justRegistered && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-xs font-semibold"
              style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
            >
              🎉 You're all set for this {schedule.day}! We'll see {form.studentName || "you"} at {schedule.startTime} {schedule.timezone === "Indian Standard Time" ? "IST" : schedule.timezone}.
            </div>
          )}
        </div>

        {/* Step-by-step instructions for joining the live session and opening Zoom. */}
        <div className="rounded-2xl border border-pk-border bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: PALETTE[0].bg, color: PALETTE[0].text }}
            >
              <HelpCircle size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">How to Join In</h2>
          </div>

          <ol className="space-y-3 mb-6">
            {joinSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#241B4E]">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: GRADIENT }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="border-t border-pk-border pt-6 text-center">
            <h3 className="text-sm font-bold text-[#241B4E] mb-3">{zoom.title}</h3>
            <button
              disabled={!zoom.joinUrl}
              onClick={() => {
                if (zoom.joinUrl) {
                  window.open(
                    zoom.joinUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              className="rounded-xl px-8 py-3 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PALETTE[5].text }}
              title={
                zoom.joinUrl
                  ? "Open the Zoom meeting"
                  : "Zoom meeting link is not configured"
              }
            >
              {joinStatus.buttonText}
            </button>

            <p className="text-xs text-slate-400 mt-3">
              {joinStatus.message}
            </p>
          </div>
        </div>

        {/* The month-based registrations calendar that highlights scheduled and registered dates. */}
        <div className="rounded-2xl border border-pk-border bg-white p-6">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: PALETTE[0].bg, color: PALETTE[0].text }}
            >
              <Calendar size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">Your Registrations</h2>
          </div>
          <p className="text-xs text-slate-500 mb-5 ml-11">
            {schedule.day}s you're registered for are shown in purple. Click the upcoming purple
            session to cancel your registration.
          </p>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-sm font-bold" style={{ color: PALETTE[0].text }}>
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-[11px] font-semibold text-slate-400 pb-1">
                {w}
              </div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;

              const cellDate = new Date(year, month, day);
              const dateKey = toDateKey(cellDate);
              const dayMap = {
                Sunday: 0,
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6,
              };
              const isScheduledDay =
                cellDate.getDay() === (dayMap[schedule.day] ?? 6);
              const isToday = isSameDay(cellDate, today);
              const isPast =
                cellDate < new Date(toDateKey(today) + "T00:00:00");
              const registered = registrations.includes(dateKey);
              const clickable = isScheduledDay && !isPast;

              let circleStyle = {};
              let textClass = "text-slate-700";
              if (registered) {
                circleStyle = {
                  backgroundColor: PALETTE[4].text,
                  color: "white",
                };
              } else if (isScheduledDay) {
                circleStyle = {
                  backgroundColor: PALETTE[0].bg,
                  color: PALETTE[0].text,
                };
              }
              if (isPast && !registered) textClass = "text-slate-300";

              return (
                <div key={i} className="flex items-center justify-center py-0.5">
                  <button
                    disabled={!clickable}
                    onClick={() => clickable && handleToggle(dateKey)}
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${textClass} ${
                      clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                    }`}
                    style={{
                      ...circleStyle,
                      outline: isToday ? "2px solid #241B4E" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-pk-border text-center">
            {upcomingRegistrations.length === 0 ? (
              <p className="text-sm text-slate-400">
                You don't have any upcoming registrations yet. Register above for this session!
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                You're registered for{" "}
                <span className="font-semibold" style={{ color: PALETTE[4].text }}>
                  {upcomingRegistrations.length}
                </span>{" "}
                upcoming session{upcomingRegistrations.length > 1 ? "s" : ""}.
              </p>
            )}
          </div>
        </div>

        {/* The learning activities and experiences offered during the session. */}
        <div className="rounded-2xl border border-pk-border bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: PALETTE[0].bg, color: PALETTE[0].text }}
            >
              <MessageSquare size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whatWeDo.map((item, i) => {
              const chip = PALETTE[i % PALETTE.length];
              return (
                <div
                  key={item.text}
                  className="rounded-xl px-4 py-4 text-sm font-semibold flex items-center gap-3"
                  style={{ backgroundColor: chip.bg, color: chip.text }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Parent-facing reassurance section explaining the program and safety expectations. */}
        <div className="rounded-2xl border border-pk-border bg-white p-6 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
            >
              <ShieldCheck size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">{content.parents?.title || "For Parents"}</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {content.parents?.description || ""}
          </p>
        </div>
      </div>

      {/* Registration modal shown only after the learner selects the register action. */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ background: GRADIENT }}
                >
                  <Users2 size={16} />
                </span>
                <h2 className="text-base font-bold text-[#241B4E]">Register for Code Together</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5 ml-11">
              This {schedule.day}, {schedule.startTime} – {schedule.endTime} {schedule.timezone}. Just a few details so we can welcome you!
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <FormField
                icon={User}
                label="Student's name"
                error={errors.studentName}
              >
                <input
                  autoFocus
                  value={form.studentName}
                  onChange={(e) => updateField("studentName", e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className={inputClass(errors.studentName)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField icon={Cake} label="Age" error={errors.age}>
                  <input
                    type="number"
                    min={5}
                    max={18}
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="e.g. 10"
                    className={inputClass(errors.age)}
                  />
                </FormField>

                <FormField icon={GraduationCap} label="Grade" error={errors.grade}>
                  <input
                    value={form.grade}
                    onChange={(e) => updateField("grade", e.target.value)}
                    placeholder="e.g. 5th"
                    className={inputClass(errors.grade)}
                  />
                </FormField>
              </div>

              <FormField
                icon={Phone}
                label="Parent's email or phone"
                error={errors.parentContact}
              >
                <input
                  value={form.parentContact}
                  onChange={(e) => updateField("parentContact", e.target.value)}
                  placeholder="e.g. parent@email.com"
                  className={inputClass(errors.parentContact)}
                />
              </FormField>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                  Coding experience
                </label>
                <div className="flex flex-col gap-2">
                  {experienceLevels.map((level) => {
                    const selected = form.experience === level;
                    return (
                      <button
                        type="button"
                        key={level}
                        onClick={() => updateField("experience", level)}
                        className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold text-left transition-colors"
                        style={
                          selected
                            ? { backgroundColor: PALETTE[4].bg, color: PALETTE[4].text, borderColor: PALETTE[4].border }
                            : { backgroundColor: "white", color: "#475569", borderColor: "#E2E8F0" }
                        }
                      >
                        {level}
                        {selected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {errors.experience && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.experience}</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-5">
                <button
                  type="submit"
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: GRADIENT }}
                >
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
}

// Format a Date into a readable day/month label used in status messaging.
function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function zoomMessage(state, schedule, sessionStart) {
  if (state === "unregistered") {
    return (
      schedule?.whoCanJoin
        ? `Register above to unlock the Zoom link. The session starts at ${
            schedule.startTime || formatTime(sessionStart)
          } ${schedule.timezone || ""}.`
        : "Register above to unlock the Zoom link."
    );
  }

  return "";
}

// Shared CSS class helper for form inputs with and without validation errors.
function inputClass(hasError) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:ring-red-100"
      : "border-slate-200 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
  }`;
}

// Reusable label-and-input wrapper used throughout the registration modal.
function FormField({ icon: Icon, label, error, children }) {
  return (
    <div className="mb-3">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
        <Icon size={12} />
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Simple row component used in the weekly schedule summary cards.
function ScheduleItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: PALETTE[0].bg, color: PALETTE[0].text }}
      >
        <Icon size={15} />
      </span>
      <div>
        <p className="text-[11px] font-semibold text-slate-400">{label}</p>
        <p className="text-sm font-bold text-[#241B4E]">{value}</p>
      </div>
    </div>
  );
}