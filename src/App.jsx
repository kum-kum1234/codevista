import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CoursesMarketing from "./pages/CoursesMarketing";
import WhyUs from "./pages/WhyUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Playground from "./pages/Playground";
import TurtleArtStudio from "./pages/TurtleArtStudio";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Timetable from "./pages/Timetable";
import Notes from "./pages/Notes";
import CodeTogether from "./pages/CodeTogether";
import PythonHelpGuide from "./pages/PythonHelpGuide";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Public marketing pages (logged out, reachable from the top nav) */}
        <Route path="/courses" element={<CoursesMarketing />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

        {/* In-app course browser (logged in, reached via the sidebar) */}
        <Route path="/app/courses" element={<Courses />} />

        <Route path="/playground" element={<Playground />} />
        <Route path="/turtle-art-studio" element={<TurtleArtStudio />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/community" element={<Community />} />
        <Route path="/help" element={<Help />} />
        <Route path="/my-timetable" element={<Timetable />} />
        <Route path="/my-notes" element={<Notes />} />
        <Route path="/code-together" element={<CodeTogether />} />
        <Route path="/python-help-guide" element={<PythonHelpGuide />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}