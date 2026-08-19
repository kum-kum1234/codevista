import React, { useMemo, useState } from "react";
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
  getRegistrations,
  toggleRegistration,
  getNextSaturday,
  toDateKey,
  isSameDay,
} from "../utils/CodeTogether";

const EXPERIENCE_LEVELS = ["Just starting out", "Some experience", "Confident coder"];

function emptyForm(user) {
  return {
    studentName: user?.name || "",
    age: "",
    grade: "",
    parentContact: user?.email || user?.phone || "",
    experience: "",
  };
}

const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WHAT_WE_DO = [
  { icon: "🐍", text: "Show your Python projects" },
  { icon: "🙋", text: "Ask for help with tricky code" },
  { icon: "💡", text: "Learn something new from other kids" },
  { icon: "🎉", text: "Have fun with friends who code!" },
];

export default function CodeTogether() {
  const today = useMemo(() => new Date(), []);
  const nextSaturday = useMemo(() => getNextSaturday(today), [today]);
  const nextSaturdayKey = toDateKey(nextSaturday);

  const [registrations, setRegistrations] = useState(getRegistrations());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const currentUser = useMemo(() => getCurrentUser(), []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(() => emptyForm(currentUser));
  const [errors, setErrors] = useState({});
  const [justRegistered, setJustRegistered] = useState(false);

  const isNextSaturdayRegistered = registrations.includes(nextSaturdayKey);

  function handleToggle(dateKey) {
    setRegistrations(toggleRegistration(dateKey));
  }

  function openRegisterForm() {
    if (isNextSaturdayRegistered) {
      handleToggle(nextSaturdayKey);
      return;
    }
    setForm(emptyForm(currentUser));
    setErrors({});
    setShowForm(true);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.studentName.trim()) next.studentName = "Please enter the student's name.";
    const ageNum = Number(form.age);
    if (!form.age.trim()) next.age = "Please enter an age.";
    else if (!Number.isInteger(ageNum) || ageNum < 5 || ageNum > 18) {
      next.age = "Age should be between 5 and 18.";
    }
    if (!form.grade.trim()) next.grade = "Please enter a grade.";
    if (!form.parentContact.trim()) next.parentContact = "Please add an email or phone number.";
    if (!form.experience) next.experience = "Pick a coding experience level.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    handleToggle(nextSaturdayKey);
    setShowForm(false);
    setJustRegistered(true);
    setTimeout(() => setJustRegistered(false), 4000);
  }

  function changeMonth(delta) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  // Build the calendar grid (leading blanks + days of month)
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const upcomingRegistrations = registrations
    .filter((k) => new Date(k + "T00:00:00") >= new Date(toDateKey(today) + "T00:00:00"))
    .sort();

  return (
    <AppLayout active="code-together">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Community banner */}
        <div className="flex items-start gap-4 rounded-2xl border border-pk-border bg-white p-5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: PALETTE[5].bg, color: PALETTE[5].text }}
          >
            <Users2 size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-wide" style={{ color: PALETTE[0].text }}>
              COMMUNITY
            </p>
            <h1 className="text-lg font-bold text-[#241B4E]">Welcome to Code Together!</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Join our weekly Zoom meetups where CodeVista learners come together to code, create,
              and help each other.
            </p>
          </div>
        </div>

        {/* Weekly Schedule */}
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
            <ScheduleItem icon={Calendar} label="Day" value="Every Saturday" />
            <ScheduleItem icon={Clock} label="Time" value="4:00 PM – 5:00 PM (Indian Standard Time)" />
            <ScheduleItem icon={Video} label="Where" value="On Zoom (link below)" />
            <ScheduleItem icon={Users} label="Who can join" value="All CodeVista learners (ages 8–14)" />
          </div>

          <div className="mt-6 pt-5 border-t border-pk-border flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {isNextSaturdayRegistered
                ? "You're registered for this Saturday's session:"
                : "Register for this Saturday's session:"}
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
              {isNextSaturdayRegistered ? "Cancel Registration" : "Register for Code Together"}
            </button>
          </div>

          {justRegistered && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-xs font-semibold"
              style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
            >
              🎉 You're all set for this Saturday! We'll see {form.studentName || "you"} at 4:00 PM IST.
            </div>
          )}
        </div>

        {/* How to Join In */}
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
            {[
              "Click the Zoom link when it's time.",
              "Mute your mic unless you're talking.",
              "Be kind, be curious, and have fun.",
              "You can bring your code or just watch!",
            ].map((step, i) => (
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
            <h3 className="text-sm font-bold text-[#241B4E] mb-3">Join the Zoom Session</h3>
            <button
              disabled={!isNextSaturdayRegistered}
              className="rounded-xl px-8 py-3 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PALETTE[5].text }}
              title={
                isNextSaturdayRegistered
                  ? "Opens the Zoom session"
                  : "Register above to unlock the Zoom link"
              }
            >
              Click here to join Code Together
            </button>
            <p className="text-xs text-slate-400 mt-3">
              {isNextSaturdayRegistered
                ? "(Need help? Ask a parent to join you for the first time!)"
                : "(Register above to unlock this link — need help? Ask a parent to join you for the first time!)"}
            </p>
          </div>
        </div>

        {/* Your Registrations */}
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
            Saturdays you're registered for are shown in purple. Click the upcoming purple
            Saturday to cancel your registration.
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
              const isSaturday = cellDate.getDay() === 6;
              const isToday = isSameDay(cellDate, today);
              const isPast = cellDate < new Date(toDateKey(today) + "T00:00:00");
              const registered = registrations.includes(dateKey);
              const clickable = isSaturday && !isPast;

              let circleStyle = {};
              let textClass = "text-slate-700";
              if (registered) {
                circleStyle = { backgroundColor: PALETTE[4].text, color: "white" };
              } else if (isSaturday) {
                circleStyle = { backgroundColor: PALETTE[0].bg, color: PALETTE[0].text };
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
                You don't have any upcoming registrations yet. Register above for this Saturday!
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

        {/* What We Do */}
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
            {WHAT_WE_DO.map((item, i) => {
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

        {/* For Parents */}
        <div className="rounded-2xl border border-pk-border bg-white p-6 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
            >
              <ShieldCheck size={16} />
            </span>
            <h2 className="text-base font-bold text-[#241B4E]">For Parents</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            All sessions are monitored by the CodeVista team. There are no public recordings, and
            video is optional for kids. Safe, simple, and fun — just the way learning should be.
          </p>
        </div>
      </div>

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
              This Saturday, 4:00 PM – 5:00 PM IST. Just a few details so we can welcome you!
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
                  {EXPERIENCE_LEVELS.map((level) => {
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

function inputClass(hasError) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:ring-red-100"
      : "border-slate-200 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
  }`;
}

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