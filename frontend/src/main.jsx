import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { FollowsProvider } from "./context/FollowsContext.jsx";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* HashRouter en vez de BrowserRouter: GitHub Pages no soporta rewrites
        de servidor para SPAs, así que las rutas necesitan vivir después
        del "#" para no romper al recargar o entrar directo a una URL. */}
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <FollowsProvider>
              <App />
            </FollowsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
);
