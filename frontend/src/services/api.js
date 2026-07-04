export const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers
    }
  });
  return res;
}

function authHeaders(token) {
  return { Authorization: token };
}

async function jsonOrThrow(res, fallbackError) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || fallbackError);
  }
  return res.json();
}

export const api = {
  // ===== PEDIDOS =====
  getMesa: id => request(`/mesa/${id}`).then(r => r.json()),
  agregarProducto: (id, nombre, productoId) =>
    request(`/mesa/${id}/agregar`, {
      method: "POST",
      body: JSON.stringify({ nombre, productoId })
    }).then(r => r.json()),
  confirmarPedido: id =>
    request(`/mesa/${id}/confirmar`, { method: "POST" }).then(r => r.json()),
  pagar: (id, nombre) =>
    request(`/mesa/${id}/pagar`, {
      method: "POST",
      body: JSON.stringify({ nombre })
    }).then(r => r.json()),
  getProductos: () => request(`/productos`).then(r => r.json()),
  getCategorias: () => request(`/categorias`).then(r => r.json()),

  // ===== AUTH =====
  login: (user, pass) =>
    request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ user, pass })
    }),
  loginUsuario: (email, password) =>
    request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  registrar: formData =>
    request(`/auth/register`, {
      method: "POST",
      body: formData
    }),

  // ===== RUNNER / ADMIN =====
  getRunnerMesas: token =>
    request(`/runner/mesas`, { headers: authHeaders(token) }).then(r =>
      r.ok ? r.json() : Promise.reject(r)
    ),
  entregarMesa: (id, token) =>
    request(`/runner/mesa/${id}/entregar`, {
      method: "POST",
      headers: authHeaders(token)
    }),
  getMesaQr: (id, token) =>
    request(`/mesa/${id}/qr`, { headers: authHeaders(token) }).then(r =>
      r.ok ? r.json() : Promise.reject(r)
    ),

  // ===== POSTS DE BARISTAS =====
  getPosts: () => request(`/posts`).then(r => r.json()),
  getPost: id => request(`/posts/${id}`).then(r => (r.ok ? r.json() : Promise.reject(r))),
  crearPost: (token, body) =>
    request(`/posts`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(body)
    }).then(r => jsonOrThrow(r, "No pudimos crear el post")),
  editarPost: (token, id, body) =>
    request(`/posts/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(body)
    }).then(r => jsonOrThrow(r, "No pudimos editar el post")),
  eliminarPost: (token, id) =>
    request(`/posts/${id}`, { method: "DELETE", headers: authHeaders(token) }).then(r =>
      jsonOrThrow(r, "No pudimos eliminar el post")
    ),
  likePost: (token, id) =>
    request(`/posts/${id}/like`, { method: "POST", headers: authHeaders(token) }).then(r =>
      jsonOrThrow(r, "No pudimos registrar el like")
    ),
  comentarPost: (token, id, texto) =>
    request(`/posts/${id}/comentarios`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ texto })
    }).then(r => jsonOrThrow(r, "No pudimos publicar el comentario")),

  // ===== FAVORITOS =====
  getFavoritos: token =>
    request(`/favoritos`, { headers: authHeaders(token) }).then(r => jsonOrThrow(r, "Error al cargar favoritos")),
  toggleFavorito: (token, cafeteriaId) =>
    request(`/favoritos/${cafeteriaId}`, { method: "POST", headers: authHeaders(token) }).then(r =>
      jsonOrThrow(r, "No pudimos actualizar tus favoritos")
    ),

  // ===== RESEÑAS =====
  getResenas: cafeteriaId => request(`/cafeterias/${cafeteriaId}/resenas`).then(r => r.json()),
  dejarResena: (token, cafeteriaId, rating, comentario) =>
    request(`/cafeterias/${cafeteriaId}/resenas`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ rating, comentario })
    }).then(r => jsonOrThrow(r, "No pudimos guardar tu reseña")),

  // ===== FOLLOWS =====
  getFollows: token =>
    request(`/follows`, { headers: authHeaders(token) }).then(r => jsonOrThrow(r, "Error al cargar seguidos")),
  toggleFollowCafeteria: (token, id) =>
    request(`/follows/cafeteria/${id}`, { method: "POST", headers: authHeaders(token) }).then(r =>
      jsonOrThrow(r, "No pudimos actualizar")
    ),
  toggleFollowBarista: (token, id) =>
    request(`/follows/barista/${id}`, { method: "POST", headers: authHeaders(token) }).then(r =>
      jsonOrThrow(r, "No pudimos actualizar")
    )
};
