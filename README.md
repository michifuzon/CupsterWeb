# Cupster (web)

Cupster es una comunidad para descubrir cafeterías de especialidad y conectar
clientes, baristas y cafeterías en un solo lugar.

- **Supabase** (Postgres + Auth + Storage) maneja usuarios/roles, posts de
  baristas, likes, comentarios, favoritos, reseñas y follows — el frontend
  habla directo con Supabase para todo esto (ver `supabase/schema.sql`).
- `backend/` — Express + Socket.io + `lowdb`, reducido a lo que necesita
  tiempo real: mesas/pedidos/pagos por QR y el login fijo de runner/admin.
- `frontend/` — React + Vite. Home, listado/detalle de cafeterías (con
  mapa), baristas y sus posts, favoritos, seguidos, y el módulo de
  **Pedidos** (100% funcional: agregar productos, confirmar pedido, pagar,
  panel de Runner).

## Setup de Supabase (una sola vez)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Pegar y correr **todo** `supabase/schema.sql` en el *SQL Editor* del
   proyecto — crea las tablas (`profiles`, `posts`, `post_likes`,
   `post_comments`, `favoritos`, `resenas`, `follows`), las políticas de
   Row Level Security y los buckets de Storage (`avatars`, `cvs`).
3. En *Authentication → Providers → Email*, desactivar **"Confirm email"**
   (si no, después de registrarte quedás sin sesión hasta confirmar por
   mail).
4. Copiar la URL del proyecto y la *publishable key* (Settings → API) a
   `frontend/.env`:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

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

El frontend usa `VITE_API_URL` para el backend de pedidos y
`VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` para todo lo demás. El
backend usa `PORT` y `FRONTEND_URL` (para armar las URLs de los QR).

## Roles y permisos

Hay dos roles de usuario reales, validados con **Row Level Security de
Postgres** (no solo ocultos en el frontend):

- **Cliente**: se registra, inicia sesión, ve cafeterías, guarda favoritos,
  sigue cafeterías/baristas, deja reseñas y comenta/da like a posts de
  barista.
- **Barista**: además de todo lo anterior, puede crear, editar y eliminar
  sus propias publicaciones (título, descripción, método, receta,
  etiquetas). Una policy de RLS en la tabla `posts` rechaza el INSERT si
  el usuario no tiene `role = 'barista'` en `profiles` — un cliente no
  puede crear un post ni mandando la request a mano.

Al registrarse se puede subir una foto de perfil (cualquier rol) y un CV
(opcional, solo baristas) — se guardan en los buckets `avatars`/`cvs` de
Supabase Storage.

## Flujo de pedidos (mesas por QR)

1. Un cliente entra a `/pedido/:mesaId` (por QR o a mano), pone su nombre y
   agrega productos por categoría.
2. Confirma el pedido desde el modal "Ver pedido".
3. En `/runner` (login en `/runner/login`, usuario `runner` / contraseña
   `1234`), aparecen las mesas confirmadas para marcarlas como entregadas.
4. Cada comensal puede pagar su parte desde "Ver pagos".
5. Los QR de cada mesa se generan en `/admin/qr` (login en `/admin/login`,
   usuario `admin` / contraseña `admin`).

Mesas/pedidos/pagos se guardan en `backend/data/db.json`, así que
sobreviven a un reinicio del servidor. Todo lo demás (usuarios, posts,
favoritos, reseñas, follows) vive en Supabase.

## Usuarios de prueba (runner/admin, credenciales fijas)

| Rol    | Usuario | Contraseña |
|--------|---------|------------|
| Runner | runner  | 1234       |
| Admin  | admin   | admin      |

(Son credenciales fijas para desarrollo, no aptas para producción. Los
usuarios cliente/barista se crean desde el botón "Ingresar" de la web,
contra Supabase Auth.)

## Notas honestas sobre el alcance

- Las fotos de cafeterías/baristas en `frontend/src/data/` son fotos de
  stock libres (Unsplash), usadas como ambientación — no son fotos
  verídicas de los locales.
- "Seguir" es una relación simple persistida, sin feed algorítmico ni
  notificaciones.
- El formulario de Contacto confirma en pantalla pero todavía no envía el
  mensaje a un correo real.
- Supabase resuelve base de datos/auth/storage, pero no hostea el
  frontend ni el backend de pedidos — para "verlo publicado" hace falta
  además desplegar `frontend/` (ej. Vercel/Netlify) y `backend/` (ej.
  Railway/Render) por separado.
