import { Link } from "react-router-dom";
import { baristas } from "../data/baristas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useFollows } from "../context/FollowsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export function SeguidosPage() {
  const { user } = useAuth();
  const { baristas: baristasSeguidosIds, toggleFollowBarista } = useFollows();
  const { showToast } = useToast();

  if (!user) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Iniciá sesión para ver tus baristas seguidos</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            Seguí a los baristas que más te gustan para encontrar rápido sus publicaciones.
          </p>
          <Link to="/baristas" className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
            Ver baristas
          </Link>
        </div>
      </div>
    );
  }

  const baristasSeguidos = baristas.filter(b => baristasSeguidosIds.includes(`mock:${b.id}`));

  async function dejarDeSeguir(baristaId) {
    await toggleFollowBarista(`mock:${baristaId}`);
    showToast("Dejaste de seguirlo", "success");
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Baristas seguidos</h1>

      {baristasSeguidos.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Todavía no seguís a ningún barista.
          </p>
          <Link to="/baristas" className="btn-lg btn-lg-primary" style={{ justifyContent: "center", display: "inline-flex" }}>
            Descubrir baristas
          </Link>
        </div>
      ) : (
        <div className="grid-cards-centered">
          {baristasSeguidos.map(b => (
            <div className="card seguido-card" key={b.id}>
              <img src={b.photo} alt={b.name} className="barista-avatar-photo" />
              <strong>{b.name}</strong>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{b.subtitle}</span>
              <div className="seguido-actions">
                <Link to={`/baristas/${b.id}`} className="btn-secondary" style={{ borderRadius: 12, padding: "8px 12px", fontSize: 13 }}>
                  Ver perfil
                </Link>
                <button
                  className="btn-follow following"
                  style={{ fontSize: 12, padding: "8px 12px" }}
                  onClick={() => dejarDeSeguir(b.id)}
                >
                  Dejar de seguir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
