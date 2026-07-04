import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && roles.includes(user.role) ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}
