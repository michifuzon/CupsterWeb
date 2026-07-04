import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";
import { ConfirmDialog } from "./ConfirmDialog.jsx";

export function PostCard({ post, onChange, onDeleted }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comentario, setComentario] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const esAutor = user && user.userId === post.authorId;
  const yaLikeado = user && post.likes.includes(user.userId);

  async function toggleLike() {
    if (!user) {
      showToast("Iniciá sesión para dar like", "info");
      return;
    }
    const updated = await api.likePost(user.token, post.id);
    onChange?.(updated);
  }

  async function enviarComentario(e) {
    e.preventDefault();
    if (!user) {
      showToast("Iniciá sesión para comentar", "info");
      return;
    }
    if (!comentario.trim()) return;

    setBusy(true);
    try {
      const updated = await api.comentarPost(user.token, post.id, comentario.trim());
      setComentario("");
      onChange?.(updated);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function eliminar() {
    setBusy(true);
    try {
      await api.eliminarPost(user.token, post.id);
      showToast("Post eliminado", "success");
      onDeleted?.(post.id);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="post-card">
      {post.imagen && (
        <img
          src={post.imagen}
          alt={post.titulo}
          className="post-card-image"
          onError={e => (e.currentTarget.style.display = "none")}
        />
      )}

      <strong>{post.titulo}</strong>
      <span style={{ color: "var(--muted)", fontSize: 13 }}>
        por {post.authorNombre} {post.metodo ? `· ${post.metodo}` : ""}
      </span>
      <p style={{ fontSize: 14 }}>{post.descripcion}</p>

      {post.etiquetas?.length > 0 && (
        <div className="tag-list">
          {post.etiquetas.map(t => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="post-actions-row">
        <button
          onClick={toggleLike}
          style={{ background: "none", border: "none", color: yaLikeado ? "var(--accent)" : "var(--muted)", fontWeight: 600 }}
        >
          {yaLikeado ? "❤️" : "🤍"} {post.likes.length}
        </button>
        <button
          onClick={() => setShowComments(s => !s)}
          style={{ background: "none", border: "none", color: "var(--muted)", fontWeight: 600 }}
        >
          💬 {post.comentarios.length}
        </button>

        {esAutor && (
          <>
            <Link to={`/baristas/${post.id}/editar`} style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
              Editar
            </Link>
            <button
              onClick={() => setConfirmingDelete(true)}
              style={{ background: "none", border: "none", fontSize: 12, color: "#b3372c" }}
            >
              Eliminar
            </button>
          </>
        )}
      </div>

      {showComments && (
        <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          {post.comentarios.length === 0 && (
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Sé el primero en comentar.</p>
          )}
          {post.comentarios.map(c => (
            <div key={c.id} style={{ fontSize: 12, marginBottom: 6 }}>
              <strong>{c.userNombre}: </strong>
              {c.texto}
            </div>
          ))}

          <form onSubmit={enviarComentario} style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              className="input"
              placeholder={user ? "Agregar un comentario..." : "Iniciá sesión para comentar"}
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              disabled={!user || busy}
              style={{ padding: "8px 12px" }}
            />
            <button className="btn-primary" disabled={!user || busy} style={{ padding: "0 16px", borderRadius: 12 }}>
              Enviar
            </button>
          </form>
        </div>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="¿Eliminar esta publicación?"
          message="Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={eliminar}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
