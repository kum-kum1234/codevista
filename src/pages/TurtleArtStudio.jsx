import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Palette,
  Play,
  Trash2,
  RotateCcw,
  Save,
  LayoutTemplate,
  Palette as PaletteIcon,
  Loader2,
  Check,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { loadPyodideRuntime } from "../components/CodeRunner";
import { getCurrentUser } from "../utils/auth";

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

const TEMPLATES = [
  { name: "Spiral", code: DEFAULT_CODE },
  {
    name: "Star",
    code: `import turtle

t = turtle.Turtle()
t.speed(5)
t.color("gold")
t.pensize(3)

for i in range(5):
    t.forward(200)
    t.right(144)
`,
  },
  {
    name: "Flower",
    code: `import turtle

t = turtle.Turtle()
t.speed(0)
colors = ['red', 'orange', 'yellow', 'purple', 'pink']

for i in range(36):
    t.color(colors[i % 5])
    t.circle(60)
    t.right(10)
`,
  },
  {
    name: "Rainbow Square",
    code: `import turtle

t = turtle.Turtle()
t.speed(3)
t.pensize(4)
colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

for i in range(60):
    t.color(colors[i % 6])
    t.forward(i * 3)
    t.left(91)
`,
  },
];

const SWATCHES = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899", "#111827"];

