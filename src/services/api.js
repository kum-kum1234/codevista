import { authFetch as fetch } from "../utils/auth";

import { API_URL } from "../config";
// =========================
// COURSE APIs
// =========================

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
};

export const getCourse = async (courseId) => {
  const response = await fetch(
    `${API_URL}/courses/${courseId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
};


// =========================
// LESSON APIs
// =========================

export const getLessons = async () => {
  const response = await fetch(`${API_URL}/lessons`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return response.json();
};

export const getLessonsByCourse = async (courseId) => {
  const response = await fetch(
    `${API_URL}/lessons/course/${courseId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course lessons");
  }

  return response.json();
};

// Summaries (no video/exercises) of every lesson, for building curriculum lists.
export const getAllLessons = async () => {
  const response = await fetch(`${API_URL}/lessons`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return response.json();
};

export const getLesson = async (lessonId) => {
  const response = await fetch(
    `${API_URL}/lessons/${lessonId}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || "Failed to fetch lesson");
    error.status = response.status;
    error.code = data.code;
    throw error;
  }

  return response.json();
};
// =========================
// LEARNER DASHBOARD API
// =========================

export const getLearnerDashboard = async (token) => {
  const response = await fetch(
    `${API_URL}/v1/learner-dashboard/learner`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch learner dashboard");
  }

  return response.json();
};
export const getPlaygroundStarters = async () => {
  const response = await fetch(`${API_URL}/playground/starters`);

  if (!response.ok) {
    throw new Error("Failed to fetch playground starters");
  }

  return response.json();
};


export const getPlaygroundProjects = async (userId) => {
  const response = await fetch(
    `${API_URL}/playground/projects?userId=${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playground projects");
  }

  return response.json();
};


export const savePlaygroundProject = async (projectData) => {
  const response = await fetch(`${API_URL}/playground/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to save playground project");
  }

  return response.json();
};


export const updatePlaygroundProject = async (projectId, projectData) => {
  const response = await fetch(
    `${API_URL}/playground/projects/${projectId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update playground project");
  }

  return response.json();
};
export const getPlaygroundChallenges = async () => {
  const response = await fetch(
    `${API_URL}/playground/challenges`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playground challenges");
  }

  return response.json();
};
export const getTurtleTemplates = async () => {
  const response = await fetch(
    `${API_URL}/turtle-studio/templates`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch turtle templates"
    );
  }

  return response.json();
};

export const getTurtleSettings = async () => {
  const response = await fetch(
    `${API_URL}/turtle-studio/settings`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch turtle settings"
    );
  }

  return response.json();
};

export const getTurtleProjects = async (
  userId
) => {
  const response = await fetch(
    `${API_URL}/turtle-studio/projects?userId=${encodeURIComponent(
      userId
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch turtle projects"
    );
  }

  return response.json();
};

export const saveTurtleProject = async (
  projectData
) => {
  const response = await fetch(
    `${API_URL}/turtle-studio/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save turtle project"
    );
  }

  return response.json();
};

export const updateTurtleProject = async (
  projectId,
  projectData
) => {
  const response = await fetch(
    `${API_URL}/turtle-studio/projects/${projectId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update turtle project"
    );
  }

  return response.json();
};

export const deleteTurtleProject = async (
  projectId,
  userId
) => {
  const response = await fetch(
    `${API_URL}/turtle-studio/projects/${projectId}?userId=${encodeURIComponent(
      userId
    )}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete turtle project"
    );
  }

  return response.json();
};
// Fire-and-forget: tells the backend a Python run succeeded (counts towards
// achievements). Never throws, so it cannot break the editor.
export const recordCodeRun = () => {
  fetch(`${API_URL}/achievements/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "codeRuns" }),
  })
    .then(requestAchievementCheck)
    .catch(() => {});
};

// Asks the popup listener to look for newly unlocked achievements now
// instead of waiting for its next poll.
export const requestAchievementCheck = () => {
  window.dispatchEvent(new Event("achievements:check"));
};

export const getUserAchievements = async (userId) => {
  const response = await fetch(
    `${API_URL}/achievements/user/${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user achievements");
  }

  return response.json();
};
// =====================================================
// COMMUNITY
// =====================================================

export const getCommunityPosts = async (
  category = "",
  search = ""
) => {
  const params = new URLSearchParams();

  if (
    category &&
    category !== "All Categories"
  ) {
    params.append("category", category);
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const queryString =
    params.toString();

  const response = await fetch(
    `${API_URL}/community/posts${
      queryString
        ? `?${queryString}`
        : ""
    }`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch community posts"
    );
  }

  return response.json();
};

export const createCommunityPost =
  async (postData) => {
    const response = await fetch(
      `${API_URL}/community/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          postData
        ),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create community post"
      );
    }

    return response.json();
  };

export const deleteCommunityPost =
  async (postId, userId) => {
    const response = await fetch(
      `${API_URL}/community/posts/${encodeURIComponent(
        postId
      )}?userId=${encodeURIComponent(
        userId
      )}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete community post"
      );
    }

    return response.json();
  };

