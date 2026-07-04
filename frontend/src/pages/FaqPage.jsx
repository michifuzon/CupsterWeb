import { useState } from "react";

const PREGUNTAS = [
  {
    q: "¿Cupster es gratis?",
    a: "Sí, descubrir cafeterías, guardar favoritos, seguir baristas y dejar reseñas es completamente gratis."
  },
  {
    q: "¿Cómo sumo mi cafetería a Cupster?",
    a: "Por ahora las cafeterías se cargan de forma curada. Escribinos desde la página de Contacto y la sumamos."
  },
  {
    q: "¿Cualquiera puede publicar como barista?",
    a: "No. Solo las cuentas registradas con el rol \"barista\" pueden crear publicaciones. Los clientes pueden comentar y darles like, pero no publicar contenido de barista."
  },
  {
    q: "¿Es obligatorio subir el CV al registrarme como barista?",
    a: "No, por ahora es un campo opcional pensado para probar cómo funcionaría ese flujo a futuro."
  },
  {
    q: "¿Puedo pedir desde Cupster en cualquier cafetería?",
    a: "El módulo de pedidos por mesa (con QR) funciona hoy como una demo para mesas específicas, no para todas las cafeterías del listado todavía."
  }
];

export function FaqPage() {
  const [abierta, setAbierta] = useState(null);

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Preguntas frecuentes</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PREGUNTAS.map((item, i) => (
          <div className="card faq-item" key={item.q}>
            <button className="faq-question" onClick={() => setAbierta(abierta === i ? null : i)}>
              <span>{item.q}</span>
              <span>{abierta === i ? "−" : "+"}</span>
            </button>
            {abierta === i && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
