import React, { useMemo, useState } from "react";
import { BookOpen, Search, ChevronDown, ChevronUp } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

const GRADIENT = "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TOPICS = [
  {
    id: "getting-started",
    category: "Python Basics",
    title: "Getting Started with Python",
    body: "Python is a fun, easy-to-learn programming language that's great for beginners. Here are the basics to get you started!",
    examples: [
      {
        heading: "print()",
        caption: "Displays text or variables on the screen.",
        code: `print("Hello, World!")\nprint(5 + 3)`,
      },
      {
        heading: "input()",
        caption: "Gets input from the user.",
        code: `name = input("What's your name? ")\nprint(f"Hello, {name}!")`,
      },
    ],
    tip: 'Try running a simple "Hello, World!" program in the playground to get familiar with Python syntax.',
  },
  {
    id: "variables",
    category: "Python Basics",
    title: "Variables and Data Types",
    body: "A variable is a named box that stores a value. Python figures out the type automatically — you never have to declare it.",
    examples: [
      {
        heading: "Common types",
        caption: "The four data types you'll use the most.",
        code: `age = 10          # int\nheight = 4.5      # float\nname = "Alex"      # str\nis_fun = True      # bool`,
      },
    ],
    tip: "Use snake_case for variable names, like my_score, not MyScore.",
  },
  {
    id: "conditionals",
    category: "Control Flow",
    title: "Conditionals (if, else)",
    body: "Conditionals let your program make decisions and run different code depending on whether something is True or False.",
    examples: [
      {
        heading: "if / elif / else",
        caption: "Checks a condition and branches.",
        code: `score = 85\nif score >= 90:\n    print("A grade")\nelif score >= 70:\n    print("B grade")\nelse:\n    print("Keep practicing!")`,
      },
    ],
    tip: "Indentation matters in Python — every line inside an if block must line up.",
  },
  {
    id: "loops",
    category: "Control Flow",
    title: "Loops (for, while)",
    body: "Loops repeat a block of code so you don't have to write it again and again.",
    examples: [
      {
        heading: "for loop",
        caption: "Repeats once for each item in a sequence.",
        code: `for i in range(5):\n    print(i)`,
      },
      {
        heading: "while loop",
        caption: "Repeats as long as a condition stays True.",
        code: `count = 0\nwhile count < 3:\n    print(count)\n    count += 1`,
      },
    ],
    tip: "Watch out for infinite loops — always make sure the condition can eventually become False.",
  },
  {
    id: "functions",
    category: "Programming Concepts",
    title: "Functions",
    body: "A function is a reusable block of code that runs when you call it. Functions can accept inputs (parameters) and give back an output (return value).",
    examples: [
      {
        heading: "Defining and calling",
        caption: "Use def to create a function, and call it by name.",
        code: `def greet(name):\n    return f"Hi, {name}!"\n\nprint(greet("Maya"))`,
      },
    ],
    tip: "Give functions clear, verb-based names like calculate_total, so it's obvious what they do.",
  },
  {
    id: "lists",
    category: "Data Structures",
    title: "Working with Lists",
    body: "A list stores an ordered collection of items, and you can add, remove, or change items after creating it.",
    examples: [
      {
        heading: "Basics",
        caption: "Creating, indexing, and adding to a list.",
        code: `fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nprint(fruits[0])   # apple`,
      },
    ],
    tip: "List indexes start at 0, so the first item is fruits[0], not fruits[1].",
  },
  {
    id: "dictionaries",
    category: "Data Structures",
    title: "Working with Dictionaries",
    body: "A dictionary stores data as key–value pairs, so you can look up a value quickly using its key instead of a position.",
    examples: [
      {
        heading: "Basics",
        caption: "Creating and reading from a dictionary.",
        code: `student = {"name": "Rhea", "age": 11}\nprint(student["name"])   # Rhea\nstudent["grade"] = 6`,
      },
    ],
    tip: "Keys must be unique — if you reuse a key, the newer value overwrites the older one.",
  },
  {
    id: "string-formatting",
    category: "Programming Concepts",
    title: "String Formatting",
    body: "f-strings are the easiest way to build text that includes variables.",
    examples: [
      {
        heading: "f-strings",
        caption: "Put any expression inside curly braces.",
        code: `name = "Kabir"\nscore = 92\nprint(f"{name} scored {score}%!")`,
      },
    ],
    tip: 'f-strings need the f right before the opening quote — f"...".',
  },
  {
    id: "modules",
    category: "Programming Concepts",
    title: "Using Modules and Libraries",
    body: "Modules are files full of pre-written code you can reuse with import, so you don't have to build everything from scratch.",
    examples: [
      {
        heading: "import",
        caption: "Bring in Python's built-in random module.",
        code: `import random\n\ndice_roll = random.randint(1, 6)\nprint(dice_roll)`,
      },
    ],
    tip: "Python comes with dozens of built-in modules — math, random, and time are great ones to explore first.",
  },
  {
    id: "file-handling",
    category: "Advanced Topics",
    title: "File Handling",
    body: "Python can read from and write to files on disk, which is handy for saving data between program runs.",
    examples: [
      {
        heading: "Reading and writing",
        caption: "The with statement closes the file automatically.",
        code: `with open("notes.txt", "w") as f:\n    f.write("Hello, file!")\n\nwith open("notes.txt") as f:\n    print(f.read())`,
      },
    ],
    tip: "Always use with open(...) — it closes the file for you, even if an error happens.",
  },
  {
    id: "error-handling",
    category: "Advanced Topics",
    title: "Error Handling (try/except)",
    body: "try/except lets your program handle errors gracefully instead of crashing.",
    examples: [
      {
        heading: "try / except",
        caption: "Catches an error and keeps the program running.",
        code: `try:\n    number = int(input("Pick a number: "))\n    print(100 / number)\nexcept ZeroDivisionError:\n    print("Can't divide by zero!")\nexcept ValueError:\n    print("That's not a number!")`,
      },
    ],
  },
  {
    id: "classes",
    category: "Advanced Topics",
    title: "Classes and Objects",
    body: "A class is a blueprint for creating objects that bundle together data and the functions (methods) that work on that data.",
    examples: [
      {
        heading: "Defining a class",
        caption: "__init__ runs automatically when you create a new object.",
        code: `class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        print(f"{self.name} says Woof!")\n\nmy_dog = Dog("Rex")\nmy_dog.bark()`,
      },
    ],
    tip: "self refers to the specific object the method is being called on.",
  },
  {
    id: "debugging",
    category: "Advanced Topics",
    title: "Debugging Tips",
    body: "Debugging is the normal, everyday process of finding and fixing mistakes in your code — every programmer does it, all the time.",
    examples: [
      {
        heading: "Print debugging",
        caption: "Add print statements to see what's happening inside your code.",
        code: `total = 0\nfor n in [1, 2, 3]:\n    print("n is", n)\n    total += n\nprint("total is", total)`,
      },
    ],
    tip: "Read error messages carefully — the last line usually tells you exactly what went wrong and on which line.",
  },
];

