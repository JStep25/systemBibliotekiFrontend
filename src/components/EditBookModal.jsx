import { useState } from "react";
import { updateBook } from "../services/api";

export default function EditBookModal({ book, onClose, onUpdated }) {
  const [tytul, setTytul] = useState(book.tytul);
  const [autor, setAutor] = useState(book.autor);
  const [status, setStatus] = useState(book.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateBook(book.id_ksiazki, { tytul, autor, status });
      onUpdated();
      onClose();
    } catch (err) {
      alert("Błąd aktualizacji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal" style={modalStyle}>
        <h3>Edytuj książkę</h3>
        <form onSubmit={handleUpdate}>
          <input value={tytul} onChange={e => setTytul(e.target.value)} placeholder="Tytuł" required />
          <input value={autor} onChange={e => setAutor(e.target.value)} placeholder="Autor" required />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="dostepna">Dostępna</option>
            <option value="wypozyczona">Wypożyczona</option>
          </select>
          <div style={{ marginTop: "10px" }}>
            <button type="submit" disabled={loading}>Zapisz zmiany</button>
            <button type="button" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
}

