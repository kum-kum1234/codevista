const mongoose = require("mongoose");

// One document per (user, course) once the user has opened a lesson of it.
const courseEnrollmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "courseenrollments" }
);

courseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports =
  mongoose.models.CourseEnrollment ||
  mongoose.model("CourseEnrollment", courseEnrollmentSchema);
