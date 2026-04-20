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
      setError("Błędny email lub hasło");
    }
  };

  return (
    <div className="auth container">
      <form onSubmit={handleLogin}>
        <h2>Logowanie</h2>
        {error && <p className="unavailable center">{error}</p>}
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{width: '100%'}}>Zaloguj</button>
        <p className="mt center">Brak konta? <Link to="/register" style={{color: 'white'}}>Zarejestruj się</Link></p>
      </form>
    </div>
  );
}