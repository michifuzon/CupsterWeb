import { Router } from "express";
import crypto from "crypto";
import { db } from "./db.js";
import { auth, authAny } from "./auth.js";

export function postsRouter() {
  const router = Router();

  router.get("/posts", (req, res) => {
    const posts = [...db.data.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(posts);
  });

  router.get("/posts/:id", (req, res) => {
    const post = db.data.posts.find(p => p.id === req.params.id);
    if (!post) return res.sendStatus(404);
    res.json(post);
  });

  router.post("/posts", auth("barista"), async (req, res) => {
    const { titulo, descripcion, metodo, receta, etiquetas, imagen } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ error: "Título y descripción son obligatorios" });
    }

    const post = {
      id: crypto.randomUUID(),
      titulo,
      descripcion,
      metodo: metodo || null,
      receta: receta || null,
      etiquetas: Array.isArray(etiquetas) ? etiquetas : [],
      imagen: imagen || null,
      authorId: req.sesion.userId,
      authorNombre: req.sesion.nombre,
      likes: [],
      comentarios: [],
      createdAt: new Date().toISOString()
    };

    db.data.posts.push(post);
    await db.write();
    res.status(201).json(post);
  });

  router.put("/posts/:id", auth("barista"), async (req, res) => {
    const post = db.data.posts.find(p => p.id === req.params.id);
    if (!post) return res.sendStatus(404);
    if (post.authorId !== req.sesion.userId) return res.sendStatus(403);

    const { titulo, descripcion, metodo, receta, etiquetas, imagen } = req.body;
    Object.assign(post, {
      titulo: titulo ?? post.titulo,
      descripcion: descripcion ?? post.descripcion,
      metodo: metodo ?? post.metodo,
      receta: receta ?? post.receta,
      etiquetas: Array.isArray(etiquetas) ? etiquetas : post.etiquetas,
      imagen: imagen ?? post.imagen
    });

    await db.write();
    res.json(post);
  });

  router.delete("/posts/:id", auth("barista"), async (req, res) => {
    const post = db.data.posts.find(p => p.id === req.params.id);
    if (!post) return res.sendStatus(404);
    if (post.authorId !== req.sesion.userId) return res.sendStatus(403);

    db.data.posts = db.data.posts.filter(p => p.id !== req.params.id);
    await db.write();
    res.json({ ok: true });
  });

  router.post("/posts/:id/like", authAny(), async (req, res) => {
    const post = db.data.posts.find(p => p.id === req.params.id);
    if (!post) return res.sendStatus(404);

    const userId = req.sesion.userId;
    const yaLikeado = post.likes.includes(userId);
    post.likes = yaLikeado ? post.likes.filter(id => id !== userId) : [...post.likes, userId];

    await db.write();
    res.json(post);
  });

  router.post("/posts/:id/comentarios", authAny(), async (req, res) => {
    const post = db.data.posts.find(p => p.id === req.params.id);
    if (!post) return res.sendStatus(404);

    const { texto } = req.body;
    if (!texto?.trim()) return res.status(400).json({ error: "El comentario no puede estar vacío" });

    const comentario = {
      id: crypto.randomUUID(),
      userId: req.sesion.userId,
      userNombre: req.sesion.nombre,
      texto: texto.trim(),
      createdAt: new Date().toISOString()
    };

    post.comentarios.push(comentario);
    await db.write();
    res.status(201).json(post);
  });

  return router;
}
