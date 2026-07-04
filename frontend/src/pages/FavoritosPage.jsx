import { Link } from "react-router-dom";
import { coffeePlaces } from "../data/coffeePlaces.js";
import { CoffeeCard } from "../components/CoffeeCard.jsx";
import { SkeletonCards } from "../components/Skeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export function FavoritosPage() {
  const { user } = useAuth();
  const { favoritos, loaded } = useFavorites();

  if (!user) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Iniciá sesión para ver tus favoritos</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            Guardá las cafeterías que más te gustan para encontrarlas rápido la próxima vez.
          </p>
          <Link to="/cafeterias" className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
            Explorar cafeterías
          </Link>
        </div>
      </div>
    );
  }

  const cafeteriasFavoritas = coffeePlaces.filter(p => favoritos.includes(p.id));

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Tus favoritos</h1>

      {!loaded && <SkeletonCards count={3} />}

      {loaded && cafeteriasFavoritas.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Todavía no guardaste ninguna cafetería como favorita.
          </p>
          <Link to="/cafeterias" className="btn-lg btn-lg-primary" style={{ justifyContent: "center", display: "inline-flex" }}>
            Explorar cafeterías
          </Link>
        </div>
      )}

      {cafeteriasFavoritas.length > 0 && (
        <div className="grid-cards-centered">
          {cafeteriasFavoritas.map(p => (
            <CoffeeCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}
