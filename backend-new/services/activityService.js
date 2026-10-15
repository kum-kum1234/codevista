const {
  Achievement,
  UserAchievement,
  UnlockedAchievement,
} = require("../models/Achievement");

const { CommunityUser } = require("../models/Community");
const Profile = require("../models/Profile");
const defaultAchievements = require("../data/defaultAchievements");
const { sendNotificationToUser } = require("./notificationService");

const XP_PER_LEVEL = 500;
const DAY_MS = 24 * 60 * 60 * 1000;

// Counters a server-side event is allowed to increment.
const COUNTERS = [
  "lessonsDone",
  "codeRuns",
  "exercisesDone",
  "projectsCreated",
  "projectsSaved",
  "commentsMade",
  "visualArtProjects",
  "gamesCreated",
  "dataAnalysisProjects",
  "perfectQuizzes",
  "collaborations",
  "beginnerCoursesCompleted",
];

const METRICS = [...COUNTERS, "currentStreak"];

function getMetricValue(stats, criteriaType) {
  return Number((stats && stats[criteriaType]) || 0);
}

// level / progress fields derived from total xp
function levelFromXp(xp) {
  const total = Math.max(0, Number(xp) || 0);
  const into = total % XP_PER_LEVEL;

  return {
    xp: total,
    level: Math.floor(total / XP_PER_LEVEL) + 1,
    xpProgress: Math.round((into / XP_PER_LEVEL) * 100),
    xpToNextLevel: XP_PER_LEVEL - into,
  };
}

let defaultsSeeded = false;

// Adds any default definition that is missing (matched by achievementId).
// Existing ones are never touched, so edits made in the database are kept.
async function ensureDefaultAchievements() {
  if (defaultsSeeded) return;

  await Achievement.bulkWrite(
    defaultAchievements.map((definition) => ({
      updateOne: {
        filter: { achievementId: definition.achievementId },
        update: { $setOnInsert: definition },
        upsert: true,
      },
    }))
  );

  defaultsSeeded = true;
}

// Unlocks everything the user now qualifies for (and notifies them).
// Returns one entry per active definition with currentValue + unlocked.
async function evaluateAchievements(userId, stats) {
  await ensureDefaultAchievements();

  const [definitions, unlockedRecords] = await Promise.all([
    Achievement.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 }),
    UnlockedAchievement.find({ userId }),
  ]);

  const unlockedIds = new Set(unlockedRecords.map((item) => item.achievementId));
  const unlockedAt = new Map(
    unlockedRecords.map((item) => [item.achievementId, item.unlockedAt])
  );
  const result = [];

  for (const achievement of definitions) {
    const currentValue = getMetricValue(stats, achievement.criteriaType);
    const qualifies = currentValue >= achievement.criteriaValue;

    if (qualifies && !unlockedIds.has(achievement.achievementId)) {
      try {
        await UnlockedAchievement.create({
          userId,
          achievementId: achievement.achievementId,
        });

        const isBadge = achievement.type === "badge";

        await sendNotificationToUser({
          userId,
          type: "achievement",
          title: isBadge ? "Badge Earned" : "Achievement Unlocked",
          message: isBadge
            ? `${achievement.title} badge has been earned!`
            : `${achievement.title} has been unlocked!`,
          link: "/achievements",
          push: false,
          data: {
            achievementId: achievement.achievementId,
            achievementType: achievement.type,
          },
        }).catch((error) =>
          console.error("Achievement notification error:", error.message)
        );
      } catch (error) {
        // Duplicate unlock records are ignored.
        if (error?.code !== 11000) {
          console.error("Create unlocked achievement error:", error.message);
        }
      }

      unlockedIds.add(achievement.achievementId);
      unlockedAt.set(achievement.achievementId, new Date());
    }

    result.push({
      ...achievement.toObject(),
      currentValue,
      unlocked: unlockedIds.has(achievement.achievementId),
      unlockedAt: unlockedAt.get(achievement.achievementId) || null,
    });
  }

  return result;
}

// Mirrors learning stats into the community profile.
async function syncCommunityUser(
  userId,
  stats,
  badgeCount,
  xpGain = 0,
  unlockedCount = null
) {
  const profile = await Profile.findOne({ userId }).select("name").lean();

  // Profile page shows these.
  const profileFields = { streak: stats.currentStreak || 0 };
  if (unlockedCount !== null) profileFields.achievementsCount = unlockedCount;

  await Profile.updateOne({ userId }, { $set: profileFields });

  const update = {
    $set: {
      lessons: stats.lessonsDone || 0,
      streak: stats.currentStreak || 0,
      badges: badgeCount,
    },
    $setOnInsert: { name: profile?.name || "Community Member" },
  };

  if (xpGain > 0) update.$inc = { xp: xpGain };

  const user = await CommunityUser.findOneAndUpdate({ userId }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  await CommunityUser.updateOne({ userId }, { $set: levelFromXp(user.xp) });
}

// Adds XP to a community profile (posts etc.) and keeps level fields in step.
async function addCommunityXp(userId, delta, extraInc = {}) {
  const user = await CommunityUser.findOneAndUpdate(
    { userId },
    { $inc: { xp: delta, ...extraInc } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const fields = levelFromXp(user.xp);
  const fix = { ...fields };

  if (user.posts < 0) fix.posts = 0;

  await CommunityUser.updateOne({ userId }, { $set: fix });

  return { ...user.toObject(), ...fix };
}

// Records learning activity. Safe to call without awaiting: never throws.
//   inc: { lessonsDone: 1, ... }  xp: community xp to award
async function trackActivity(userId, { inc = {}, xp = 0 } = {}) {
  try {
    if (!userId) return null;

    const counters = {};
    for (const key of COUNTERS) {
      if (Number.isFinite(inc[key]) && inc[key] > 0) counters[key] = inc[key];
    }

    const now = new Date();
    const previous = await UserAchievement.findOne({ userId }).select(
      "lastActive currentStreak"
    );

    // Streak counts consecutive calendar days (UTC).
    let streak = previous?.currentStreak || 0;
    const today = Math.floor(now.getTime() / DAY_MS);
    const last = previous?.lastActive
      ? Math.floor(previous.lastActive.getTime() / DAY_MS)
      : null;

    if (last === null || today - last > 1) streak = 1;
    else if (today - last === 1) streak += 1;
    else streak = Math.max(streak, 1);

    const update = { $set: { lastActive: now, currentStreak: streak } };
    if (Object.keys(counters).length) update.$inc = counters;

    const stats = await UserAchievement.findOneAndUpdate({ userId }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    const evaluated = await evaluateAchievements(userId, stats);
    const badgeCount = evaluated.filter(
      (item) => item.type === "badge" && item.unlocked
    ).length;

    await syncCommunityUser(
      userId,
      stats,
      badgeCount,
      xp,
      evaluated.filter((item) => item.unlocked).length
    );

    return stats;
  } catch (error) {
    console.error("Track activity error:", error.message);
    return null;
  }
}

module.exports = {
  COUNTERS,
  METRICS,
  XP_PER_LEVEL,
  levelFromXp,
  ensureDefaultAchievements,
  evaluateAchievements,
  syncCommunityUser,
  addCommunityXp,
  trackActivity,
};
