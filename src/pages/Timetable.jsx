import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Clock, RotateCcw, Printer, Calendar } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import {
  DAYS,
  getTimetable,
  addSlot,
  removeSlot,
  setShowWeekend,
  setEntry,
  removeEntry,
  clearTimetable,
} from "../utils/timetable";

const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

function to12h(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function Timetable() {
  const [state, setState] = useState(getTimetable());
  const [editing, setEditing] = useState(null); // { slotId, dayKey, entry } | null
  const [addingSlot, setAddingSlot] = useState(false);
  const [newStart, setNewStart] = useState("16:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [confirmClear, setConfirmClear] = useState(false);

  const refresh = () => setState(getTimetable());

  const days = state.showWeekend ? DAYS : DAYS.filter((d) => d.key !== "sat" && d.key !== "sun");

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

  function saveEntry() {
    if (!editing.subject.trim()) return;
    setEntry(editing.slotId, editing.dayKey, {
      subject: editing.subject.trim(),
      note: editing.note.trim(),
      colorIndex: editing.colorIndex,
    });
    setEditing(null);
    refresh();
  }

  function deleteEntry() {
    removeEntry(editing.slotId, editing.dayKey);
    setEditing(null);
    refresh();
  }

  function handleAddSlot(e) {
    e.preventDefault();
    if (!newStart || !newEnd || newStart >= newEnd) return;
    addSlot(newStart, newEnd);
    setAddingSlot(false);
    setNewStart("16:00");
    setNewEnd("17:00");
    refresh();
  }

  function handleRemoveSlot(slotId) {
    removeSlot(slotId);
    refresh();
  }

  function toggleWeekend() {
    setShowWeekend(!state.showWeekend);
    refresh();
  }

  function handleClear() {
    clearTimetable();
    setConfirmClear(false);
    refresh();
  }

  return (
    <AppLayout active="timetable">
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
            <h1 className="text-lg font-bold text-[#241B4E]">My Timetable</h1>
            <p className="text-xs text-slate-500">
              Build your own weekly schedule — click any slot to add a class, study block, or break.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mr-2">
            <input type="checkbox" checked={state.showWeekend} onChange={toggleWeekend} />
            Show weekend
          </label>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-[720px] rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: `140px repeat(${days.length}, minmax(120px, 1fr))` }}
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
                    <Clock size={12} className="text-slate-300" />
                    {to12h(slot.start)} - {to12h(slot.end)}
                  </span>
                  <button
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 print:hidden"
                    title="Remove this time slot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {days.map((d) => {
                  const entry = state.entries[`${slot.id}_${d.key}`];
                  const chip = entry ? PALETTE[entry.colorIndex % PALETTE.length] : null;
                  return (
                    <button
                      key={d.key}
                      onClick={() => openCell(slot.id, d.key)}
                      className="border-b border-slate-200 last:border-r-0 border-r p-1.5 text-left align-top h-16"
                    >
                      {entry ? (
                        <div
                          className="h-full w-full rounded-lg px-2 py-1.5 flex flex-col justify-center overflow-hidden"
                          style={{ backgroundColor: chip.bg, border: `1px solid ${chip.border}` }}
                        >
                          <p className="text-xs font-bold truncate" style={{ color: chip.text }}>
                            {entry.subject}
                          </p>
                          {entry.note && (
                            <p className="text-[10px] text-slate-500 truncate">{entry.note}</p>
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
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Start</label>
                <input
                  type="time"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">End</label>
                <input
                  type="time"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-xs font-bold text-white"
                style={{ background: GRADIENT }}
              >
                Add slot
              </button>
              <button
                type="button"
                onClick={() => setAddingSlot(false)}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingSlot(true)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
            >
              <Plus size={14} /> Add a time slot
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
                {editing.isNew ? "Add to schedule" : "Edit schedule item"}
              </h2>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject / activity</label>
            <input
              autoFocus
              value={editing.subject}
              onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
              placeholder="e.g. Python Practice"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-3"
            />

            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Note (optional)</label>
            <input
              value={editing.note}
              onChange={(e) => setEditing({ ...editing, note: e.target.value })}
              placeholder="e.g. Room 4, or self-study"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-3"
            />

            <label className="block text-[11px] font-semibold text-slate-500 mb-2">Color</label>
            <div className="flex items-center gap-2 mb-4">
              {PALETTE.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setEditing({ ...editing, colorIndex: i })}
                  className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: c.solid,
                    outline: editing.colorIndex === i ? `2px solid ${c.solid}` : "none",
                    outlineOffset: "2px",
                  }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={saveEntry}
                disabled={!editing.subject.trim()}
                className="flex-1 rounded-lg py-2 text-sm font-bold text-white disabled:opacity-40"
                style={{ background: GRADIENT }}
              >
                Save
              </button>
              {!editing.isNew && (
                <button
                  onClick={deleteEntry}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
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
            <h2 className="text-sm font-bold text-[#241B4E] mb-2">Reset your timetable?</h2>
            <p className="text-xs text-slate-500 mb-4">
              This clears everything you've added and can't be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-bold text-white hover:bg-red-600"
              >
                Yes, reset it
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}