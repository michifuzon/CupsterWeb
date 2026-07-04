import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { socket } from "../services/socket.js";

export function RunnerPage() {
  const [mesas, setMesas] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("cupster_runner_token");

  const cargarMesas = useCallback(async () => {
    try {
      const data = await api.getRunnerMesas(token);
      setMesas(data);
    } catch {
      navigate("/runner/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/runner/login");
      return;
    }

    cargarMesas();
    socket.connect();
    socket.on("runner:update", cargarMesas);

    return () => {
      socket.off("runner:update", cargarMesas);
      socket.disconnect();
    };
  }, [token, cargarMesas, navigate]);

  async function entregar(id) {
    await api.entregarMesa(id, token);
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Runner</h1>

      <div className="products">
        {mesas.map(mesa => (
          <div className="product-card" key={mesa.id}>
            <h3>Mesa {mesa.id}</h3>
            {Object.entries(mesa.comensales).map(([n, items]) => (
              <div key={n}>
                <strong>{n}</strong>
                {items.map((p, i) => (
                  <div key={i}>- {p.name}</div>
                ))}
              </div>
            ))}
            <button onClick={() => entregar(mesa.id)}>Entregado</button>
          </div>
        ))}

        {mesas.length === 0 && <p style={{ color: "var(--muted)" }}>No hay mesas confirmadas.</p>}
      </div>
    </div>
  );
}
