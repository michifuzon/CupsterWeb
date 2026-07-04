import { supabase } from "./supabase.js";

const POST_SELECT =
  "*, profiles(nombre), post_likes(user_id), post_comments(id, user_id, texto, created_at, profiles(nombre))";

function reshapePost(p) {
  return {
    id: p.id,
    titulo: p.titulo,
    descripcion: p.descripcion,
    metodo: p.metodo,
    receta: p.receta,
    etiquetas: p.etiquetas || [],
    imagen: p.imagen,
    authorId: p.author_id,
    authorNombre: p.profiles?.nombre || "",
    likes: (p.post_likes || []).map(l => l.user_id),
    comentarios: (p.post_comments || []).map(c => ({
      id: c.id,
      userId: c.user_id,
      userNombre: c.profiles?.nombre || "",
      texto: c.texto,
      createdAt: c.created_at
    })),
    createdAt: p.created_at
  };
}

function reshapeResena(r) {
  return {
    id: r.id,
    cafeteriaId: r.cafeteria_id,
    userId: r.user_id,
    userNombre: r.user_nombre,
    rating: r.rating,
    comentario: r.comentario,
    createdAt: r.created_at
  };
}

export const supabaseData = {
  // ===== POSTS =====
  async getPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw new Error("No pudimos cargar los posts");
    return data.map(reshapePost);
  },

  async getPost(id) {
    const { data, error } = await supabase.from("posts").select(POST_SELECT).eq("id", id).single();
    if (error) throw new Error("No encontramos ese post");
    return reshapePost(data);
  },

  async crearPost(user, body) {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        titulo: body.titulo,
        descripcion: body.descripcion,
        metodo: body.metodo,
        receta: body.receta,
        etiquetas: body.etiquetas,
        imagen: body.imagen
      })
      .select(POST_SELECT)
      .single();
    if (error) throw new Error("No pudimos crear el post");
    return reshapePost(data);
  },

  async editarPost(user, id, body) {
    const { data, error } = await supabase
      .from("posts")
      .update({
        titulo: body.titulo,
        descripcion: body.descripcion,
        metodo: body.metodo,
        receta: body.receta,
        etiquetas: body.etiquetas,
        imagen: body.imagen
      })
      .eq("id", id)
      .eq("author_id", user.id)
      .select(POST_SELECT)
      .single();
    if (error) throw new Error("No pudimos editar el post");
    return reshapePost(data);
  },

  async eliminarPost(user, id) {
    const { error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id);
    if (error) throw new Error("No pudimos eliminar el post");
    return { ok: true };
  },

  async likePost(user, postId) {
    const { data: existente } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existente) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }

    return this.getPost(postId);
  },

  async comentarPost(user, postId, texto) {
    const { error } = await supabase
      .from("post_comments")
      .insert({ post_id: postId, user_id: user.id, texto: texto.trim() });
    if (error) throw new Error("No pudimos publicar el comentario");
    return this.getPost(postId);
  },

  // ===== FAVORITOS =====
  async getFavoritos(userId) {
    const { data, error } = await supabase.from("favoritos").select("cafeteria_id").eq("user_id", userId);
    if (error) throw new Error("Error al cargar favoritos");
    return data.map(f => f.cafeteria_id);
  },

  async toggleFavorito(userId, cafeteriaId) {
    const { data: existente } = await supabase
      .from("favoritos")
      .select("*")
      .eq("user_id", userId)
      .eq("cafeteria_id", cafeteriaId)
      .maybeSingle();

    if (existente) {
      await supabase.from("favoritos").delete().eq("user_id", userId).eq("cafeteria_id", cafeteriaId);
    } else {
      await supabase.from("favoritos").insert({ user_id: userId, cafeteria_id: cafeteriaId });
    }

    return this.getFavoritos(userId);
  },

  // ===== RESEÑAS =====
  async getResenas(cafeteriaId) {
    const { data, error } = await supabase
      .from("resenas")
      .select("*")
      .eq("cafeteria_id", cafeteriaId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("No pudimos cargar las reseñas");
    return data.map(reshapeResena);
  },

  async dejarResena(user, cafeteriaId, rating, comentario) {
    const { error } = await supabase.from("resenas").upsert(
      {
        cafeteria_id: cafeteriaId,
        user_id: user.id,
        user_nombre: user.nombre,
        rating,
        comentario,
        updated_at: new Date().toISOString()
      },
      { onConflict: "cafeteria_id,user_id" }
    );
    if (error) throw new Error("No pudimos guardar tu reseña");
    return this.getResenas(cafeteriaId);
  },

  // ===== FOLLOWS =====
  async getFollows(userId) {
    const { data, error } = await supabase
      .from("follows")
      .select("target_type, target_id")
      .eq("user_id", userId);
    if (error) throw new Error("Error al cargar seguidos");
    return {
      cafeterias: data.filter(f => f.target_type === "cafeteria").map(f => f.target_id),
      baristas: data.filter(f => f.target_type === "barista").map(f => f.target_id)
    };
  },

  async toggleFollow(userId, targetType, targetId) {
    const { data: existente } = await supabase
      .from("follows")
      .select("*")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();

    if (existente) {
      await supabase
        .from("follows")
        .delete()
        .eq("user_id", userId)
        .eq("target_type", targetType)
        .eq("target_id", targetId);
    } else {
      await supabase.from("follows").insert({ user_id: userId, target_type: targetType, target_id: targetId });
    }

    const { data } = await supabase
      .from("follows")
      .select("target_id")
      .eq("user_id", userId)
      .eq("target_type", targetType);
    return data.map(f => f.target_id);
  },

  toggleFollowCafeteria(userId, id) {
    return this.toggleFollow(userId, "cafeteria", id);
  },

  toggleFollowBarista(userId, id) {
    return this.toggleFollow(userId, "barista", id);
  }
};
