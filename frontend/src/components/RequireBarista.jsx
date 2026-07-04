import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function RequireBarista({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Iniciá sesión para publicar</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            Crear publicaciones es una función exclusiva para baristas registrados en Cupster.
          </p>
          <Link to="/" className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
            Volver a explorar
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "barista") {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Esta sección es solo para baristas</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            Tu cuenta es de cliente. Los posts de barista solo los pueden crear cuentas
            registradas con el rol barista.
          </p>
          <Link to="/baristas" className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
            Ver publicaciones de baristas
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
