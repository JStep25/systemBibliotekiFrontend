import { useState } from "react";
import { addBook } from "../services/api";

export default function AddBookModal({ onClose, onAdded }) {
  const [tytul, setTytul] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    const cleanTytul = tytul.trim();
    const cleanAutor = autor.trim();

    if (!cleanTytul || !cleanAutor) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await addBook({
        tytul: cleanTytul,
        autor: cleanAutor,
        status: "dostepna"
      });

      onAdded();
      onClose();

    } catch (err) {
      setError(err.response?.data?.message || "Nie udało się dodać książki.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Dodaj książkę</h2>

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

        <form onSubmit={handleAdd} className="mt">
          <label>Tytuł</label>
          <input
            type="text"
            required
            value={tytul}
            onChange={e => setTytul(e.target.value)}
          />

          <label className="mt">Autor</label>
          <input
            type="text"
            required
            value={autor}
            onChange={e => setAutor(e.target.value)}
          />

          <div className="mt" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="danger" onClick={onClose} disabled={loading}>
              Anuluj
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}