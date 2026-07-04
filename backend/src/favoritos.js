import { Router } from "express";
import { db } from "./db.js";
import { authAny } from "./auth.js";

export function favoritosRouter() {
  const router = Router();

  router.get("/favoritos", authAny(), (req, res) => {
    const mios = db.data.favoritos
      .filter(f => f.userId === req.sesion.userId)
      .map(f => f.cafeteriaId);
    res.json(mios);
  });

  router.post("/favoritos/:cafeteriaId", authAny(), async (req, res) => {
    const { cafeteriaId } = req.params;
    const userId = req.sesion.userId;

    const existente = db.data.favoritos.find(
      f => f.userId === userId && f.cafeteriaId === cafeteriaId
    );

    if (existente) {
      db.data.favoritos = db.data.favoritos.filter(f => f !== existente);
    } else {
      db.data.favoritos.push({ userId, cafeteriaId });
    }

    await db.write();

    const mios = db.data.favoritos.filter(f => f.userId === userId).map(f => f.cafeteriaId);
    res.json(mios);
  });

  return router;
}
