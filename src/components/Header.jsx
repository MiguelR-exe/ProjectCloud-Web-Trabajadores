import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-eyebrow">陈 · Panel de Trabajadores</span>
          <span className="brand-title">Madam Tusan</span>
        </Link>

        <nav className="header-actions">
          <Link to="/" className="header-link">Inicio</Link>
          <Link to="/pedidos" className="header-link">Pedidos</Link>
          {user?.role === "admin" && (
            <Link to="/admin/trabajadores" className="header-link">Trabajadores</Link>
          )}
          <span className="header-user">
            {user?.user_id} <span className="header-role">{user?.role}</span>
          </span>
          <button className="header-link as-button" onClick={handleLogout}>
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
