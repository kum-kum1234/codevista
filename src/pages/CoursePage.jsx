import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseDetailPage from "../components/CourseDetailPage";
import {
  getCourse,
  getLessonsByCourse,
  getCourseProgress,
} from "../services/api";
import { getCurrentUser } from "../utils/auth";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, lessonsResponse] = await Promise.all([
          getCourse(courseId),
          getLessonsByCourse(courseId),
        ]);

        setCourse(courseResponse.course);
        setLessons(lessonsResponse.lessons);

        // Progress is optional: the course still renders if it fails.
        const user = getCurrentUser() || {};
        const userId = user.id || user._id || user.userId || "";

        if (userId) {
          try {
            const progressResponse = await getCourseProgress(
              userId,
              courseId
            );

            setProgress(progressResponse?.progress?.percent || 0);
            setCompletedLessonIds(
              progressResponse?.progress?.completedLessonIds || []
            );
          } catch (progressError) {
            console.error("Failed to load progress:", progressError);
          }
        }

      } catch (err) {
        console.error("Failed to load course:", err);
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading course...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm font-semibold text-slate-700">
          {error || "Course not found."}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg px-4 py-2 text-xs font-semibold text-white"
          style={{
            background:
              "linear-gradient(135deg, #8B5CF6, #1AACDB)",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      
      <CourseDetailPage
        active="dashboard"
        courseId={courseId}
        title={course.title}
        description={course.description}
        level={course.level}
        badge={course.badge}
        lessonCount={lessons.length}
        videos={`${course.hours} hours`}
        whatYoullLearn={course.whatYoullLearn}
        requirements={course.requirements}
        lessons={lessons}
        progress={progress}
        completedLessonIds={completedLessonIds}
      />
    </div>
  );
}