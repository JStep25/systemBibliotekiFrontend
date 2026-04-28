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
      setError("Wystąpił błąd podczas tworzenia konta.");
    }
  };

  return (
    <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main)' }}>
      <div className="profile-card animation-slide-up" style={{ maxWidth: '550px' }}>
        <header className="center" style={{ marginBottom: '2rem' }}>
          <h2 className="page-title">Utwórz konto</h2>
          <p className="page-subtitle">Dołącz do grona naszych czytelników</p>
        </header>

        {error && <div className="status-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-grid">
            <div className="input-group">
              <label>Imię</label>
              <input 
                placeholder="Jan" 
                onChange={e => setForm({...form, imie: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Nazwisko</label>
              <input 
                placeholder="Kowalski" 
                onChange={e => setForm({...form, nazwisko: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1.25rem' }}>
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="adres@poczta.pl"
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group" style={{ marginTop: '1.25rem' }}>
            <label>Hasło</label>
            <input 
              type="password" 
              placeholder="Minimum 8 znaków"
              onChange={e => setForm({...form, haslo: e.target.value})} 
              required 
            />
          </div>

          <button type="submit" className="btn-save" style={{ width: '100%', marginTop: '2.5rem' }}>
            Zarejestruj profil
          </button>
        </form>

        <p className="center" style={{ marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Masz już konto?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}