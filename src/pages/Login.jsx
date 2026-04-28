import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, haslo: password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") navigate("/admin/books");
      else navigate("/user/books");

    } catch {
      setError("Nieprawidłowy email lub hasło.");
    }
  };

  return (
    <div className="container center" style={{ maxWidth: 420 }}>
      <h1 style={{ marginBottom: 10 }}>Logowanie</h1>
      <p style={{ color: "var(--text-light)", marginBottom: 30 }}>
        Zaloguj się do systemu biblioteki
      </p>

      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "15px",
          fontSize: "0.9rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="twoj@email.pl"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mt">
          <label>Hasło</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={{ width: "100%", marginTop: 25 }}>
          Zaloguj się
        </button>
      </form>

      <p style={{ marginTop: 25, fontSize: "0.9rem" }}>
        Nie masz konta?{" "}
        <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}