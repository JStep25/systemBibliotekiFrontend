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

    if (user.role === "admin") {
      navigate("/admin/books");
    } else {
      navigate("/user/books");
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <h2 className="center">Loading...</h2>;
  }

  return (
    <div className="container center">
      <h1>📚 System Biblioteki</h1>

      <div className="btn-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}