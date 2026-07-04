import { createContext, useContext, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "cupster_user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toStoredUser(data) {
  return {
    token: data.token,
    role: data.role,
    nombre: data.nombre,
    userId: data.userId,
    apellido: data.usuario?.apellido || "",
    fotoUrl: data.usuario?.fotoUrl || null
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  async function login(email, password) {
    const res = await api.loginUsuario(email, password);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "No pudimos iniciar sesión");
    }

    const data = await res.json();
    const nextUser = toStoredUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  // formData: FormData con nombre, apellido, email, password, role y, opcionalmente, foto/cv
  async function register(formData) {
    const res = await api.registrar(formData);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "No pudimos crear la cuenta");
    }

    const data = await res.json();
    const nextUser = toStoredUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
