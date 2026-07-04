import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { loginFijo, loginUsuario, registrarUsuario } from "./src/auth.js";
import { mesasRouter } from "./src/mesas.js";
import { postsRouter } from "./src/posts.js";
import { favoritosRouter } from "./src/favoritos.js";
import { resenasRouter } from "./src/resenas.js";
import { followsRouter } from "./src/follows.js";
import { productos, categorias } from "./src/productos.js";
import { upload, uploadsDir, uploadedFileUrl } from "./src/uploads.js";

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: FRONTEND_URL } });

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

io.on("connection", () => console.log("🔌 Socket conectado"));

app.get("/productos", (req, res) => res.json(productos));
app.get("/categorias", (req, res) => res.json(categorias));

app.post("/auth/login", async (req, res) => {
  const { user, pass, email, password } = req.body;

  const result = user ? loginFijo(user, pass) : await loginUsuario(email, password);

  if (!result) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  res.json(result);
});

app.post(
  "/auth/register",
  upload.fields([{ name: "foto", maxCount: 1 }, { name: "cv", maxCount: 1 }]),
  async (req, res) => {
    const { nombre, apellido, email, password, role } = req.body;

    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 4 caracteres" });
    }

    const fotoFile = req.files?.foto?.[0];
    const cvFile = req.files?.cv?.[0];

    const result = await registrarUsuario({
      nombre,
      apellido,
      email,
      password,
      role,
      fotoUrl: fotoFile ? uploadedFileUrl(req, fotoFile) : null,
      cvUrl: cvFile ? uploadedFileUrl(req, cvFile) : null
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ ...result.sesion, usuario: result.usuario });
  }
);

app.use(mesasRouter(io));
app.use(postsRouter());
app.use(favoritosRouter());
app.use(resenasRouter());
app.use(followsRouter());

httpServer.listen(PORT, () => {
  console.log(`☕ Cupster backend listo en puerto ${PORT}`);
});
