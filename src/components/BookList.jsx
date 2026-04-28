import { deleteBook } from "../services/api";

export default function BookList({ books, refreshList, isAdmin, onLoan, loadingId }) {

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      try {
        await deleteBook(id);
        refreshList();
      } catch (err) {
        alert("Nie udało się usunąć książki.");
      }
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

            <div className="mt">
              {isAdmin ? (
                <button className="danger" onClick={() => handleDelete(b.id_ksiazki)}>
                  Usuń
                </button>
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