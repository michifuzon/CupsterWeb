import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";

const AuthContext = createContext(null);

async function fetchProfile(authUser) {
  if (!authUser) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error || !data) return null;

  return {
    id: authUser.id,
    email: authUser.email,
    nombre: data.nombre,
    apellido: data.apellido,
    role: data.role,
    fotoUrl: data.foto_url
  };
}

async function uploadArchivo(bucket, userId, file) {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw new Error(`No pudimos subir el archivo (${bucket})`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = await fetchProfile(session?.user);
      setUser(profile);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = await fetchProfile(session?.user);
      setUser(profile);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Credenciales inválidas");

    const profile = await fetchProfile(data.user);
    setUser(profile);
    return profile;
  }

  // formData: FormData con nombre, apellido, email, password, role y, opcionalmente, foto/cv
  async function register(formData) {
    const nombre = formData.get("nombre");
    const apellido = formData.get("apellido");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");
    const foto = formData.get("foto");
    const cv = formData.get("cv");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido, role } }
    });

    if (error) throw new Error(error.message || "No pudimos crear la cuenta");
    if (!data.user) throw new Error("No pudimos crear la cuenta");

    const updates = {};
    if (foto && foto.size > 0) {
      updates.foto_url = await uploadArchivo("avatars", data.user.id, foto);
    }
    if (role === "barista" && cv && cv.size > 0) {
      updates.cv_url = await uploadArchivo("cvs", data.user.id, cv);
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("profiles").update(updates).eq("id", data.user.id);
    }

    const profile = await fetchProfile(data.user);
    setUser(profile);
    return profile;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
