import { useState } from "react";
import { useToast } from "../context/ToastContext.jsx";

export function ContactPage() {
  const { showToast } = useToast();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    showToast("¡Gracias! Recibimos tu mensaje.", "success");
    setNombre("");
    setEmail("");
    setMensaje("");
  }

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Contacto</h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        ¿Tenés dudas, sugerencias o querés sumar tu cafetería a Cupster? Escribinos.
      </p>

      <form onSubmit={onSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="input"
          placeholder="Tu nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="Contanos en qué te podemos ayudar"
          rows={5}
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          required
        />
        <button className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
          Enviar mensaje
        </button>
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Este formulario todavía es una demo: no envía el mensaje a ningún
          correo real, solo confirma el envío en pantalla.
        </p>
      </form>
    </div>
  );
}
