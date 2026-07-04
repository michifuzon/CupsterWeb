import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { socket } from "../services/socket.js";

export function PedidoPage() {
  const { mesaId: paramId } = useParams();
  const [mesaId, setMesaId] = useState(
    () => paramId || localStorage.getItem("cupster_mesa") || null
  );
  const [mesaInput, setMesaInput] = useState("");

  const [mesa, setMesa] = useState({ estado: "armando", comensales: {}, pagos: {} });
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [nombreError, setNombreError] = useState("");

  const [nombre, setNombre] = useState(() =>
    mesaId ? localStorage.getItem(`cupster_nombre_mesa_${mesaId}`) || "" : ""
  );
  const nombreConfirmado = Boolean(
    mesaId && localStorage.getItem(`cupster_nombre_mesa_${mesaId}`)
  );

  const [modal, setModal] = useState(null); // null | "pedido" | "pagos"

  useEffect(() => {
    if (paramId) {
      localStorage.setItem("cupster_mesa", paramId);
      setMesaId(paramId);
    }
  }, [paramId]);

  useEffect(() => {
    if (!mesaId) return;

    api.getMesa(mesaId).then(setMesa);
    api.getProductos().then(setProductos);
    api.getCategorias().then(setCategorias);

    socket.connect();

    function onMesaUpdate(data) {
      if (String(data.id) === String(mesaId)) setMesa(data);
    }

    function onMesaEntregada({ id }) {
      if (String(id) === String(mesaId)) {
        setMesa({ estado: "armando", comensales: {}, pagos: {} });
        localStorage.removeItem(`cupster_nombre_mesa_${mesaId}`);
        setNombre("");
      }
    }

    socket.on("mesa:update", onMesaUpdate);
    socket.on("mesa:entregada", onMesaEntregada);

    return () => {
      socket.off("mesa:update", onMesaUpdate);
      socket.off("mesa:entregada", onMesaEntregada);
      socket.disconnect();
    };
  }, [mesaId]);

  const cerrado = mesa.estado !== "armando";

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchCategoria = !categoria || p.category === categoria;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategoria && matchSearch;
    });
  }, [productos, categoria, search]);

  const total = useMemo(() => {
    return Object.values(mesa.comensales || {}).reduce(
      (sum, items) => sum + items.reduce((s, p) => s + p.price, 0),
      0
    );
  }, [mesa.comensales]);

  function seleccionarMesa(e) {
    e.preventDefault();
    const id = mesaInput.trim();
    if (!id) return;
    localStorage.setItem("cupster_mesa", id);
    setMesaId(id);
  }

  async function agregarProducto(producto) {
    const n = nombre.trim();
    if (!n) {
      setNombreError("Ingresá tu nombre para poder pedir");
      return;
    }
    setNombreError("");

    localStorage.setItem(`cupster_nombre_mesa_${mesaId}`, n);
    const updated = await api.agregarProducto(mesaId, n, producto.id);
    setMesa(updated);
  }

  async function confirmarPedido() {
    await api.confirmarPedido(mesaId);
    setModal(null);
  }

  async function pagar() {
    await api.pagar(mesaId, localStorage.getItem(`cupster_nombre_mesa_${mesaId}`));
    const updated = await api.getMesa(mesaId);
    setMesa(updated);
  }

  if (!mesaId) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 360, margin: "60px auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <h2>¿En qué mesa estás?</h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Escaneá el QR de tu mesa o ingresá el número manualmente.
          </p>
          <form onSubmit={seleccionarMesa} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="input"
              placeholder="Número de mesa"
              value={mesaInput}
              onChange={e => setMesaInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: 16, padding: 10, border: "none" }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const estadoLabel =
    mesa.estado === "armando"
      ? "Armando pedido"
      : mesa.estado === "confirmado"
      ? "Pedido confirmado"
      : "Pedido entregado";

  return (
    <div className="page">
      <div style={{ marginBottom: 16 }}>
        Mesa <strong>{mesaId}</strong> — <strong>{estadoLabel}</strong>
      </div>

      <input
        className="input"
        placeholder="Buscar por productos"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="categories">
        <button className={!categoria ? "active" : ""} onClick={() => setCategoria(null)}>
          Todos
        </button>
        {categorias.map(c => (
          <button
            key={c.id}
            className={categoria === c.id ? "active" : ""}
            onClick={() => setCategoria(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!nombreConfirmado && (
        <>
          <input
            className="input"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => {
              setNombre(e.target.value);
              if (e.target.value.trim()) setNombreError("");
            }}
            style={{ marginBottom: nombreError ? 6 : 16 }}
          />
          {nombreError && (
            <div style={{ color: "#b3372c", fontSize: 13, marginBottom: 16 }}>{nombreError}</div>
          )}
        </>
      )}

      <div className="products">
        {productosFiltrados.map(p => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <span className="price">$ {p.price}</span>
            <button disabled={cerrado} onClick={() => agregarProducto(p)}>
              {cerrado ? "Cerrado" : "Agregar"}
            </button>
          </div>
        ))}
      </div>

      <div className="pedido-bar">
        <span>$ {total}</span>
        <button onClick={() => setModal("pedido")}>Ver pedido</button>
      </div>

      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{modal === "pedido" ? "Pedido de la mesa" : "Pagos"}</h2>

            {modal === "pedido" &&
              Object.entries(mesa.comensales || {}).map(([n, items]) => (
                <div key={n}>
                  <strong>{n}</strong>
                  <div>
                    {items.map((p, i) => (
                      <div key={i}>
                        - {p.name} (${p.price})
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {modal === "pagos" &&
              Object.entries(mesa.comensales || {}).map(([n, items]) => {
                const subtotal = items.reduce((s, p) => s + p.price, 0);
                const pagado = mesa.pagos?.[n] === "pagado";
                const esMiNombre = n === localStorage.getItem(`cupster_nombre_mesa_${mesaId}`);

                return (
                  <div key={n} style={{ marginBottom: 16 }}>
                    <strong>{n}</strong>
                    <div>Total: ${subtotal}</div>
                    <div style={{ color: pagado ? "#3f7a3f" : "#b3372c" }}>
                      {pagado ? "Pagado ✔" : "Pendiente ❌"}
                    </div>
                    {esMiNombre && !pagado && (
                      <button className="btn-primary" style={{ marginTop: 8 }} onClick={pagar}>
                        Pagar mi parte
                      </button>
                    )}
                  </div>
                );
              })}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setModal(null)}>
                Cerrar
              </button>
              {modal === "pedido" && !cerrado && (
                <button className="btn-primary" onClick={confirmarPedido}>
                  Confirmar pedido
                </button>
              )}
              <button className="btn-secondary" onClick={() => setModal("pagos")}>
                Ver pagos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
