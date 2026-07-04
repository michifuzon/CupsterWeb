import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { supabaseData } from "../services/supabaseData.js";

const FollowsContext = createContext(null);

export function FollowsProvider({ children }) {
  const { user } = useAuth();
  const [cafeterias, setCafeterias] = useState([]);
  const [baristas, setBaristas] = useState([]);

  useEffect(() => {
    if (!user) {
      setCafeterias([]);
      setBaristas([]);
      return;
    }
    supabaseData
      .getFollows(user.id)
      .then(f => {
        setCafeterias(f.cafeterias);
        setBaristas(f.baristas);
      })
      .catch(() => {});
  }, [user]);

  async function toggleFollowCafeteria(id) {
    if (!user) return false;
    const actuales = await supabaseData.toggleFollowCafeteria(user.id, id);
    setCafeterias(actuales);
    return actuales.includes(id);
  }

  async function toggleFollowBarista(id) {
    if (!user) return false;
    const actuales = await supabaseData.toggleFollowBarista(user.id, id);
    setBaristas(actuales);
    return actuales.includes(id);
  }

  return (
    <FollowsContext.Provider
      value={{
        cafeterias,
        baristas,
        siguiendoCafeteria: id => cafeterias.includes(id),
        siguiendoBarista: id => baristas.includes(id),
        toggleFollowCafeteria,
        toggleFollowBarista
      }}
    >
      {children}
    </FollowsContext.Provider>
  );
}

export function useFollows() {
  return useContext(FollowsContext);
}
