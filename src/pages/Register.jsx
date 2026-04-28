import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch {
      setError("Nie udało się utworzyć konta.");
    }
  };

  return (
    <div className="container center" style={{ maxWidth: 450 }}>
      <h1 style={{ marginBottom: 10 }}>Rejestracja</h1>
      <p style={{ color: "var(--text-light)", marginBottom: 30 }}>
        Utwórz nowe konto użytkownika
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

      <form onSubmit={handleSubmit}>
        <div className="mt">
          <label>Imię</label>
          <input
            placeholder="Jan"
            onChange={e => setForm({ ...form, imie: e.target.value })}
            required
          />
        </div>

        <div className="mt">
          <label>Nazwisko</label>
          <input
            placeholder="Kowalski"
            onChange={e => setForm({ ...form, nazwisko: e.target.value })}
            required
          />
        </div>

        <div className="mt">
          <label>Email</label>
          <input
            type="email"
            placeholder="email@adres.pl"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mt">
          <label>Hasło</label>
          <input
            type="password"
            placeholder="Minimum 8 znaków"
            onChange={e => setForm({ ...form, haslo: e.target.value })}
            required
          />
        </div>

        <button style={{ width: "100%", marginTop: 25 }}>
          Utwórz konto
        </button>
      </form>

      <p style={{ marginTop: 25, fontSize: "0.9rem" }}>
        Masz już konto?{" "}
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}