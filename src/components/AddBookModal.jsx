export default function AddBookModal({ onClose, onAdded }) {
  const [tytul, setTytul] = useState("");
  const [autor, setAutor] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!tytul || !autor) return;

    await addBook({ tytul, autor });
    onAdded();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Dodaj książkę</h2>

        <form onSubmit={handleAdd} className="mt">
          <label>Tytuł</label>
          <input onChange={e => setTytul(e.target.value)} />

          <label className="mt">Autor</label>
          <input onChange={e => setAutor(e.target.value)} />

          <div className="mt" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" className="danger" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit">Dodaj</button>
          </div>
        </form>
      </div>
    </div>
  );
}