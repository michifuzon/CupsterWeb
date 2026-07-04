import { Link } from "react-router-dom";

export function LocationCard({ title, subtitle }) {
  return (
    <Link to={`/cafeterias?zona=${encodeURIComponent(title)}`} className="location-card">
      <span style={{ fontSize: 22, color: "var(--accent)" }}>📍</span>
      <div>
        <strong>{title}</strong>
        <div style={{ color: "var(--muted)" }}>{subtitle}</div>
      </div>
      <span className="location-card-arrow">→</span>
    </Link>
  );
}