export const getCommunityQuestions =
  async () => {
    const response = await fetch(
      `${API_URL}/community/questions`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch community questions"
      );
    }

    return response.json();
  };

export const createCommunityQuestion =
  async (questionData) => {
    const response = await fetch(
      `${API_URL}/community/questions`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          questionData
        ),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create community question"
      );
    }

    return response.json();
  };

export const getCommunitySettings =
  async () => {
    const response = await fetch(
      `${API_URL}/community/settings`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch community settings"
      );
    }

    return response.json();
  };

export const getCommunityStats =
  async (userId) => {
    const response = await fetch(
      `${API_URL}/community/stats/${encodeURIComponent(
        userId
      )}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch community statistics"
      );
    }

    return response.json();
  };

export const updateCommunityUser =
  async (
    userId,
    userData
  ) => {
    const response = await fetch(
      `${API_URL}/community/users/${encodeURIComponent(
        userId
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          userData
        ),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update community user"
      );
    }

    return response.json();
  };

export const getCommunityLeaderboard =
  async () => {
    const response = await fetch(
      `${API_URL}/community/leaderboard`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch community leaderboard"
      );
    }

    return response.json();
  };

export const getCommunityChallenges =
  async () => {
    const response = await fetch(
      `${API_URL}/community/challenges`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch community challenges"
      );
    }

    return response.json();
  };
  export const getHelpContent = async () => {
  const response = await fetch(`${API_URL}/help`);

  if (!response.ok) {
    throw new Error("Failed to fetch help content");
  }

  return response.json();
};
export const getTimetable = async (userId) => {
  const response = await fetch(
    `${API_URL}/timetable/${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch timetable");
  }

  return response.json();
};

export const saveTimetable = async (userId, timetable) => {
  const response = await fetch(
    `${API_URL}/timetable/${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timetable),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save timetable");
  }

  return response.json();
};

