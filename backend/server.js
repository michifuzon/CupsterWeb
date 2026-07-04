import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { loginFijo } from "./src/auth.js";
import { mesasRouter } from "./src/mesas.js";
import { productos, categorias } from "./src/productos.js";

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: FRONTEND_URL } });

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

io.on("connection", () => console.log("🔌 Socket conectado"));

app.get("/productos", (req, res) => res.json(productos));
app.get("/categorias", (req, res) => res.json(categorias));

// Login fijo de runner/admin (usado solo para el panel de mesas). El resto
// de la autenticación (clientes/baristas) vive ahora en Supabase Auth.
app.post("/auth/login", (req, res) => {
  const { user, pass } = req.body;
  const result = loginFijo(user, pass);

  if (!result) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  res.json(result);
});

app.use(mesasRouter(io));

httpServer.listen(PORT, () => {
  console.log(`☕ Cupster backend listo en puerto ${PORT}`);
});
