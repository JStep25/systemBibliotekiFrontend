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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    if (form.haslo.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    try {
      setLoading(true);
      await registerUser(form);
      setSuccess(true); 

     
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setError("Nie udało się utworzyć konta. Być może email jest już zajęty.");
      setLoading(false);
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
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "15px",
          fontSize: "0.9rem",
          border: "1px solid #fecaca"
        }}>
          ⚠️ {error}
        </div>
      )}


      {success && (
        <div style={{
          background: "#dcfce7",
          color: "#166534",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "15px",
          fontSize: "0.9rem",
          border: "1px solid #bbf7d0",
          textAlign: "center"
        }}>
          ✅ Konto utworzone pomyślnie! Zaraz nastąpi przekierowanie do logowania...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt">
          <label>Imię</label>
          <input
            placeholder="Jan"
            onChange={e => setForm({ ...form, imie: e.target.value })}
            required
            disabled={success || loading}
          />
        </div>

        <div className="mt">
          <label>Nazwisko</label>
          <input
            placeholder="Kowalski"
            onChange={e => setForm({ ...form, nazwisko: e.target.value })}
            required
            disabled={success || loading}
          />
        </div>

        <div className="mt">
          <label>Email</label>
          <input
            type="email"
            placeholder="email@adres.pl"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            disabled={success || loading}
          />
        </div>

        <div className="mt">
          <label>Hasło</label>
          <input
            type="password"
            placeholder="Minimum 8 znaków"
            onChange={e => setForm({ ...form, haslo: e.target.value })}
            required
            disabled={success || loading}
          />
        </div>

        <button 
          style={{ width: "100%", marginTop: 25 }} 
          disabled={success || loading}
        >
          {loading ? "Przetwarzanie..." : "Utwórz konto"}
        </button>
      </form>

      {!success && (
        <p style={{ marginTop: 25, fontSize: "0.9rem" }}>
          Masz już konto?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Zaloguj się
          </Link>
        </p>
      )}
    </div>
  );
}