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
    try {
      const res = await loginUser({ email, haslo: password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (res.data.user.role === "admin") navigate("/admin/books");
      else navigate("/user/books");
    } catch (err) {
      setError("Błędne dane uwierzytelniające.");
    }
  };

  return (
    <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main)' }}>
      <div className="profile-card animation-slide-up" style={{ maxWidth: '450px' }}>
        <header className="center" style={{ marginBottom: '2rem' }}>
          <h2 className="page-title">Zaloguj się</h2>
          <p className="page-subtitle">Witaj z powrotem w systemie</p>
        </header>

        {error && <div className="status-message error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Adres e-mail</label>
            <input 
              type="email" 
              placeholder="np. jan@domena.pl"
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <label>Hasło</label>
            <input 
              type="password" 
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn-save" style={{ width: '100%', marginTop: '2rem' }}>
            Zaloguj do systemu
          </button>
        </form>

        <p className="center" style={{ marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Nie posiadasz konta?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}