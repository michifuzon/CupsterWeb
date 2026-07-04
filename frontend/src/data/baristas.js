function unsplashPortrait(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=300&h=300&q=70`;
}

export const baristas = [
  {
    id: "1",
    name: "Ana Ros",
    subtitle: "Café & Creatividad",
    photo: unsplashPortrait("1522992319-0365e5f11656"),
    bio: "Barista con 6 años de experiencia en café de especialidad, enfocada en recetas de autor y maridajes.",
    especialidades: ["Recetas de autor", "Maridaje café y repostería", "Latte art"],
    cafeteria: "Hogaza"
  },
  {
    id: "2",
    name: "Lucas Pérez",
    subtitle: "Latte Art",
    photo: unsplashPortrait("1506372023823-741c83b836fe"),
    bio: "Campeón regional de latte art. Da talleres de texturizado de leche y diseño en taza.",
    especialidades: ["Latte art avanzado", "Texturizado de leche", "Talleres para principiantes"],
    cafeteria: "Shiok"
  },
  {
    id: "3",
    name: "María Gómez",
    subtitle: "Métodos & Brew",
    photo: unsplashPortrait("1541167760496-1628856ab772"),
    bio: "Especialista en métodos de filtrado manual. Le apasiona explicar el origen de cada grano.",
    especialidades: ["V60 y Chemex", "Cold brew", "Cata y trazabilidad de origen"],
    cafeteria: "Casa Chacana"
  }
];