// --- Python-side shim: fakes the `turtle` module so `import turtle` in the
// user's code works inside Pyodide, and every drawing call forwards to the
// JS bridge functions (_t_line, _t_clear, etc.) that render onto our canvas.
const TURTLE_SHIM = `
import sys, types, math

class _Turtle:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self.heading_deg = 0.0
        self.pen_down = True
        self.pen_color = 'black'
        self.fill_color = 'black'
        self.pen_width = 1
        self.visible = True
        self.filling = False

    def _emit_line(self, x1, y1, x2, y2):
        if self.pen_down:
            _t_line(x1, y1, x2, y2, self.pen_color, self.pen_width)
        if self.filling:
            _t_add_fill_point(x2, y2)

    def forward(self, dist):
        rad = math.radians(self.heading_deg)
        nx = self.x + math.cos(rad) * dist
        ny = self.y + math.sin(rad) * dist
        self._emit_line(self.x, self.y, nx, ny)
        self.x, self.y = nx, ny
    fd = forward

    def backward(self, dist):
        self.forward(-dist)
    bk = backward
    back = backward

    def right(self, angle):
        self.heading_deg = (self.heading_deg - angle) % 360
    rt = right

    def left(self, angle):
        self.heading_deg = (self.heading_deg + angle) % 360
    lt = left

    def penup(self):
        self.pen_down = False
    pu = penup
    up = penup

    def pendown(self):
        self.pen_down = True
    pd = pendown
    down = pendown

    def isdown(self):
        return self.pen_down

    def goto(self, x, y=None):
        if y is None and hasattr(x, '__len__'):
            x, y = x[0], x[1]
        self._emit_line(self.x, self.y, x, y)
        self.x, self.y = float(x), float(y)
    setpos = goto
    setposition = goto

    def setx(self, x):
        self.goto(x, self.y)

    def sety(self, y):
        self.goto(self.x, y)

    def home(self):
        self.goto(0, 0)
        self.heading_deg = 0.0

    def position(self):
        return (self.x, self.y)
    pos = position

    def heading(self):
        return self.heading_deg

    def setheading(self, angle):
        self.heading_deg = angle % 360
    seth = setheading

    def _resolve_color(self, args):
        if len(args) == 1:
            return args[0]
        if len(args) == 3:
            r, g, b = args
            if max(r, g, b) <= 1:
                r, g, b = r * 255, g * 255, b * 255
            return f"rgb({int(r)},{int(g)},{int(b)})"
        return self.pen_color

    def color(self, *args):
        if not args:
            return self.pen_color, self.fill_color
        c = self._resolve_color(args)
        self.pen_color = c
        self.fill_color = c

    def pencolor(self, *args):
        if not args:
            return self.pen_color
        self.pen_color = self._resolve_color(args)

    def fillcolor(self, *args):
        if not args:
            return self.fill_color
        self.fill_color = self._resolve_color(args)

    def width(self, w=None):
        if w is None:
            return self.pen_width
        self.pen_width = w
    pensize = width

    def speed(self, *_args):
        pass

    def hideturtle(self):
        self.visible = False
    ht = hideturtle

    def showturtle(self):
        self.visible = True
    st = showturtle

    def isvisible(self):
        return self.visible

    def begin_fill(self):
        self.filling = True
        _t_begin_fill()
        _t_add_fill_point(self.x, self.y)

    def end_fill(self):
        self.filling = False
        _t_end_fill(self.fill_color)

    def dot(self, size=None, *color):
        d = size or max(self.pen_width + 4, 6)
        c = self._resolve_color(color) if color else self.pen_color
        _t_dot(self.x, self.y, d, c)

    def circle(self, radius, extent=360, steps=None):
        if steps is None:
            steps = max(int(abs(extent) / 6), 8)
        step_len = 2 * radius * math.pi * (extent / 360) / steps
        step_angle = extent / steps
        turn = self.left if radius >= 0 else self.right
        for _ in range(steps):
            self.forward(step_len)
            turn(step_angle)

    def clear(self):
        _t_clear()

    def reset(self):
        self.x, self.y, self.heading_deg = 0.0, 0.0, 0.0
        self.pen_down = True
        _t_clear()

    def write(self, text, *_args, **_kwargs):
        _t_write(self.x, self.y, str(text), self.pen_color)

    def tracer(self, *_a, **_k):
        pass

    def update(self):
        pass

    def delay(self, *_a, **_k):
        pass


class _Screen:
    def bgcolor(self, *_a, **_k):
        pass
    def title(self, *_a, **_k):
        pass
    def setup(self, *_a, **_k):
        pass
    def exitonclick(self, *_a, **_k):
        pass
    def tracer(self, *_a, **_k):
        pass
    def update(self, *_a, **_k):
        pass
    def bye(self, *_a, **_k):
        pass
    def colormode(self, *_a, **_k):
        pass


_default = _Turtle()
_screen = _Screen()

_turtle_module = types.ModuleType('turtle')
_turtle_module.Turtle = _Turtle
_turtle_module.Pen = _Turtle
_turtle_module.Screen = lambda: _screen

for _name in ['forward', 'fd', 'backward', 'bk', 'back', 'right', 'rt', 'left', 'lt',
              'penup', 'pu', 'up', 'pendown', 'pd', 'down', 'isdown', 'goto', 'setpos',
              'setposition', 'setx', 'sety', 'home', 'position', 'pos', 'heading',
              'setheading', 'seth', 'color', 'pencolor', 'fillcolor', 'width',
              'pensize', 'speed', 'hideturtle', 'ht', 'showturtle', 'st', 'isvisible',
              'begin_fill', 'end_fill', 'dot', 'circle', 'clear', 'reset', 'write']:
    setattr(_turtle_module, _name, getattr(_default, _name))

_turtle_module.bgcolor = _screen.bgcolor
_turtle_module.title = _screen.title
_turtle_module.setup = _screen.setup
_turtle_module.exitonclick = _screen.exitonclick
_turtle_module.tracer = _screen.tracer
_turtle_module.update = _screen.update
_turtle_module.done = lambda: None
_turtle_module.mainloop = lambda: None
_turtle_module.bye = _screen.bye
_turtle_module.colormode = _screen.colormode

sys.modules['turtle'] = _turtle_module
`;

function saveKey() {
  const user = getCurrentUser?.();
  const id = user?.email || user?.phone || "guest";
  return `codevista_turtle_art_${id}`;
}

