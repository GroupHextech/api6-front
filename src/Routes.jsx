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
import { AuthContext } from "./services/authContext";

export default function AppRoutes() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Verificar se o usuário está autenticado 
  const { isAuthenticated } = useContext(AuthContext);

  // Função para renderizar as rotas privadas apenas se o usuário estiver autenticado
  const renderPrivateRoute = (element) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && !isRegisterPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content" style={{overflowY: 'scroll'}}>
            {!isLoginPage && !isRegisterPage && <Topbar setIsSidebar={setIsSidebar} />}

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={renderPrivateRoute(<Home />)} />
              <Route path="/dashboard" element={renderPrivateRoute(<Dashboard />)} />
              <Route path="/map" element={renderPrivateRoute(<Map />)} />
              <Route path="/userData" element={renderPrivateRoute(<UserData />)} />
              <Route path="/manege" element={renderPrivateRoute(<Manegement />)} />

              {/* Adicione outras rotas aqui */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
