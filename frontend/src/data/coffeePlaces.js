function unsplash(id, w = 800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
}

export const coffeePlaces = [
  {
    id: "1",
    name: "Hogaza",
    category: "Panadería & Café de especialidad",
    rating: 4.8,
    distance: "300 m",
    zone: "Nueva Córdoba",
    address: "Bv. San Juan 450, Nueva Córdoba",
    city: "Córdoba",
    horario: "Lun a Dom · 8:00 - 20:00",
    lat: -31.4235,
    lng: -64.1863,
    image: unsplash("1495474472287-4d71bcdd2085"),
    description:
      "Panadería de fermentación natural con barra de café de especialidad. Ideal para desayunar o hacer una pausa de trabajo.",
    specialties: ["Café de especialidad", "Panadería de masa madre", "Espacio para trabajar"],
    tags: ["Wifi", "Pet friendly", "Desayunos"]
  },
  {
    id: "2",
    name: "Shiok",
    category: "Café asiático & fusión",
    rating: 4.6,
    distance: "600 m",
    zone: "Güemes",
    address: "Belgrano 620, Güemes",
    city: "Córdoba",
    horario: "Mar a Dom · 9:00 - 21:00",
    lat: -31.4184,
    lng: -64.1839,
    image: unsplash("1447933601403-0c6688de566e"),
    description:
      "Propuesta de café con influencia asiática: cold brews de autor, brunch fusión y ambientación cálida en pleno Güemes.",
    specialties: ["Cold brew de autor", "Brunch fusión", "Pet friendly"],
    tags: ["Pet friendly", "Brunch", "Terraza"]
  },
  {
    id: "3",
    name: "Cherry Season",
    category: "Brunch & Café",
    rating: 4.7,
    distance: "1.2 km",
    zone: "Nueva Córdoba",
    address: "Av. Hipólito Yrigoyen 320, Nueva Córdoba",
    city: "Córdoba",
    horario: "Todos los días · 8:30 - 20:00",
    lat: -31.4262,
    lng: -64.1875,
    image: unsplash("1521017432531-fbd92d768814"),
    description:
      "Brunch todo el día, cartas de temporada y buena luz natural. Uno de los puntos de encuentro favoritos de la zona.",
    specialties: ["Brunch todo el día", "Opciones veganas", "Terraza"],
    tags: ["Vegano", "Terraza", "Brunch"]
  },
  {
    id: "4",
    name: "Casa Chacana",
    category: "Café de especialidad",
    rating: 4.9,
    distance: "450 m",
    zone: "Alta Córdoba",
    address: "Rivadavia 1780, Alta Córdoba",
    city: "Córdoba",
    horario: "Lun a Sáb · 8:00 - 19:00",
    lat: -31.3969,
    lng: -64.1798,
    image: unsplash("1461023058943-07fcbe16d735"),
    description:
      "Tostado propio en pequeños lotes. Foco absoluto en café de especialidad y métodos de filtrado manuales.",
    specialties: ["Tostado propio", "Métodos: V60, Chemex, prensa francesa", "Catas los sábados"],
    tags: ["Tostadero", "Catas", "Métodos filtrados"]
  },
  {
    id: "5",
    name: "Cocoliche Café",
    category: "Café de especialidad",
    rating: 4.5,
    distance: "800 m",
    zone: "General Paz",
    address: "Bv. Illia 210, General Paz",
    city: "Córdoba",
    horario: "Lun a Vie · 8:00 - 19:00",
    lat: -31.4145,
    lng: -64.1935,
    image: unsplash("1498804103079-a6351b050096"),
    description:
      "Café de barrio con selección rotativa de granos de origen único y repostería de autor.",
    specialties: ["Granos de origen único", "Repostería de autor", "Wifi rápido"],
    tags: ["Wifi", "Para trabajar", "De barrio"]
  },
  {
    id: "6",
    name: "Origen Café de Autor",
    category: "Café de especialidad",
    rating: 4.7,
    distance: "1.5 km",
    zone: "Nueva Córdoba",
    address: "Av. Chacabuco 890, Nueva Córdoba",
    city: "Córdoba",
    horario: "Todos los días · 9:00 - 20:00",
    lat: -31.4298,
    lng: -64.1858,
    image: unsplash("1517701604599-bb29b565090c"),
    description:
      "Barra minimalista pensada para amantes del café filtrado, con cartas de origen trazables por productor.",
    specialties: ["Trazabilidad por productor", "Filtrado de autor", "Solo café, sin distracciones"],
    tags: ["Filtrados", "Minimalista", "Trazabilidad"]
  },
  {
    id: "7",
    name: "Molde Café",
    category: "Café & Repostería",
    rating: 4.6,
    distance: "2.1 km",
    zone: "Güemes",
    address: "Fructuoso Rivera 55, Güemes",
    city: "Córdoba",
    horario: "Mié a Lun · 9:00 - 20:00",
    lat: -31.4172,
    lng: -64.1812,
    image: unsplash("1600093463592-8e36ae95ef56"),
    description:
      "Café de especialidad combinado con repostería de temporada, en una de las esquinas más fotografiadas de Güemes.",
    specialties: ["Repostería de temporada", "Espacio instagrameable", "Delivery propio"],
    tags: ["Repostería", "Delivery", "Fotogénico"]
  },
  {
    id: "8",
    name: "Tinto Torrado",
    category: "Tostadores & Café de especialidad",
    rating: 4.8,
    distance: "1.8 km",
    zone: "Alta Córdoba",
    address: "Obispo Trejo 340, Alta Córdoba",
    city: "Córdoba",
    horario: "Lun a Sáb · 8:00 - 18:00",
    lat: -31.3985,
    lng: -64.1841,
    image: unsplash("1509042239860-f550ce710b93"),
    description:
      "Tostaduría boutique que abastece a otras cafeterías de la ciudad y también atiende en su propia barra.",
    specialties: ["Tostado boutique", "Venta de granos por kilo", "Cursos de tueste"],
    tags: ["Tostadero", "Cursos", "Granos"]
  },
  {
    id: "9",
    name: "Nativo Café",
    category: "Café de especialidad & Vegano",
    rating: 4.5,
    distance: "900 m",
    zone: "Nueva Córdoba",
    address: "Duarte Quirós 610, Nueva Córdoba",
    city: "Córdoba",
    horario: "Todos los días · 8:00 - 21:00",
    lat: -31.4221,
    lng: -64.1902,
    image: unsplash("1559925393-8be0ec4767c8"),
    description:
      "Propuesta 100% plant-based con foco en café de especialidad y opciones sin TACC.",
    specialties: ["Menú 100% plant-based", "Opciones sin TACC", "Leches vegetales de la casa"],
    tags: ["Vegano", "Sin TACC", "Plant-based"]
  },
  {
    id: "10",
    name: "Full City Coffee Lab",
    category: "Café de especialidad & Laboratorio",
    rating: 4.9,
    distance: "2.5 km",
    zone: "General Paz",
    address: "Av. Colón 1450, General Paz",
    city: "Córdoba",
    horario: "Mar a Dom · 9:00 - 19:00",
    lat: -31.4108,
    lng: -64.1961,
    image: unsplash("1524350876685-274059332603"),
    description:
      "Espacio de experimentación cafetera: catas guiadas, fermentaciones especiales y capacitación para baristas.",
    specialties: ["Catas guiadas", "Fermentaciones experimentales", "Capacitación de baristas"],
    tags: ["Catas", "Capacitación", "Laboratorio"]
  }
];
