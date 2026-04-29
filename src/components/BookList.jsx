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

  const adminBtnStyle = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    fontWeight: "500",
    flex: 1,
    fontSize: "14px",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "38px"
  };

  return (
    <div className="book-grid">
      {books.length === 0 ? (
        <p>Brak książek w bazie.</p>
      ) : (
        books.map((b) => {
          const isBorrowed = b.status === "wypozyczona";

          return (
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
                      disabled={isBorrowed}
                      style={{ 
                        ...adminBtnStyle,
                        background: "#f59e0b", 
                        color: "white",
                        opacity: isBorrowed ? 0.5 : 1,
                        cursor: isBorrowed ? "not-allowed" : "pointer"
                      }}
                      title={isBorrowed ? "Nie można edytować wypożyczonej książki" : ""}
                    >
                      Edytuj
                    </button>
                    
                    <button 
                      className="danger" 
                      onClick={() => handleDelete(b.id_ksiazki)}
                      disabled={isBorrowed}
                      style={{ 
                        ...adminBtnStyle,
                        opacity: isBorrowed ? 0.5 : 1,
                        cursor: isBorrowed ? "not-allowed" : "pointer"
                      }}
                      title={isBorrowed ? "Nie można usunąć wypożyczonej książki" : ""}
                    >
                      Usuń
                    </button>
                  </>
                ) : (
                  b.status === "dostepna" && (
                    <button 
                      onClick={() => onLoan(b.id_ksiazki)} 
                      disabled={loadingId === b.id_ksiazki}
                      style={{ width: "100%", height: "38px" }}
                    >
                      {loadingId === b.id_ksiazki ? "Przetwarzanie..." : "Wypożycz"}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}