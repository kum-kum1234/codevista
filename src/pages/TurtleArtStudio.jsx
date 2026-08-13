import React, { useState } from "react";
import { Palette, Play, Trash2, RotateCcw, Save, LayoutTemplate, Palette as PaletteIcon } from "lucide-react";
import AppLayout from "../components/AppLayout";

const DEFAULT_CODE = `import turtle

# 🐢 Welcome to the Turtle Art Studio!
# Anything you can imagine, you can draw here.
# Try tweaking the colors, sizes, and angles below.

colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
t = turtle.Turtle()
t.speed(3)
t.hideturtle()

for i in range(72):
    t.color(colors[i % 7])
    t.forward(i * 2)
    t.right(61)
`;

export default function TurtleArtStudio() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [penColor, setPenColor] = useState("#8B5CF6");

  return (
    <AppLayout active="turtle">
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <Palette size={16} style={{ color: "#8B5CF6" }} />
            <div className="leading-tight">
              <p className="text-[9px] font-bold tracking-wide" style={{ color: "#8B5CF6" }}>CREATOR TOOLS</p>
              <p className="text-sm font-bold text-[#241B4E]">Turtle Art Studio</p>
            </div>
          </div>
          <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Up ↑, Space/Ctrl
          </span>
        </div>

        <div className="px-4 py-2 shrink-0" style={{ backgroundColor: "#F5EEFF" }}>
          <p className="text-xs font-bold text-[#241B4E]">Turtle Art Studio</p>
          <p className="text-[10px] text-slate-400">Sketch, animate, and bring your ideas to life with code.</p>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-2 gap-px bg-slate-200">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full resize-none text-[#241B4E] font-mono text-xs p-4 outline-none leading-relaxed"
            style={{ backgroundColor: "#F5EEFF" }}
          />
          <div className="w-full h-full bg-white flex items-center justify-center text-slate-300 text-xs">
            Your canvas — hit Run to see it come to life
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-4 py-2 shrink-0">
          <button className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
            <Play size={12} /> Run
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100">
            <Trash2 size={12} /> Clear
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-600 hover:bg-yellow-100">
            <RotateCcw size={12} /> Reset
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-80"
            style={{ backgroundColor: "#F5EEFF", color: "#8B5CF6" }}
          >
            <Save size={12} /> Save
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
            <LayoutTemplate size={12} /> Templates
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
            <PaletteIcon size={12} /> Colours
          </button>
          <span className="text-xs font-semibold text-slate-400">Pen</span>
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="h-6 w-10 rounded border border-slate-200"
          />
        </div>
      </div>
    </AppLayout>
  );
}