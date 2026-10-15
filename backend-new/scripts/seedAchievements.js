// Adds every default achievement / badge that is missing from the database.
// Existing documents are left untouched. Run: node scripts/seedAchievements.js
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { Achievement } = require("../models/Achievement");
const defaults = require("../data/defaultAchievements");

(async () => {
  await connectDB();

  const before = await Achievement.countDocuments();

  await Achievement.bulkWrite(
    defaults.map((definition) => ({
      updateOne: {
        filter: { achievementId: definition.achievementId },
        update: { $setOnInsert: definition },
        upsert: true,
      },
    }))
  );

  const after = await Achievement.countDocuments();

  console.log(`Achievements: ${before} -> ${after} (${after - before} added)`);

  await mongoose.disconnect();
})().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
