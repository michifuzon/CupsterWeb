import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbFile = path.join(dataDir, "db.json");

mkdirSync(dataDir, { recursive: true });

const defaultData = {
  mesas: {},
  usuarios: [],
  posts: [],
  favoritos: [], // { userId, cafeteriaId }
  resenas: [], // { id, cafeteriaId, userId, userNombre, rating, comentario, createdAt }
  follows: [] // { userId, targetType: "cafeteria" | "barista", targetId }
};

export const db = await JSONFilePreset(dbFile, defaultData);

// migración suave para bases ya existentes creadas antes de sumar estas colecciones
for (const key of ["usuarios", "posts", "favoritos", "resenas", "follows"]) {
  if (!db.data[key]) db.data[key] = [];
}

export function mesaVacia(id) {
  return { id, estado: "armando", comensales: {}, pagos: {} };
}

export function getMesa(id) {
  return db.data.mesas[id];
}

export async function setMesa(id, mesa) {
  db.data.mesas[id] = mesa;
  await db.write();
}

export function listMesas() {
  return Object.values(db.data.mesas);
}
