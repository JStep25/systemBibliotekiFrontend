import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!token || !user) {
      setLoading(false);
      return;
    }

    if (user.role === "admin") navigate("/admin/books");
    else navigate("/user/books");
    
    setLoading(false);
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="container center" style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Biblioteka Miejska</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Witaj w systemie zarządzania zasobami bibliotecznymi.</p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button style={{ padding: '12px 30px' }} onClick={() => navigate("/login")}>Logowanie</button>
        <button style={{ padding: '12px 30px' }} className="danger" onClick={() => navigate("/register")}>Rejestracja</button>
      </div>
    </div>
  );
}