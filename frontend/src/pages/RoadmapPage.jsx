import { useMemo, useState } from "react";
import { coffeePlaces } from "../data/coffeePlaces.js";
import { CafeteriasMap } from "../components/CafeteriasMap.jsx";
import { LocationCard } from "../components/LocationCard.jsx";
import { Link } from "react-router-dom";

const zonas = [
  { title: "Nueva Córdoba", subtitle: "Alta concentración de cafeterías" },
  { title: "Güemes", subtitle: "Especialidad y cafés de autor" },
  { title: "General Paz", subtitle: "Cafeterías emergentes" },
  { title: "Alta Córdoba", subtitle: "Clásicos y nuevos spots" }
];

export function RoadmapPage() {
  const [search, setSearch] = useState("");

  const zonasFiltradas = zonas.filter(z =>
    z.title.toLowerCase().includes(search.toLowerCase())
  );

  const cafeteriasFiltradas = useMemo(() => {
    if (!search.trim()) return coffeePlaces;
    const q = search.trim().toLowerCase();
    return coffeePlaces.filter(
      p => p.zone.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="page">
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Explorar cafeterías</h1>

      <input
        className="input"
        placeholder="Buscar barrio o cafetería"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ height: 20 }} />

      <CafeteriasMap places={cafeteriasFiltradas} />

      <div className="section-title">Zonas populares</div>

      {zonasFiltradas.map(z => (
        <LocationCard key={z.title} title={z.title} subtitle={z.subtitle} />
      ))}

      <div style={{ height: 12 }} />

      <Link to="/cafeterias" className="back-link" style={{ marginBottom: 0 }}>
        Ver listado completo de cafeterías →
      </Link>
    </div>
  );
}
