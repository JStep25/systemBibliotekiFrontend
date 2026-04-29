import { useState } from "react";
import { updateBook } from "../services/api";

export default function EditBookModal({ book, onClose, onUpdated }) {
  const [tytul, setTytul] = useState(book.tytul);
  const [autor, setAutor] = useState(book.autor);
  const [status, setStatus] = useState(book.status);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!tytul.trim() || !autor.trim()) {
      setError("Pola nie mogą być puste.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await updateBook(book.id_ksiazki, {
        tytul: tytul.trim(),
        autor: autor.trim(),
        status: status
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Nie udało się zaktualizować książki.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div className="modal" style={{
        background: "white", padding: "2rem", borderRadius: "12px",
        width: "90%", maxWidth: "500px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "#333"
      }}>
        <h2 style={{ marginTop: 0 }}>Edytuj książkę</h2>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Status</label>
            <select 
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="dostepna">Dostępna</option>
              <option value="wypozyczona">Wypożyczona</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: "10px" }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ padding: "8px 16px", cursor: "pointer", border: "none", borderRadius: "4px", background: "#e5e7eb" }}
            >
              Anuluj
            </button>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: "8px 16px", cursor: "pointer", 
                background: "#f59e0b", color: "white", 
                border: "none", borderRadius: "4px",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}