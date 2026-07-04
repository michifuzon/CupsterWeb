export const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  return res;
}

function authHeaders(token) {
  return { Authorization: token };
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

  // ===== AUTH FIJO (runner/admin) =====
  login: (user, pass) =>
    request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ user, pass })
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
    )
};
