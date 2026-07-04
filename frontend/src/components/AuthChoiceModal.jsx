import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export function AuthChoiceModal({ onClose }) {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState("choice"); // choice | login | register
  const [role, setRole] = useState("cliente");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const nextUser = await login(email, password);
      showToast(`¡Hola de nuevo, ${nextUser.nombre}!`, "success");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (foto) formData.append("foto", foto);
      if (role === "barista" && cv) formData.append("cv", cv);

      const nextUser = await register(formData);
      showToast(`Cuenta creada. ¡Bienvenido/a, ${nextUser.nombre}!`, "success");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {view === "choice" && (
          <>
            <h2>Ingresar a Cupster</h2>

            <button
              className="role-card"
              onClick={() => {
                setRole("barista");
                setView("login");
              }}
            >
              <span className="icon">☕</span>
              <span>
                <strong>Soy barista</strong>
                <br />
                <small>Compartí recetas y experiencias cafeteras</small>
              </span>
            </button>

            <button
              className="role-card"
              onClick={() => {
                setRole("cliente");
                setView("login");
              }}
            >
              <span className="icon">🙂</span>
              <span>
                <strong>Soy cliente</strong>
                <br />
                <small>Descubrí cafeterías y pedí desde la web</small>
              </span>
            </button>

            <button
              className="btn-outline-accent"
              style={{ borderRadius: 16, padding: 10 }}
              onClick={() => setView("register")}
            >
              Crear una cuenta
            </button>
          </>
        )}

        {view === "login" && (
          <>
            <h2>{role === "barista" ? "Ingresar como barista" : "Ingresar"}</h2>
            <form onSubmit={onLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <span style={{ color: "#b3372c", fontSize: 13 }}>{error}</span>}
              <button className="btn-primary" style={{ borderRadius: 16, padding: 10, border: "none" }} disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
            <button
              className="btn-secondary"
              style={{ borderRadius: 16, padding: 10, border: "none" }}
              onClick={() => setView("register")}
            >
              ¿No tenés cuenta? Registrate
            </button>
          </>
        )}

        {view === "register" && (
          <>
            <h2>Crear cuenta</h2>
            <form onSubmit={onRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="form-row-2">
                <input
                  className="input"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                />
              </div>
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Contraseña (mínimo 4 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "cliente"}
                    onChange={() => setRole("cliente")}
                  />
                  Cliente
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "barista"}
                    onChange={() => setRole("barista")}
                  />
                  Barista
                </label>
              </div>

              <label className="field-label">
                Foto de perfil <span className="field-optional">(opcional)</span>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={e => setFoto(e.target.files?.[0] || null)}
                />
              </label>

              {role === "barista" && (
                <label className="field-label">
                  CV <span className="field-optional">(opcional, solo para probar el flujo)</span>
                  <input
                    className="input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setCv(e.target.files?.[0] || null)}
                  />
                </label>
              )}

              {error && <span style={{ color: "#b3372c", fontSize: 13 }}>{error}</span>}
              <button className="btn-primary" style={{ borderRadius: 16, padding: 10, border: "none" }} disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
            <button
              className="btn-secondary"
              style={{ borderRadius: 16, padding: 10, border: "none" }}
              onClick={() => setView("login")}
            >
              ¿Ya tenés cuenta? Ingresá
            </button>
          </>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