export default function TurtleArtStudio() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [penColor, setPenColor] = useState("#8B5CF6");
  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColours, setShowColours] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pyodideRef = useRef(null);
  const fillPointsRef = useRef([]);

  // Keep the canvas's pixel resolution matched to its displayed size.
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toCanvasCoords = (x, y) => {
    const canvas = canvasRef.current;
    return [canvas.width / 2 + x, canvas.height / 2 - y];
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillPointsRef.current = [];
  }, []);

  const handleRun = useCallback(async () => {
    setError("");
    setHasRun(true);
    setRunning(true);
    clearCanvas();

    try {
      if (!pyodideRef.current) {
        setStarting(true);
        pyodideRef.current = await loadPyodideRuntime();
        setStarting(false);
      }
      const pyodide = pyodideRef.current;

      // --- JS bridge: each function reads canvasRef.current fresh, so it
      // always draws onto the current canvas even after a resize.
      pyodide.globals.set("_t_line", (x1, y1, x2, y2, color, width) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const [cx1, cy1] = toCanvasCoords(x1, y1);
        const [cx2, cy2] = toCanvasCoords(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();
      });

      pyodide.globals.set("_t_clear", () => clearCanvas());

      pyodide.globals.set("_t_begin_fill", () => {
        fillPointsRef.current = [];
      });

      pyodide.globals.set("_t_add_fill_point", (x, y) => {
        fillPointsRef.current.push(toCanvasCoords(x, y));
      });

      pyodide.globals.set("_t_end_fill", (color) => {
        const pts = fillPointsRef.current;
        const canvas = canvasRef.current;
        if (!canvas || pts.length < 3) {
          fillPointsRef.current = [];
          return;
        }
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.fill();
        fillPointsRef.current = [];
      });

      pyodide.globals.set("_t_dot", (x, y, size, color) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const [cx, cy] = toCanvasCoords(x, y);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      pyodide.globals.set("_t_write", (x, y, text, color) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const [cx, cy] = toCanvasCoords(x, y);
        ctx.fillStyle = color;
        ctx.font = "12px sans-serif";
        ctx.fillText(text, cx, cy);
      });

      let captured = "";
      pyodide.setStdout({ batched: (s) => { captured += s + "\n"; } });
      pyodide.setStderr({ batched: (s) => { captured += s + "\n"; } });

      await pyodide.runPythonAsync(TURTLE_SHIM);

      try {
        await pyodide.runPythonAsync(code);
      } catch (err) {
        captured += (captured ? "\n" : "") + String(err?.message || err);
      }

      setError(captured.trim());
    } catch (err) {
      setError("Couldn't start the Python runtime. Check your connection and try again.");
    } finally {
      setRunning(false);
      setStarting(false);
    }
  }, [code, clearCanvas]);

  function handleClear() {
    clearCanvas();
    setError("");
  }

  function handleReset() {
    setCode(DEFAULT_CODE);
    clearCanvas();
    setError("");
    setHasRun(false);
  }

  function handleSave() {
    try {
      localStorage.setItem(saveKey(), JSON.stringify({ code, savedAt: Date.now() }));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }

  function applyTemplate(tpl) {
    setCode(tpl.code);
    setShowTemplates(false);
  }

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

          <div ref={containerRef} className="relative w-full h-full bg-white">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {!hasRun && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs pointer-events-none">
                Your canvas — hit Run to see it come to life
              </div>
            )}

            {(starting || running) && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/70 text-xs font-semibold text-slate-500">
                <Loader2 size={14} className="animate-spin" style={{ color: "#8B5CF6" }} />
                {starting ? "Loading Python runtime…" : "Running…"}
              </div>
            )}

            {!running && error && (
              <div className="absolute bottom-0 left-0 right-0 max-h-28 overflow-y-auto bg-red-50 border-t border-red-200 px-3 py-2 text-[11px] font-mono text-red-600 whitespace-pre-wrap">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className="relative flex flex-wrap items-center gap-2 border-t border-slate-200 px-4 py-2 shrink-0">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            {starting ? "Starting…" : running ? "Running…" : "Run"}
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100"
          >
            <Trash2 size={12} /> Clear
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-600 hover:bg-yellow-100"
          >
            <RotateCcw size={12} /> Reset
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-80"
            style={{ backgroundColor: "#F5EEFF", color: "#8B5CF6" }}
          >
            {savedFlash ? <Check size={12} /> : <Save size={12} />}
            {savedFlash ? "Saved!" : "Save"}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowTemplates((v) => !v);
                setShowColours(false);
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              <LayoutTemplate size={12} /> Templates
            </button>
            {showTemplates && (
              <div className="absolute bottom-full mb-2 left-0 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-10">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => applyTemplate(tpl)}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowColours((v) => !v);
                setShowTemplates(false);
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              <PaletteIcon size={12} /> Colours
            </button>
            {showColours && (
              <div className="absolute bottom-full mb-2 left-0 grid grid-cols-4 gap-1.5 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-10">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setPenColor(c);
                      setShowColours(false);
                    }}
                    className="h-6 w-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            )}
          </div>

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