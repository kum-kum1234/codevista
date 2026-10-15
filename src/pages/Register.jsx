import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ChevronLeft } from "lucide-react";

import { FontLoader } from "../theme/playfulPalette";
import { API_URL } from "../config";
import { validatePassword } from "../utils/auth";

const LOGIN_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field) {
    return (e) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setError("");
      setSuccess("");
    };
  }

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // ================================
    // VALIDATION
    // ================================

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ================================
    // REGISTER USER
    // ================================

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Registration failed. Please try again."
        );
      }

      console.log(
        "✅ Registration successful:",
        data.user
      );

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // =================================
      // IMPORTANT
      // Do NOT automatically log in here.
      //
      // User should login using the
      // newly registered email/password.
      // =================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="font-body min-h-screen w-full flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #F5EEFF 0%, #EAF8FE 60%, #EAFBF1 100%)",
      }}
    >
      <FontLoader />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        {/* ==========================================
            LEFT PANEL
        ========================================== */}

        <div
          className="relative p-10 md:p-12 flex flex-col justify-center text-white"
          style={{
            background: LOGIN_GRADIENT,
          }}
        >
          <div className="flex items-center gap-2 mb-10">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black shadow-sm"
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.15)",
              }}
            >
              {"</>"}
            </span>

            <span className="font-display text-xl font-bold">
              CodeVista
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Start your coding journey
          </h1>

          <p className="text-lg text-white/90 mb-2">
            Create your CodeVista account.
          </p>

          <p className="text-white/70 mb-10">
            Learn Python, build projects, and
            track your progress.
          </p>

          <div className="space-y-5">

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <User size={18} />
              </span>

              <div>
                <p className="font-semibold">
                  Create your profile
                </p>

                <p className="text-sm text-white/70">
                  Keep your learning progress in one place.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Lock size={18} />
              </span>

              <div>
                <p className="font-semibold">
                  Secure password
                </p>

                <p className="text-sm text-white/70">
                  Your password is securely hashed by the backend.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Mail size={18} />
              </span>

              <div>
                <p className="font-semibold">
                  Login anytime
                </p>

                <p className="text-sm text-white/70">
                  Use the same email and password to login.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            RIGHT PANEL
        ========================================== */}

        <div className="bg-white p-10 md:p-12 flex flex-col items-center justify-center">

          <div className="w-full max-w-sm">

            {/* LOGO */}

            <div className="text-center mb-7">

              <div className="flex items-center justify-center gap-2 mb-1">

                <span
                  className="text-xl font-black"
                  style={{
                    color: "#8B5CF6",
                  }}
                >
                  {"</>"}
                </span>

                <span
                  className="font-display text-xl font-bold"
                  style={{
                    color: "#8B5CF6",
                  }}
                >
                  CodeVista
                </span>

              </div>

              <p className="text-sm text-slate-400">
                Made by Kids, for Kids
              </p>

            </div>

            {/* TITLE */}

            <h2 className="font-display text-2xl font-bold text-[#241B4E] text-center mb-2">
              Create your account
            </h2>

            <p className="text-sm text-slate-400 text-center mb-6">
              Join CodeVista and start learning.
            </p>

            {/* ERROR */}

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Name
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Phone number
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={update("phone")}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="8+ characters, letters and numbers"
                    value={form.password}
                    onChange={update("password")}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={update(
                      "confirmPassword"
                    )}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{
                  background: LOGIN_GRADIENT,
                }}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>

            {/* LOGIN LINK */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">

              <p className="text-sm text-slate-400">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-1 font-medium"
                style={{
                  color: "#8B5CF6",
                }}
              >
                Login here
              </button>

            </div>

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-slate-400 hover:text-[#241B4E]"
            >
              <ChevronLeft size={15} />
              Back to Login
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}