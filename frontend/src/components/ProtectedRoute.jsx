import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../hooks/auth";

export default function ProtectedRoute({ role, children }) {
  const user = getUser();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
