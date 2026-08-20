import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function Onboarding() {
  const navigate = useNavigate();
  const user = getCurrentUser() || { name: "there" };
  const firstName = user.name.split(" ")[0];

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(false);

  function handleContinue() {
    if (!agreedTerms) return;
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-pk-purple text-2xl">{"</>"}</span>
          <span className="text-2xl font-bold text-pk-text-dark">CodeVista</span>
        </div>

        <h1 className="text-2xl font-extrabold text-pk-text-dark">Welcome, {firstName}!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Please review and accept our terms to complete your account setup.
        </p>

        <div className="mt-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-pk-purple"
            />
            <span className="text-sm text-slate-700">
              I agree to the{" "}
              <a href="#" className="text-pk-orange-end underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-pk-orange-end underline font-medium">
                Privacy Policy
              </a>
              . <span className="text-red-500">*</span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wantsUpdates}
              onChange={(e) => setWantsUpdates(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-pk-purple"
            />
            <span className="text-sm text-slate-700">
              I'd like to receive learning tips and updates via email (optional)
            </span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!agreedTerms}
          className={`mt-8 w-full rounded-xl px-4 py-3.5 font-semibold text-white transition-colors ${
            agreedTerms
              ? "bg-pink-500 hover:bg-pink-600 cursor-pointer"
              : "bg-pink-300 cursor-not-allowed"
          }`}
        >
          Continue to CodeVista
        </button>
      </div>
    </div>
  );
}