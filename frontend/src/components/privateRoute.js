import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check if token exists

  // If token is not found, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // If token exists, allow access to the protected route
  return children;
};

export default PrivateRoute;
