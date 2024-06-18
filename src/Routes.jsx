import React, { useState, useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Home from "../src/pages/Home";
import Dashboard from "../src/pages/Dashboard";
import Map from "../src/pages/Map";
import Register from "../src/pages/auth/Register";
import Login from "./pages/auth/Login";
import UserData from "./pages/UserData";
import Manegement from "./pages/Manegement";
import { AuthProvider, useAuth } from "./services/authContext";
import PrivateRoute from "./components/PrivateRoute";
import Termos from "./pages/Terms"
import {NotificationContext} from "./NotificationContext"

export default function AppRoutes() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isTermPage = location.pathname === "/termos"

  const [notifications, setNotifications] = useState([]);
  const notificationContextProvider = { notifications, setNotifications };

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <NotificationContext.Provider value={notificationContextProvider}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              {!isLoginPage && !isRegisterPage && !isTermPage && <Sidebar isSidebar={isSidebar} />}
              <main className="content" style={{ overflowY: 'scroll' }}>
                {!isLoginPage && !isRegisterPage && !isTermPage &&<Topbar setIsSidebar={setIsSidebar} />}

                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/userData" element={<UserData />} />
                    <Route path="/manege" element={<Manegement />} />
                    <Route path="/termos" element={<Termos />} />
                  </Route>
                  {/* Adicione outras rotas aqui */}
                  <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </NotificationContext.Provider>  
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}
