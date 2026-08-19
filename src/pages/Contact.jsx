import React, { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { FontLoader, PALETTE } from "../theme/playfulPalette";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";

const CHANNELS = [
  {
    icon: Mail,
    title: "Email Us",
    desc: "hello@pythonkid.io",
    colorIndex: 0,
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Mon–Sat, 9am–6pm IST",
    colorIndex: 1,
  },
  {
    icon: MapPin,
    title: "Based In",
    desc: "Bangalore, India",
    colorIndex: 4,
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="font-body w-full bg-white text-sm text-[#241B4E]">
      <FontLoader />
      <PublicHeader active="contact" />

      <section
        className="px-8 py-12 text-center"
        style={{ background: "linear-gradient(135deg, #EAF8FE 0%, #F5EEFF 100%)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#1AACDB] shadow-sm">
          <MessageCircle size={12} /> We'd Love to Hear From You
        </span>
        <h1 className="font-display mt-4 text-3xl md:text-4xl font-extrabold text-[#241B4E]">
          Get in <span style={{ color: "#EC4899" }}>Touch</span>
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Questions about a course, a partnership idea, or just want to say hi? Send us a message
          and we'll get back to you soon.
        </p>
      </section>

      <section className="px-8 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {CHANNELS.map(({ icon: Icon, title, desc, colorIndex }) => {
            const c = PALETTE[colorIndex];
            return (
              <div key={title} className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: c.border }}>
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  <Icon size={18} />
                </span>
                <p className="mt-2 text-sm font-bold text-[#241B4E]">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto max-w-xl rounded-3xl border-2 border-[#F0EAFF] p-6">
          {submitted ? (
            <div className="py-10 text-center">
              <span
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: PALETTE[2].bg, color: PALETTE[2].text }}
              >
                <Send size={20} />
              </span>
              <p className="font-display mt-3 text-lg font-extrabold text-[#241B4E]">Message sent!</p>
              <p className="mt-1 text-xs text-slate-400">
                Thanks for reaching out — we'll reply within a day or two.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border-2 border-[#F0EAFF] px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
                  placeholder="Arjun Sharma"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border-2 border-[#F0EAFF] px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-xl border-2 border-[#F0EAFF] px-3 py-2 text-sm outline-none focus:border-[#8B5CF6] resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #FF5A36, #EC4899)" }}
              >
                Send Message <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}