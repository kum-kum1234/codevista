import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//import AIMentor from "./pages/AIMentor";
import Home from "./pages/home";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/Dashboard";

import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import CoursesMarketing from "./pages/CoursesMarketing";

import WhyUs from "./pages/WhyUs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import LessonPage from "./components/LessonPage";

import Playground from "./pages/Playground";
import TurtleArtStudio from "./pages/TurtleArtStudio";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Profile from "./pages/Profile";

import CodeTogether from "./pages/CodeTogether";
import PythonHelpGuide from "./pages/PythonHelpGuide";
import Timetable from "./pages/Timetable";
import Notes from "./pages/notes";

//import FloatingAIMentor from "./components/FloatingAIMentor";

import { getCurrentUser } from "./utils/auth";


// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC PAGES
        ================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Login />} />

        <Route path="/welcome" element={<Onboarding />} />

        <Route path="/why-us" element={<WhyUs />} />

        <Route path="/faq" element={<FAQ />} />

        <Route path="/contact" element={<Contact />} />


        {/* ==================================================
            PROTECTED MAIN APP
        ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            COURSES
        ================================================== */}

        {/* Main Courses page */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesMarketing />
            </ProtectedRoute>
          }
        />

        {/* Alternative authenticated courses page */}
        <Route
          path="/app/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* Individual course */}
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            LESSONS
        ================================================== */}

        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            AI MENTOR
        ================================================== */}
       
        {/* 
<Route
  path="/ai-mentor"
  element={
    <ProtectedRoute>
      <AIMentor />
    </ProtectedRoute>
  }
/>
*/}
        {/* ==================================================
            LEARNING FEATURES
        ================================================== */}

        <Route
          path="/playground"
          element={
            <ProtectedRoute>
              <Playground />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turtle-art-studio"
          element={
            <ProtectedRoute>
              <TurtleArtStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/code-together"
          element={
            <ProtectedRoute>
              <CodeTogether />
            </ProtectedRoute>
          }
        />

        <Route
          path="/python-help-guide"
          element={
            <ProtectedRoute>
              <PythonHelpGuide />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            USER FEATURES
        ================================================== */}

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-timetable"
          element={
            <ProtectedRoute>
              <Timetable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* Floating AI Mentor Widget */}
      {/*<FloatingAIMentor />*/}

    </BrowserRouter>
  );
}
