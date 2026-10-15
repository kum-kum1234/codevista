// Seeded into the Achievement collection when missing (matched by achievementId).
// Existing documents are never overwritten, so edits made in the database stay.
// Re-seed with: node scripts/seedAchievements.js  (also runs on server use).

const A = (achievementId, title, description, rarity, type, icon, category, criteriaType, criteriaValue, sortOrder) => ({
  achievementId,
  title,
  description,
  rarity,
  type,
  icon,
  category,
  criteriaType,
  criteriaValue,
  sortOrder,
  active: true,
});

module.exports = [
  // ---- original set ----
  A("first-steps", "First Steps", "Finish your very first lesson", "Common", "achievement", "book", "learning", "lessonsDone", 1, 1),
  A("getting-started", "Getting Started", "Complete 5 lessons", "Common", "achievement", "book", "learning", "lessonsDone", 5, 2),
  A("code-master", "Code Master", "Complete 25 lessons", "Rare", "achievement", "code", "learning", "lessonsDone", 25, 3),
  A("project-creator", "Project Creator", "Build and save your first project", "Rare", "achievement", "folder", "projects", "projectsSaved", 1, 4),
  A("streak-hero", "Streak Hero", "Log in 7 days in a row", "Rare", "achievement", "flame", "streak", "currentStreak", 7, 5),
  A("first-coder", "First Coder", "Run your first piece of code", "Common", "badge", "code", "coding", "codeRuns", 1, 6),
  A("quick-learner", "Quick Learner", "Complete 10 lessons", "Common", "badge", "zap", "learning", "lessonsDone", 10, 7),
  A("playground-pro", "Playground Pro", "Run 25 code examples in the playground", "Rare", "badge", "terminal", "playground", "codeRuns", 25, 8),

  // ---- added later ----
  A("warm-up", "Warm Up", "Run your code 2 times", "Common", "achievement", "terminal", "coding", "codeRuns", 2, 9),
  A("lessons-15", "Lesson Marathon", "Complete 15 lessons", "Rare", "achievement", "target", "learning", "lessonsDone", 15, 9),
  A("runs-50", "Code Runner", "Run code 50 times", "Rare", "achievement", "code", "coding", "codeRuns", 50, 10),
  A("projects-5", "Serial Creator", "Save 5 projects", "Rare", "achievement", "puzzle", "projects", "projectsCreated", 5, 11),
  A("art-project", "Turtle Artist", "Save a Turtle Art project", "Rare", "achievement", "flame", "projects", "visualArtProjects", 1, 12),
  A("streak-3", "On a Roll", "Learn 3 days in a row", "Common", "achievement", "zap", "streak", "currentStreak", 3, 13),
  A("badge-coder", "Coder", "Run code 10 times", "Common", "badge", "code", "coding", "codeRuns", 10, 14),
  A("badge-builder", "Builder", "Save 3 projects", "Rare", "badge", "folder", "projects", "projectsCreated", 3, 15),
  A("badge-scholar", "Scholar", "Complete 50 lessons", "Legendary", "badge", "award", "learning", "lessonsDone", 50, 16),
];