export const clearTimetable = async (userId) => {
  const response = await fetch(
    `${API_URL}/timetable/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reset timetable");
  }

  return response.json();
};
// =====================================================
// NOTES
// =====================================================

export const getNotes = async (userId) => {
  const response = await fetch(
    `${API_URL}/notes/${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
};


export const createNote = async (userId, noteData) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      userId,
      ...noteData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return response.json();
};


export const updateNote = async (
  userId,
  noteId,
  noteData
) => {
  const response = await fetch(
    `${API_URL}/notes/${encodeURIComponent(noteId)}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        ...noteData,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  return response.json();
};


export const deleteNote = async (
  userId,
  noteId
) => {
  const response = await fetch(
    `${API_URL}/notes/${encodeURIComponent(
      noteId
    )}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  return response.json();
};


export const togglePin = async (
  userId,
  noteId
) => {
  const response = await fetch(
    `${API_URL}/notes/${encodeURIComponent(
      noteId
    )}/pin`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to toggle note pin");
  }

  return response.json();
};


// =====================================================
// NOTE SUBJECTS
// =====================================================

export const getSubjects = async (userId) => {
  const response = await fetch(
    `${API_URL}/note-subjects/${encodeURIComponent(
      userId
    )}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch note subjects");
  }

  return response.json();
};


export const addSubject = async (
  userId,
  subjectData
) => {
  const response = await fetch(
    `${API_URL}/note-subjects`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        ...subjectData,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add note subject");
  }

  return response.json();
};


export const reorderSubjects = async (
  userId,
  subjects
) => {
  const response = await fetch(
    `${API_URL}/note-subjects/${encodeURIComponent(
      userId
    )}/reorder`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        subjects,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to reorder note subjects"
    );
  }

  return response.json();
};
export const getCodeTogether = async (userId) => {
  const response = await fetch(
    `${API_URL}/code-together?userId=${encodeURIComponent(userId || "")}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message || "Failed to fetch Code Together content"
    );
  }

  return response.json();
};

export const registerCodeTogether = async (userId, registrationData) => {
  const response = await fetch(`${API_URL}/code-together/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      ...registrationData,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message || "Failed to register for Code Together"
    );
  }

  return response.json();
};

export const cancelCodeTogetherRegistration = async (userId, dateKey) => {
  const response = await fetch(
    `${API_URL}/code-together/registrations/${encodeURIComponent(
      dateKey
    )}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message || "Failed to cancel registration"
    );
  }

  return response.json();
};
// ============================================================
// PYTHON HELP GUIDE
// ============================================================


export const getPythonHelpGuide = async () => {
  const response = await fetch(
    `${API_URL}/python-help`
  );


  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => ({}));


    throw new Error(
      data.message ||
        "Failed to fetch Python Help Guide"
    );
  }


  return response.json();
};


// ============================================================
// PYTHON HELP CONTENT
// ============================================================

export const getPythonHelpContent =
  async () => {
    const response =
      await fetch(
        `${API_URL}/python-help/content`
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to fetch Python Help content"
      );
    }


    return response.json();
  };


// ============================================================
// SAVE CONTENT
// ============================================================

export const savePythonHelpContent =
  async (content) => {
    const response =
      await fetch(
        `${API_URL}/python-help/content`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            content,
          }),
        }
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to save Python Help content"
      );
    }


    return response.json();
  };


// ============================================================
// GET TOPICS
// ============================================================

export const getPythonHelpTopics =
  async (
    category = "",
    search = ""
  ) => {
    const params =
      new URLSearchParams();


    if (
      category &&
      category !== "All Topics"
    ) {
      params.set(
        "category",
        category
      );
    }


    if (search) {
      params.set(
        "search",
        search
      );
    }


    const query =
      params.toString();


    const response =
      await fetch(
        `${API_URL}/python-help/topics${
          query
            ? `?${query}`
            : ""
        }`
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to fetch Python Help topics"
      );
    }


    return response.json();
  };


// ============================================================
// GET ONE TOPIC
// ============================================================

export const getPythonHelpTopic =
  async (topicId) => {
    const response =
      await fetch(
        `${API_URL}/python-help/topics/${encodeURIComponent(
          topicId
        )}`
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to fetch Python Help topic"
      );
    }


    return response.json();
  };


// ============================================================
// CREATE TOPIC
// ============================================================

export const createPythonHelpTopic =
  async (topic) => {
    const response =
      await fetch(
        `${API_URL}/python-help/topics`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            topic,
          }),
        }
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to create Python Help topic"
      );
    }


    return response.json();
  };


// ============================================================
// UPDATE TOPIC
// ============================================================

