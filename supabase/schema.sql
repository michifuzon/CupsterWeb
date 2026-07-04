-- ============================================================
-- Cupster: esquema Supabase (auth/posts/favoritos/resenas/follows)
-- Correr una sola vez en el SQL Editor del proyecto de Supabase.
-- ============================================================

-- ===== PROFILES =====
-- Extiende auth.users con nuestros campos propios.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  apellido text not null default '',
  role text not null check (role in ('cliente', 'barista')),
  foto_url text,
  cv_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "cualquiera puede leer perfiles" on profiles
  for select using (true);

create policy "cada uno actualiza su propio perfil" on profiles
  for update using (auth.uid() = id);

-- Crea el profile automaticamente cuando alguien se registra
-- (nombre/apellido/role viajan en options.data del signUp del frontend).
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, apellido, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    coalesce(new.raw_user_meta_data->>'role', 'cliente')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ===== POSTS =====
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  titulo text not null,
  descripcion text not null,
  metodo text,
  receta text,
  etiquetas text[] not null default '{}',
  imagen text,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "cualquiera puede leer posts" on posts
  for select using (true);

create policy "solo baristas crean su propio post" on posts
  for insert with check (
    auth.uid() = author_id
    and exists (select 1 from profiles where id = auth.uid() and role = 'barista')
  );

create policy "el autor edita su post" on posts
  for update using (auth.uid() = author_id);

create policy "el autor borra su post" on posts
  for delete using (auth.uid() = author_id);

-- ===== POST LIKES =====
create table if not exists post_likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table post_likes enable row level security;

create policy "cualquiera puede leer likes" on post_likes
  for select using (true);

create policy "un usuario logueado da/saca su propio like" on post_likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== POST COMMENTS =====
create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  texto text not null,
  created_at timestamptz not null default now()
);

alter table post_comments enable row level security;

create policy "cualquiera puede leer comentarios" on post_comments
  for select using (true);

create policy "un usuario logueado comenta" on post_comments
  for insert with check (auth.uid() = user_id);

-- ===== FAVORITOS =====
create table if not exists favoritos (
  user_id uuid not null references profiles(id) on delete cascade,
  cafeteria_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, cafeteria_id)
);

alter table favoritos enable row level security;

create policy "cada uno ve/gestiona sus propios favoritos" on favoritos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== RESENAS =====
create table if not exists resenas (
  id uuid primary key default gen_random_uuid(),
  cafeteria_id text not null,
  user_id uuid not null references profiles(id) on delete cascade,
  user_nombre text not null default '',
  rating int not null check (rating between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  unique (cafeteria_id, user_id)
);

alter table resenas enable row level security;

create policy "cualquiera puede leer resenas" on resenas
  for select using (true);

create policy "cada uno gestiona su propia resena" on resenas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== FOLLOWS =====
create table if not exists follows (
  user_id uuid not null references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('cafeteria', 'barista')),
  target_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

alter table follows enable row level security;

create policy "cada uno gestiona sus propios follows" on follows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== STORAGE (avatars y cv) =====
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', true)
on conflict (id) do nothing;

create policy "cualquiera puede leer avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "cada uno sube su propio avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "cualquiera puede leer cvs" on storage.objects
  for select using (bucket_id = 'cvs');

create policy "cada uno sube su propio cv" on storage.objects
  for insert with check (
    bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
  );
