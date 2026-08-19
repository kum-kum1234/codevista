import React, { useState, useRef, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";

const DASH_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";
const PYODIDE_VERSION = "0.26.4";

let pyodideLoadPromise = null;

export function loadPyodideRuntime() {
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoadPromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window
        .loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` })
        .then(resolve)
        .catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
    script.onload = () => {
      window
        .loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` })
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.body.appendChild(script);
  });

  return pyodideLoadPromise;
}

export default function CodeRunner({
  title = "✨ A Quick Example to Play With",
  initialCode = "",
  minHeight = 260,
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const pyodideRef = useRef(null);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setHasRun(true);
    setOutput("");

    try {
      if (!pyodideRef.current) {
        setStarting(true);
        pyodideRef.current = await loadPyodideRuntime();
        setStarting(false);
      }

      const pyodide = pyodideRef.current;
      let captured = "";

      pyodide.setStdout({ batched: (s) => { captured += s + "\n"; } });
      pyodide.setStderr({ batched: (s) => { captured += s + "\n"; } });

      try {
        await pyodide.runPythonAsync(code);
      } catch (err) {
        captured += (captured ? "\n" : "") + String(err?.message || err);
      }

      setOutput(captured.trimEnd() || "(no output)");
    } catch (err) {
      setOutput("Couldn't start the Python runtime. Check your connection and try again.");
    } finally {
      setRunning(false);
      setStarting(false);
    }
  }, [code]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2 text-white text-xs font-semibold"
        style={{ background: DASH_GRADIENT }}
      >
        <span className="flex items-center gap-2">{title}</span>
      </div>

      <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
        <span className="text-[10px] text-slate-400">Python 3.11</span>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1 rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-60"
        >
          {running ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
          {starting ? "Starting..." : running ? "Running..." : "Run"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{ minHeight }}
          className="bg-[#1e1e1e] text-slate-300 text-xs p-4 leading-relaxed font-mono resize-none outline-none"
        />
        <pre
          style={{ minHeight }}
          className={`bg-black text-xs p-4 font-mono whitespace-pre-wrap overflow-y-auto ${
            hasRun ? "text-slate-200" : "text-slate-500"
          }`}
        >
          {hasRun ? output || (running ? "Running..." : "") : "Run the code to see your output here..."}
        </pre>
      </div>
    </div>
  );
}