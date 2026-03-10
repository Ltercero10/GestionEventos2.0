import { useState } from "react";
import { api, setAuthToken } from "../api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    const { data } = await api.post("/auth/login", { email, password });
    const token = data.token;
    const user = data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    onLogin(user);
  };

  const doRegister = async () => {
    await api.post("/auth/register", { nombre, email, password });
    await doLogin();
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (!email || !password) throw new Error("Email y contraseña son requeridos");
      if (mode === "register" && !nombre) throw new Error("Nombre es requerido");

      if (mode === "register") await doRegister();
      else await doLogin();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-shell">
        <div className="auth-grid">
          {/* LEFT: ilustración fake (sin imagen externa) */}
          <div className="auth-left">
            <div className="auth-blob" />
            <div className="auth-illustration">
              <div className="auth-illus-content">
                <div className="auth-illus-title">Bienvenido 👋</div>
                <div className="auth-illus-sub">
                  Administra eventos, controla cupos, asigna recursos y permite que tus clientes se inscriban en segundos.
                </div>

                <div className="auth-chiprow">
                  <div className="auth-chip">✅ Cupos</div>
                  <div className="auth-chip">✅ Inscripciones</div>
                  <div className="auth-chip">✅ Recursos</div>
                  <div className="auth-chip">✅ Dashboard</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="auth-right">
            <div className="auth-card">
              <div className="auth-brand">
                <div className="auth-brand-badge">GE</div>
                <div>
                  <div style={{ fontWeight: 900 }}>Gestión de Eventos</div>
                  <div style={{ fontSize: 12, color: "rgba(11,18,32,.65)" }}>
                    {mode === "login" ? "Iniciá sesión" : "Creá tu cuenta"}
                  </div>
                </div>
              </div>

              <div className="auth-title">
                {mode === "login" ? "Inicio de Sesión" : "Crear Cuenta"}
              </div>
              <div className="auth-sub">
                {mode === "login"
                  ? "Accedé con tu correo y contraseña."
                  : "Registrate como cliente para inscribirte a eventos."}
              </div>

             
              <form onSubmit={submit}>
                {mode === "register" && (
                  <div className="auth-field">
                    <label>Nombre</label>
                    <input
                      className="auth-input"
                      placeholder="Tu nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label>Correo electrónico</label>
                  <input
                    className="auth-input"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label>Contraseña</label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="auth-row">
                <span style={{ fontSize: 12, color: "rgba(11,18,32,.65)" }}>
                    {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
                </span>

                <span
                    className="auth-link"
                    onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setNombre("");
                    setEmail("");
                    setPassword("");
                    setMsg("");
                    }}
                >
                    {mode === "login" ? "Crear cuenta" : "Regresar"}
                </span>
                </div>

                <button className="auth-primary" disabled={loading}>
                  {loading ? "Procesando..." : mode === "login" ? "Iniciar Sesión" : "Crear cuenta y entrar"}
                </button>

                {msg && <div className="auth-alert">{msg}</div>}
              </form>

              <div style={{ marginTop: 14, fontSize: 12, color: "rgba(11,18,32,.60)" }}>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
