import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export function CoffeeCard({ place }) {
  const { user } = useAuth();
  const { isFavorito, toggleFavorito } = useFavorites();
  const { showToast } = useToast();

  const favorito = isFavorito(place.id);

  async function onToggleFavorito(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Iniciá sesión para guardar favoritos", "info");
      return;
    }
    const yaEsFavorito = await toggleFavorito(place.id);
    showToast(yaEsFavorito ? "Agregado a favoritos" : "Quitado de favoritos", "success");
  }

  return (
    <Link to={`/cafeterias/${place.id}`} className="coffee-card">
      <div className="coffee-card-image-wrap">
        <img src={place.image} alt={place.name} className="coffee-card-image" loading="lazy" />
        <button
          className={`btn-favorite ${favorito ? "is-favorite" : ""}`}
          onClick={onToggleFavorito}
          title={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          {favorito ? "♥" : "♡"}
        </button>
      </div>
      <div className="coffee-card-body">
        <strong>{place.name}</strong>
        <span className="chip">{place.category}</span>
        <div className="coffee-card-meta">
          <span>⭐ {place.rating}</span>
          <span>{place.distance}</span>
        </div>
      </div>
    </Link>
  );
}
