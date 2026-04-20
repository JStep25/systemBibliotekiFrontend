import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ imie: "", nazwisko: "", email: "", haslo: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError("Błąd rejestracji. Sprawdź dane.");
    }
  };

  return (
    <div className="auth container">
      <h2>Rejestracja</h2>
      {error && <p className="unavailable">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Imię" onChange={e => setForm({...form, imie: e.target.value})} required />
        <input placeholder="Nazwisko" onChange={e => setForm({...form, nazwisko: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Hasło" onChange={e => setForm({...form, haslo: e.target.value})} required />
        <button type="submit" style={{width: '100%'}}>Zarejestruj</button>
      </form>
      <p className="mt center">Masz konto? <Link to="/login" style={{color: 'white'}}>Zaloguj się</Link></p>
    </div>
  );
}