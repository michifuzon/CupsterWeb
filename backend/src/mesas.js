import { Router } from "express";
import QRCode from "qrcode";
import { getMesa, setMesa, listMesas, mesaVacia } from "./db.js";
import { productos } from "./productos.js";
import { auth } from "./auth.js";

export function mesasRouter(io) {
  const router = Router();

  function emitirCambioMesa(id) {
    io.emit("mesa:update", getMesa(id));
  }

  function emitirRunner() {
    io.emit(
      "runner:update",
      listMesas().filter(m => m.estado === "confirmado")
    );
  }

  router.get("/mesa/:id", (req, res) => {
    const { id } = req.params;
    res.json(getMesa(id) || mesaVacia(id));
  });

  router.post("/mesa/:id/agregar", async (req, res) => {
    const { id } = req.params;
    const { nombre, productoId } = req.body;

    const producto = productos.find(p => p.id === productoId);
    if (!producto) return res.status(400).json({ error: "Producto inválido" });

    const mesa = getMesa(id) || mesaVacia(id);

    if (mesa.estado !== "armando") {
      return res.status(400).json({ error: "Mesa cerrada" });
    }

    mesa.comensales[nombre] ||= [];
    mesa.comensales[nombre].push(producto);

    if (!mesa.pagos[nombre]) {
      mesa.pagos[nombre] = "pendiente";
    }

    await setMesa(id, mesa);
    emitirCambioMesa(id);
    res.json(mesa);
  });

  router.post("/mesa/:id/confirmar", async (req, res) => {
    const { id } = req.params;
    const mesa = getMesa(id);
    if (!mesa) return res.sendStatus(404);

    mesa.estado = "confirmado";

    await setMesa(id, mesa);
    emitirCambioMesa(id);
    emitirRunner();

    res.json(mesa);
  });

  router.post("/mesa/:id/pagar", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const mesa = getMesa(id);
    if (!mesa) return res.sendStatus(404);

    mesa.pagos[nombre] = "pagado";

    await setMesa(id, mesa);
    emitirCambioMesa(id);
    res.json({ ok: true });
  });

  router.get("/runner/mesas", auth("runner"), (req, res) => {
    res.json(listMesas().filter(m => m.estado === "confirmado"));
  });

  router.post("/runner/mesa/:id/entregar", auth("runner"), async (req, res) => {
    const { id } = req.params;
    if (!getMesa(id)) return res.sendStatus(404);

    io.emit("mesa:entregada", { id });

    await setMesa(id, mesaVacia(id));
    emitirRunner();

    res.json({ ok: true });
  });

  router.get("/mesa/:id/qr", auth("admin"), async (req, res) => {
    const { id } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = `${frontendUrl}/pedido/${id}`;

    try {
      const qr = await QRCode.toDataURL(url);
      res.json({ mesa: id, url, qr });
    } catch (err) {
      res.status(500).json({ error: "Error generando QR" });
    }
  });

  return router;
}
