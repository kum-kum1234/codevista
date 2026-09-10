import React, { useEffect, useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Award,
  Gauge,
  Users,
  Mail,
  MessageCircle,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";
import { getHelpContent } from "../services/api";

const HELP_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = ["FAQs", "Features", "Contact"];

const ICONS = {
  BookOpen,
  Award,
  Gauge,
  Users,
};

export default function Help() {
  const [activeTab, setActiveTab] = useState("FAQs");

  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [guideSteps, setGuideSteps] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHelpContent() {
    try {
      setLoading(true);
      setError("");

      const response = await getHelpContent();
      const content = response?.help || response?.data || response || {};

      setFaqs(Array.isArray(content.faqs) ? content.faqs : []);
      setFeatures(Array.isArray(content.features) ? content.features : []);
      setGuideSteps(
        Array.isArray(content.guideSteps) ? content.guideSteps : []
      );
      setContact(content.contact || null);
    } catch (err) {
      console.error("Help content error:", err);
      setFaqs([]);
      setFeatures([]);
      setGuideSteps([]);
      setContact(null);
      setError("Could not load help content. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHelpContent();
  }, []);

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} style={{ color: "#8B5CF6" }} />
            <p
              className="text-[9px] font-bold tracking-wide"
              style={{ color: "#8B5CF6" }}
            >
              SUPPORT
            </p>
          </div>

          <h1 className="mt-1 text-2xl font-extrabold text-[#241B4E]">
            Help & Support
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Answers, guides, and ways to reach us if you're stuck
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex gap-6 border-b border-slate-200 text-xs font-semibold text-slate-400">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="border-b-2 pb-2 -mb-px"
                  style={
                    activeTab === tab
                      ? {
                          borderColor: "#8B5CF6",
                          color: "#8B5CF6",
                        }
                      : {
                          borderColor: "transparent",
                        }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                Loading help content...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-white p-6 text-center text-xs text-red-500">
                {error}
              </div>
            ) : (
              <>
                {activeTab === "FAQs" && (
                  <>
                    <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                      Common Questions
                    </h2>

                    <div className="space-y-3">
                      {faqs.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                          No FAQs are available yet.
                        </div>
                      ) : (
                        faqs.map((f, i) => {
                          const clr = PALETTE[i % PALETTE.length];

                          return (
                            <div
                              key={f._id || f.q || i}
                              className="rounded-xl border-2 bg-white p-4"
                              style={{ borderColor: clr.border }}
                            >
                              <p
                                className="flex items-center gap-2 text-sm font-bold"
                                style={{ color: clr.text }}
                              >
                                <HelpCircle size={13} />
                                {f.q}
                              </p>

                              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                {f.a}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}

                {activeTab === "Features" && (
                  <>
                    <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                      What's Included
                    </h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      {features.length === 0 ? (
                        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                          No feature information is available yet.
                        </div>
                      ) : (
                        features.map((feature, index) => {
                          const Icon =
                            ICONS[feature.icon] || ICONS[feature.iconName] || BookOpen;
                          const colorIndex =
                            Number.isInteger(feature.colorIndex)
                              ? feature.colorIndex
                              : index % PALETTE.length;
                          const clr = PALETTE[colorIndex % PALETTE.length];

                          return (
                            <div
                              key={feature._id || feature.title || index}
                              className="rounded-xl border-2 bg-white p-4"
                              style={{ borderColor: clr.border }}
                            >
                              <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                                <Icon size={14} style={{ color: clr.text }} />
                                {feature.title}
                              </p>

                              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                {feature.desc}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="mb-3 text-sm font-bold text-[#241B4E]">
                        How to Get Started
                      </p>

                      <ol className="space-y-3">
                        {guideSteps.length === 0 ? (
                          <li className="text-xs text-slate-500">
                            No getting-started guide is available yet.
                          </li>
                        ) : (
                          guideSteps.map((s, i) => (
                            <li
                              key={s._id || s.title || i}
                              className="flex items-start gap-3"
                            >
                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                style={{
                                  backgroundColor: "#F5EEFF",
                                  color: "#8B5CF6",
                                }}
                              >
                                {i + 1}
                              </span>

                              <span>
                                <p
                                  className="text-xs font-bold"
                                  style={{ color: "#8B5CF6" }}
                                >
                                  {s.title}
                                </p>

                                <p className="text-xs leading-relaxed text-slate-500">
                                  {s.desc}
                                </p>
                              </span>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                  </>
                )}

                {activeTab === "Contact" && (
                  <>
                    <h2 className="mb-4 text-lg font-extrabold text-[#241B4E]">
                      Reach Out
                    </h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                          <Mail
                            size={14}
                            style={{ color: "#8B5CF6" }}
                          />
                          {contact?.emailTitle || "Email Us"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {contact?.emailDescription || ""}
                        </p>

                        {contact?.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="mt-1 block text-xs font-semibold"
                            style={{ color: "#8B5CF6" }}
                          >
                            {contact.email}
                          </a>
                        ) : null}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-[#241B4E]">
                          <MessageCircle
                            size={14}
                            style={{ color: "#1AACDB" }}
                          />
                          {contact?.communityTitle || "Ask the Community"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {contact?.communityDescription || ""}
                        </p>

                        {contact?.communityPath ? (
                          <a
                            href={contact.communityPath}
                            className="mt-1 block text-xs font-semibold"
                            style={{ color: "#1AACDB" }}
                          >
                            {contact?.communityLinkText || "Visit Community ↗"}
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="mb-2 text-sm font-bold text-[#241B4E]">
                        {contact?.furtherTitle || "Want to Go Further?"}
                      </p>

                      <p className="text-xs font-semibold text-[#241B4E]">
                        {contact?.externalTitle || ""}
                      </p>

                      <p className="text-xs text-slate-500">
                        {contact?.externalDescription || ""}
                      </p>

                      {contact?.externalUrl ? (
                        <a
                          href={contact.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-xs font-semibold"
                          style={{ color: "#8B5CF6" }}
                        >
                          {contact?.externalLinkText || "Visit ↗"}
                        </a>
                      ) : null}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
