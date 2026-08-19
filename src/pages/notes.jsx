import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reorder } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  NotebookPen,
  Laptop,
  Calculator,
  Atom,
  BookOpen,
  Palette,
  Music2,
  Globe2,
  Users2,
  Folder,
  Download,
  GripVertical,
  X,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import { getCurrentUser } from "../utils/auth";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  getSubjects,
  addSubject,
  reorderSubjects,
} from "../utils/notes";

const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";
// Mapping of icon with react component.
const SUBJECT_ICONS = {
  Laptop,
  Calculator,
  Atom,
  BookOpen,
  Palette,
  Music2,
  Globe2,
  Users2,
};
const ICON_CHOICES = Object.keys(SUBJECT_ICONS);

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Notes() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  // Subject picker state
  const [subjects, setSubjects] = useState([]);
  const [view, setView] = useState("subjects"); // "subjects" | "editor"
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [notesSearch, setNotesSearch] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectIcon, setNewSubjectIcon] = useState(ICON_CHOICES[0]);

  useEffect(() => {
    setNotes(getNotes());
    setSubjects(getSubjects());
  }, []);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubjectId) || null,
    [subjects, selectedSubjectId]
  );

  function notesCountFor(subjectId) {
    return notes.filter((n) => n.subjectId === subjectId).length;
  }

  const globalSearchResults = useMemo(() => {
    const q = notesSearch.trim().toLowerCase();
    if (!q) return [];
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, notesSearch]);

  function openSubject(subjectId) {
    setSelectedSubjectId(subjectId);
    setActiveId(null);
    setQuery("");
    setView("editor");
  }

  function openNoteFromSearch(note) {
    setSelectedSubjectId(note.subjectId || null);
    setActiveId(note.id);
    setView("editor");
  }

  function handleAddSubject() {
    const name = newSubjectName.trim();
    if (!name) return;
    const next = addSubject({ name, icon: newSubjectIcon });
    setSubjects(next);
    setNewSubjectName("");
    setNewSubjectIcon(ICON_CHOICES[0]);
    setShowAddSubject(false);
  }

  function handleReorderSubjects(nextOrder) {
    setSubjects(nextOrder);
    reorderSubjects(nextOrder);
  }

  function handleExportAll() {
    if (notes.length === 0) return;

    const bySubject = new Map();
    for (const n of notes) {
      const key = n.subjectId || "none";
      if (!bySubject.has(key)) bySubject.set(key, []);
      bySubject.get(key).push(n);
    }

    const groups = [...subjects.map((s) => [s.id, s.name]), ["none", "Unsorted"]];

    const escapeHtml = (str = "") =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let bodyHtml = "";
    for (const [subjectId, subjectName] of groups) {
      const subjectNotes = (bySubject.get(subjectId) || []).sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      if (subjectNotes.length === 0) continue;

      bodyHtml += `<h2>${escapeHtml(subjectName)}</h2>`;
      for (const n of subjectNotes) {
        bodyHtml += `
          <div class="note">
            <h3>${escapeHtml(n.title || "Untitled note")}</h3>
            <p class="meta">Last edited ${new Date(n.updatedAt).toLocaleString()}</p>
            <p class="content">${escapeHtml(n.body || "(No content)")}</p>
          </div>`;
      }
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>My Notebook</title>
          <style>
            body { font-family: Arial, sans-serif; color: #241B4E; padding: 32px; }
            h1 { margin-bottom: 4px; }
            .exported-at { color: #888; font-size: 12px; margin-bottom: 24px; }
            h2 { margin-top: 28px; border-bottom: 2px solid #EEE7FF; padding-bottom: 4px; }
            .note { margin: 14px 0 20px; page-break-inside: avoid; }
            .note h3 { margin: 0 0 2px; font-size: 15px; }
            .meta { margin: 0 0 6px; color: #999; font-size: 11px; }
            .content { margin: 0; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>My Notebook</h1>
          <p class="exported-at">Exported ${new Date().toLocaleString()}</p>
          ${bodyHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeId) || null,
    [notes, activeId]
  );

  useEffect(() => {
    setDraftTitle(activeNote?.title || "");
    setDraftBody(activeNote?.body || "");
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bySubject = notes.filter((n) => n.subjectId === selectedSubjectId);
    const base = !q
      ? bySubject
      : bySubject.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.body.toLowerCase().includes(q)
        );
    return [...base].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, query, selectedSubjectId]);

  function handleNewNote() {
    const note = createNote({
      title: "",
      body: "",
      colorIndex: Math.floor(Math.random() * PALETTE.length),
      subjectId: selectedSubjectId,
    });
    setNotes(getNotes());
    setActiveId(note.id);
  }

  function handleSelect(id) {
    if (activeId) commitDraft();
    setActiveId(id);
  }

  function commitDraft() {
    if (!activeId) return;
    const current = notes.find((n) => n.id === activeId);
    if (!current) return;
    if (current.title === draftTitle && current.body === draftBody) return;
    updateNote(activeId, { title: draftTitle, body: draftBody });
    setNotes(getNotes());
  }

  function handleDelete(id) {
    const next = deleteNote(id);
    setNotes(next);
    if (activeId === id) setActiveId(null);
  }

  function handleTogglePin(id) {
    const next = togglePin(id);
    setNotes(next);
  }

  return (
    <AppLayout active="notes">
    <div className="font-body min-h-screen w-full bg-[#FDFCFA]">
      <FontLoader />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-[#EEE7FF] bg-white/90 px-6 py-3 backdrop-blur">
        <button
          onClick={() => {
            if (view === "editor") {
              setView("subjects");
              setActiveId(null);
            } else {
              navigate("/");
            }
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#241B4E]"
        >
          <ArrowLeft size={16} />
          {view === "editor" ? "Back to Subjects" : "Back to CodeVista"}
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white shadow-sm"
            style={{ background: GRADIENT }}
          >
            <NotebookPen size={14} />
          </span>
          <span className="font-display text-base font-extrabold text-[#241B4E]">
            My Notebook
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {user?.name ? user.name : "Guest"}
        </span>
      </header>

      {view === "subjects" && (
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={notesSearch}
                onChange={(e) => setNotesSearch(e.target.value)}
                placeholder="Search your notes..."
                className="w-full rounded-full border-2 border-[#EEE7FF] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": "rgba(139,92,246,0.25)" }}
              />
            </div>
            <button
              onClick={handleExportAll}
              disabled={notes.length === 0}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#EEE7FF] bg-white px-4 py-3 text-sm font-bold text-[#241B4E] shadow-sm transition-colors hover:bg-[#F5EEFF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Export All Notes (PDF)
            </button>
          </div>

          {notesSearch.trim() ? (
            <div className="mt-6 space-y-2">
              {globalSearchResults.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-[#EEE7FF] bg-white/50 px-4 py-8 text-center">
                  <p className="text-xs text-slate-400">No notes match your search.</p>
                </div>
              ) : (
                globalSearchResults.map((n) => {
                  const subj = subjects.find((s) => s.id === n.subjectId);
                  return (
                    <button
                      key={n.id}
                      onClick={() => openNoteFromSearch(n)}
                      className="block w-full rounded-xl border-2 border-[#F1EEFA] bg-white p-3 text-left transition-colors hover:border-[#DFCBFF] hover:bg-[#F5EEFF]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-[#241B4E]">
                          {n.title || "Untitled note"}
                        </p>
                        {subj && (
                          <span className="shrink-0 rounded-full bg-[#F5EEFF] px-2 py-0.5 text-[10px] font-bold text-[#8B5CF6]">
                            {subj.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {n.body ? n.body.slice(0, 80) : "No content yet"}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder size={20} className="text-[#E8A400]" />
                  <h2 className="font-display text-xl font-extrabold text-[#241B4E]">
                    Choose Your Subject
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">
                    (Drag to reorder!)
                  </span>
                </div>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                  style={{ background: GRADIENT }}
                >
                  <Plus size={14} />
                  Add Subject
                </button>
              </div>

              <Reorder.Group
                as="div"
                axis="y"
                values={subjects}
                onReorder={handleReorderSubjects}
                className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {subjects.map((s) => {
                  const Icon = SUBJECT_ICONS[s.icon] || BookOpen;
                  const count = notesCountFor(s.id);
                  return (
                    <Reorder.Item
                      key={s.id}
                      value={s}
                      as="div"
                      className="group relative cursor-grab rounded-2xl border-2 border-[#F1EEFA] bg-white p-5 text-center shadow-sm transition-colors hover:border-[#DFCBFF] active:cursor-grabbing"
                      whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: "0 8px 24px rgba(139,92,246,0.25)" }}
                    >
                      <GripVertical
                        size={13}
                        className="absolute right-2 top-2 text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <button
                        onClick={() => openSubject(s.id)}
                        className="flex w-full flex-col items-center gap-2"
                      >
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{ background: "#F5EEFF", color: "#8B5CF6" }}
                        >
                          <Icon size={22} />
                        </span>
                        <span className="text-sm font-bold text-[#241B4E]">
                          {s.name}
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            {count} note{count === 1 ? "" : "s"}
                          </span>
                        )}
                      </button>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </>
          )}
        </div>
      )}

      {showAddSubject && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-extrabold text-[#241B4E]">
                Add Subject
              </h3>
              <button
                onClick={() => setShowAddSubject(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
              >
                <X size={15} />
              </button>
            </div>

            <input
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Subject name"
              autoFocus
              className="mt-4 w-full rounded-xl border-2 border-[#EEE7FF] bg-white px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ "--tw-ring-color": "rgba(139,92,246,0.25)" }}
            />

            <p className="mt-4 text-xs font-semibold text-slate-400">Icon</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {ICON_CHOICES.map((key) => {
                const Icon = SUBJECT_ICONS[key];
                const isSelected = newSubjectIcon === key;
                return (
                  <button
                    key={key}
                    onClick={() => setNewSubjectIcon(key)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-colors"
                    style={{
                      borderColor: isSelected ? "#8B5CF6" : "#F1EEFA",
                      background: isSelected ? "#F5EEFF" : "white",
                      color: isSelected ? "#8B5CF6" : "#94A3B8",
                    }}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAddSubject}
              disabled={!newSubjectName.trim()}
              className="mt-5 w-full rounded-full py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: GRADIENT }}
            >
              Add Subject
            </button>
          </div>
        </div>
      )}

      {view === "editor" && (
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="w-full max-w-xs shrink-0">
          {selectedSubject && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#F5EEFF] px-3 py-2">
              {(() => {
                const Icon = SUBJECT_ICONS[selectedSubject.icon] || BookOpen;
                return <Icon size={14} className="text-[#8B5CF6]" />;
              })()}
              <span className="text-xs font-bold text-[#8B5CF6]">
                {selectedSubject.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-xl border-2 border-[#EEE7FF] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": "rgba(139,92,246,0.25)" }}
              />
            </div>
            <button
              onClick={handleNewNote}
              title="New note"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: GRADIENT }}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {filtered.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-[#EEE7FF] bg-white/50 px-4 py-8 text-center">
                <p className="text-xs text-slate-400">
                  {notes.length === 0
                    ? "No notes yet — write your first one."
                    : "No notes match your search."}
                </p>
              </div>
            )}

            {filtered.map((n) => {
              const c = PALETTE[n.colorIndex % PALETTE.length];
              const isActive = n.id === activeId;
              return (
                <button
                  key={n.id}
                  onClick={() => handleSelect(n.id)}
                  className="block w-full rounded-xl border-2 bg-white p-3 text-left transition-colors"
                  style={{
                    borderColor: isActive ? c.border : "#F1EEFA",
                    backgroundColor: isActive ? c.bg : "white",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {n.pinned && (
                      <Pin size={11} style={{ color: c.text }} className="shrink-0" />
                    )}
                    <p className="truncate text-sm font-bold text-[#241B4E]">
                      {n.title || "Untitled note"}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {n.body ? n.body.slice(0, 60) : "No content yet"}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold" style={{ color: c.text }}>
                    {timeAgo(n.updatedAt)}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          {!activeNote ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#EEE7FF] bg-white/50 text-center">
              <NotebookPen size={28} className="text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-400">
                Select a note, or create a new one
              </p>
              <button
                onClick={handleNewNote}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                style={{ background: GRADIENT }}
              >
                <Plus size={14} /> New note
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-[#EEE7FF] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={commitDraft}
                  placeholder="Untitled note"
                  className="font-display w-full text-xl font-extrabold text-[#241B4E] outline-none placeholder:text-slate-300"
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(activeNote.id)}
                    title={activeNote.pinned ? "Unpin" : "Pin"}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-[#241B4E]"
                  >
                    {activeNote.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(activeNote.id)}
                    title="Delete note"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                Last edited {timeAgo(activeNote.updatedAt)}
              </p>

              <textarea
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                onBlur={commitDraft}
                placeholder="Write what confused you, what clicked, or an idea for your next project..."
                className="mt-4 h-80 w-full resize-none text-sm leading-relaxed text-[#241B4E] outline-none placeholder:text-slate-300"
              />
            </div>
          )}
        </section>
      </div>
      )}
    </div>
    </AppLayout>
  );
}