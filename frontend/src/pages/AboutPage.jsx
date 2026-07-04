import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Sobre Cupster</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>¿Quiénes somos?</h2>
        <p>
          Cupster nace como un proyecto para la comunidad cafetera: un espacio
          donde cafeterías, baristas y amantes del café de especialidad se
          encuentran, se descubren y comparten experiencias reales.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>¿Para qué sirve?</h2>
        <p>
          Te ayuda a encontrar cafeterías de especialidad cerca tuyo, guardar
          tus favoritas, seguir a las que más te gustan y descubrir el trabajo
          de baristas que comparten recetas, métodos y experiencias. Del otro
          lado, les da a las cafeterías y baristas un lugar para mostrarse y
          construir comunidad.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>¿Por qué existe?</h2>
        <p>
          Porque el café de especialidad es mucho más que una bebida: es una
          cultura. Queremos ayudar a que esa cultura se descubra y se comparta,
          en vez de quedar dispersa entre lugares que nadie termina de conocer.
        </p>
      </div>

      <Link to="/cafeterias" className="btn-lg btn-lg-primary" style={{ justifyContent: "center" }}>
        Empezar a explorar
      </Link>
    </div>
  );
}
