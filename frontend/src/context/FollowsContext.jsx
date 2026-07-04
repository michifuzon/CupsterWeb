import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { api } from "../services/api.js";

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
    api
      .getFollows(user.token)
      .then(f => {
        setCafeterias(f.cafeterias);
        setBaristas(f.baristas);
      })
      .catch(() => {});
  }, [user]);

  async function toggleFollowCafeteria(id) {
    if (!user) return false;
    const actuales = await api.toggleFollowCafeteria(user.token, id);
    setCafeterias(actuales);
    return actuales.includes(id);
  }

  async function toggleFollowBarista(id) {
    if (!user) return false;
    const actuales = await api.toggleFollowBarista(user.token, id);
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
