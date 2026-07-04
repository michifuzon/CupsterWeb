import { Link } from "react-router-dom";

const REDES = [
  { label: "Instagram", icon: "📷" },
  { label: "Twitter / X", icon: "🐦" },
  { label: "TikTok", icon: "🎵" }
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <strong className="footer-brand">Cupster</strong>
          <p>La comunidad para descubrir café de especialidad.</p>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Sobre Cupster</span>
          <Link to="/sobre-cupster">Sobre Cupster</Link>
          <Link to="/faq">Preguntas frecuentes</Link>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Legal</span>
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/terminos">Términos y condiciones</Link>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Ayuda</span>
          <Link to="/contacto">Contacto</Link>
          <div className="footer-socials">
            {REDES.map(r => (
              <Link key={r.label} to="/contacto" title={`${r.label} (próximamente)`}>
                {r.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Cupster. Todos los derechos reservados.</span>
        <span>Fotos: Unsplash</span>
      </div>
    </footer>
  );
}
