# Cupster (web)

Cupster es una comunidad para descubrir cafeterías de especialidad y conectar
clientes, baristas y cafeterías en un solo lugar.

- `backend/` — Express + Socket.io + persistencia real en archivo (`lowdb`).
  Maneja usuarios y roles, posts de baristas, favoritos, reseñas, follows,
  mesas/pedidos/pagos, login de runner/admin, generación de QR y subida de
  archivos (foto de perfil / CV) vía `multer`.
- `frontend/` — React + Vite. Home, listado/detalle de cafeterías (con mapa),
  baristas y sus posts, favoritos, seguidos, y el módulo de **Pedidos**
  (100% funcional contra el backend: agregar productos, confirmar pedido,
  pagar, y un panel de Runner para marcar mesas como entregadas).

## Cómo correrlo en desarrollo

```bash
cd backend
npm install
npm start        # http://localhost:3000

# en otra terminal
cd frontend
npm install
npm run dev       # http://localhost:5173
```

El frontend usa `VITE_API_URL` (ver `frontend/.env`) para saber a qué backend
pegarle. El backend usa `PORT` y `FRONTEND_URL` (para armar las URLs de los
QR y de los archivos subidos) si querés cambiarlos.

## Roles y permisos

Hay dos roles de usuario reales, validados en el backend (no solo ocultos en
el frontend):

- **Cliente**: se registra, inicia sesión, ve cafeterías, guarda favoritos,
  sigue cafeterías/baristas, deja reseñas y comenta/da like a posts de
  barista.
- **Barista**: además de todo lo anterior, puede crear, editar y eliminar
  sus propias publicaciones (título, descripción, método, receta,
  etiquetas). Un cliente que intenta crear un post recibe un 403 del
  servidor, no solo un botón deshabilitado.

Al registrarse se puede subir una foto de perfil (cualquier rol) y un CV
(opcional, solo baristas) — se guardan de verdad en `backend/data/uploads/`.

## Flujo de pedidos (mesas por QR)

1. Un cliente entra a `/pedido/:mesaId` (por QR o a mano), pone su nombre y
   agrega productos por categoría.
2. Confirma el pedido desde el modal "Ver pedido".
3. En `/runner` (login en `/runner/login`, usuario `runner` / contraseña
   `1234`), aparecen las mesas confirmadas para marcarlas como entregadas.
4. Cada comensal puede pagar su parte desde "Ver pagos".
5. Los QR de cada mesa se generan en `/admin/qr` (login en `/admin/login`,
   usuario `admin` / contraseña `admin`).

Todo (usuarios, posts, favoritos, reseñas, follows, mesas/pedidos/pagos) se
guarda en `backend/data/db.json`, así que sobrevive a un reinicio del
servidor.

## Usuarios de prueba (runner/admin, credenciales fijas)

| Rol    | Usuario | Contraseña |
|--------|---------|------------|
| Runner | runner  | 1234       |
| Admin  | admin   | admin      |

(Son credenciales fijas para desarrollo, no aptas para producción. Los
usuarios cliente/barista se crean desde el botón "Ingresar" de la web.)

## Notas honestas sobre el alcance

- Las fotos de cafeterías/baristas en `frontend/src/data/` son fotos de
  stock libres (Unsplash), usadas como ambientación — no son fotos
  verídicas de los locales.
- "Seguir" es una relación simple persistida, sin feed algorítmico ni
  notificaciones.
- El formulario de Contacto confirma en pantalla pero todavía no envía el
  mensaje a un correo real.
