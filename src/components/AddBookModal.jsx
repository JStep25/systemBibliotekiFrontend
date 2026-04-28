import { useState } from "react";
import { addBook } from "../services/api";

export default function AddBookModal({ onClose, onAdded }) {
  const [tytul, setTytul] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!tytul.trim() || !autor.trim()) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await addBook({
        tytul: tytul.trim(),
        autor: autor.trim(),
        status: "dostepna"
      });
      onAdded();
      onClose();
    } catch (err) {
      setError("Nie udało się dodać książki.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div className="modal" style={{
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        color: "#333" // Pewność, że tekst jest ciemny
      }}>
        <h2 style={{ marginTop: 0 }}>Dodaj nową książkę</h2>

        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Tytuł</label>
            <input
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={tytul}
              onChange={e => setTytul(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Autor</label>
            <input
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={autor}
              onChange={e => setAutor(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: "10px" }}>
            <button 
              type="button" 
              className="danger" 
              onClick={onClose}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              Anuluj
            </button>

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: "8px 16px", cursor: "pointer", background: "var(--primary, #2563eb)", color: "white", border: "none", borderRadius: "4px" }}
            >
              {loading ? "Dodawanie..." : "Dodaj książkę"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}