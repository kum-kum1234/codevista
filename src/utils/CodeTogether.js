import { getCurrentUser } from "./auth";

function storageKey() {
  const user = getCurrentUser();
  const id = user?.email || user?.phone || "guest";
  return `codevista_code_together_${id}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b);
}

export function getNextSaturday(from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diff = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getRegistrations() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(storageKey(), JSON.stringify(list));
  return list;
}

export function isRegistered(dateKey) {
  return getRegistrations().includes(dateKey);
}

export function register(dateKey) {
  const list = getRegistrations();
  if (list.includes(dateKey)) return list;
  return save([...list, dateKey].sort());
}

export function unregister(dateKey) {
  const list = getRegistrations();
  return save(list.filter((k) => k !== dateKey));
}

export function toggleRegistration(dateKey) {
  return isRegistered(dateKey) ? unregister(dateKey) : register(dateKey);
}