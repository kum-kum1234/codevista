import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Sparkles,
  Trophy,
  Rocket,
  BookOpen,
  User,
  ChevronLeft,
  Zap,
  Award,
  Layers,
} from "lucide-react";

import { setCurrentUser, setAuthToken, validatePassword } from "../utils/auth";
import { API_URL } from "../config";
import { FontLoader, PALETTE } from "../theme/playfulPalette";

const LOGIN_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Interactive Python Lessons",
    description: "Fun, hands-on coding challenges",
  },
  {
    icon: Trophy,
    title: "Earn Badges and Certificates",
    description: "Track every milestone you hit",
  },
  {
    icon: Rocket,
    title: "Python + Turtle Art",
    description: "Two creative ways to code",
  },
  {
    icon: BookOpen,
    title: "Curriculum for ages 8–14",
    description: "Structured, step-by-step learning path",
  },
];

const UNREGISTERED_FEATURES = [
  {
    icon: Zap,
    title: "Learn Python from scratch",
    description: "No experience needed",
  },
  {
    icon: Award,
    title: "Certificates on completion",
    description: "Real achievements to be proud of",
  },
  {
    icon: Layers,
    title: "Structured 3-course path",
    description: "Beginner to advanced",
  },
];

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GSI_SCRIPT_ID = "google-gsi-client";

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 5.4 29.2 3.4 24 3.4 12.7 3.4 3.6 12.5 3.6 23.8S12.7 44.2 24 44.2c11.3 0 20.4-9.1 20.4-20.4 0-1.3-.1-2.3-.4-3.3z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6 4.4C13.9 15.6 18.5 12.8 24 12.8c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 7.4 29.2 5.4 24 5.4c-7.3 0-13.6 4.1-16.7 10.1z"
      />
      <path
        fill="#4CAF50"
        d="M24 44.2c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.2c-2 1.4-4.6 2.3-7.2 2.3-5.3 0-9.7-3.5-11.3-8.4l-6.1 4.7C9.7 39.6 16.3 44.2 24 44.2z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.9 2.5-2.6 4.6-4.8 6l6.1 5.2c-.4.4 6.8-5 6.8-15.8 0-1.3-.1-2.3-.4-3.3z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const googleBtnRef = useRef(null);

  // Phone flow:
  // enter -> unregistered -> otp
  const [phoneStage, setPhoneStage] = useState("enter");

  const [otpBoxes, setOtpBoxes] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [testOtp, setTestOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(45);

  const otpRefs = useRef([]);

  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));

  // =====================================================
  // OTP RESEND TIMER
  // =====================================================

  useEffect(() => {
    if (phoneStage !== "otp") return;
    if (resendSeconds <= 0) return;

    const t = setTimeout(
      () => setResendSeconds((s) => s - 1),
      1000
    );

    return () => clearTimeout(t);
  }, [phoneStage, resendSeconds]);

  // =====================================================
  // RESET PHONE FLOW
  // =====================================================

  function resetPhoneFlow() {
    setPhoneStage("enter");

    setForm((f) => ({
      ...f,
      phone: "",
    }));

    setOtpBoxes([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setTestOtp("");
    setResendSeconds(45);
  }

  // =====================================================
  // EMAIL LOGIN
  // =====================================================
  // NOTE:
  // This remains the existing frontend/demo email flow
  // because no email-login backend endpoint was provided.
  async function handleEmailSubmit(e) {
  e.preventDefault();

  const email = form.email.trim().toLowerCase();
  const password = form.password;

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || "Login failed. Please try again."
      );
    }

    // ---------------------------------------------
    // LOGIN SUCCESSFUL
    // ---------------------------------------------

    if (!data.user) {
      throw new Error("Invalid login response from server.");
    }

    setCurrentUser(data.user);
    setAuthToken(data.token);

    navigate("/dashboard", {
      replace: true,
    });

  } catch (error) {
    console.error("Email login failed:", error);

    alert(
      error.message ||
        "Incorrect email or password."
    );

  } finally {
    setLoading(false);
  }
}
 // =====================================================
