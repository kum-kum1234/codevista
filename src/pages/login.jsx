import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Sparkles, Trophy, Rocket, BookOpen, User } from "lucide-react";
import { setCurrentUser, nameFromEmail } from "../utils/auth";
import { FontLoader, PALETTE } from "../theme/playfulPalette";

const LOGIN_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const FEATURES = [
  { icon: Sparkles, title: "Interactive Python Lessons", description: "Fun, hands-on coding challenges" },
  { icon: Trophy, title: "Earn Badges and Certificates", description: "Track every milestone you hit" },
  { icon: Rocket, title: "Python + Turtle Art", description: "Two creative ways to code" },
  { icon: BookOpen, title: "Curriculum for ages 8–14", description: "Structured, step-by-step learning path" },
];

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 5.4 29.2 3.4 24 3.4 12.7 3.4 3.6 12.5 3.6 23.8S12.7 44.2 24 44.2c11.3 0 20.4-9.1 20.4-20.4 0-1.3-.1-2.3-.4-3.3z" />
      <path fill="#FF3D00" d="M6.3 14.7l6 4.4C13.9 15.6 18.5 12.8 24 12.8c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 7.4 29.2 5.4 24 5.4c-7.3 0-13.6 4.1-16.7 10.1z" />
      <path fill="#4CAF50" d="M24 44.2c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.2c-2 1.4-4.6 2.3-7.2 2.3-5.3 0-9.7-3.5-11.3-8.4l-6.1 4.7C9.7 39.6 16.3 44.2 24 44.2z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.9 2.5-2.6 4.6-4.8 6l6.1 5.2c-.4.4 6.8-5 6.8-15.8 0-1.3-.1-2.3-.4-3.3z" />
    </svg>
  );
}

