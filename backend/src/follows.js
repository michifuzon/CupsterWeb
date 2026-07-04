import { Router } from "express";
import { db } from "./db.js";
import { authAny } from "./auth.js";

// targetId de barista puede ser "mock:<id>" (perfil curado en el frontend)
// o "user:<id>" (usuario barista real registrado) — no hay una tabla de
// perfiles de barista en el backend, así que el prefijo es lo que distingue el origen.
export function followsRouter() {
  const router = Router();

  router.get("/follows", authAny(), (req, res) => {
    const mios = db.data.follows.filter(f => f.userId === req.sesion.userId);
    res.json({
      cafeterias: mios.filter(f => f.targetType === "cafeteria").map(f => f.targetId),
      baristas: mios.filter(f => f.targetType === "barista").map(f => f.targetId)
    });
  });

  function toggleFollow(targetType) {
    return async (req, res) => {
      const userId = req.sesion.userId;
      const targetId = req.params.id;

      const existente = db.data.follows.find(
        f => f.userId === userId && f.targetType === targetType && f.targetId === targetId
      );

      if (existente) {
        db.data.follows = db.data.follows.filter(f => f !== existente);
      } else {
        db.data.follows.push({ userId, targetType, targetId });
      }

      await db.write();

      const mios = db.data.follows.filter(f => f.userId === userId && f.targetType === targetType);
      res.json(mios.map(f => f.targetId));
    };
  }

  router.post("/follows/cafeteria/:id", authAny(), toggleFollow("cafeteria"));
  router.post("/follows/barista/:id", authAny(), toggleFollow("barista"));

  return router;
}
