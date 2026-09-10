import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import { PALETTE } from "../theme/playfulPalette";

import {
  getPythonHelpGuide,
} from "../services/api";


// ============================================================
// UI CONFIGURATION ONLY
// No Python educational data is hardcoded here.
// ============================================================

const GRADIENT =
  "linear-gradient(135deg, #8B5CF6, #1AACDB)";


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PythonHelpGuide() {

  // ==========================================================
  // API DATA
  // ==========================================================

  const [guide, setGuide] =
    useState(null);

  const [topics, setTopics] =
    useState([]);

  const [categories, setCategories] =
    useState([]);


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [activeCategory, setActiveCategory] =
    useState("All Topics");

  const [query, setQuery] =
    useState("");

  const [openId, setOpenId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD PYTHON HELP DATA FROM API
  // ==========================================================

  useEffect(() => {

    let cancelled = false;


    const loadPythonHelpGuide =
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await getPythonHelpGuide();


          if (cancelled) {
            return;
          }


          // --------------------------------------------------
          // Main content
          // --------------------------------------------------

          const loadedContent =
            response?.content || null;


          // --------------------------------------------------
          // Topics
          // --------------------------------------------------

          const loadedTopics =
            Array.isArray(
              response?.topics
            )
              ? response.topics
              : [];


          // --------------------------------------------------
          // Categories
          //
          // Categories are now stored inside:
          //
          // response.content.categories
          // --------------------------------------------------

          const loadedMongoCategories =
            Array.isArray(
              response?.content?.categories
            )
              ? response.content.categories
              : [];


          // --------------------------------------------------
          // Add "All Topics" only as a UI filter.
          //
          // It is NOT stored in MongoDB.
          // --------------------------------------------------

          const loadedCategories = [
            "All Topics",
            ...loadedMongoCategories,
          ];


          // --------------------------------------------------
          // Save API data
          // --------------------------------------------------

          setGuide(
            loadedContent
          );


          setTopics(
            loadedTopics
          );


          setCategories(
            loadedCategories
          );


          // --------------------------------------------------
          // Select first real category if available.
          //
          // Otherwise use All Topics.
          // --------------------------------------------------

          if (
            loadedMongoCategories.length >
            0
          ) {

            const firstCategory =
              loadedMongoCategories[0];

            setActiveCategory(
              typeof firstCategory ===
                "string"
                ? firstCategory
                : firstCategory?.name ||
                  "All Topics"
            );

          } else {

            setActiveCategory(
              "All Topics"
            );

          }


          // --------------------------------------------------
          // Automatically open the first topic.
          // --------------------------------------------------

          if (
            loadedTopics.length > 0
          ) {

            setOpenId(
              getTopicId(
                loadedTopics[0]
              )
            );

          } else {

            setOpenId(null);

          }

        } catch (err) {

          if (!cancelled) {

            console.error(
              "Python Help Guide API error:",
              err
            );


            setError(
              err?.message ||
                "Failed to load Python Help Guide."
            );

          }

        } finally {

          if (!cancelled) {
            setLoading(false);
          }

        }
      };


    loadPythonHelpGuide();


    return () => {

      cancelled = true;

    };

  }, []);


  // ==========================================================
  // FILTER TOPICS
  // ==========================================================

  const filteredTopics =
    useMemo(() => {

      const searchText =
        query
          .trim()
          .toLowerCase();


      return topics.filter(
        (topic) => {

          // --------------------------------------------------
          // Topic category
          // --------------------------------------------------

          const topicCategory =
            typeof topic?.category ===
              "string"
              ? topic.category
              : topic?.category?.name ||
                "";


          // --------------------------------------------------
          // Category filter
          // --------------------------------------------------

          const categoryMatch =
            !activeCategory ||
            activeCategory ===
              "All Topics" ||
            topicCategory ===
              activeCategory;


          // --------------------------------------------------
          // Search filter
          // --------------------------------------------------

          const searchMatch =
            !searchText ||

            topic.title
              ?.toLowerCase()
              .includes(searchText) ||

            topic.body
              ?.toLowerCase()
              .includes(searchText) ||

            topicCategory
              ?.toLowerCase()
              .includes(searchText) ||

            topic.tip
              ?.toLowerCase()
              .includes(searchText) ||

            topic.examples?.some(
              (example) =>
                example.heading
                  ?.toLowerCase()
                  .includes(searchText) ||

                example.caption
                  ?.toLowerCase()
                  .includes(searchText) ||

                example.code
                  ?.toLowerCase()
                  .includes(searchText)
            );


          return (
            categoryMatch &&
            searchMatch
          );

        }
      );

    }, [
      topics,
      activeCategory,
      query,
    ]);


  // ==========================================================
  // CATEGORY CHANGE
  // ==========================================================

  const handleCategoryChange =
    (category) => {

      setActiveCategory(
        category
      );


      // ------------------------------------------------------
      // Find first topic in selected category
      // ------------------------------------------------------

      const firstTopic =
        topics.find(
          (topic) => {

            const topicCategory =
              typeof topic?.category ===
                "string"
                ? topic.category
                : topic?.category?.name ||
                  "";


            return (
              category ===
                "All Topics" ||
              topicCategory ===
                category
            );

          }
        );


      // ------------------------------------------------------
      // Open first topic
      // ------------------------------------------------------

      if (firstTopic) {

        setOpenId(
          getTopicId(
            firstTopic
          )
        );

      } else {

        setOpenId(null);

      }

    };


  // ==========================================================
  // TOPIC TOGGLE
  // ==========================================================

  const handleTopicToggle =
    (topic) => {

      const topicId =
        getTopicId(topic);


      setOpenId(
        openId === topicId
          ? null
          : topicId
      );

    };


  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {

    return (

      <AppLayout
        active="python-help-guide"
      >

        <div className="flex-1 overflow-y-auto p-6">

          <div className="rounded-2xl border border-pk-border bg-white p-8 text-center">

            <p className="text-sm text-slate-400">
              Loading Python Help Guide...
            </p>

          </div>

        </div>

      </AppLayout>

    );

  }


  // ==========================================================
  // ERROR SCREEN
  // ==========================================================

  if (error) {

    return (

      <AppLayout
        active="python-help-guide"
      >

        <div className="flex-1 overflow-y-auto p-6">

          <div className="rounded-2xl border border-pk-border bg-white p-8 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">

              <BookOpen size={20} />

            </div>


            <h2 className="text-lg font-bold text-[#241B4E]">
              Unable to load Python Help Guide
            </h2>


            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>

          </div>

        </div>

      </AppLayout>

    );

  }


  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (

    <AppLayout
      active="python-help-guide"
    >

      <div className="flex-1 overflow-y-auto p-6 space-y-6">


        {/* ================================================== */}
        {/* PAGE HEADER */}
        {/* ================================================== */}

        <div className="flex items-start gap-4 rounded-2xl border border-pk-border bg-white p-5">

          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                PALETTE[4].bg,

              color:
                PALETTE[4].text,
            }}
          >

            <BookOpen size={20} />

          </span>


          <div>

            <p
              className="text-[11px] font-bold tracking-wide"
              style={{
                color:
                  PALETTE[0].text,
              }}
            >
              {guide?.header?.eyebrow ||
                ""}
            </p>


            <h1 className="text-lg font-bold text-[#241B4E]">
              {guide?.header?.title ||
                ""}
            </h1>


            <p className="text-xs text-slate-500 mt-0.5">
              {guide?.header?.description ||
                ""}
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* SEARCH */}
        {/* ================================================== */}

        <div className="relative">

          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />


          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search for help topics..."
            className="w-full rounded-xl border border-pk-border bg-white py-3 pl-11 pr-4 text-sm text-[#241B4E] placeholder:text-slate-400 focus:outline-none focus:ring-2"
            style={{
              "--tw-ring-color":
                "#8B5CF6",
            }}
          />

        </div>


        {/* ================================================== */}
        {/* INTRODUCTION */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-pk-border bg-white p-6">

          <h2 className="text-xl font-bold text-[#241B4E] mb-3">

            {guide?.intro?.title ||
              ""}

          </h2>


          {Array.isArray(
            guide?.intro?.paragraphs
          ) &&

            guide.intro.paragraphs.map(
              (
                paragraph,
                index
              ) => (

                <p
                  key={`${index}-${paragraph}`}
                  className={
                    index <
                    guide.intro.paragraphs
                      .length -
                      1
                      ? "text-sm text-slate-600 leading-relaxed mb-3"
                      : "text-sm text-slate-600 leading-relaxed"
                  }
                >

                  {paragraph}

                </p>

              )
            )}


          {(
            !guide?.intro ||
            !Array.isArray(
              guide?.intro?.paragraphs
            ) ||
            guide.intro.paragraphs
              .length === 0
          ) && (

            <p className="text-sm text-slate-400">
              No introduction content available.
            </p>

          )}

        </div>


        {/* ================================================== */}
        {/* CONTENT AREA */}
        {/* ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">


          {/* ================================================= */}
          {/* CATEGORIES */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-pk-border bg-white p-5 md:sticky md:top-6">

            <h3 className="text-base font-bold text-[#241B4E] mb-4">
              Categories
            </h3>


            {categories.length ===
              0 ? (

              <p className="text-sm text-slate-400">
                No categories available.
              </p>

            ) : (

              <div className="flex flex-col gap-1">

                {categories.map(
                  (category) => {

                    // ----------------------------------------
                    // Category can be:
                    //
                    // "All Topics"
                    //
                    // OR MongoDB object:
                    //
                    // {
                    //   name: "...",
                    //   description: "...",
                    //   order: 1
                    // }
                    // ----------------------------------------

                    const categoryName =
                      typeof category ===
                        "string"
                        ? category
                        : category?.name ||
                          "";


                    const categoryId =
                      typeof category ===
                        "string"
                        ? category
                        : category?.id ||
                          category?._id ||
                          category?.name ||
                          "";


                    const active =
                      categoryName ===
                      activeCategory;


                    return (

                      <button
                        key={categoryId}
                        type="button"
                        onClick={() =>
                          handleCategoryChange(
                            categoryName
                          )
                        }
                        className={`text-left rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                          active
                            ? "text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                        style={
                          active
                            ? {
                                background:
                                  GRADIENT,
                              }
                            : {}
                        }
                      >

                        {categoryName}

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* TOPICS */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-pk-border bg-white p-2 sm:p-4">

            {filteredTopics.length ===
              0 ? (

              <p className="text-sm text-slate-400 text-center py-10">
                No topics match your search. Try a different keyword.
              </p>

            ) : (

              filteredTopics.map(
                (
                  topic,
                  index
                ) => (

                  <TopicRow
                    key={
                      getTopicId(
                        topic
                      )
                    }

                    topic={topic}

                    isOpen={
                      openId ===
                      getTopicId(
                        topic
                      )
                    }

                    onToggle={() =>
                      handleTopicToggle(
                        topic
                      )
                    }

                    isLast={
                      index ===
                      filteredTopics.length -
                        1
                    }
                  />

                )
              )

            )}

          </div>

        </div>

      </div>

    </AppLayout>

  );

}


// ============================================================
// GET TOPIC ID
// ============================================================

function getTopicId(
  topic
) {

  return (
    topic?.topicId ||
    topic?.id ||
    topic?._id
  );

}


// ============================================================
// TOPIC ROW
// ============================================================

function TopicRow({
  topic,
  isOpen,
  onToggle,
  isLast,
}) {

  return (

    <div
      className={
        isLast
          ? ""
          : "border-b border-pk-border"
      }
    >


      {/* ==================================================== */}
      {/* TOPIC HEADER */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 px-3 text-left"
      >

        <span className="text-base font-bold text-[#241B4E]">

          {topic.title}

        </span>


        {isOpen ? (

          <ChevronUp
            size={18}
            className="text-slate-400 shrink-0"
          />

        ) : (

          <ChevronDown
            size={18}
            className="text-slate-400 shrink-0"
          />

        )}

      </button>


      {/* ==================================================== */}
      {/* TOPIC DETAILS */}
      {/* ==================================================== */}

      {isOpen && (

        <div className="px-3 pb-6 space-y-4">


          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          {topic.body && (

            <p className="text-sm text-slate-600 leading-relaxed">

              {topic.body}

            </p>

          )}


          {/* ================================================= */}
          {/* EXAMPLES */}
          {/* ================================================= */}

          {Array.isArray(
            topic.examples
          ) &&

            topic.examples.length >
              0 && (

              <div
                className={`grid gap-4 ${
                  topic.examples.length >
                  1
                    ? "sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >

                {topic.examples.map(
                  (
                    example,
                    index
                  ) => (

                    <div
                      key={`${example.heading || "example"}-${index}`}
                    >


                      {/* ===================================== */}
                      {/* EXAMPLE HEADING */}
                      {/* ===================================== */}

                      {example.heading && (

                        <code
                          className="inline-block rounded-lg px-3 py-1 text-sm font-semibold mb-2"
                          style={{
                            backgroundColor:
                              PALETTE[1].bg,

                            color:
                              PALETTE[1].text,
                          }}
                        >

                          {example.heading}

                        </code>

                      )}


                      {/* ===================================== */}
                      {/* EXAMPLE CAPTION */}
                      {/* ===================================== */}

                      {example.caption && (

                        <p className="text-xs text-slate-500 mb-2">

                          {example.caption}

                        </p>

                      )}


                      {/* ===================================== */}
                      {/* EXAMPLE CODE */}
                      {/* ===================================== */}

                      {example.code && (

                        <pre className="rounded-xl bg-[#241B4E] text-[#E8E4FB] text-xs leading-relaxed p-4 overflow-x-auto">

                          <code>

                            {example.code}

                          </code>

                        </pre>

                      )}

                    </div>

                  )
                )}

              </div>

            )}


          {/* ================================================= */}
          {/* TIP */}
          {/* ================================================= */}

          {topic.tip && (

            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor:
                  PALETTE[3].bg,

                color:
                  "#5A4300",
              }}
            >

              <span
                className="font-bold"
                style={{
                  color:
                    PALETTE[3].text,
                }}
              >

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