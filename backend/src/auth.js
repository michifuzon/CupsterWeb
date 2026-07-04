import crypto from "crypto";

const FIXED_USERS = {
  runner: { user: "runner", pass: "1234", role: "runner" },
  admin: { user: "admin", pass: "admin", role: "admin" }
};

const sesiones = {}; // token -> { role, nombre }

function crearSesion({ role, nombre }) {
  const token = crypto.randomBytes(16).toString("hex");
  sesiones[token] = { role, nombre };
  return { token, role, nombre };
}

export function loginFijo(user, pass) {
  const u = FIXED_USERS[user];
  if (!u || u.pass !== pass) return null;
  return crearSesion({ role: u.role, nombre: u.user });
}

export function auth(role) {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !sesiones[token] || sesiones[token].role !== role) {
      return res.sendStatus(403);
    }
    req.sesion = sesiones[token];
    next();
  };
}