// EMAIL REGISTRATION
// =====================================================

async function handleRegisterSubmit(e) {
  e.preventDefault();

  const email = form.email.trim().toLowerCase();
  const password = form.password;

  // -------------------------------------------------
  // VALIDATE INPUT
  // -------------------------------------------------

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    alert(passwordError);
    return;
  }

  setLoading(true);

  try {
    // -------------------------------------------------
    // CREATE ACCOUNT
    // -------------------------------------------------

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    // -------------------------------------------------
    // REGISTRATION FAILED
    // -------------------------------------------------

    if (!res.ok) {
      throw new Error(
        data.error ||
          "Registration failed. Please try again."
      );
    }

    // -------------------------------------------------
    // REGISTRATION SUCCESSFUL
    // -------------------------------------------------

    alert(
      "Account created successfully! Please login with your email and password."
    );

    // Clear password
    setForm((f) => ({
      ...f,
      password: "",
    }));

    // Go to email login screen
    setMode("email");

  } catch (error) {
    console.error(
      "Registration failed:",
      error
    );

    alert(
      error.message ||
        "Registration failed. Please try again."
    );

  } finally {
    setLoading(false);
  }
}
  
  // =====================================================
  // INITIAL PHONE BUTTON
  // =====================================================

  function handleSendOtp(e) {
    e.preventDefault();

    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) {
      alert("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Show the existing screen first.
    setPhoneStage("unregistered");
  }

  // =====================================================
  // SEND OTP
  // =====================================================

  async function sendOtp() {
    try {
      const res = await fetch(`${API_URL}/auth/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Couldn't send the code. Please try again."
        );
      }

      // Development/testing only.
      // If backend no longer returns OTP, this simply stays empty.
      if (data.otp) {
        setTestOtp(data.otp);
        console.log("Generated OTP:", data.otp);
      } else {
        setTestOtp("");
      }

      return true;
    } catch (err) {
      console.error("OTP send failed:", err);

      alert(
        err.message ||
          "Couldn't send the code. Please check the number and try again."
      );

      return false;
    }
  }

  // =====================================================
  // GO TO OTP SCREEN
  // =====================================================

  async function goToOtpStage() {
    setLoading(true);

    const sent = await sendOtp();

    setLoading(false);

    if (!sent) return;

    setPhoneStage("otp");

    setResendSeconds(45);

    setOtpBoxes([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 50);
  }

  // =====================================================
  // RESEND OTP
  // =====================================================

  async function handleResendOtp() {
    setLoading(true);

    const sent = await sendOtp();

    setLoading(false);

    if (sent) {
      setResendSeconds(45);
    }
  }

  // =====================================================
  // OTP BOX CHANGE
  // =====================================================

  function handleOtpBoxChange(index, value) {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    setOtpBoxes((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  // =====================================================
  // OTP BACKSPACE
  // =====================================================

  function handleOtpKeyDown(index, e) {
    if (
      e.key === "Backspace" &&
      !otpBoxes[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  // =====================================================
  // VERIFY OTP
  // =====================================================

  async function handleVerifyOtp(e) {
    e.preventDefault();

    const code = otpBoxes.join("");

    if (code.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/auth/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: form.phone,
            code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "That code didn't work. Please check it and try again."
        );
      }

      // =================================================
      // IMPORTANT
      // Backend now returns:
      //
      // {
      //   status: "approved",
      //   user: {...}
      // }
      //
      // Store that user locally and go to dashboard.
      // =================================================

      if (data.user) {
        setCurrentUser(data.user);
        setAuthToken(data.token);

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // Fallback in case backend only returns approved
      // without user information.
      setCurrentUser({
        phone: form.phone,
        provider: "phone",
        accountType: "Free",
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "OTP verify failed:",
        err
      );

      alert(
        err.message ||
          "That code didn't work. Please check it and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================
  // Google returns a signed ID token; the backend verifies it and
  // issues our own session token.

  function handleGoogleClick() {
    setShowGooglePicker(true);
  }

  async function handleGoogleCredential(response) {
    if (!response?.credential) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.user || !data.token) {
        throw new Error(
          data.error || "Google sign-in failed. Please try again."
        );
      }

      setCurrentUser(data.user);
      setAuthToken(data.token);
      setShowGooglePicker(false);

      navigate(data.isNewUser ? "/welcome" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Google sign-in failed:", err);
      alert(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load Google Identity Services and render its button when the modal opens.
  useEffect(() => {
    if (!showGooglePicker || !GOOGLE_CLIENT_ID) return;

    let cancelled = false;

    function init() {
      if (cancelled || !window.google?.accounts?.id || !googleBtnRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 280,
      });
    }

    if (window.google?.accounts?.id) {
      init();
    } else {
      let script = document.getElementById(GSI_SCRIPT_ID);

      if (!script) {
        script = document.createElement("script");
        script.id = GSI_SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", init);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGooglePicker]);

  // =====================================================
  // LEFT PANEL CONTENT
  // =====================================================

  const currentFeatures =
    phoneStage === "unregistered" ||
    phoneStage === "otp"
      ? UNREGISTERED_FEATURES
      : FEATURES;

  const heroTitle =
    phoneStage === "unregistered" ||
    phoneStage === "otp"
      ? "Join thousands of young coders"
      : "Start your coding journey";

  const heroSubtitle =
    phoneStage === "unregistered" ||
    phoneStage === "otp"
      ? "Your coding adventure starts here."
      : "Build with code, one lesson at a time.";

  const heroTagline =
    phoneStage === "unregistered" ||
    phoneStage === "otp"
      ? "Created by Sahaj and Sujas, age 11, Bangalore."
      : "Made by kids, for kids aged 8–14.";

  return (
    <div
      className="font-body min-h-screen w-full flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #F5EEFF 0%, #EAF8FE 60%, #EAFBF1 100%)",
      }}
    >
      <FontLoader />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        {/* =====================================================
            LEFT PANEL
        ===================================================== */}

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
            {heroTitle}
          </h1>

          <p className="text-lg text-white/90 mb-1">
            {heroSubtitle}
          </p>

          <p className="text-white/70 mb-10">
            {heroTagline}
          </p>

          <ul className="space-y-5">
            {currentFeatures.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <li
                  key={title}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon size={18} />
                  </span>

                  <span>
                    <p className="font-semibold leading-tight">
                      {title}
                    </p>

                    <p className="text-sm text-white/70">
                      {description}
                    </p>
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* =====================================================
            RIGHT PANEL
        ===================================================== */}

        <div className="bg-white p-10 md:p-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">

            {/* =================================================
                INITIAL METHOD PICKER
            ================================================= */}

            {mode === null && (
              <>
                <div className="text-center mb-8">
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

                <h2 className="font-display text-2xl font-bold text-[#241B4E] text-center mb-6">
                  Welcome to CodeVista
                </h2>

                <div className="space-y-3">

                  <button
                    onClick={() =>
                      setMode("email")
                    }
                    className="w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-[#241B4E] font-medium hover:bg-slate-50 transition-colors"
                    style={{
                      borderColor:
                        PALETTE[5].border,
                    }}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          PALETTE[5].bg,
                      }}
                    >
                      <Mail
                        size={16}
                        style={{
                          color:
                            PALETTE[5].text,
                        }}
                      />
                    </span>

                    Continue with Email
                  </button>

                  <button
                    onClick={() => {
                      setMode("phone");
                      resetPhoneFlow();
                    }}
                    className="w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-[#241B4E] font-medium hover:bg-slate-50 transition-colors"
                    style={{
                      borderColor:
                        PALETTE[2].border,
                    }}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          PALETTE[2].bg,
                      }}
                    >
                      <Phone
                        size={16}
                        style={{
                          color:
                            PALETTE[2].text,
                        }}
                      />
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

                    {loading
                      ? "Please wait..."
                      : "Continue with Google"}
                  </button>

                </div>
              </>
            )}

            {/* =================================================
                EMAIL FORM
            ================================================= */}

            {mode === "email" && (
              <>
                <div className="text-center mb-8">
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

                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={update("password")}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color":
                        "rgba(139,92,246,0.3)",
                    }}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl px-4 py-3 font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{
                      background:
                        LOGIN_GRADIENT,
                    }}
                  >
                    {loading
                      ? "Please wait..."
                      : "Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMode(null)
                    }
                    className="w-full text-sm text-slate-400 hover:text-[#241B4E]"
                  >
                    Back
                  </button>
                </form>
                <div className="mt-5 border-t border-slate-100 pt-4 text-center">
  <p className="text-sm text-slate-400">
    Don't have an account?
  </p>

  <button
    type="button"
    onClick={() => navigate("/register")}
    className="mt-1 text-sm font-medium"
    style={{
      color: "#8B5CF6",
    }}
  >
    Create an account
  </button>
</div>
              </>
            )}

            {/* =================================================
                PHONE FLOW
            ================================================= */}

            {mode === "phone" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg font-black"
                      style={{
                        color: "#8B5CF6",
                      }}
                    >
                      {"</>"}
                    </span>

                    <span
                      className="font-display text-lg font-bold"
                      style={{
                        color: "#8B5CF6",
                      }}
                    >
                      CodeVista
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Made by Kids, for Kids
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (
                      phoneStage ===
                      "enter"
                    ) {
                      setMode(null);
                    } else if (
                      phoneStage ===
                      "unregistered"
                    ) {
                      setPhoneStage(
                        "enter"
                      );
                    } else {
                      setPhoneStage(
                        "unregistered"
                      );
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-[#241B4E] mb-4"
                >
                  <ChevronLeft size={15} />
                  Back
                </button>

                {/* =================================================
                    PHONE ENTER
                ================================================= */}

                {phoneStage === "enter" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">
                      Continue with Phone
                    </h2>

                    <p className="text-sm text-slate-400 mb-5">
                      Enter your mobile number to receive a one-time code.
                    </p>

                    <form
                      onSubmit={
                        handleSendOtp
                      }
                    >
                      <label className="text-xs font-semibold text-slate-500">
                        Mobile Number
                      </label>

                      <div className="mt-1.5 mb-5 flex">
                        <span
                          className="flex items-center gap-1 rounded-l-xl border-2 border-r-0 px-3 text-sm text-slate-500"
                          style={{
                            borderColor:
                              "#E2E8F0",
                            backgroundColor:
                              "#F8FAFC",
                          }}
                        >
                          IN +91
                        </span>

                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={update(
                            "phone"
                          )}
                          placeholder="9171738097"
                          className="w-full rounded-r-xl border-2 border-slate-200 px-4 py-3 outline-none focus:ring-2"
                          style={{
                            "--tw-ring-color":
                              "rgba(139,92,246,0.3)",
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{
                          background:
                            LOGIN_GRADIENT,
                        }}
                      >
                        {loading
                          ? "Please wait..."
                          : "Continue"}
                      </button>
                    </form>

                    <div className="mt-5 space-y-2.5 text-center border-t border-slate-100 pt-4">
                      <button
                        onClick={() =>
                          setMode(
                            "email"
                          )
                        }
                        className="block w-full text-sm font-medium"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Sign in with Email instead
                      </button>

                      <button
                        onClick={
                          handleGoogleClick
                        }
                        className="block w-full text-sm font-medium"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </>
                )}

                {/* =================================================
                    PHONE CONFIRMATION
                ================================================= */}

                {phoneStage ===
                  "unregistered" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">
                      Continue with this number
                    </h2>

                    <p
                      className="text-sm mb-6"
                      style={{
                        color: "#8B5CF6",
                      }}
                    >
                      +91{form.phone}
                    </p>

                    <div className="space-y-3">

                      <button
                        onClick={
                          goToOtpStage
                        }
                        disabled={loading}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{
                          background:
                            LOGIN_GRADIENT,
                        }}
                      >
                        {loading
                          ? "Sending code..."
                          : "Send OTP"}
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        setPhoneStage(
                          "enter"
                        )
                      }
                      className="mt-5 block w-full text-center text-sm text-slate-400 hover:text-[#241B4E]"
                    >
                      Use a different number
                    </button>
                  </>
                )}

                {/* =================================================
                    OTP
                ================================================= */}

                {phoneStage ===
                  "otp" && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#241B4E] mb-1">
                      Enter the code sent to your number.
                    </h2>

                    <p className="text-sm text-slate-400 mb-6">
                      A 6-digit code was sent to{" "}
                      <span
                        style={{
                          color: "#8B5CF6",
                        }}
                      >
                        +91{form.phone}
                      </span>
                      .
                    </p>

                    {testOtp && (
                      <div className="mb-4 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 text-center">
                        <p className="text-xs text-slate-500">
                          Testing OTP
                        </p>

                        <p className="text-2xl font-bold tracking-widest text-purple-600">
                          {testOtp}
                        </p>
                      </div>
                    )}

                    <form
                      onSubmit={
                        handleVerifyOtp
                      }
                    >
                      <div className="flex justify-between gap-2 mb-6">
                        {otpBoxes.map(
                          (digit, i) => (
                            <input
                              key={i}
                              ref={(el) =>
                                (otpRefs.current[
                                  i
                                ] = el)
                              }
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpBoxChange(
                                  i,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                handleOtpKeyDown(
                                  i,
                                  e
                                )
                              }
                              className="h-12 w-11 rounded-xl border-2 border-slate-200 text-center text-lg font-bold outline-none focus:ring-2"
                              style={{
                                "--tw-ring-color":
                                  "rgba(139,92,246,0.3)",
                              }}
                            />
                          )
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={
                          loading ||
                          otpBoxes.some(
                            (d) => !d
                          )
                        }
                        className="w-full rounded-xl px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{
                          background:
                            LOGIN_GRADIENT,
                        }}
                      >
                        {loading
                          ? "Verifying..."
                          : "Verify Code"}
                      </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                      {resendSeconds >
                      0 ? (
                        <span className="text-slate-400">
                          Resend code in{" "}
                          {
                            resendSeconds
                          }
                          s
                        </span>
                      ) : (
                        <button
                          onClick={
                            handleResendOtp
                          }
                          disabled={
                            loading
                          }
                          className="font-medium disabled:opacity-60"
                          style={{
                            color:
                              "#8B5CF6",
                          }}
                        >
                          {loading
                            ? "Sending..."
                            : "Resend code"}
                        </button>
                      )}
                    </div>

                    <div className="mt-5 space-y-2.5 text-center border-t border-slate-100 pt-4">
                      <button
                        onClick={() =>
                          setPhoneStage(
                            "enter"
                          )
                        }
                        className="block w-full text-sm font-medium"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Use a different number
                      </button>

                      <button
                        onClick={() =>
                          setMode(
                            "email"
                          )
                        }
                        className="block w-full text-sm font-medium"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Sign in with Email instead
                      </button>

                      <button
                        onClick={
                          handleGoogleClick
                        }
                        className="block w-full text-sm font-medium"
                        style={{
                          color:
                            "#8B5CF6",
                        }}
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          GOOGLE SIGN-IN (Google Identity Services)
      ===================================================== */}

      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 text-center">
              <GoogleIcon className="mx-auto" />

              <h3 className="mt-3 text-lg font-medium text-slate-800">
                Sign in with Google
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                to continue to CodeVista
              </p>
            </div>

            <div className="px-6 pb-4 flex flex-col items-center gap-3 min-h-[60px]">
              {!GOOGLE_CLIENT_ID ? (
                <p className="text-sm text-red-600 text-center">
                  Google sign-in is not configured.
                </p>
              ) : (
                <>
                  <div ref={googleBtnRef} />
                  {loading && (
                    <p className="text-xs text-slate-500">
                      Signing you in...
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setShowGooglePicker(false)}
                className="text-sm font-medium"
                style={{ color: "#8B5CF6" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
