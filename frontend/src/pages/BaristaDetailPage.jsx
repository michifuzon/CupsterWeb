import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { baristas } from "../data/baristas.js";
import { PostCard } from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFollows } from "../context/FollowsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";

export function BaristaDetailPage() {
  const { id } = useParams();
  const barista = baristas.find(b => b.id === id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { siguiendoBarista, toggleFollowBarista } = useFollows();

  const [posts, setPosts] = useState([]);

  const followTargetId = `mock:${id}`;
  const siguiendo = siguiendoBarista(followTargetId);

  useEffect(() => {
    if (!barista) return;
    api.getPosts().then(all => setPosts(all.filter(p => p.authorNombre === barista.name)));
  }, [barista]);

  async function onToggleSeguir() {
    if (!user) {
      showToast("Iniciá sesión para seguir baristas", "info");
      return;
    }
    const yaSigue = await toggleFollowBarista(followTargetId);
    showToast(yaSigue ? "Ahora seguís a este barista" : "Dejaste de seguirlo", "success");
  }

  function onPostChange(updated) {
    setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }

  function onPostDeleted(postId) {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  if (!barista) {
    return (
      <div className="page">
        <Link to="/baristas" className="back-link">
          ← Volver a Baristas
        </Link>
        <p>No encontramos ese barista.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/baristas" className="back-link">
        ← Volver a Baristas
      </Link>

      <div className="detail-header">
        <img src={barista.photo} alt={barista.name} className="detail-photo" />
        <div>
          <h1 style={{ fontSize: 24 }}>{barista.name}</h1>
          <div className="chip" style={{ marginTop: 6 }}>
            {barista.subtitle}
          </div>
        </div>
        <div className="detail-header-actions">
          <button className={`btn-follow ${siguiendo ? "following" : ""}`} onClick={onToggleSeguir}>
            {siguiendo ? "Siguiendo ✓" : "Seguir"}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p>{barista.bio}</p>
        {barista.cafeteria && (
          <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)" }}>
            Trabaja en{" "}
            <Link to="/cafeterias" style={{ color: "var(--accent)", fontWeight: 600 }}>
              {barista.cafeteria}
            </Link>
          </p>
        )}
      </div>

      <div className="section-title">Qué propone</div>
      <div className="tag-list" style={{ marginBottom: 28 }}>
        {barista.especialidades.map(e => (
          <span className="tag" key={e}>
            {e}
          </span>
        ))}
      </div>

      <div className="section-title">Publicaciones</div>
      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Este barista todavía no publicó nada.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onChange={onPostChange} onDeleted={onPostDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
