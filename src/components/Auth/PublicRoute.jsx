import React from "react";
import { Navigate,Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const jwt = localStorage.getItem("jwt");
  
  // Check for either token to determine if user is authenticated
  if (accessToken || jwt) {
    // If already authenticated, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default PublicRoute; 





// import React from "react";
// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     // If already authenticated, redirect to dashboard
//     return <Navigate to="/dashboard" replace />;
//   }
//   return children;
// };

// export default PublicRoute; 