import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baristas } from "../data/baristas.js";
import { BaristaCard } from "../components/BaristaCard.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { SkeletonCards } from "../components/Skeleton.jsx";
import { supabaseData } from "../services/supabaseData.js";

export function BaristasPage() {
  const [posts, setPosts] = useState(null); // null = cargando

  useEffect(() => {
    supabaseData.getPosts().then(setPosts);
  }, []);

  function onPostChange(updated) {
    setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }

  function onPostDeleted(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 26 }}>Baristas</h1>
      <p style={{ color: "var(--muted)", marginTop: 8, marginBottom: 20 }}>
        Personas que comparten recetas, experiencias y cultura cafetera.
      </p>

      <Link
        to="/baristas/nueva"
        className="btn-lg btn-lg-primary"
        style={{ width: "100%", justifyContent: "center", marginBottom: 24 }}
      >
        + Crear post
      </Link>

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 22, color: "var(--accent)" }}>✏️</span>
        <span style={{ color: "var(--muted)" }}>
          ¿Sos barista o tostador? Registrate como barista y compartí tu experiencia.
        </span>
      </div>

      <div className="section-title">Creaciones recientes</div>

      {posts === null && <SkeletonCards count={3} />}

      {posts !== null && posts.length === 0 && (
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          Todavía no hay posts de baristas. ¡Sé el primero en publicar!
        </p>
      )}

      {posts !== null && posts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onChange={onPostChange} onDeleted={onPostDeleted} />
          ))}
        </div>
      )}

      <div className="section-title">Baristas destacados</div>
      <div className="grid-cards-centered">
        {baristas.map(b => (
          <BaristaCard key={b.id} barista={b} />
        ))}
      </div>
    </div>
  );
}
