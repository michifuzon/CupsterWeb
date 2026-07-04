import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RequireBarista } from "../components/RequireBarista.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { supabaseData } from "../services/supabaseData.js";

const METODOS = ["Espresso", "V60", "Chemex", "Prensa francesa", "Cold Brew", "Aeropress", "Otro"];

function CreateBaristaPostForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [metodo, setMetodo] = useState(METODOS[0]);
  const [receta, setReceta] = useState("");
  const [etiquetasTexto, setEtiquetasTexto] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(editando);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!editando) return;

    supabaseData
      .getPost(id)
      .then(post => {
        if (post.authorId !== user.id) {
          setForbidden(true);
          return;
        }
        setTitulo(post.titulo);
        setDescripcion(post.descripcion);
        setMetodo(post.metodo || METODOS[0]);
        setReceta(post.receta || "");
        setEtiquetasTexto((post.etiquetas || []).join(", "));
        setImagen(post.imagen || "");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, editando, user.id]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!titulo.trim() || !descripcion.trim()) {
      setError("Título y descripción son obligatorios");
      return;
    }

    const etiquetas = etiquetasTexto
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      const body = { titulo, descripcion, metodo, receta, etiquetas, imagen };
      editando
        ? await supabaseData.editarPost(user, id, body)
        : await supabaseData.crearPost(user, body);

      showToast(editando ? "Post actualizado" : "Post publicado", "success");
      navigate("/baristas");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page">Cargando post...</div>;
  }

  if (notFound) {
    return <div className="page">No encontramos ese post.</div>;
  }

  if (forbidden) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 420, margin: "60px auto", textAlign: "center" }}>
          <h2>No podés editar este post</h2>
          <p style={{ color: "var(--muted)" }}>Solo el autor puede editar o eliminar su publicación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        {editando ? "Editar post" : "Nuevo post de barista"}
      </h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          className="input"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />

        <textarea
          className="input"
          placeholder="Descripción"
          rows={4}
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          required
        />

        <label className="field-label">
          Método
          <select className="input" value={metodo} onChange={e => setMetodo(e.target.value)}>
            {METODOS.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <textarea
          className="input"
          placeholder="Receta (opcional)"
          rows={4}
          value={receta}
          onChange={e => setReceta(e.target.value)}
        />

        <input
          className="input"
          placeholder="Etiquetas separadas por coma (ej: filtrado, v60, origen)"
          value={etiquetasTexto}
          onChange={e => setEtiquetasTexto(e.target.value)}
        />

        <input
          className="input"
          placeholder="URL de imagen (opcional)"
          value={imagen}
          onChange={e => setImagen(e.target.value)}
        />

        {imagen && (
          <img
            src={imagen}
            alt="Vista previa"
            style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 16 }}
            onError={e => (e.currentTarget.style.display = "none")}
          />
        )}

        {error && <span style={{ color: "#b3372c", fontSize: 13 }}>{error}</span>}

        <button className="btn-lg btn-lg-primary" disabled={saving} style={{ justifyContent: "center" }}>
          {saving ? "Guardando..." : editando ? "Guardar cambios" : "Publicar"}
        </button>
      </form>
    </div>
  );
}

export function CreateBaristaPostPage() {
  return (
    <RequireBarista>
      <CreateBaristaPostForm />
    </RequireBarista>
  );
}
