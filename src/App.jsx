import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import WhyUs from "./pages/WhyUs";
import FAQ from "./pages/FAQ";
import Playground from "./pages/Playground";
import TurtleArtStudio from "./pages/TurtleArtStudio";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import CoursePage from "./pages/CoursePage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Public marketing pages */}
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/faq" element={<FAQ />} />

        {/* In-app course browser */}
        <Route path="/app/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />

        <Route path="/playground" element={<Playground />} />
        <Route path="/turtle-art-studio" element={<TurtleArtStudio />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/community" element={<Community />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}