export const updatePythonHelpTopic =
  async (
    topicId,
    topic
  ) => {
    const response =
      await fetch(
        `${API_URL}/python-help/topics/${encodeURIComponent(
          topicId
        )}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            topic,
          }),
        }
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to update Python Help topic"
      );
    }


    return response.json();
  };


// ============================================================
// DELETE TOPIC
// ============================================================

export const deletePythonHelpTopic =
  async (topicId) => {
    const response =
      await fetch(
        `${API_URL}/python-help/topics/${encodeURIComponent(
          topicId
        )}`,
        {
          method: "DELETE",
        }
      );


    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => ({}));


      throw new Error(
        data.message ||
          "Failed to delete Python Help topic"
      );
    }


    return response.json();
  };
  // ===============================
// PROFILE API
// ===============================

export const getProfile = async (userId) => {
  const response = await fetch(
    `${API_URL}/profile/${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Failed to fetch profile"
    );
  }

  return response.json();
};
export const updateProfile = async (
  userId,
  profileData
) => {
  const response = await fetch(
    `${API_URL}/profile/${encodeURIComponent(userId)}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to update profile"
    );

    // Preserve the backend error code
    // e.g. PHONE_ALREADY_REGISTERED
    error.code = data.code;

    throw error;
  }

  return data;
};
export const updateProfileNotifications = async (
  userId,
  notifications
) => {
  const response = await fetch(
    `${API_URL}/profile/${encodeURIComponent(
      userId
    )}/notifications`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(notifications),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      data.message ||
        "Failed to update notification settings"
    );
  }

  return response.json();
};


export const deleteProfile = async (userId) => {
  const response = await fetch(
    `${API_URL}/profile/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      data.message || "Failed to delete profile"
    );
  }

  return response.json();
};
// ========================================
// NOTIFICATIONS API
// ========================================

export const getNotifications = async (
  userId
) => {
  const response = await fetch(
    `${API_URL}/notifications/${encodeURIComponent(
      userId
    )}`
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch notifications"
    );
  }

  return data;
};


export const markNotificationRead =
  async (
    userId,
    notificationId
  ) => {
    const response = await fetch(
      `${API_URL}/notifications/${encodeURIComponent(
        notificationId
      )}/read`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          userId,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to mark notification as read"
      );
    }

    return data;
  };


export const markAllNotificationsRead =
  async (userId) => {
    const response = await fetch(
      `${API_URL}/notifications/${encodeURIComponent(
        userId
      )}/read-all`,
      {
        method: "PATCH",
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to mark notifications as read"
      );
    }

    return data;
  };
export const createStripeCheckoutSession = async (userId) => {
  const response = await fetch(
    `${API_URL}/payments/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        "Failed to create Stripe checkout session"
    );

    error.code = data.code;

    throw error;
  }

  return data;
};

export const getPaymentStatus = async (sessionId) => {
  const response = await fetch(
    `${API_URL}/payments/status/${encodeURIComponent(
      sessionId
    )}`
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        "Failed to get payment status"
    );

    error.code = data.code;

    throw error;
  }

  return data;
};
// =====================================================
// COURSE PURCHASE / STRIPE
// =====================================================

export const createCourseCheckoutSession = async (
  userId,
  courseId
) => {
  const response = await fetch(
    `${API_URL}/course-purchases/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        courseId,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        "Unable to create course checkout session."
    );

    error.code = data.code;

    throw error;
  }

  return data;
};


export const getCoursePurchaseStatus = async (
  courseId,
  userId
) => {
  const response = await fetch(
    `${API_URL}/course-purchases/status/${encodeURIComponent(
      courseId
    )}/${encodeURIComponent(userId)}`
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to get course purchase status."
    );
  }

  return data;
};

// =====================================================
// COURSE / LESSON PROGRESS
// =====================================================

export const completeLesson = async (userId, lessonId) => {
  const response = await fetch(`${API_URL}/progress/lesson-complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, lessonId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save lesson progress");
  }

  requestAchievementCheck();

  return response.json();
};

export const getCourseProgress = async (userId, courseId) => {
  const response = await fetch(
    `${API_URL}/progress/${encodeURIComponent(
      userId
    )}/course/${encodeURIComponent(courseId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course progress");
  }

  return response.json();
};

// Status (Not Started / In Progress / Completed) of every course in one call.
export const getCourseStatuses = async (userId) => {
  const response = await fetch(
    `${API_URL}/progress/${encodeURIComponent(userId)}/courses`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course statuses");
  }

  return response.json();
};

export const startCourse = async (userId, courseId) => {
  const response = await fetch(`${API_URL}/progress/course-start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save course start");
  }

  return response.json();
};