const CATEGORIES = [
  "All Topics",
  ...Array.from(new Set(TOPICS.map((t) => t.category))),
];

export default function PythonHelpGuide() {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState("getting-started");

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOPICS.filter((t) => {
      const inCategory = activeCategory === "All Topics" || t.category === activeCategory;
      const inQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.body?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [activeCategory, query]);

  return (
    <AppLayout active="python-help-guide">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-start gap-4 rounded-2xl border border-pk-border bg-white p-5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: PALETTE[4].bg, color: PALETTE[4].text }}
          >
            <BookOpen size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-wide" style={{ color: PALETTE[0].text }}>
              RESOURCES
            </p>
            <h1 className="text-lg font-bold text-[#241B4E]">Python Help Guide</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              A comprehensive guide to help you learn Python programming
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for help topics..."
            className="w-full rounded-xl border border-pk-border bg-white py-3 pl-11 pr-4 text-sm text-[#241B4E] placeholder:text-slate-400 focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "#8B5CF6" }}
          />
        </div>

        <div className="rounded-2xl border border-pk-border bg-white p-6">
          <h2 className="text-xl font-bold text-[#241B4E] mb-3">Quick Introduction to Python</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Python is a versatile, beginner-friendly programming language created by Guido van
            Rossum in 1991. It's designed to be easy to read with clear, simple syntax that
            emphasizes readability and reduced code complexity. Python is widely used in many
            fields including web development, data science, artificial intelligence, game
            development, and more.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            This help guide provides a structured way to learn Python concepts, with examples and
            explanations for each topic. Use the category filters or search function to find
            exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
          <div className="rounded-2xl border border-pk-border bg-white p-5 md:sticky md:top-6">
            <h3 className="text-base font-bold text-[#241B4E] mb-4">Categories</h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      active ? "text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={active ? { background: GRADIENT } : {}}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-pk-border bg-white p-2 sm:p-4">
            {filteredTopics.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">
                No topics match your search. Try a different keyword.
              </p>
            ) : (
              filteredTopics.map((topic, i) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  isOpen={openId === topic.id}
                  onToggle={() => setOpenId(openId === topic.id ? null : topic.id)}
                  isLast={i === filteredTopics.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function TopicRow({ topic, isOpen, onToggle, isLast }) {
  return (
    <div className={isLast ? "" : "border-b border-pk-border"}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 px-3 text-left"
      >
        <span className="text-base font-bold text-[#241B4E]">{topic.title}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-6 space-y-4">
          {topic.body && (
            <p className="text-sm text-slate-600 leading-relaxed">{topic.body}</p>
          )}

          {topic.examples && topic.examples.length > 0 && (
            <div
              className={`grid gap-4 ${
                topic.examples.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {topic.examples.map((ex) => (
                <div key={ex.heading}>
                  <code
                    className="inline-block rounded-lg px-3 py-1 text-sm font-semibold mb-2"
                    style={{ backgroundColor: PALETTE[1].bg, color: PALETTE[1].text }}
                  >
                    {ex.heading}
                  </code>
                  <p className="text-xs text-slate-500 mb-2">{ex.caption}</p>
                  <pre className="rounded-xl bg-[#241B4E] text-[#E8E4FB] text-xs leading-relaxed p-4 overflow-x-auto">
                    <code>{ex.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {topic.tip && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ backgroundColor: PALETTE[3].bg, color: "#5A4300" }}
            >
              <span className="font-bold" style={{ color: PALETTE[3].text }}>
                First steps:
              </span>{" "}
              {topic.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}