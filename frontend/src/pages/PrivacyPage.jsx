import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Privacidad</h1>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p>
          Esta es una versión de demostración de Cupster. Los datos que cargás
          (registro, favoritos, reseñas, posts) se guardan en nuestra base de
          datos para que la app funcione de punta a punta, pero este documento
          todavía no reemplaza una política de privacidad legal completa.
        </p>
        <p>
          No compartimos tu información con terceros. Las fotos de perfil y CV
          que subís se almacenan únicamente para el funcionamiento de tu
          cuenta dentro de Cupster.
        </p>
        <p>
          Si tenés dudas sobre tus datos, escribinos desde la página de{" "}
          <Link to="/contacto" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Contacto
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
