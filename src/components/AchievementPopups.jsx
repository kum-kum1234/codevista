import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, X } from "lucide-react";

import { getCurrentUser } from "../utils/auth";
import { getNotifications } from "../services/api";

const POLL_MS = 10000;
const SHOW_MS = 6000;
const MAX_SEEN = 200;

function readSeen(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : new Set(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeSeen(key, seen) {
  try {
    localStorage.setItem(key, JSON.stringify([...seen].slice(-MAX_SEEN)));
  } catch {
    // storage unavailable: popups may repeat after a reload, nothing else breaks
  }
}

// In-page popups for newly unlocked achievements / badges.
// Watches the user's saved notifications, so it also catches unlocks that
// happen on the server (lesson completed, project saved, ...).
export default function AchievementPopups() {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);

  const user = getCurrentUser();

  const userId =
    user?.id ||
    user?._id ||
    user?.userId ||
    user?.email ||
    user?.phone ||
    "";

  const seenRef = useRef(null);
  const busyRef = useRef(false);

  const dismiss = useCallback((id) => {
    setPopups((current) => current.filter((popup) => popup.id !== id));
  }, []);

  const check = useCallback(async () => {
    if (!userId || busyRef.current) return;

    busyRef.current = true;

    try {
      const response = await getNotifications(userId);

      const achievements = (response?.notifications || []).filter(
        (item) => item.type === "achievement"
      );

      const key = `achievement_popups_seen_${userId}`;

      if (!seenRef.current) seenRef.current = readSeen(key);

      // First run for this user: treat what already exists as seen,
      // so old unlocks do not pop up all at once.
      if (!seenRef.current) {
        seenRef.current = new Set(achievements.map((item) => item.id));
        writeSeen(key, seenRef.current);
        return;
      }

      const fresh = achievements
        .filter((item) => !seenRef.current.has(item.id))
        .reverse();

      if (!fresh.length) return;

      fresh.forEach((item) => seenRef.current.add(item.id));
      writeSeen(key, seenRef.current);

      setPopups((current) => [
        ...current,
        ...fresh.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          link: item.link || "/achievements",
        })),
      ]);
    } catch {
      // not logged in / offline: try again on the next poll
    } finally {
      busyRef.current = false;
    }
  }, [userId]);

  useEffect(() => {
    seenRef.current = null;

    if (!userId) {
      setPopups([]);
      return undefined;
    }

    check();

    const timer = setInterval(() => {
      if (!document.hidden) check();
    }, POLL_MS);

    window.addEventListener("achievements:check", check);

    return () => {
      clearInterval(timer);
      window.removeEventListener("achievements:check", check);
    };
  }, [userId, check]);

  // Each popup closes itself after a few seconds.
  useEffect(() => {
    if (!popups.length) return undefined;

    const timers = popups.map((popup) =>
      setTimeout(() => dismiss(popup.id), SHOW_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [popups, dismiss]);

  if (!popups.length) return null;

  return (
    <div className="fixed right-5 top-5 z-[100] flex w-80 flex-col gap-3">
      {popups.map((popup) => (
        <div
          key={popup.id}
          role="status"
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-purple-200 bg-white p-4 shadow-xl"
          onClick={() => {
            dismiss(popup.id);
            navigate(popup.link);
          }}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #1AACDB)",
            }}
          >
            <Award size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#241B4E]">{popup.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">{popup.message}</p>
          </div>

          <button
            type="button"
            aria-label="Close"
            className="shrink-0 text-slate-400 hover:text-slate-600"
            onClick={(event) => {
              event.stopPropagation();
              dismiss(popup.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
