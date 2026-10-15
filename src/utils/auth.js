// src/utils/auth.js

const KEY = "pythonkid_user";
const TOKEN_KEY = "pythonkid_token";


// ======================================================
// ACCESS TOKEN (JWT issued by the backend on login)
// ======================================================

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// fetch() that sends the logged-in user's token automatically.
// If the server rejects that token (expired / invalid) with 401, the session
// is cleared; ProtectedRoute reacts to "auth-change" and redirects to /login.
export async function authFetch(url, options = {}) {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (token && response.status === 401) {
    clearCurrentUser();
  }

  return response;
}

// Same rules as the backend (routes/auth.js). Returns an error message or null.
export function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (new TextEncoder().encode(password).length > 72) {
    return "Password is too long (max 72 characters).";
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }

  return null;
}

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
  localStorage.removeItem(TOKEN_KEY);

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