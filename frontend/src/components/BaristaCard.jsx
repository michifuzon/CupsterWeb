import { Link } from "react-router-dom";

export function BaristaCard({ barista }) {
  return (
    <Link to={`/baristas/${barista.id}`} className="barista-card">
      <img src={barista.photo} alt={barista.name} className="barista-avatar-photo" />
      <strong style={{ fontSize: 13 }}>{barista.name}</strong>
      <span style={{ fontSize: 11, color: "var(--muted)" }}>{barista.subtitle}</span>
    </Link>
  );
}
