import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Dashboard from "../src/pages/Dashboard";
import Map from "../src/pages/Map";
import Register from "../src/pages/auth/Register"
import Login from "./pages/auth/Login";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
