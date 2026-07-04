export function TermsPage() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Términos y condiciones</h1>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p>
          Al usar Cupster aceptás que esta es una plataforma en desarrollo
          activo: algunas funciones (como pagos o notificaciones) todavía son
          simplificadas o están en construcción.
        </p>
        <p>
          Los usuarios con rol <strong>cliente</strong> pueden explorar
          cafeterías, guardar favoritos, seguir cafeterías/baristas y dejar
          reseñas. Solo los usuarios con rol <strong>barista</strong> pueden
          crear, editar y eliminar publicaciones de barista.
        </p>
        <p>
          No publiques contenido que no te pertenezca ni información falsa
          sobre cafeterías o personas reales. Nos reservamos el derecho de
          moderar publicaciones que incumplan esto.
        </p>
      </div>
    </div>
  );
}
