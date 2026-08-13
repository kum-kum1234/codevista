import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  ChevronLeft,
  Play,
  Save,
  Download,
  Image as ImageIcon,
  FileCode,
} from "lucide-react";

const PLAYGROUND_GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const STARTERS = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "A simple program that prints a greeting message.",
    code: `# Your very first Python program
name = "Code Explorer"
print(f"Hello, {name}!")

# Try changing the name to your own!`,
  },
  {
    id: "number-guess",
    title: "Number Guessing Game",
    description: "Can you guess the random number?",
    code: `import random

secret = random.randint(1, 20)
guess = int(input("Guess a number between 1 and 20: "))

if guess == secret:
    print("You got it!")
else:
    print(f"Nope! The number was {secret}")`,
  },
  {
    id: "calculator",
    title: "Simple Calculator",
    description: "A basic calculator that can add, subtract, multiply and divide.",
    code: `a = float(input("First number: "))
b = float(input("Second number: "))

print("Sum:", a + b)
print("Difference:", a - b)
print("Product:", a * b)
print("Quotient:", a / b if b != 0 else "undefined")`,
  },
  {
    id: "mad-libs",
    title: "Mad Libs Story",
    description: "Create a funny story by filling in the blanks.",
    code: `adjective = input("Give me an adjective: ")
animal = input("Give me an animal: ")
place = input("Give me a place: ")

print(f"Once upon a time, a {adjective} {animal} went to {place}.")`,
  },
  {
    id: "countdown",
    title: "Countdown Timer",
    description: "Create a simple countdown timer using a loop.",
    code: `import time

seconds = 5
while seconds > 0:
    print(seconds)
    time.sleep(1)
    seconds -= 1

print("Time's up!")`,
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate a random secure password.",
    code: `import random
import string

length = 12
chars = string.ascii_letters + string.digits + "!@#$%"
password = "".join(random.choice(chars) for _ in range(length))

print("Your password:", password)`,
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Play the classic game against the computer.",
    code: `import random

choices = ["rock", "paper", "scissors"]
player = input("rock, paper, or scissors? ")
computer = random.choice(choices)

print(f"Computer chose {computer}")
print("You win!" if player != computer else "It's a tie!")`,
  },
];

const TABS = ["Starters", "Challenges", "My Projects"];

export default function Playground() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Starters");
  const [selected, setSelected] = useState(STARTERS[0]);
  const [code, setCode] = useState(STARTERS[0].code);
  const [output, setOutput] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [running, setRunning] = useState(false);

  function selectStarter(starter) {
    setSelected(starter);
    setCode(starter.code);
    setOutput("");
  }

  function handleRun() {
    setRunning(true);
    setOutput("Running...");
    // Demo only — no real Python interpreter in the browser.
    // Wire this up to Pyodide or a backend execution service for real output.
    setTimeout(() => {
      setOutput(
        "This is a demo playground — connect a real Python runtime (e.g. Pyodide) to execute this code and see live output here."
      );
      setRunning(false);
    }, 600);
  }

  return (
    <AppLayout active="playground">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Page-specific top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 shrink-0">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <ChevronLeft size={16} className="text-slate-400" />
            <Code2 size={16} style={{ color: "#8B5CF6" }} />
            <div className="text-left leading-tight">
              <p className="text-[9px] font-bold tracking-wide" style={{ color: "#8B5CF6" }}>CODE LAB</p>
              <p className="text-sm font-bold text-[#241B4E]">Python Playground</p>
            </div>
          </button>

          <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Python 3.9 · Sandbox
          </span>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Code library sidebar (page-specific, not the app nav sidebar) */}
          <aside className="w-72 shrink-0 border-r border-slate-200 overflow-y-auto">
            <p className="px-4 pt-4 pb-2 font-bold text-[#241B4E]">Starter Snippets</p>

            <div className="flex gap-4 px-4 border-b border-slate-200 text-xs font-semibold text-slate-400">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="pb-2 border-b-2 -mb-px"
                  style={
                    activeTab === tab
                      ? { borderColor: "#8B5CF6", color: "#8B5CF6" }
                      : { borderColor: "transparent" }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Starters" && (
              <ul className="py-2">
                {STARTERS.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => selectStarter(s)}
                      className="w-full flex items-start gap-2 px-4 py-2.5 text-left hover:bg-slate-50"
                      style={selected.id === s.id ? { backgroundColor: "#F5EEFF" } : undefined}
                    >
                      <FileCode size={14} className="mt-0.5 shrink-0" style={{ color: "#8B5CF6" }} />
                      <span>
                        <p className="text-xs font-bold text-[#241B4E]">{s.title}</p>
                        <p className="text-[10px] text-slate-400 leading-snug">{s.description}</p>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Challenges" && (
              <div className="px-4 py-10 text-center text-xs text-slate-400">
                New challenges are on the way — check back soon!
              </div>
            )}

            {activeTab === "My Projects" && (
              <div className="px-4 py-10 text-center text-xs text-slate-400">
                Nothing saved here yet — build something and hit Save.
              </div>
            )}
          </aside>

          {/* Editor area */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Project title + actions */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 shrink-0">
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Name this project..."
                className="flex-1 max-w-xs text-sm outline-none border-b border-transparent focus:border-slate-300 py-1"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Play size={12} /> Run Code
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100">
                  <Save size={12} /> Save
                </button>
                <button className="text-slate-400 hover:text-slate-600">
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 shrink-0">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Code2 size={12} style={{ color: "#8B5CF6" }} /> Python 3.9
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Ready
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <ImageIcon size={14} />
                </button>
                <button className="text-slate-400 hover:text-slate-600">
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className="px-4 py-2 shrink-0">
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                <Play size={12} /> {running ? "Running..." : "Run"}
              </button>
            </div>

            {/* Code + output split */}
            <div className="flex-1 min-h-0 grid grid-cols-2 gap-px bg-slate-200">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full resize-none bg-[#1e1e1e] text-slate-200 font-mono text-xs p-4 outline-none leading-relaxed"
              />
              <div className="w-full h-full bg-black text-green-400 font-mono text-xs p-4 overflow-y-auto whitespace-pre-wrap">
                {output || "Hit Run to see your output here..."}
              </div>
            </div>

            {/* Project description bar */}
            <div className="shrink-0 bg-slate-900 px-4 py-2">
              <input
                type="text"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="What does this project do? (optional)"
                className="w-full bg-transparent text-xs text-slate-300 placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}