import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/Dashboard";

import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";

import WhyUs from "./pages/WhyUs";
import FAQ from "./pages/FAQ";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Courses */}
        <Route path="/app/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />

        {/* Public Pages */}
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Learning Features */}
        <Route path="/playground" element={<Playground />} />
        <Route
          path="/turtle-art-studio"
          element={<TurtleArtStudio />}
        />

        <Route path="/code-together" element={<CodeTogether />} />

        <Route
          path="/python-help-guide"
          element={<PythonHelpGuide />}
        />

        {/* User Features */}
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/community" element={<Community />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/my-timetable"
          element={<Timetable />}
        />

        <Route
          path="/my-notes"
          element={<Notes />}
        />

      </Routes>
    </BrowserRouter>
  );
}
