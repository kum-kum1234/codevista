const mongoose = require("mongoose");

const PythonHelpContent =
  require("../models/PythonHelpContent");

const PythonHelpTopic =
  require("../models/PythonHelpTopic");


// ============================================================
// FORMAT TOPIC
// ============================================================

function formatTopic(topic) {
  return {
    id: topic._id?.toString(),

    topicId: topic.topicId,

    category: topic.category,

    title: topic.title,

    body: topic.body || "",

    examples: Array.isArray(topic.examples)
      ? topic.examples
      : [],

    tip: topic.tip || "",

    order: topic.order || 0,

    active:
      topic.active !== false,

    createdAt: topic.createdAt,

    updatedAt: topic.updatedAt,
  };
}


// ============================================================
// FORMAT CONTENT
// ============================================================

function formatContent(content) {
  if (!content) {
    return null;
  }

  return {
    id: content._id?.toString(),

    key: content.key,

    header: {
      eyebrow:
        content.header?.eyebrow || "",

      title:
        content.header?.title || "",

      description:
        content.header?.description || "",
    },

    intro: {
      title:
        content.intro?.title || "",

      paragraphs:
        Array.isArray(
          content.intro?.paragraphs
        )
          ? content.intro.paragraphs
          : [],
    },

    categories:
      Array.isArray(content.categories)
        ? content.categories
            .filter(
              (category) =>
                category &&
                category.active !== false
            )
            .sort(
              (a, b) =>
                (a.order || 0) -
                (b.order || 0)
            )
            .map((category) => ({
              id:
                category._id?.toString(),

              name:
                category.name,

              description:
                category.description ||
                "",

              order:
                category.order || 0,

              active:
                category.active !== false,
            }))
        : [],

    active:
      content.active !== false,

    createdAt:
      content.createdAt,

    updatedAt:
      content.updatedAt,
  };
}


// ============================================================
// GET COMPLETE PYTHON HELP GUIDE
// ============================================================

async function getPythonHelpGuide(
  req,
  res
) {
  try {
    const content =
      await PythonHelpContent.findOne({
        key: "default",
        active: true,
      }).lean();

    const topics =
      await PythonHelpTopic.find({
        active: true,
      })
        .sort({
          order: 1,
          createdAt: 1,
        })
        .lean();

    const formattedTopics =
      topics.map(formatTopic);

    const formattedContent =
      formatContent(content);

    const categories =
      Array.isArray(
        formattedContent?.categories
      )
        ? [
            "All Topics",
            ...formattedContent.categories.map(
              (category) =>
                category.name
            ),
          ]
        : ["All Topics"];

    return res.json({
      success: true,

      content:
        formattedContent,

      topics:
        formattedTopics,

      categories,
    });

  } catch (error) {
    console.error(
      "Get Python Help Guide error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch Python Help Guide",
    });
  }
}


// ============================================================
// GET CONTENT ONLY
// ============================================================

async function getPythonHelpContent(
  req,
  res
) {
  try {
    const content =
      await PythonHelpContent.findOne({
        key: "default",
        active: true,
      }).lean();

    return res.json({
      success: true,

      content:
        formatContent(content),
    });

  } catch (error) {
    console.error(
      "Get Python Help content error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch Python Help content",
    });
  }
}


// ============================================================
// CREATE / UPDATE PAGE CONTENT
// ============================================================