const MOCK_GOOGLE_ACCOUNTS = [
  { name: "Kumkum Goyal", email: "kumkum.goyal@gmail.com", color: "bg-purple-500" },
  { name: "Aryan Sharma", email: "aryan.sharma14@gmail.com", color: "bg-blue-500" },
  { name: "Priya Mehta", email: "priya.mehta@gmail.com", color: "bg-pink-500" },
];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | "email" | "phone"
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // DEMO MODE: no backend calls — just simulate a short delay, then go to /dashboard.
  // Swap the body of these handlers back to the axios calls once your backend is running.

  function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        name: nameFromEmail(form.email),
        email: form.email,
        provider: "email",
        accountType: "Free",
      });
      navigate("/dashboard");
    }, 500);
  }

  function handlePhoneSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!otpSent) {
        setOtpSent(true);
      } else {
        setCurrentUser({
          name: "CodeVista User",
          phone: form.phone,
          provider: "phone",
          accountType: "Free",
        });
        navigate("/dashboard");
      }
    }, 500);
  }

  function handleGoogleClick() {
    setShowGooglePicker(true);
  }

  function selectGoogleAccount(account) {
    setLoading(true);
    setShowGooglePicker(false);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        name: account.name,
        email: account.email,
        provider: "google",
        accountType: "Free",
      });
      navigate("/welcome");
    }, 500);
  }

  function handleAddAccountSubmit(e) {
    e.preventDefault();
    if (!newAccountEmail) return;
    selectGoogleAccount({
      name: nameFromEmail(newAccountEmail),
      email: newAccountEmail,
    });
  }

  return (
    <div
      className="font-body min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #F5EEFF 0%, #EAF8FE 60%, #EAFBF1 100%)" }}
    >
      <FontLoader />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left panel */}
        <div
          className="relative p-10 md:p-12 flex flex-col justify-center text-white"
          style={{ background: LOGIN_GRADIENT }}
        >
          <div className="flex items-center gap-2 mb-10">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black shadow-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {"</>"}
            </span>
            <span className="font-display text-xl font-bold">CodeVista</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Start your coding journey
          </h1>
          <p className="text-lg text-white/90 mb-1">Build with code, one lesson at a time.</p>
          <p className="text-white/70 mb-10">Made by kids, for kids aged 8–14.</p>

          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon size={18} />
                </span>
                <span>
                  <p className="font-semibold leading-tight">{title}</p>
                  <p className="text-sm text-white/70">{description}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel */}
        <div className="bg-white p-10 md:p-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xl font-black" style={{ color: "#8B5CF6" }}>{"</>"}</span>
                <span className="font-display text-xl font-bold" style={{ color: "#8B5CF6" }}>CodeVista</span>
              </div>
              <p className="text-sm text-slate-400">Made by Kids, for Kids</p>
            </div>

            <h2 className="font-display text-2xl font-bold text-[#241B4E] text-center mb-6">
              Welcome to CodeVista
            </h2>

            {mode === null && (
              <div className="space-y-3">
                <button
                  onClick={() => setMode("email")}
                  className="w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-[#241B4E] font-medium hover:bg-slate-50 transition-colors"
                  style={{ borderColor: PALETTE[5].border }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: PALETTE[5].bg }}
                  >
                    <Mail size={16} style={{ color: PALETTE[5].text }} />
                  </span>
                  Continue with Email
                </button>

                <button
                  onClick={() => setMode("phone")}
                  className="w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-[#241B4E] font-medium hover:bg-slate-50 transition-colors"
                  style={{ borderColor: PALETTE[2].border }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: PALETTE[2].bg }}
                  >
                    <Phone size={16} style={{ color: PALETTE[2].text }} />
                  </span>
                  Continue with Phone
                </button>

                <button
                  onClick={handleGoogleClick}
                  disabled={loading}
                  className="w-full flex items-center gap-3 rounded-xl border-2 border-slate-200 px-4 py-3 text-[#241B4E] font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                    <GoogleIcon />
                  </span>
                  {loading ? "Please wait..." : "Continue with Google"}
                </button>
              </div>
            )}

            {mode === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={update("email")}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={update("password")}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl px-4 py-3 font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: LOGIN_GRADIENT }}
                >
                  {loading ? "Please wait..." : "Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="w-full text-sm text-slate-400 hover:text-[#241B4E]"
                >
                  Back
                </button>
              </form>
            )}

            {mode === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-3">
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={update("phone")}
                  disabled={otpSent}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2 disabled:bg-slate-50"
                  style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                />
                {otpSent && (
                  <input
                    type="text"
                    required
                    placeholder="Enter OTP (any digits work in demo mode)"
                    value={form.otp}
                    onChange={update("otp")}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                    style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                  />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl px-4 py-3 font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: LOGIN_GRADIENT }}
                >
                  {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode(null);
                    setOtpSent(false);
                  }}
                  className="w-full text-sm text-slate-400 hover:text-[#241B4E]"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google account picker modal */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 text-center">
              <GoogleIcon className="mx-auto" />
              <h3 className="mt-3 text-lg font-medium text-slate-800">Choose an account</h3>
              <p className="mt-1 text-xs text-slate-500">to continue to CodeVista</p>
            </div>

            {!addingAccount ? (
              <>
                <div className="border-t border-slate-100">
                  {MOCK_GOOGLE_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => selectGoogleAccount(account)}
                      disabled={loading}
                      className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-slate-50 disabled:opacity-60"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${account.color} text-white text-sm font-semibold`}
                      >
                        {account.name[0]}
                      </span>
                      <span className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{account.name}</p>
                        <p className="text-xs text-slate-500 truncate">{account.email}</p>
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={() => setAddingAccount(true)}
                    className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-slate-50 border-t border-slate-100"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                      <User size={16} />
                    </span>
                    <span className="text-sm font-medium text-slate-800">Use another account</span>
                  </button>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowGooglePicker(false)}
                    className="text-sm font-medium"
                    style={{ color: "#8B5CF6" }}
                  >
                    Cancel
                  </button>
                  <p className="text-[10px] text-slate-400">This is a demo picker</p>
                </div>
              </>
            ) : (
              <form onSubmit={handleAddAccountSubmit} className="px-6 pb-6">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="Enter your email"
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                />
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingAccount(false);
                      setNewAccountEmail("");
                    }}
                    className="text-sm font-medium"
                    style={{ color: "#8B5CF6" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                    style={{ background: LOGIN_GRADIENT }}
                  >
                    {loading ? "Please wait..." : "Next"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}