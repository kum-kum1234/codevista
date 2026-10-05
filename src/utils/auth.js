// src/utils/auth.js

const KEY = "pythonkid_user";

// ======================================================
// SAVE CURRENT USER
// ======================================================

export function setCurrentUser(user) {
  if (!user || typeof user !== "object") {
    console.warn("Cannot save invalid user");
    return;
  }

  localStorage.setItem(KEY, JSON.stringify(user));

  window.dispatchEvent(new Event("auth-change"));
}


// ======================================================
// GET CURRENT USER
// ======================================================

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

    // userId is required
    if (!user.userId) {
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


// ======================================================
// CHECK LOGIN STATUS
// ======================================================

export function isLoggedIn() {
  return getCurrentUser() !== null;
}


// ======================================================
// CLEAR CURRENT USER / LOGOUT
// ======================================================

export function clearCurrentUser() {
  localStorage.removeItem(KEY);

  window.dispatchEvent(new Event("auth-change"));
}


// ======================================================
// EMAIL -> NAME
// ======================================================

export function nameFromEmail(email) {
  if (!email) {
    return "";
  }

  const local = email.split("@")[0];

  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


// ======================================================
// NAME -> INITIALS
// ======================================================

export function initialsFromName(name) {
  if (!name) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  return parts
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
    )
    .join("");
}