// Frontend authentication state
// Stores the currently logged-in user in localStorage.

const KEY = "pythonkid_user";

// Save logged-in user
export function setCurrentUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

// Get currently logged-in user
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) {
      return null;
    }

    const user = JSON.parse(raw);

    if (!user || typeof user !== "object") {
      localStorage.removeItem(KEY);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Invalid authentication data:", error);
    localStorage.removeItem(KEY);
    return null;
  }
}

// Logout
export function clearCurrentUser() {
  localStorage.removeItem(KEY);
}

// Turns "kumkum.goyal@gmail.com" into "Kumkum Goyal"
export function nameFromEmail(email) {
  if (!email) return "";

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