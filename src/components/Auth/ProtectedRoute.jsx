// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, redirectIfAuth = false }) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (redirectIfAuth && accessToken) {
//     // If already authenticated, redirect to dashboard
//     return <Navigate to="/dashboard" replace />;
//   }
//   if (!redirectIfAuth && !accessToken) {
//     // If not authenticated and route is protected, redirect to login
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute; 
// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectIfAuth = false }) => {
  const accessToken = localStorage.getItem("accessToken");
  const jwt = localStorage.getItem("jwt");
  const isAuthenticated = !!(accessToken || jwt);
  
  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!redirectIfAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
