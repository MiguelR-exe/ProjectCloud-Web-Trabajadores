import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { sessionExpired, dismissSessionExpired } = useAuth();

  return (
    <div className="app">
      <Header />

      {sessionExpired && (
        <div className="session-banner">
          Tu sesión expiró. Vuelve a iniciar sesión para continuar.
          <button onClick={dismissSessionExpired}>×</button>
        </div>
      )}

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="pie">
        <p>Madam Tusan · Panel de Trabajadores · Proyecto académico CS2032 Cloud Computing</p>
      </footer>
    </div>
  );
}
