import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { supabaseData } from "../services/supabaseData.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavoritos([]);
      setLoaded(false);
      return;
    }
    supabaseData
      .getFavoritos(user.id)
      .then(ids => {
        setFavoritos(ids);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [user]);

  async function toggleFavorito(cafeteriaId) {
    if (!user) return false;
    const actuales = await supabaseData.toggleFavorito(user.id, cafeteriaId);
    setFavoritos(actuales);
    return actuales.includes(cafeteriaId);
  }

  function isFavorito(cafeteriaId) {
    return favoritos.includes(cafeteriaId);
  }

  return (
    <FavoritesContext.Provider value={{ favoritos, loaded, isFavorito, toggleFavorito }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
