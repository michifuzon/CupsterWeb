import { Router } from "express";
import crypto from "crypto";
import { db } from "./db.js";
import { authAny } from "./auth.js";

export function resenasRouter() {
  const router = Router();

  router.get("/cafeterias/:id/resenas", (req, res) => {
    const resenas = db.data.resenas
      .filter(r => r.cafeteriaId === req.params.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(resenas);
  });

  router.post("/cafeterias/:id/resenas", authAny(), async (req, res) => {
    const { rating, comentario } = req.body;
    const cafeteriaId = req.params.id;
    const userId = req.sesion.userId;

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "El rating debe ser entre 1 y 5" });
    }

    const existente = db.data.resenas.find(
      r => r.cafeteriaId === cafeteriaId && r.userId === userId
    );

    if (existente) {
      existente.rating = ratingNum;
      existente.comentario = comentario || "";
      existente.updatedAt = new Date().toISOString();
    } else {
      db.data.resenas.push({
        id: crypto.randomUUID(),
        cafeteriaId,
        userId,
        userNombre: req.sesion.nombre,
        rating: ratingNum,
        comentario: comentario || "",
        createdAt: new Date().toISOString()
      });
    }

    await db.write();

    const resenas = db.data.resenas
      .filter(r => r.cafeteriaId === cafeteriaId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.status(201).json(resenas);
  });

  return router;
}