async function upsertPythonHelpContent(
  req,
  res
) {
  try {
    const body =
      req.body?.content ||
      req.body ||
      {};

    // --------------------------------------------------------
    // Prepare categories
    // --------------------------------------------------------

    let categories = [];

    if (
      Array.isArray(
        body.categories
      )
    ) {
      categories =
        body.categories
          .map(
            (category, index) => ({
              name:
                typeof category ===
                "string"
                  ? category
                  : category?.name ||
                    "",

              description:
                typeof category ===
                "object"
                  ? category?.description ||
                    ""
                  : "",

              order:
                typeof category ===
                  "object" &&
                category?.order !==
                  undefined
                  ? Number(
                      category.order
                    )
                  : index + 1,

              active:
                typeof category ===
                "object"
                  ? category?.active !==
                    false
                  : true,
            })
          )
          .filter(
            (category) =>
              category.name
                .trim()
                .length > 0
          );
    }


    // --------------------------------------------------------
    // IMPORTANT
    //
    // Only update fields that were actually
    // included in the request.
    //
    // This prevents:
    //
    // PUT categories only
    //
    // from deleting:
    //
    // header
    // intro
    // --------------------------------------------------------

    const updateData = {};


    if (
      body.header !==
      undefined
    ) {
      updateData.header =
        body.header;
    }


    if (
      body.intro !==
      undefined
    ) {
      updateData.intro =
        body.intro;
    }


    if (
      Array.isArray(
        body.categories
      )
    ) {
      updateData.categories =
        categories;
    }


    if (
      body.active !==
      undefined
    ) {
      updateData.active =
        Boolean(
          body.active
        );
    }


    // --------------------------------------------------------
    // Update MongoDB
    // --------------------------------------------------------

    const content =
      await PythonHelpContent.findOneAndUpdate(
        {
          key: "default",
        },

        {
          $set:
            updateData,
        },

        {
          new: true,

          upsert: true,

          runValidators: true,

          setDefaultsOnInsert:
            true,
        }
      );


    return res.json({
      success: true,

      message:
        "Python Help content updated successfully",

      content:
        formatContent(content),
    });

  } catch (error) {
    console.error(
      "Upsert Python Help content error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update Python Help content",
    });
  }
}


// ============================================================
// GET ALL TOPICS
// ============================================================

async function getPythonHelpTopics(
  req,
  res
) {
  try {
    const {
      category,
      search,
    } = req.query;


    const filter = {
      active: true,
    };


    if (
      category &&
      category !==
        "All Topics"
    ) {
      filter.category =
        category;
    }


    if (search) {
      filter.$or = [
        {
          title: {
            $regex:
              search,
            $options: "i",
          },
        },

        {
          body: {
            $regex:
              search,
            $options: "i",
          },
        },

        {
          category: {
            $regex:
              search,
            $options: "i",
          },
        },
      ];
    }


    const topics =
      await PythonHelpTopic.find(
        filter
      )
        .sort({
          order: 1,
          createdAt: 1,
        })
        .lean();


    return res.json({
      success: true,

      topics:
        topics.map(
          formatTopic
        ),
    });

  } catch (error) {
    console.error(
      "Get Python Help topics error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch Python Help topics",
    });
  }
}


// ============================================================
// GET ONE TOPIC
// ============================================================

async function getPythonHelpTopic(
  req,
  res
) {
  try {
    const topicId =
      req.params.topicId;


    let topic = null;


    if (
      mongoose.Types.ObjectId.isValid(
        topicId
      )
    ) {
      topic =
        await PythonHelpTopic.findOne({
          _id: topicId,

          active: true,
        }).lean();
    }


    if (!topic) {
      topic =
        await PythonHelpTopic.findOne({
          topicId,

          active: true,
        }).lean();
    }


    if (!topic) {
      return res.status(404).json({
        success: false,

        message:
          "Python Help topic not found",
      });
    }


    return res.json({
      success: true,

      topic:
        formatTopic(topic),
    });

  } catch (error) {
    console.error(
      "Get Python Help topic error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch Python Help topic",
    });
  }
}


// ============================================================
// CREATE ONE TOPIC
// ============================================================

