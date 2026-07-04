import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { coffeePlaces } from "../data/coffeePlaces.js";
import { CoffeeCard } from "../components/CoffeeCard.jsx";

export function CafeteriasPage() {
  const [searchParams] = useSearchParams();
  const zonaParam = searchParams.get("zona") || "";
  const [search, setSearch] = useState(zonaParam);

  useEffect(() => {
    if (zonaParam) setSearch(zonaParam);
  }, [zonaParam]);

  const filtradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coffeePlaces;
    return coffeePlaces.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Cafeterías</h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Descubrí cafeterías de especialidad por nombre, categoría o barrio.
      </p>

      <input
        className="input"
        placeholder="Buscar por nombre, categoría o barrio..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      <div className="result-count">
        {filtradas.length} {filtradas.length === 1 ? "resultado" : "resultados"}
        {search && (
          <button className="clear-filter-btn" onClick={() => setSearch("")}>
            Limpiar filtro ✕
          </button>
        )}
      </div>

      <div className="grid-cards-centered">
        {filtradas.map(p => (
          <CoffeeCard key={p.id} place={p} />
        ))}
      </div>

      {filtradas.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          No encontramos cafeterías que coincidan con "{search}".
        </p>
      )}
    </div>
  );
}
