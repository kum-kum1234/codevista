import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import AppLayout from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import { loadPyodideRuntime } from "../components/CodeRunner";
import { getCurrentUser } from "../utils/auth";

import {
  getPlaygroundStarters,
  getPlaygroundProjects,
  getPlaygroundChallenges,
  savePlaygroundProject,
  updatePlaygroundProject,
} from "../services/api";

import {
  Code2,
  ChevronLeft,
  Play,
  Save,
  Download,
  FileCode,
} from "lucide-react";

const PLAYGROUND_GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";

const TABS = [
  "Starters",
  "Challenges",
  "My Projects",
];

export default function Playground() {
  const navigate = useNavigate();

  /* ---------------------------------------------------------
     User
  --------------------------------------------------------- */

  const user = getCurrentUser();

  const userId =
    user?.id ||
    user?._id ||
    user?.userId ||
    user?.email ||
    "";

  /* ---------------------------------------------------------
     State
  --------------------------------------------------------- */

  const [activeTab, setActiveTab] =
    useState("Starters");

  const [starters, setStarters] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [challenges, setChallenges] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [selectedChallenge, setSelectedChallenge] =
    useState(null);

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [projectTitle, setProjectTitle] =
    useState("");

  const [projectDescription, setProjectDescription] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loadingStarters, setLoadingStarters] =
    useState(true);

  const [loadingProjects, setLoadingProjects] =
    useState(false);

  const [loadingChallenges, setLoadingChallenges] =
    useState(true);

  const pyodideRef =
    useRef(null);

  /* ---------------------------------------------------------
     Load starters
  --------------------------------------------------------- */

  useEffect(() => {
    const loadStarters = async () => {
      try {
        setLoadingStarters(true);

        const starterResponse =
          await getPlaygroundStarters();

        const starterData =
          Array.isArray(starterResponse)
            ? starterResponse
            : starterResponse?.data ||
              starterResponse?.starters ||
              [];

        setStarters(starterData);

        if (starterData.length > 0) {
          const firstStarter =
            starterData[0];

          setSelected(firstStarter);
          setSelectedProject(null);
          setSelectedChallenge(null);

          setCode(
            firstStarter.code || ""
          );

          setProjectTitle("");
          setProjectDescription("");
        }
      } catch (error) {
        console.error(
          "Error loading playground starters:",
          error
        );

        setOutput(
          "Couldn't load starter programs. Please try again."
        );
      } finally {
        setLoadingStarters(false);
      }
    };

    loadStarters();
  }, []);

  /* ---------------------------------------------------------
     Load projects
  --------------------------------------------------------- */

  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) {
        setProjects([]);
        return;
      }

      try {
        setLoadingProjects(true);

        const projectResponse =
          await getPlaygroundProjects(
            userId
          );

        const projectData =
          Array.isArray(projectResponse)
            ? projectResponse
            : projectResponse?.data ||
              projectResponse?.projects ||
              [];

        setProjects(projectData);
      } catch (error) {
        console.error(
          "Error loading playground projects:",
          error
        );

        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [userId]);

  /* ---------------------------------------------------------
     Load challenges
  --------------------------------------------------------- */

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoadingChallenges(true);

        const challengeResponse =
          await getPlaygroundChallenges();

        const challengeData =
          Array.isArray(challengeResponse)
            ? challengeResponse
            : challengeResponse?.data ||
              challengeResponse?.challenges ||
              [];

        setChallenges(challengeData);
      } catch (error) {
        console.error(
          "Error loading playground challenges:",
          error
        );

        setChallenges([]);
      } finally {
        setLoadingChallenges(false);
      }
    };

    loadChallenges();
  }, []);

  /* ---------------------------------------------------------
     Select starter
  --------------------------------------------------------- */

  function selectStarter(starter) {
    setSelected(starter);
    setSelectedProject(null);
    setSelectedChallenge(null);

    setCode(
      starter?.code || ""
    );

    setProjectTitle("");
    setProjectDescription("");

    setOutput("");
  }

  /* ---------------------------------------------------------
     Select challenge
  --------------------------------------------------------- */

  function selectChallenge(challenge) {
    setSelectedChallenge(challenge);

    setSelected(null);
    setSelectedProject(null);

    /*
      Challenge solutions must be written by
      the learner, so the editor is always empty.
    */
    setCode("");

    setProjectTitle(
      challenge?.title || ""
    );

    setProjectDescription(
      challenge?.description || ""
    );

    setOutput("");
  }

  /* ---------------------------------------------------------
     Select saved project
  --------------------------------------------------------- */

  function selectProject(project) {
    setSelectedProject(project);

    setSelected(null);
    setSelectedChallenge(null);

    setCode(
      project?.code || ""
    );

    setProjectTitle(
      project?.title || ""
    );

    setProjectDescription(
      project?.description || ""
    );

    setOutput("");
  }

  /* ---------------------------------------------------------
     Change tab
  --------------------------------------------------------- */

  function handleTabChange(tab) {
    setActiveTab(tab);

    /* ---------------------------
       Starters tab
    --------------------------- */

    if (tab === "Starters") {
      setSelectedProject(null);
      setSelectedChallenge(null);

      if (starters.length > 0) {
        selectStarter(
          starters[0]
        );
      } else {
        setSelected(null);
        setCode("");
        setProjectTitle("");
        setProjectDescription("");
        setOutput("");
      }

      return;
    }

    /* ---------------------------
       Challenges tab
    --------------------------- */

    if (tab === "Challenges") {
      setSelected(null);
      setSelectedProject(null);

      if (challenges.length > 0) {
        selectChallenge(
          challenges[0]
        );
      } else {
        setSelectedChallenge(null);
        setCode("");
        setProjectTitle("");
        setProjectDescription("");
        setOutput("");
      }

      return;
    }

    /* ---------------------------
       My Projects tab
    --------------------------- */

    if (tab === "My Projects") {
      setSelected(null);
      setSelectedChallenge(null);

      if (projects.length > 0) {
        selectProject(
          projects[0]
        );
      } else {
        setSelectedProject(null);
        setCode("");
        setProjectTitle("");
        setProjectDescription("");
        setOutput("");
      }
    }
  }

  /* ---------------------------------------------------------
     Normalize output for comparison
  --------------------------------------------------------- */

  function normalizeOutput(value) {
    return String(value ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();
  }

  /* ---------------------------------------------------------
     Run normal Python code
  --------------------------------------------------------- */

  const runNormalCode = async (pyodide) => {
    let captured = "";

    pyodide.setStdout({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    pyodide.setStderr({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    pyodide.setStdin({
      stdin: () => {
        const value =
          window.prompt(
            "Enter input:"
          );

        return value === null
          ? ""
          : value;
      },
    });

    try {
      await pyodide.runPythonAsync(
        code
      );
    } catch (error) {
      captured +=
        (captured ? "\n" : "") +
        String(
          error?.message || error
        );
    }

    return (
      captured.trimEnd() ||
      "(no output)"
    );
  };

  /* ---------------------------------------------------------
     Run challenge test cases
  --------------------------------------------------------- */

  const runChallenge = async (pyodide) => {
  const testCases = Array.isArray(
    selectedChallenge?.testCases
  )
    ? selectedChallenge.testCases
    : [];

  if (testCases.length === 0) {
    let captured = "";

    pyodide.setStdout({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    pyodide.setStderr({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    pyodide.setStdin({
      stdin: () => {
        const value = window.prompt(
          "Enter input:"
        );

        return value === null ? "" : value;
      },
    });

    try {
      await pyodide.runPythonAsync(code);

      return (
        "Code executed successfully.\n\n" +
        "No test cases are configured for this challenge yet."
      );
    } catch (error) {
      return (
        "❌ Code Error\n\n" +
        String(error?.message || error)
      );
    }
  }

  const results = [];
  let allPassed = true;

  for (
    let index = 0;
    index < testCases.length;
    index += 1
  ) {
    const testCase = testCases[index];

    const inputValue = String(
      testCase?.input ?? ""
    );

    const expectedOutput = String(
      testCase?.expectedOutput ?? ""
    );

    const inputValues =
      inputValue.split("\n");

    let captured = "";
    let executionError = null;

    pyodide.setStdout({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    pyodide.setStderr({
      batched: (s) => {
        captured += s + "\n";
      },
    });

    /*
      For challenge testing, replace Python's input()
      with our own input function.

      This is important because normal input(prompt)
      prints the prompt into stdout. We don't want:

      Enter your name: Kumkum

      We want to compare only:

      Kumkum
    */

    const isolatedCode = `
import builtins

_test_inputs = ${JSON.stringify(
      inputValues
    )}

_test_index = 0

def _challenge_input(prompt=""):
    global _test_index

    if _test_index < len(_test_inputs):
        value = _test_inputs[_test_index]
        _test_index += 1
        return value

    return ""

builtins.input = _challenge_input

exec(
    ${JSON.stringify(code)},
    {"__name__": "__main__"}
)
`;

    try {
      /*
        Do not use setStdin for challenge tests.
        Our custom Python input() above supplies the
        test case values without printing the prompt.
      */

      pyodide.setStdin({
        stdin: () => "",
      });

      await pyodide.runPythonAsync(
        isolatedCode
      );
    } catch (error) {
      executionError =
        String(
          error?.message || error
        );
    }

    const actualOutput =
      normalizeOutput(captured);

    const expected =
      normalizeOutput(
        expectedOutput
      );

    const passed =
      !executionError &&
      actualOutput === expected;

    if (!passed) {
      allPassed = false;
    }

    results.push({
      testNumber: index + 1,
      passed,
      input: inputValue,
      expected,
      actual:
        executionError ||
        actualOutput,
    });
  }

  let resultText = allPassed
    ? "✅ Challenge Passed!\n\n"
    : "❌ Challenge Failed\n\n";

  if (allPassed) {
    resultText +=
      `All ${testCases.length} test case${
        testCases.length === 1
          ? ""
          : "s"
      } passed.`;
  } else {
    const failedResults =
      results.filter(
        (result) => !result.passed
      );

    resultText +=
      `${failedResults.length} test case${
        failedResults.length === 1
          ? ""
          : "s"
      } failed.\n\n`;

    failedResults.forEach(
      (result) => {
        resultText +=
          `Test Case ${result.testNumber}\n`;

        resultText +=
          `Input:\n${
            result.input || "(empty)"
          }\n\n`;

        resultText +=
          `Expected:\n${
            result.expected ||
            "(no output)"
          }\n\n`;

        resultText +=
          `Received:\n${
            result.actual ||
            "(no output)"
          }\n\n`;

        resultText +=
          "-------------------------\n\n";
      }
    );

    resultText +=
      "Your Python code can still be valid, but it does not solve this challenge.";
  }

  return resultText;
};
  /* ---------------------------------------------------------
     Run Python code
  --------------------------------------------------------- */

  const handleRun = useCallback(
    async () => {
      if (!code.trim()) {
        setOutput(
          selectedChallenge
            ? "Write your Python solution before running."
            : "Write some Python code before running."
        );

        return;
      }

      setRunning(true);
      setOutput("Running...");

      try {
        if (!pyodideRef.current) {
          setStarting(true);

          pyodideRef.current =
            await loadPyodideRuntime();

          setStarting(false);
        }

        const pyodide =
          pyodideRef.current;

        /* ---------------------------
           Challenge mode
        --------------------------- */

        if (selectedChallenge) {
          const challengeResult =
            await runChallenge(
              pyodide
            );

          setOutput(
            challengeResult
          );

          return;
        }

        /* ---------------------------
           Normal mode
        --------------------------- */

        const normalResult =
          await runNormalCode(
            pyodide
          );

        setOutput(
          normalResult
        );
      } catch (error) {
        console.error(
          "Python runtime error:",
          error
        );

        setOutput(
          "Couldn't start the Python runtime. Check your connection and try again."
        );
      } finally {
        setRunning(false);
        setStarting(false);
      }
    },
    [
      code,
      selectedChallenge,
    ]
  );

  /* ---------------------------------------------------------
     Save project
  --------------------------------------------------------- */

  const handleSave = async () => {
    if (!userId) {
      setOutput(
        "Please sign in before saving a project."
      );

      return;
    }

    if (!projectTitle.trim()) {
      setOutput(
        "Please enter a project name before saving."
      );

      return;
    }

    if (!code.trim()) {
      setOutput(
        "There is no code to save."
      );

      return;
    }

    try {
      setSaving(true);
      setOutput("Saving...");

      const projectData = {
        userId,
        title:
          projectTitle.trim(),
        description:
          projectDescription.trim(),
        code,
        language: "python",
      };

      let response;

      /* Update existing project */

      if (selectedProject?._id) {
        response =
          await updatePlaygroundProject(
            selectedProject._id,
            projectData
          );
      }

      /* Create new project */

      else {
        response =
          await savePlaygroundProject(
            projectData
          );
      }

      const savedProject =
        response?.data ||
        response?.project ||
        response;

      if (!savedProject) {
        throw new Error(
          "Invalid response from save API"
        );
      }

      /*
        Update project in local state.
      */

      if (selectedProject?._id) {
        setProjects(
          (previousProjects) =>
            previousProjects.map(
              (project) =>
                project._id ===
                selectedProject._id
                  ? savedProject
                  : project
            )
        );
      } else {
        setProjects(
          (previousProjects) => [
            savedProject,
            ...previousProjects,
          ]
        );
      }

      setSelectedProject(
        savedProject
      );

      setSelected(null);
      setSelectedChallenge(null);

      setOutput(
        "Project saved successfully."
      );
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      setOutput(
        "Couldn't save the project. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------
     Download Python file
  --------------------------------------------------------- */

  const handleDownload = () => {
    if (!code.trim()) {
      setOutput(
        "There is no code to download."
      );

      return;
    }

    let fileName =
      projectTitle.trim() ||
      selected?.title ||
      selectedProject?.title ||
      selectedChallenge?.title ||
      "python-project";

    fileName = fileName
      .replace(
        /[^a-z0-9-_ ]/gi,
        ""
      )
      .trim()
      .replace(
        /\s+/g,
        "-"
      )
      .toLowerCase();

    if (!fileName) {
      fileName =
        "python-project";
    }

    const blob =
      new Blob(
        [code],
        {
          type:
            "text/x-python;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${fileName}.py`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);

    setOutput(
      `Downloaded ${fileName}.py`
    );
  };

  /* ---------------------------------------------------------
     Render
  --------------------------------------------------------- */

  return (
    <AppLayout active="playground">

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* --------------------------------------------------
            Page-specific top bar
        -------------------------------------------------- */}

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 shrink-0">

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="flex items-center gap-2"
          >

            <ChevronLeft
              size={16}
              className="text-slate-400"
            />

            <Code2
              size={16}
              style={{
                color:
                  "#8B5CF6",
              }}
            />

            <div className="text-left leading-tight">

              <p
                className="text-[9px] font-bold tracking-wide"
                style={{
                  color:
                    "#8B5CF6",
                }}
              >
                CODE LAB
              </p>

              <p className="text-sm font-bold text-[#241B4E]">
                Python Playground
              </p>

            </div>

          </button>

          <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Python 3.9 · Sandbox
          </span>

        </div>

        {/* --------------------------------------------------
            Main playground
        -------------------------------------------------- */}

        <div className="flex flex-1 min-h-0">

          {/* ------------------------------------------------
              Sidebar
          ------------------------------------------------ */}

          <aside className="w-72 shrink-0 border-r border-slate-200 overflow-y-auto">

            <p className="px-4 pt-4 pb-2 font-bold text-[#241B4E]">
              Starter Snippets
            </p>

            {/* Tabs */}

            <div className="flex gap-4 px-4 border-b border-slate-200 text-xs font-semibold text-slate-400">

              {TABS.map(
                (tab) => (

                  <button
                    key={tab}
                    onClick={() =>
                      handleTabChange(
                        tab
                      )
                    }
                    className="pb-2 border-b-2 -mb-px"
                    style={
                      activeTab ===
                      tab
                        ? {
                            borderColor:
                              "#8B5CF6",
                            color:
                              "#8B5CF6",
                          }
                        : {
                            borderColor:
                              "transparent",
                          }
                    }
                  >
                    {tab}
                  </button>

                )
              )}

            </div>

            {/* ------------------------------------------------
                Starters
            ------------------------------------------------ */}

            {activeTab ===
              "Starters" && (

              <ul className="py-2">

                {loadingStarters ? (

                  <li className="px-4 py-10 text-center text-xs text-slate-400">
                    Loading starters...
                  </li>

                ) : starters.length ===
                  0 ? (

                  <li className="px-4 py-10 text-center text-xs text-slate-400">
                    No starter programs available.
                  </li>

                ) : (

                  starters.map(
                    (starter) => (

                      <li
                        key={
                          starter._id ||
                          starter.starterId
                        }
                      >

                        <button
                          onClick={() =>
                            selectStarter(
                              starter
                            )
                          }
                          className="w-full flex items-start gap-2 px-4 py-2.5 text-left hover:bg-slate-50"
                          style={
                            selected?._id ===
                              starter._id ||
                            selected?.starterId ===
                              starter.starterId
                              ? {
                                  backgroundColor:
                                    "#F5EEFF",
                                }
                              : undefined
                          }
                        >

                          <FileCode
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{
                              color:
                                "#8B5CF6",
                            }}
                          />

                          <span>

                            <p className="text-xs font-bold text-[#241B4E]">
                              {
                                starter.title
                              }
                            </p>

                            <p className="text-[10px] text-slate-400 leading-snug">
                              {
                                starter.description
                              }
                            </p>

                          </span>

                        </button>

                      </li>

                    )
                  )

                )}

              </ul>

            )}

            {/* ------------------------------------------------
                Challenges
            ------------------------------------------------ */}

            {activeTab ===
              "Challenges" && (

              <div className="py-2">

                {loadingChallenges ? (

                  <div className="px-4 py-10 text-center text-xs text-slate-400">
                    Loading challenges...
                  </div>

                ) : challenges.length ===
                  0 ? (

                  <div className="px-4 py-10 text-center text-xs text-slate-400">
                    No challenges available yet.
                  </div>

                ) : (

                  <ul>

                    {challenges.map(
                      (challenge) => (

                        <li
                          key={
                            challenge._id ||
                            challenge.challengeId
                          }
                        >

                          <button
                            onClick={() =>
                              selectChallenge(
                                challenge
                              )
                            }
                            className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-slate-50"
                            style={
                              selectedChallenge?._id ===
                                challenge._id ||
                              selectedChallenge?.challengeId ===
                                challenge.challengeId
                                ? {
                                    backgroundColor:
                                      "#F5EEFF",
                                  }
                                : undefined
                            }
                          >

                            <FileCode
                              size={14}
                              className="mt-0.5 shrink-0"
                              style={{
                                color:
                                  "#8B5CF6",
                              }}
                            />

                            <span className="min-w-0">

                              <p className="text-xs font-bold text-[#241B4E]">
                                {
                                  challenge.title
                                }
                              </p>

                              <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                                {
                                  challenge.description
                                }
                              </p>

                              <p
                                className="text-[9px] font-semibold mt-1"
                                style={{
                                  color:
                                    challenge.difficulty ===
                                    "Hard"
                                      ? "#EF4444"
                                      : challenge.difficulty ===
                                        "Medium"
                                      ? "#F59E0B"
                                      : "#16A34A",
                                }}
                              >
                                {
                                  challenge.difficulty
                                }
                              </p>

                            </span>

                          </button>

                        </li>

                      )
                    )}

                  </ul>

                )}

              </div>

            )}

            {/* ------------------------------------------------
                My Projects
            ------------------------------------------------ */}

            {activeTab ===
              "My Projects" && (

              <div className="py-2">

                {loadingProjects ? (

                  <div className="px-4 py-10 text-center text-xs text-slate-400">
                    Loading your projects...
                  </div>

                ) : projects.length ===
                  0 ? (

                  <div className="px-4 py-10 text-center text-xs text-slate-400">
                    Nothing saved here yet — build something and hit Save.
                  </div>

                ) : (

                  <ul>

                    {projects.map(
                      (project) => (

                        <li
                          key={
                            project._id
                          }
                        >

                          <button
                            onClick={() =>
                              selectProject(
                                project
                              )
                            }
                            className="w-full flex items-start gap-2 px-4 py-2.5 text-left hover:bg-slate-50"
                            style={
                              selectedProject?._id ===
                              project._id
                                ? {
                                    backgroundColor:
                                      "#F5EEFF",
                                  }
                                : undefined
                            }
                          >

                            <FileCode
                              size={14}
                              className="mt-0.5 shrink-0"
                              style={{
                                color:
                                  "#8B5CF6",
                              }}
                            />

                            <span className="min-w-0">

                              <p className="text-xs font-bold text-[#241B4E] truncate">
                                {
                                  project.title
                                }
                              </p>

                              <p className="text-[10px] text-slate-400 leading-snug truncate">
                                {
                                  project.description ||
                                  "Python project"
                                }
                              </p>

                            </span>

                          </button>

                        </li>

                      )
                    )}

                  </ul>

                )}

              </div>

            )}

          </aside>

          {/* ------------------------------------------------
              Editor area
          ------------------------------------------------ */}

          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

            {/* ------------------------------------------------
                Project title + actions
            ------------------------------------------------ */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 shrink-0">

              <input
                type="text"
                value={
                  projectTitle
                }
                onChange={(e) =>
                  setProjectTitle(
                    e.target.value
                  )
                }
                placeholder="Name this project..."
                className="flex-1 max-w-xs text-sm outline-none border-b border-transparent focus:border-slate-300 py-1"
              />

              <div className="flex items-center gap-2">

                {/* Run */}

                <button
                  onClick={
                    handleRun
                  }
                  disabled={
                    running
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >

                  <Play size={12} />

                  {starting
                    ? "Starting..."
                    : running
                    ? "Running..."
                    : "Run Code"}

                </button>

                {/* Save */}

                <button
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100 disabled:opacity-60"
                >

                  <Save size={12} />

                  {saving
                    ? "Saving..."
                    : "Save"}

                </button>

                {/* Download */}

                <button
                  onClick={
                    handleDownload
                  }
                  className="text-slate-400 hover:text-slate-600"
                  title="Download Python file"
                >

                  <Download
                    size={16}
                  />

                </button>

              </div>

            </div>

            {/* ------------------------------------------------
                Editor toolbar
            ------------------------------------------------ */}

            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 shrink-0">

              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">

                <Code2
                  size={12}
                  style={{
                    color:
                      "#8B5CF6",
                  }}
                />

                Python 3.9

              </span>

              <div className="flex items-center gap-3">

                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  Ready

                </span>

                {/* Image */}

  

                {/* Download */}

                <button
                  onClick={
                    handleDownload
                  }
                  className="text-slate-400 hover:text-slate-600"
                  title="Download Python file"
                >

                  <Download
                    size={14}
                  />

                </button>

              </div>

            </div>

            

            {/* ------------------------------------------------
                Code + output
            ------------------------------------------------ */}

            <div className="flex-1 min-h-0 grid grid-cols-2 gap-px bg-slate-200">

              {/* Code editor */}

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                  )
                }
                spellCheck={false}
                placeholder={
                  selectedChallenge
                    ? "Write your Python solution here..."
                    : ""
                }
                className="w-full h-full resize-none text-[#241B4E] font-mono text-xs p-4 outline-none leading-relaxed border-r-4"
                style={{
                  borderColor:
                    "#8B5CF6",

                  backgroundColor:
                    "#FBF7FF",

                  backgroundImage:
                    "radial-gradient(#DCC9FF 1.5px, transparent 1.5px)",

                  backgroundSize:
                    "18px 18px",
                }}
              />

              {/* Output */}

              <div
                className="w-full h-full text-[#0B3B4F] font-mono text-xs p-4 overflow-y-auto whitespace-pre-wrap"
                style={{
                  backgroundColor:
                    "#E9FBFF",

                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(139,92,246,0.08) 0px, transparent 60px)," +
                    "radial-gradient(circle at 80% 70%, rgba(26,172,219,0.10) 0px, transparent 80px)," +
                    "radial-gradient(#BEEFFC 1.5px, transparent 1.5px)",

                  backgroundSize:
                    "auto, auto, 18px 18px",
                }}
              >

                {output ||
                  "Hit Run to see your output here..."}

              </div>

            </div>

            {/* ------------------------------------------------
                Project description
            ------------------------------------------------ */}

            <div className="shrink-0 bg-slate-900 px-4 py-2">

              <input
                type="text"
                value={
                  projectDescription
                }
                onChange={(e) =>
                  setProjectDescription(
                    e.target.value
                  )
                }
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