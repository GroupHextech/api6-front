import React from "react";
import AppRoutes from "./Routes";
import { AuthProvider } from "./services/authContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
