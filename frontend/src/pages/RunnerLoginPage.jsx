import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export function RunnerLoginPage({ tokenKey = "cupster_runner_token", redirectTo = "/runner", title = "Runner login" }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api.login(user, pass);
    if (!res.ok) {
      setError("Login inválido");
      return;
    }

    const data = await res.json();
    localStorage.setItem(tokenKey, data.token);
    navigate(redirectTo);
  }

  return (
    <div className="login-page">
      <form className="card" onSubmit={onSubmit}>
        <h3>{title}</h3>
        <input className="input" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        {error && <span style={{ color: "red", fontSize: 13 }}>{error}</span>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
