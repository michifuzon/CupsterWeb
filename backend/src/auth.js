import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db.js";

const FIXED_USERS = {
  runner: { user: "runner", pass: "1234", role: "runner" },
  admin: { user: "admin", pass: "admin", role: "admin" }
};

const ROLES_PERMITIDOS = ["cliente", "barista"];

const sesiones = {}; // token -> { role, nombre, userId }

function crearSesion({ role, nombre, userId }) {
  const token = crypto.randomBytes(16).toString("hex");
  sesiones[token] = { role, nombre, userId };
  return { token, role, nombre, userId };
}

function sinPassword(usuario) {
  const { password, ...resto } = usuario;
  return resto;
}

export function loginFijo(user, pass) {
  const u = FIXED_USERS[user];
  if (!u || u.pass !== pass) return null;
  return crearSesion({ role: u.role, nombre: u.user });
}

export async function registrarUsuario({ nombre, apellido, email, password, role, fotoUrl, cvUrl }) {
  if (!ROLES_PERMITIDOS.includes(role)) {
    return { error: "Rol inválido" };
  }

  const emailNorm = email.trim().toLowerCase();
  const existe = db.data.usuarios.find(u => u.email === emailNorm);
  if (existe) return { error: "Ese email ya está registrado" };

  const hash = await bcrypt.hash(password, 10);
  const usuario = {
    id: crypto.randomUUID(),
    nombre,
    apellido: apellido || "",
    email: emailNorm,
    password: hash,
    role,
    fotoUrl: fotoUrl || null,
    cvUrl: role === "barista" ? cvUrl || null : null,
    createdAt: new Date().toISOString()
  };

  db.data.usuarios.push(usuario);
  await db.write();

  const sesion = crearSesion({ role: usuario.role, nombre: usuario.nombre, userId: usuario.id });
  return { usuario: sinPassword(usuario), sesion };
}

export async function loginUsuario(email, password) {
  const emailNorm = email.trim().toLowerCase();
  const usuario = db.data.usuarios.find(u => u.email === emailNorm);
  if (!usuario) return null;

  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return null;

  return crearSesion({ role: usuario.role, nombre: usuario.nombre, userId: usuario.id });
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

// para rutas que solo requieren estar logueado, sin importar el rol (favoritos, reseñas, follows, likes, comentarios)
export function authAny() {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !sesiones[token]) {
      return res.sendStatus(403);
    }
    req.sesion = sesiones[token];
    next();
  };
}
