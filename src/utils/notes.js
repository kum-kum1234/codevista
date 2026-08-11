import { getCurrentUser } from "./auth";

function storageKey() {
  const user = getCurrentUser();
  const id = user?.email || user?.phone || "guest";
  return `pythonkid_notes_${id}`;
}

function subjectsKey() {
  const user = getCurrentUser();
  const id = user?.email || user?.phone || "guest";
  return `pythonkid_subjects_${id}`;
}
export const DEFAULT_SUBJECTS = [
  { id: "python", name: "Python Programming", icon: "Laptop" },
  { id: "maths", name: "Mathematics", icon: "Calculator" },
  { id: "science", name: "Science", icon: "Atom" },
  { id: "reading", name: "Reading", icon: "BookOpen" },
  { id: "art", name: "Art & Design", icon: "Palette" },
  { id: "music", name: "Music", icon: "Music2" },
  { id: "social", name: "Social Studies", icon: "Globe2" },
  { id: "pe", name: "Physical Education", icon: "Users2" },
];

export function getSubjects() {
  try {
    const raw = localStorage.getItem(subjectsKey());
    if (!raw) {
      saveSubjects(DEFAULT_SUBJECTS);
      return DEFAULT_SUBJECTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
}

function saveSubjects(subjects) {
  localStorage.setItem(subjectsKey(), JSON.stringify(subjects));
}

export function addSubject({ name, icon = "BookOpen" }) {
  const subjects = getSubjects();
  const subject = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    icon,
  };
  const next = [...subjects, subject];
  saveSubjects(next);
  return next;
}

export function reorderSubjects(nextOrder) {
  saveSubjects(nextOrder);
  return nextOrder;
}

export function deleteSubject(id) {
  const next = getSubjects().filter((s) => s.id !== id);
  saveSubjects(next);
  return next;
}

export function getNotes() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(storageKey(), JSON.stringify(notes));
}

export function createNote({
  title = "",
  body = "",
  colorIndex = 0,
  subjectId = null,
} = {}) {
  const notes = getNotes();
  const now = Date.now();
  const note = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    body,
    colorIndex,
    subjectId,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  saveNotes([note, ...notes]);
  return note;
}

export function updateNote(id, changes) {
  const notes = getNotes();
  const next = notes.map((n) =>
    n.id === id ? { ...n, ...changes, updatedAt: Date.now() } : n
  );
  saveNotes(next);
  return next.find((n) => n.id === id) || null;
}

export function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  saveNotes(notes);
  return notes;
}

export function togglePin(id) {
  const target = getNotes().find((n) => n.id === id);
  if (!target) return getNotes();
  updateNote(id, { pinned: !target.pinned });
  return getNotes();
}