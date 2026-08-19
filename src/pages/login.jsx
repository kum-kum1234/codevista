import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Sparkles, Trophy, Rocket, BookOpen, User, ChevronLeft, Zap, Award, Layers } from "lucide-react";
import { setCurrentUser, nameFromEmail } from "../utils/auth";
import { FontLoader, PALETTE } from "../theme/playfulPalette";

const LOGIN_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const FEATURES = [
  { icon: Sparkles, title: "Interactive Python Lessons", description: "Fun, hands-on coding challenges" },
  { icon: Trophy, title: "Earn Badges and Certificates", description: "Track every milestone you hit" },
  { icon: Rocket, title: "Python + Turtle Art", description: "Two creative ways to code" },
  { icon: BookOpen, title: "Curriculum for ages 8–14", description: "Structured, step-by-step learning path" },
];

const UNREGISTERED_FEATURES = [
  { icon: Zap, title: "Learn Python from scratch", description: "No experience needed" },
  { icon: Award, title: "Certificates on completion", description: "Real achievements to be proud of" },
  { icon: Layers, title: "Structured 3-course path", description: "Beginner to advanced" },
];

// DEMO ONLY: used to simulate "email already registered" validation.
// Swap for a real POST /auth/check-email (or similar) once the backend exists.
const MOCK_TAKEN_EMAILS = ["kumkum.goyal@gmail.com", "aryan.sharma14@gmail.com"];

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
  const [loading, setLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState("");

  // Phone flow sub-stage: "enter" -> "unregistered" -> "otp" -> "create-account"
  const [phoneStage, setPhoneStage] = useState("enter");
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);
  const [resendSeconds, setResendSeconds] = useState(45);
  const otpRefs = useRef([]);

  // Account creation form (after OTP verify)
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [emailTakenError, setEmailTakenError] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Countdown timer for OTP resend
  useEffect(() => {
    if (phoneStage !== "otp") return;
    if (resendSeconds <= 0) return;
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phoneStage, resendSeconds]);

  function resetPhoneFlow() {
    setPhoneStage("enter");
    setForm((f) => ({ ...f, phone: "" }));
    setOtpBoxes(["", "", "", "", "", ""]);
    setResendSeconds(45);
    setAccountName("");
    setAccountEmail("");
    setAgreedTerms(false);
    setEmailTakenError(false);
  }

  // DEMO MODE: no backend calls — just simulate a short delay.
  // Swap these handlers for real API calls once your backend is running.

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

  function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // DEMO: always treat the number as unregistered to show the linking screen.
      // Swap this for a real "does this number exist?" API check.
      setPhoneStage("unregistered");
    }, 500);
  }

  function goToOtpStage() {
    setPhoneStage("otp");
    setResendSeconds(45);
    setOtpBoxes(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }

  function handleOtpBoxChange(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpBoxes((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Move on to account creation instead of logging straight in.
      setPhoneStage("create-account");
    }, 500);
  }

  function handleCreateAccountSubmit(e) {
    e.preventDefault();
    setEmailTakenError(false);

    if (accountEmail && MOCK_TAKEN_EMAILS.includes(accountEmail.trim().toLowerCase())) {
      setEmailTakenError(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        name: accountName.trim(),
        email: accountEmail.trim() || undefined,
        phone: form.phone,
        provider: "phone",
        accountType: "Free",
      });
      navigate("/dashboard");
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

  const currentFeatures =
    phoneStage === "unregistered" || phoneStage === "otp" || phoneStage === "create-account"
      ? UNREGISTERED_FEATURES
      : FEATURES;
  const heroTitle =
    phoneStage === "unregistered" || phoneStage === "otp" || phoneStage === "create-account"
      ? "Join thousands of young coders"
      : "Start your coding journey";
  const heroSubtitle =
    phoneStage === "unregistered" || phoneStage === "otp" || phoneStage === "create-account"
      ? "Your coding adventure starts here."
      : "Build with code, one lesson at a time.";
  const heroTagline =
    phoneStage === "unregistered" || phoneStage === "otp" || phoneStage === "create-account"
      ? "Created by Sahaj and Sujas, age 11, Bangalore."
      : "Made by kids, for kids aged 8–14.";

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
            {heroTitle}
          </h1>
          <p className="text-lg text-white/90 mb-1">{heroSubtitle}</p>
          <p className="text-white/70 mb-10">{heroTagline}</p>

          <ul className="space-y-5">
            {currentFeatures.map(({ icon: Icon, title, description }) => (
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
            {/* ---------------- Initial method picker ---------------- */}
            {mode === null && (
              <>
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
                    onClick={() => {
                      setMode("phone");
                      resetPhoneFlow();
                    }}
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
              </>
            )}

            {/* ---------------- Email form ---------------- */}
            {mode === "email" && (
              <>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl font-black" style={{ color: "#8B5CF6" }}>{"</>"}</span>
                    <span className="font-display text-xl font-bold" style={{ color: "#8B5CF6" }}>CodeVista</span>
                  </div>
                  <p className="text-sm text-slate-400">Made by Kids, for Kids</p>
                </div>

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
              </>
            )}

            {/* ---------------- Phone flow ---------------- */}
            {mode === "phone" && (
              <>
                {/* Shared compact header for all phone-flow screens */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black" style={{ color: "#8B5CF6" }}>{"</>"}</span>
                    <span className="font-display text-lg font-bold" style={{ color: "#8B5CF6" }}>CodeVista</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Made by Kids, for Kids</p>
                </div>

                <button
                  onClick={() => {
                    if (phoneStage === "enter") {
                      setMode(null);
                    } else if (phoneStage === "unregistered") {
                      setPhoneStage("enter");
                    } else if (phoneStage === "otp") {
                      setPhoneStage("unregistered");
                    } else {
                      setPhoneStage("otp");
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-[#241B4E] mb-4"
                >
                  <ChevronLeft size={15} /> Back
                </button>

                {/* Stage 1: enter phone number */}
                {phoneStage === "enter" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">Continue with Phone</h2>
                    <p className="text-sm text-slate-400 mb-5">Enter your mobile number to receive a one-time code.</p>

                    <form onSubmit={handleSendOtp}>
                      <label className="text-xs font-semibold text-slate-500">Mobile Number</label>
                      <div className="mt-1.5 mb-5 flex">
                        <span
                          className="flex items-center gap-1 rounded-l-xl border-2 border-r-0 px-3 text-sm text-slate-500"
                          style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}
                        >
                          IN +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={update("phone")}
                          placeholder="9171738097"
                          className="w-full rounded-r-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                          style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{ background: LOGIN_GRADIENT }}
                      >
                        {loading ? "Please wait..." : "Send OTP"}
                      </button>
                    </form>

                    <div className="mt-5 space-y-2.5 text-center border-t border-slate-100 pt-4">
                      <button
                        onClick={() => setMode("email")}
                        className="block w-full text-sm font-medium"
                        style={{ color: "#8B5CF6" }}
                      >
                        Sign in with Email instead
                      </button>
                      <button
                        onClick={handleGoogleClick}
                        className="block w-full text-sm font-medium"
                        style={{ color: "#8B5CF6" }}
                      >
                        Sign in with Google
                      </button>
                      <button
                        onClick={() => setMode("email")}
                        className="block w-full text-sm font-medium text-red-500"
                      >
                        Use email instead
                      </button>
                    </div>
                  </>
                )}

                {/* Stage 2: number not linked yet */}
                {phoneStage === "unregistered" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">This number isn't linked yet.</h2>
                    <p className="text-sm mb-6" style={{ color: "#8B5CF6" }}>+91{form.phone}</p>

                    <div className="space-y-3">
                      <button
                        onClick={goToOtpStage}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: LOGIN_GRADIENT }}
                      >
                        Create an account with this number
                      </button>
                      <button
                        onClick={goToOtpStage}
                        className="w-full rounded-xl border-2 px-4 py-3 font-semibold hover:bg-slate-50 transition-colors"
                        style={{ borderColor: "#8B5CF6", color: "#8B5CF6" }}
                      >
                        Link this number to an existing account
                      </button>
                    </div>

                    <button
                      onClick={() => setPhoneStage("enter")}
                      className="mt-5 block w-full text-center text-sm text-slate-400 hover:text-[#241B4E]"
                    >
                      Use a different number
                    </button>
                  </>
                )}

                {/* Stage 3: enter OTP */}
                {phoneStage === "otp" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">
                      Enter the code sent to your number.
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                      A 6-digit code was sent to <span style={{ color: "#8B5CF6" }}>+91{form.phone}</span>.
                    </p>

                    <form onSubmit={handleVerifyOtp}>
                      <div className="flex justify-between gap-2 mb-6">
                        {otpBoxes.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => (otpRefs.current[i] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpBoxChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="h-12 w-11 rounded-xl border-2 border-slate-200 text-center text-lg font-bold outline-none focus:ring-2"
                            style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpBoxes.some((d) => !d)}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{ background: LOGIN_GRADIENT }}
                      >
                        {loading ? "Please wait..." : "Verify Code"}
                      </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                      {resendSeconds > 0 ? (
                        <span className="text-slate-400">Resend code in {resendSeconds}s</span>
                      ) : (
                        <button
                          onClick={() => setResendSeconds(45)}
                          className="font-medium"
                          style={{ color: "#8B5CF6" }}
                        >
                          Resend code
                        </button>
                      )}
                    </div>

                    <div className="mt-5 space-y-2.5 text-center border-t border-slate-100 pt-4">
                      <button
                        onClick={() => setPhoneStage("enter")}
                        className="block w-full text-sm font-medium"
                        style={{ color: "#8B5CF6" }}
                      >
                        Use a different number
                      </button>
                      <button
                        onClick={() => setMode("email")}
                        className="block w-full text-sm font-medium"
                        style={{ color: "#8B5CF6" }}
                      >
                        Sign in with Email instead
                      </button>
                      <button
                        onClick={handleGoogleClick}
                        className="block w-full text-sm font-medium"
                        style={{ color: "#8B5CF6" }}
                      >
                        Sign in with Google
                      </button>
                      <button
                        onClick={() => setMode("email")}
                        className="block w-full text-sm font-medium text-red-500"
                      >
                        Use email instead
                      </button>
                    </div>
                  </>
                )}

                {/* Stage 4: create account (after OTP verified) */}
                {phoneStage === "create-account" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">Create your account</h2>
                    <p className="text-sm text-slate-400 mb-6">
                      Your phone number was verified. Complete your profile below.
                    </p>

                    <form onSubmit={handleCreateAccountSubmit}>
                      <label className="text-xs font-semibold text-slate-500">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Your full name"
                        className="mt-1.5 mb-4 w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                        style={{ "--tw-ring-color": "rgba(139,92,246,0.3)" }}
                      />

                      <label className="text-xs font-semibold text-slate-500">
                        Email <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => {
                          setAccountEmail(e.target.value);
                          setEmailTakenError(false);
                        }}
                        placeholder="Your email address"
                        className="mt-1.5 w-full rounded-xl border-2 px-4 py-3 outline-none focus:ring-2"
                        style={{
                          borderColor: emailTakenError ? "#EF4444" : "#E2E8F0",
                          "--tw-ring-color": "rgba(139,92,246,0.3)",
                        }}
                      />
                      {emailTakenError && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          This email is already registered. Try signing in instead, or use a different email.
                        </p>
                      )}

                      <label className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                        <input
                          type="checkbox"
                          required
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          I agree to the{" "}
                          <span className="font-medium" style={{ color: "#8B5CF6" }}>Terms of Service</span> and{" "}
                          <span className="font-medium" style={{ color: "#8B5CF6" }}>Privacy Policy</span>{" "}
                          <span className="text-red-500">*</span>
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={loading || !accountName.trim() || !agreedTerms}
                        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{ background: LOGIN_GRADIENT }}
                      >
                        {loading ? "Please wait..." : "Create Account"}
                      </button>
                    </form>

                    <button
                      onClick={() => setPhoneStage("enter")}
                      className="mt-4 block w-full text-center text-sm underline"
                      style={{ color: "#8B5CF6" }}
                    >
                      Link to an existing account instead
                    </button>
                  </>
                )}
              </>
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