import React from "react";
import { useParams, Navigate } from "react-router-dom";
import CourseDetailPage from "../components/CourseDetailPage";
import { COURSES_DATA } from "../data/coursesData";

export default function CoursePage() {
  const { courseId } = useParams();
  const course = COURSES_DATA[courseId];

  if (!course) {
    return <Navigate to="/dashboard" replace />;
  }

  return <CourseDetailPage active="dashboard" {...course} />;
}