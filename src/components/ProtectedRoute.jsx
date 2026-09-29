import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { getCurrentUser } from "./utils/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [authenticated, setAuthenticated] =
    useState(() => {
      return getCurrentUser() !== null;
    });

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();

      setAuthenticated(user !== null);
    };

    // Check when authentication changes
    window.addEventListener(
      "auth-change",
      checkAuth
    );

    // Check when browser tab becomes active
    window.addEventListener(
      "visibilitychange",
      checkAuth
    );

    // Very important:
    // handles Chrome Back/Forward cache
    window.addEventListener(
      "pageshow",
      checkAuth
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        checkAuth
      );

      window.removeEventListener(
        "visibilitychange",
        checkAuth
      );

      window.removeEventListener(
        "pageshow",
        checkAuth
      );
    };
  }, []);

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}