async function createPythonHelpTopic(
  req,
  res
) {
  try {
    const body =
      req.body?.topic ||
      req.body ||
      {};


    if (
      !body.topicId ||
      !body.category ||
      !body.title
    ) {
      return res.status(400).json({
        success: false,

        message:
          "topicId, category and title are required",
      });
    }


    const topic =
      await PythonHelpTopic.create({
        topicId:
          body.topicId,

        category:
          body.category,

        title:
          body.title,

        body:
          body.body || "",

        examples:
          Array.isArray(
            body.examples
          )
            ? body.examples
            : [],

        tip:
          body.tip || "",

        order:
          body.order !==
          undefined
            ? Number(
                body.order
              )
            : 0,

        active:
          body.active !==
          false,
      });


    return res.status(201).json({
      success: true,

      message:
        "Python Help topic created successfully",

      topic:
        formatTopic(topic),
    });

  } catch (error) {
    console.error(
      "Create Python Help topic error:",
      error
    );


    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,

        message:
          "A topic with this topicId already exists",
      });
    }


    return res.status(500).json({
      success: false,

      message:
        "Failed to create Python Help topic",
    });
  }
}


// ============================================================
// UPDATE TOPIC
// ============================================================

async function updatePythonHelpTopic(
  req,
  res
) {
  try {
    const topicId =
      req.params.topicId;


    const body =
      req.body?.topic ||
      req.body ||
      {};


    const filter =
      mongoose.Types.ObjectId.isValid(
        topicId
      )
        ? {
            $or: [
              {
                _id:
                  topicId,
              },

              {
                topicId:
                  topicId,
              },
            ],
          }
        : {
            topicId:
              topicId,
          };


    const update = {
      $set: {},
    };


    if (
      body.topicId !==
      undefined
    ) {
      update.$set.topicId =
        body.topicId;
    }


    if (
      body.category !==
      undefined
    ) {
      update.$set.category =
        body.category;
    }


    if (
      body.title !==
      undefined
    ) {
      update.$set.title =
        body.title;
    }


    if (
      body.body !==
      undefined
    ) {
      update.$set.body =
        body.body;
    }


    if (
      body.examples !==
      undefined
    ) {
      update.$set.examples =
        Array.isArray(
          body.examples
        )
          ? body.examples
          : [];
    }


    if (
      body.tip !==
      undefined
    ) {
      update.$set.tip =
        body.tip;
    }


    if (
      body.order !==
      undefined
    ) {
      update.$set.order =
        Number(
          body.order
        );
    }


    if (
      body.active !==
      undefined
    ) {
      update.$set.active =
        Boolean(
          body.active
        );
    }


    const topic =
      await PythonHelpTopic.findOneAndUpdate(
        filter,

        update,

        {
          new: true,

          runValidators: true,
        }
      );


    if (!topic) {
      return res.status(404).json({
        success: false,

        message:
          "Python Help topic not found",
      });
    }


    return res.json({
      success: true,

      message:
        "Python Help topic updated successfully",

      topic:
        formatTopic(topic),
    });

  } catch (error) {
    console.error(
      "Update Python Help topic error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update Python Help topic",
    });
  }
}


// ============================================================
// DELETE TOPIC
// ============================================================

async function deletePythonHelpTopic(
  req,
  res
) {
  try {
    const topicId =
      req.params.topicId;


    const filter =
      mongoose.Types.ObjectId.isValid(
        topicId
      )
        ? {
            $or: [
              {
                _id:
                  topicId,
              },

              {
                topicId:
                  topicId,
              },
            ],
          }
        : {
            topicId:
              topicId,
          };


    const topic =
      await PythonHelpTopic.findOneAndUpdate(
        filter,

        {
          $set: {
            active: false,
          },
        },

        {
          new: true,
        }
      );


    if (!topic) {
      return res.status(404).json({
        success: false,

        message:
          "Python Help topic not found",
      });
    }


    return res.json({
      success: true,

      message:
        "Python Help topic deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Python Help topic error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete Python Help topic",
    });
  }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  getPythonHelpGuide,

  getPythonHelpContent,

  upsertPythonHelpContent,

  getPythonHelpTopics,

  getPythonHelpTopic,

  createPythonHelpTopic,

  updatePythonHelpTopic,

  deletePythonHelpTopic,

};