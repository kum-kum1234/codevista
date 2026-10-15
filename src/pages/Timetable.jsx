import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Clock,
  RotateCcw,
  Printer,
  Calendar,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import { getCurrentUser } from "../utils/auth";
import {
  getTimetable,
  saveTimetable,
  clearTimetable,
} from "../services/api";

const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];
const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
  `${String(hour).padStart(2, "0")}:00`
);
function to24h(t) {
  if (!t) return "";

  const [h, m] = t.split(":").map(Number);

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function createEntryMap(entries) {
  if (!Array.isArray(entries)) {
    return {};
  }

  const map = {};

  entries.forEach((entry) => {
    if (!entry?.slotId || !entry?.dayKey) {
      return;
    }

    map[`${entry.slotId}_${entry.dayKey}`] = {
      subject: entry.subject || "",
      note: entry.note || "",
      colorIndex: Number.isInteger(entry.colorIndex)
        ? entry.colorIndex
        : 4,
    };
  });

  return map;
}

function createEntryArray(entries) {
  return Object.entries(entries || {}).map(([key, entry]) => {
    const separatorIndex = key.lastIndexOf("_");

    return {
      slotId: key.substring(0, separatorIndex),
      dayKey: key.substring(separatorIndex + 1),
      subject: entry.subject || "",
      note: entry.note || "",
      colorIndex: Number.isInteger(entry.colorIndex)
        ? entry.colorIndex
        : 4,
    };
  });
}

export default function Timetable() {
  const [state, setState] = useState({
    slots: [],
    showWeekend: true,
    entries: {},
  });

  const [editing, setEditing] = useState(null);
  const [addingSlot, setAddingSlot] = useState(false);
  const [newStart, setNewStart] = useState("16:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [confirmClear, setConfirmClear] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const user = getCurrentUser();

  const userId =
    user?.id ||
    user?._id ||
    user?.userId ||
    user?.email ||
    user?.phone ||
    "";

  const days = state.showWeekend
    ? DAYS
    : DAYS.filter(
        (d) => d.key !== "sat" && d.key !== "sun"
      );

  useEffect(() => {
    async function loadTimetable() {
      if (!userId) {
        setError("Unable to identify the current user.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getTimetable(userId);

        const timetable =
          response?.timetable ||
          response?.data ||
          response ||
          {};

        setState({
          slots: Array.isArray(timetable.slots)
            ? timetable.slots
            : [],

          showWeekend:
            typeof timetable.showWeekend === "boolean"
              ? timetable.showWeekend
              : true,

          entries: createEntryMap(timetable.entries),
        });
      } catch (err) {
        console.error("Timetable loading error:", err);

        setError(
          "Could not load timetable. Please check your backend connection."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTimetable();
  }, [userId]);

  async function persistTimetable(nextState) {
    if (!userId) {
      setError("Unable to identify the current user.");
      return false;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        showWeekend: nextState.showWeekend,

        slots: nextState.slots,

        entries: createEntryArray(nextState.entries),
      };

      const response = await saveTimetable(
        userId,
        payload
      );

      const timetable = response?.timetable;

      if (timetable) {
        setState({
          slots: Array.isArray(timetable.slots)
            ? timetable.slots
            : nextState.slots,

          showWeekend:
            typeof timetable.showWeekend === "boolean"
              ? timetable.showWeekend
              : nextState.showWeekend,

          entries: createEntryMap(timetable.entries),
        });
      } else {
        setState(nextState);
      }

      return true;
    } catch (err) {
      console.error("Timetable save error:", err);

      setError("Could not save timetable.");

      return false;
    } finally {
      setSaving(false);
    }
  }

  function openCell(slotId, dayKey) {
    const key = `${slotId}_${dayKey}`;

    const existing = state.entries[key];

    setEditing({
      slotId,
      dayKey,
      subject: existing?.subject || "",
      note: existing?.note || "",
      colorIndex: existing?.colorIndex ?? 4,
      isNew: !existing,
    });
  }

  async function saveEntry() {
    if (!editing?.subject.trim()) {
      return;
    }

    const key = `${editing.slotId}_${editing.dayKey}`;

    const nextState = {
      ...state,

      entries: {
        ...state.entries,

        [key]: {
          subject: editing.subject.trim(),
          note: editing.note.trim(),
          colorIndex: editing.colorIndex,
        },
      },
    };

    const success = await persistTimetable(nextState);

    if (success) {
      setEditing(null);
    }
  }

  async function deleteEntry() {
    if (!editing) {
      return;
    }

    const key = `${editing.slotId}_${editing.dayKey}`;

    const nextEntries = {
      ...state.entries,
    };

    delete nextEntries[key];

    const nextState = {
      ...state,
      entries: nextEntries,
    };

    const success = await persistTimetable(nextState);

    if (success) {
      setEditing(null);
    }
  }

  async function handleAddSlot(e) {
    e.preventDefault();

    if (!newStart || !newEnd || newStart >= newEnd) {
      return;
    }

    const newSlot = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      start: newStart,
      end: newEnd,
    };

    const nextSlots = [
      ...state.slots,
      newSlot,
    ].sort((a, b) =>
      a.start.localeCompare(b.start)
    );

    const nextState = {
      ...state,
      slots: nextSlots,
    };

    const success = await persistTimetable(nextState);

    if (success) {
      setAddingSlot(false);
      setNewStart("16:00");
      setNewEnd("17:00");
    }
  }

  async function handleRemoveSlot(slotId) {
    const nextSlots = state.slots.filter(
      (slot) => slot.id !== slotId
    );

    const nextEntries = {};

    Object.entries(state.entries).forEach(
      ([key, entry]) => {
        if (!key.startsWith(`${slotId}_`)) {
          nextEntries[key] = entry;
        }
      }
    );

    const nextState = {
      ...state,
      slots: nextSlots,
      entries: nextEntries,
    };

    await persistTimetable(nextState);
  }

  async function toggleWeekend() {
    const nextState = {
      ...state,
      showWeekend: !state.showWeekend,
    };

    await persistTimetable(nextState);
  }

  async function handleClear() {
    if (!userId) {
      setError("Unable to identify the current user.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await clearTimetable(userId);

      const timetable = response?.timetable;

      if (timetable) {
        setState({
          slots: Array.isArray(timetable.slots)
            ? timetable.slots
            : [],

          showWeekend:
            typeof timetable.showWeekend === "boolean"
              ? timetable.showWeekend
              : true,

          entries: createEntryMap(timetable.entries),
        });
      }

      setConfirmClear(false);
    } catch (err) {
      console.error("Timetable reset error:", err);

      setError("Could not reset timetable.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout active="timetable">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading timetable...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout active="timetable">
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: GRADIENT }}
            >
              <Calendar size={18} />
            </span>

            <div>
              <h1 className="text-lg font-bold text-[#241B4E]">
                My Timetable
              </h1>

              <p className="text-xs text-slate-500">
                Build your own weekly schedule — click any slot to add a
                class, study block, or break.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mr-2">
              <input
                type="checkbox"
                checked={state.showWeekend}
                onChange={toggleWeekend}
                disabled={saving}
              />

              Show weekend
            </label>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Printer size={14} />
              Print
            </button>

            <button
              onClick={() => setConfirmClear(true)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 disabled:opacity-50"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-500">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[720px] rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `140px repeat(${days.length}, minmax(120px, 1fr))`,
              }}
            >
              {/* Header row */}
              <div className="bg-slate-50 border-b border-r border-slate-200 px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Time
              </div>

              {days.map((d) => (
                <div
                  key={d.key}
                  className="bg-slate-50 border-b border-slate-200 px-3 py-3 text-xs font-bold text-[#241B4E] text-center"
                >
                  {d.label}
                </div>
              ))}

              {/* Slot rows */}
              {state.slots.map((slot) => (
                <React.Fragment key={slot.id}>

                  <div className="border-r border-b border-slate-200 px-3 py-3 text-xs font-semibold text-slate-500 flex items-center justify-between group">
                    <span className="flex items-center gap-1.5">
                      <Clock
                        size={12}
                        className="text-slate-300"
                      />
                     {to24h(slot.start)} - {to24h(slot.end)}
                    </span>

                    <button
                      onClick={() =>
                        handleRemoveSlot(slot.id)
                      }
                      disabled={saving}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 print:hidden disabled:opacity-30"
                      title="Remove this time slot"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {days.map((d) => {
                    const entry =
                      state.entries[
                        `${slot.id}_${d.key}`
                      ];

                    const chip = entry
                      ? PALETTE[
                          entry.colorIndex %
                            PALETTE.length
                        ]
                      : null;

                    return (
                      <button
                        key={d.key}
                        onClick={() =>
                          openCell(
                            slot.id,
                            d.key
                          )
                        }
                        disabled={saving}
                        className="border-b border-slate-200 last:border-r-0 border-r p-1.5 text-left align-top h-16"
                      >
                        {entry ? (
                          <div
                            className="h-full w-full rounded-lg px-2 py-1.5 flex flex-col justify-center overflow-hidden"
                            style={{
                              backgroundColor:
                                chip.bg,

                              border: `1px solid ${chip.border}`,
                            }}
                          >
                            <p
                              className="text-xs font-bold truncate"
                              style={{
                                color: chip.text,
                              }}
                            >
                              {entry.subject}
                            </p>

                            {entry.note && (
                              <p className="text-[10px] text-slate-500 truncate">
                                {entry.note}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="h-full w-full rounded-lg flex items-center justify-center text-slate-200 hover:bg-slate-50 hover:text-slate-400 transition-colors print:hidden">
                            <Plus size={14} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Add slot */}
          <div className="mt-4 print:hidden">
            {addingSlot ? (
              <form
                onSubmit={handleAddSlot}
                className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 max-w-md"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Start
                  </label>

                  <select
  value={newStart}
  onChange={(e) => setNewStart(e.target.value)}
  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
>
  {TIME_OPTIONS.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    End
                  </label>

                  <select
  value={newEnd}
  onChange={(e) => setNewEnd(e.target.value)}
  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
>
  {TIME_OPTIONS.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                  style={{
                    background: GRADIENT,
                  }}
                >
                  {saving ? "Saving..." : "Add slot"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAddingSlot(false)
                  }
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() =>
                  setAddingSlot(true)
                }
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
              >
                <Plus size={14} />
                Add a time slot
              </button>
            )}
          </div>
        </div>

        {/* Edit entry modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#241B4E]">
                  {editing.isNew
                    ? "Add to schedule"
                    : "Edit schedule item"}
                </h2>

                <button
                  onClick={() =>
                    setEditing(null)
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Subject / activity
              </label>

              <input
                autoFocus
                value={editing.subject}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    subject: e.target.value,
                  })
                }
                placeholder="e.g. Python Practice"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-3"
              />

              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Note (optional)
              </label>

              <input
                value={editing.note}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    note: e.target.value,
                  })
                }
                placeholder="e.g. Room 4, or self-study"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-3"
              />

              <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                Color
              </label>

              <div className="flex items-center gap-2 mb-4">
                {PALETTE.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        colorIndex: i,
                      })
                    }
                    className="h-7 w-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        c.solid,

                      outline:
                        editing.colorIndex === i
                          ? `2px solid ${c.solid}`
                          : "none",

                      outlineOffset: "2px",
                    }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={saveEntry}
                  disabled={
                    !editing.subject.trim() ||
                    saving
                  }
                  className="flex-1 rounded-lg py-2 text-sm font-bold text-white disabled:opacity-40"
                  style={{
                    background: GRADIENT,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save"}
                </button>

                {!editing.isNew && (
                  <button
                    onClick={deleteEntry}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm clear modal */}
        {confirmClear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">

              <h2 className="text-sm font-bold text-[#241B4E] mb-2">
                Reset your timetable?
              </h2>

              <p className="text-xs text-slate-500 mb-4">
                This clears everything you've added and can't be undone.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {saving
                    ? "Resetting..."
                    : "Yes, reset it"}
                </button>

                <button
                  onClick={() =>
                    setConfirmClear(false)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}