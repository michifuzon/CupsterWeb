import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/cupster_logo.png";
import { AuthChoiceModal } from "./AuthChoiceModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/cafeterias", label: "Cafeterías" },
  { to: "/baristas", label: "Baristas" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/pedido", label: "Pedidos" }
];

export function TopNav() {
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="top-nav">
      <Link to="/" className="logo" onClick={closeMenu}>
        <img src={logo} alt="Cupster" />
        Cupster
      </Link>

      <button
        className="nav-burger"
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={menuOpen ? "nav-open" : ""}>
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.label}
          </NavLink>
        ))}
        {user && (
          <>
            <NavLink to="/favoritos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Favoritos
            </NavLink>
            <NavLink to="/seguidos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Seguidos
            </NavLink>
          </>
        )}

        <div className="nav-mobile-account">
          {user ? (
            <button
              className="account-btn"
              onClick={() => {
                logout();
                closeMenu();
              }}
              style={{ fontSize: 14 }}
            >
              Salir ({user.nombre})
            </button>
          ) : (
            <button
              className="account-btn"
              onClick={() => {
                setShowAuth(true);
                closeMenu();
              }}
            >
              Ingresar / Registrarme
            </button>
          )}
        </div>
      </nav>

      <div className="nav-account-desktop">
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="nav-greeting">Hola, {user.nombre}</span>
            <button className="account-btn" title="Salir" onClick={logout} style={{ fontSize: 14 }}>
              Salir
            </button>
          </div>
        ) : (
          <button className="account-btn" title="Ingresar" onClick={() => setShowAuth(true)}>
            👤
          </button>
        )}
      </div>

      {showAuth && <AuthChoiceModal onClose={() => setShowAuth(false)} />}
    </header>
  );
}
