import { useEffect, useState } from "react";

/*
Este es un trozo MINIMO del LoginRegistro de PCCOMPONENTES, con el mismo
contrato:
  - POST /api/auth/register | /api/auth/login
  - respuesta OK -> { ok, usuario, token }
  - respuesta error -> { error: { mensaje } }
Abre devtools > Network para ver cada fetch pasar por Vite y llegar al server.
*/
function App() {
  const [modo, setModo] = useState("registro"); // "registro" | "login"
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [respuesta, setRespuesta] = useState(null);
  const [errorApi, setErrorApi] = useState("");
  const [categorias, setCategorias] = useState([]);

  // montar === pedir las categorias al back UNA vez (dependencias vacias)
  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setCategorias)
      .catch((err) => console.error("categorias:", err.message));
  }, []);

  function alCambiar(ev) {
    setForm({ ...form, [ev.target.name]: ev.target.value });
    setRespuesta(null);
    setErrorApi("");
  }

  async function enviar(ev) {
    ev.preventDefault(); // si no, el navegador recarga y se pierde el estado

    const ruta = modo === "registro" ? "/api/auth/register" : "/api/auth/login";
    const cuerpo =
      modo === "registro" ? form : { email: form.email, password: form.password };

    try {
      const res = await fetch(ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const data = await res.json(); // el cuerpo SIEMPRE es JSON (ok o error)

      if (!res.ok) throw new Error(data.error?.mensaje ?? "Error inesperado");

      // exito: el back nos ha dado usuario + token para guardarlo
      setRespuesta(data);
    } catch (err) {
      setErrorApi(err.message);
    }
  }

  return (
    <main>
      <h1>Sandbox: front hablando con un backend</h1>

      <button onClick={() => setModo("registro")}>Registro</button>{" "}
      <button onClick={() => setModo("login")}>Login</button>

      <form onSubmit={enviar} noValidate>
        {modo === "registro" && (
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={alCambiar}
          />
        )}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={alCambiar}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={alCambiar}
        />
        <button type="submit">
          {modo === "registro" ? "Registrarse" : "Entrar"}
        </button>
      </form>

      {errorApi && <p className="err">{errorApi}</p>}
      {respuesta && (
        <>
          <p className="ok">
            Bienvenido {respuesta.usuario.nombre}. Token guardado (2h):
          </p>
          <pre>{respuesta.token}</pre>
        </>
      )}

      <h2>Categorias (GET /api/categorias)</h2>
      {categorias.length === 0 ? (
        <p>Cargando... (¿esta el server.js arrancado en 3001?)</p>
      ) : (
        <ul>
          {categorias.map((cat) => (
            <li key={cat.slug}>{cat.nombre}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;