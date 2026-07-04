import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { coffeePlaces } from "../data/coffeePlaces.js";
import { baristas } from "../data/baristas.js";
import { BaristaCard } from "../components/BaristaCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useFollows } from "../context/FollowsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";

function Estrellas({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          style={{
            background: "none",
            border: "none",
            cursor: onChange ? "pointer" : "default",
            fontSize: 20,
            color: n <= value ? "var(--accent)" : "var(--border)"
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function CafeteriaDetailPage() {
  const { id } = useParams();
  const place = coffeePlaces.find(p => p.id === id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isFavorito, toggleFavorito } = useFavorites();
  const { siguiendoCafeteria, toggleFollowCafeteria } = useFollows();

  const baristasDelLugar = baristas.filter(b => b.cafeteria === place?.name);

  const [resenas, setResenas] = useState([]);
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);

  const esFavorito = place ? isFavorito(place.id) : false;
  const siguiendo = place ? siguiendoCafeteria(place.id) : false;

  useEffect(() => {
    if (!place) return;
    api.getResenas(place.id).then(setResenas);
  }, [place]);

  async function onToggleFavorito() {
    if (!user) return showToast("Iniciá sesión para guardar favoritos", "info");
    const yaEsFavorito = await toggleFavorito(place.id);
    showToast(yaEsFavorito ? "Agregado a favoritos" : "Quitado de favoritos", "success");
  }

  async function onToggleSeguir() {
    if (!user) return showToast("Iniciá sesión para seguir cafeterías", "info");
    const yaSigue = await toggleFollowCafeteria(place.id);
    showToast(yaSigue ? "Ahora seguís esta cafetería" : "Dejaste de seguirla", "success");
  }

  async function enviarResena(e) {
    e.preventDefault();
    if (!user) return showToast("Iniciá sesión para dejar una reseña", "info");

    setEnviandoResena(true);
    try {
      const actualizadas = await api.dejarResena(user.token, place.id, rating, comentario);
      setResenas(actualizadas);
      setComentario("");
      showToast("¡Gracias por tu reseña!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setEnviandoResena(false);
    }
  }

  if (!place) {
    return (
      <div className="page">
        <Link to="/cafeterias" className="back-link">
          ← Volver a Cafeterías
        </Link>
        <p>No encontramos esa cafetería.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/cafeterias" className="back-link">
        ← Volver a Cafeterías
      </Link>

      <img src={place.image} alt={place.name} className="detail-hero-image" />

      <div className="detail-header">
        <div>
          <h1 style={{ fontSize: 24 }}>{place.name}</h1>
          <div className="chip" style={{ marginTop: 6 }}>
            {place.category}
          </div>
        </div>
        <div className="detail-header-actions">
          <button className="btn-icon" title="Guardar en favoritos" onClick={onToggleFavorito}>
            {esFavorito ? "♥" : "♡"}
          </button>
          <button className={`btn-follow ${siguiendo ? "following" : ""}`} onClick={onToggleSeguir}>
            {siguiendo ? "Siguiendo ✓" : "Seguir"}
          </button>
        </div>
      </div>

      <div className="detail-meta">
        <span>⭐ {place.rating}</span>
        <span>📍 {place.address}</span>
        <span>🕒 {place.horario}</span>
        <span>🚶 {place.distance}</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p>{place.description}</p>
      </div>

      <div className="section-title">Qué proponen</div>
      <div className="tag-list" style={{ marginBottom: 28 }}>
        {place.specialties.map(s => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>

      {baristasDelLugar.length > 0 && (
        <>
          <div className="section-title">Baristas en {place.name}</div>
          <div className="grid-cards-centered" style={{ marginBottom: 32 }}>
            {baristasDelLugar.map(b => (
              <BaristaCard key={b.id} barista={b} />
            ))}
          </div>
        </>
      )}

      <div className="section-title">Reseñas</div>

      <form onSubmit={enviarResena} className="card" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <Estrellas value={rating} onChange={setRating} />
        <textarea
          className="input"
          placeholder={user ? "Contá tu experiencia..." : "Iniciá sesión para dejar una reseña"}
          rows={3}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          disabled={!user}
        />
        <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "8px 18px", borderRadius: 14 }} disabled={!user || enviandoResena}>
          {enviandoResena ? "Enviando..." : "Publicar reseña"}
        </button>
      </form>

      {resenas.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Sé el primero en dejar una reseña.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {resenas.map(r => (
            <div className="card" key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.userNombre}</strong>
                <Estrellas value={r.rating} />
              </div>
              {r.comentario && <p style={{ marginTop: 6, fontSize: 14 }}>{r.comentario}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
