import { deleteBook } from "../services/api";

export default function BookList({ books, refreshList, isAdmin, onLoan, loadingId, onError, onSuccess, onEdit }) {

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      if (onSuccess) onSuccess("Książka została usunięta.");
      refreshList();
    } catch (err) {
      if (onError) onError("Nie można usunąć książki (prawdopodobnie jest powiązana z historią wypożyczeń).");
    }
  };

  return (
    <div className="book-grid">
      {books.length === 0 ? (
        <p>Brak książek w bazie.</p>
      ) : (
        books.map((b) => (
          <div key={b.id_ksiazki} className="card">
            <h3>{b.tytul}</h3>
            <p style={{ color: "var(--text-light)" }}>{b.autor}</p>

            <span className={`badge ${b.status}`}>
              {b.status === "dostepna" ? "Dostępna" : "Wypożyczona"}
            </span>

            <div className="mt" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              {isAdmin ? (
                <>
                  <button 
                    onClick={() => onEdit(b)}
                    style={{ background: "#f59e0b", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Edytuj
                  </button>
                  <button 
                    className="danger" 
                    onClick={() => handleDelete(b.id_ksiazki)}
                    disabled={b.status === "wypozyczona"}
                    style={{ 
                      opacity: b.status === "wypozyczona" ? 0.5 : 1,
                      cursor: b.status === "wypozyczona" ? "not-allowed" : "pointer"
                    }}
                    title={b.status === "wypozyczona" ? "Nie można usunąć wypożyczonej książki" : ""}
                  >
                    Usuń
                  </button>
                </>
              ) : (
                b.status === "dostepna" && (
                  <button 
                    onClick={() => onLoan(b.id_ksiazki)} 
                    disabled={loadingId === b.id_ksiazki}
                  >
                    {loadingId === b.id_ksiazki ? "Przetwarzanie..." : "Wypożycz"}
                  </button>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}