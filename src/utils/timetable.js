import { getCurrentUser } from "./auth";

// Per-user storage key, same convention as utils/notes.js
function storageKey() {
  const user = getCurrentUser();
  const id = user?.email || user?.phone || "guest";
  return `pythonkid_timetable_${id}`;
}

export const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export const DEFAULT_SLOTS = [
  { id: "s1", start: "08:00", end: "09:00" },
  { id: "s2", start: "09:00", end: "10:00" },
  { id: "s3", start: "10:00", end: "11:00" },
  { id: "s4", start: "11:00", end: "12:00" },
  { id: "s5", start: "14:00", end: "15:00" },
  { id: "s6", start: "15:00", end: "16:00" },
];

const DEFAULT_STATE = {
  slots: DEFAULT_SLOTS,
  showWeekend: true,
  // entries keyed by `${slotId}_${dayKey}` -> { subject, note, colorIndex }
  entries: {},
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function entryKey(slotId, dayKey) {
  return `${slotId}_${dayKey}`;
}

export function getTimetable() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return { ...DEFAULT_STATE, slots: [...DEFAULT_SLOTS] };
    const parsed = JSON.parse(raw);
    return {
      slots: Array.isArray(parsed.slots) && parsed.slots.length ? parsed.slots : [...DEFAULT_SLOTS],
      showWeekend: parsed.showWeekend !== undefined ? parsed.showWeekend : true,
      entries: parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
    };
  } catch {
    return { ...DEFAULT_STATE, slots: [...DEFAULT_SLOTS] };
  }
}

function save(state) {
  localStorage.setItem(storageKey(), JSON.stringify(state));
  return state;
}

export function saveTimetable(state) {
  return save(state);
}

export function addSlot(start, end) {
  const state = getTimetable();
  const slots = [...state.slots, { id: newId(), start, end }].sort((a, b) =>
    a.start.localeCompare(b.start)
  );
  return save({ ...state, slots });
}

export function removeSlot(slotId) {
  const state = getTimetable();
  const slots = state.slots.filter((s) => s.id !== slotId);
  const entries = { ...state.entries };
  Object.keys(entries).forEach((k) => {
    if (k.startsWith(`${slotId}_`)) delete entries[k];
  });
  return save({ ...state, slots, entries });
}

export function setShowWeekend(showWeekend) {
  const state = getTimetable();
  return save({ ...state, showWeekend });
}

export function setEntry(slotId, dayKey, entry) {
  const state = getTimetable();
  const entries = { ...state.entries, [entryKey(slotId, dayKey)]: entry };
  return save({ ...state, entries });
}

export function removeEntry(slotId, dayKey) {
  const state = getTimetable();
  const entries = { ...state.entries };
  delete entries[entryKey(slotId, dayKey)];
  return save({ ...state, entries });
}

export function clearTimetable() {
  return save({ ...DEFAULT_STATE, slots: [...DEFAULT_SLOTS] });
}