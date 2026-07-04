import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

const MESAS = Array.from({ length: 12 }, (_, i) => i + 1);

export function AdminQrPage() {
  const [qrs, setQrs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("cupster_admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    Promise.all(MESAS.map(id => api.getMesaQr(id, token).catch(() => null)))
      .then(results => setQrs(results.filter(Boolean)));
  }, [token, navigate]);

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>QRs de mesas</h1>

      <div className="qr-grid">
        {qrs.map(q => (
          <div className="qr-card" key={q.mesa}>
            <h3>Mesa {q.mesa}</h3>
            <img src={q.qr} alt={`QR mesa ${q.mesa}`} />
            <p style={{ fontSize: 11, color: "var(--muted)", wordBreak: "break-all" }}>{q.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
