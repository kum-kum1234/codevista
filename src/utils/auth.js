// Lightweight "current user" store for demo/frontend-only auth.
// Swap this for real JWT/session handling once the backend is wired up.

const KEY = "pythonkid_user";

export function setCurrentUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(KEY);
}

// Turns "kumkum.goyal@gmail.com" into "Kumkum Goyal"
export function nameFromEmail(email) {
  const local = email.split("@")[0];
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// "Kumkum Goyal" -> "KG"
export function initialsFromName(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}