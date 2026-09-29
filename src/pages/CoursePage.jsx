import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import CourseDetailPage from "../components/CourseDetailPage";
import { getCourse, getLessonsByCourse } from "../services/api";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
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
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative">
      
      {/* Back to Courses button */}
      <div className="px-6 pt-4">
        <button
          onClick={() => navigate("/courses")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-purple-600"
        >
          <span className="text-lg">←</span>
          Back to Courses
        </button>
      </div>

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
      />
    </div>
  );
}