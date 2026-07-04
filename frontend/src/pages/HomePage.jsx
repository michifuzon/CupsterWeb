import { useMemo, useState } from "react";
import { coffeePlaces } from "../data/coffeePlaces.js";
import { CoffeeCard } from "../components/CoffeeCard.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { Link } from "react-router-dom";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1800&q=75";

const BENEFITS = [
  {
    icon: "☕",
    title: "Descubrí cafeterías de especialidad",
    text: "Una curaduría de lugares que cuidan cada detalle, del grano a la taza."
  },
  {
    icon: "📍",
    title: "Encontrá cafés cerca tuyo",
    text: "Explorá por barrio o dejate guiar por el mapa cuando salgas a caminar."
  },
  {
    icon: "⭐",
    title: "Guardá tus favoritos",
    text: "Armá tu propio mapa de lugares para volver cuando quieras."
  },
  {
    icon: "👥",
    title: "Formá parte de la comunidad",
    text: "Cafeterías, baristas y amantes del café compartiendo una misma pasión."
  }
];

const PASOS = [
  {
    numero: "1",
    title: "Descubrí",
    text: "Explorá cafeterías de especialidad cerca tuyo, por barrio o en el mapa."
  },
  {
    numero: "2",
    title: "Guardá y seguí",
    text: "Marcá tus favoritas y seguí a las cafeterías y baristas que más te gustan."
  },
  {
    numero: "3",
    title: "Viví la comunidad",
    text: "Dejá reseñas, descubrí publicaciones de baristas y compartí tu pasión por el café."
  }
];

export function HomePage() {
  const [search, setSearch] = useState("");

  const matches = query => place =>
    place.name.toLowerCase().includes(query) ||
    place.zone.toLowerCase().includes(query) ||
    place.category.toLowerCase().includes(query);

  const cercaTuyo = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coffeePlaces.slice(0, 5).filter(matches(q));
  }, [search]);

  const destacadas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...coffeePlaces]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .filter(matches(q));
  }, [search]);

  const recomendadas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...coffeePlaces]
      .slice()
      .reverse()
      .slice(0, 5)
      .filter(matches(q));
  }, [search]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="home-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <span className="home-hero-eyebrow">Café de especialidad · Comunidad</span>
          <h1 className="home-hero-title">Descubrí el café de especialidad cerca tuyo.</h1>
          <p className="home-hero-subtitle">
            Cupster conecta cafeterías, baristas y amantes del café en una sola
            comunidad. Encontrá lugares, compartí experiencias reales y descubrí
            nuevos sabores.
          </p>
          <div className="home-hero-actions">
            <Link to="/cafeterias" className="btn-lg btn-lg-primary">
              Explorar cafeterías
            </Link>
            <a href="#que-es-cupster" className="btn-lg btn-lg-secondary btn-lg-on-photo">
              Conocer Cupster
            </a>
          </div>
        </div>
      </section>

      {/* ===== ¿QUÉ ES CUPSTER? ===== */}
      <Reveal as="section" className="about-section">
        <h2 id="que-es-cupster">¿Qué es Cupster?</h2>
        <p>
          Cupster es una comunidad que conecta cafeterías, baristas y amantes del
          café de especialidad. No es solo un buscador de cafeterías: es un lugar
          para descubrir nuevos lugares, seguir a quienes comparten tu misma
          pasión y encontrar recomendaciones reales. Nuestro objetivo es impulsar
          la cultura del café de especialidad y ayudarte a encontrar experiencias,
          no solamente un lugar para tomar café.
        </p>
      </Reveal>

      {/* ===== BENEFICIOS ===== */}
      <section className="page benefits-section" style={{ paddingTop: 0 }}>
        <div className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} className={`benefit-card reveal-delay-${i}`}>
              <div className="benefit-icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="page how-it-works-section" style={{ paddingTop: 0 }}>
        <Reveal className="home-section-heading">
          <h2>Cómo funciona</h2>
        </Reveal>
        <div className="steps-grid">
          {PASOS.map((p, i) => (
            <Reveal key={p.title} className={`step-card reveal-delay-${i}`}>
              <div className="step-number">{p.numero}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== EXPLORAR CAFETERÍAS ===== */}
      <div className="page" style={{ paddingTop: 0 }}>
        <Reveal className="home-section-heading">
          <h2>Empezá a explorar</h2>
          <p>Buscá por nombre, categoría o barrio.</p>
        </Reveal>

        <input
          className="input"
          placeholder="Buscar cafeterías o barrios"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div style={{ height: 36 }} />

        <div className="section-title">Cerca tuyo</div>
        <div className="h-scroll">
          {cercaTuyo.map(p => (
            <CoffeeCard key={`nearby-${p.id}`} place={p} />
          ))}
          {cercaTuyo.length === 0 && (
            <p style={{ color: "var(--muted)" }}>Sin resultados para "{search}".</p>
          )}
        </div>

        <div style={{ height: 40 }} />

        <div className="section-title">Destacadas</div>
        <div className="h-scroll">
          {destacadas.map(p => (
            <CoffeeCard key={`featured-${p.id}`} place={p} />
          ))}
          {destacadas.length === 0 && (
            <p style={{ color: "var(--muted)" }}>Sin resultados para "{search}".</p>
          )}
        </div>

        <div style={{ height: 40 }} />

        <div className="section-title">Recomendadas</div>
        <div className="h-scroll">
          {recomendadas.map(p => (
            <CoffeeCard key={`recommended-${p.id}`} place={p} />
          ))}
          {recomendadas.length === 0 && (
            <p style={{ color: "var(--muted)" }}>Sin resultados para "{search}".</p>
          )}
        </div>

        <div style={{ height: 16 }} />

        <div className="quick-actions">
          <Link className="action-btn" to="/roadmap">
            🗺️ Ver mapa
          </Link>
          <Link className="action-btn" to="/cafeterias">
            🔎 Ver todas las cafeterías
          </Link>
        </div>
      </div>
    </>
  );
}
