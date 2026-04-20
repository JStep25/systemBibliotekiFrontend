import { useState } from "react";
import { addBook } from "../services/api";

export default function AddBookModal({ onClose, onAdded }) {
  const [tytul, setTytul] = useState("");
  const [autor, setAutor] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!tytul.trim() || !autor.trim()) return alert("Wypełnij pola!");
    try {
      await addBook({ tytul, autor });
      onAdded();
      onClose();
    } catch (err) { alert("Błąd dodawania"); }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>➕ Nowa Książka</h3>
        <form onSubmit={handleAdd}>
          <input placeholder="Tytuł" onChange={e => setTytul(e.target.value)} />
          <input placeholder="Autor" onChange={e => setAutor(e.target.value)} />
          <div className="mt">
            <button type="submit">Dodaj</button>
            <button type="button" className="danger" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
}