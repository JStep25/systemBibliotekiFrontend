import { deleteBook, loanBook } from "../services/api";

export default function BookList({ books, refreshList, isAdmin }) {
  
  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      await deleteBook(id);
      refreshList();
    }
  };

  const handleLoan = async (id) => {
    try {
      await loanBook({ id_ksiazki: id });
      refreshList();
    } catch (err) {
      alert("Nie można wypożyczyć książki");
    }
  };

  return (
    <div className="book-grid">
      {books.map((book) => (
        <div key={book.id_ksiazki} className="card">
          <h3>{book.tytul}</h3>
          <p>Autor: {book.autor}</p>
          <span className={`badge ${book.status}`}>
            {book.status === "dostepna" ? "Dostępna" : "Wypożyczona"}
          </span>

          <div className="card-actions">
            {isAdmin ? (
              <button className="btn-delete" onClick={() => handleDelete(book.id_ksiazki)}>
                🗑️ Usuń
              </button>
            ) : (
              book.status === "dostepna" && (
                <button className="btn-loan" onClick={() => handleLoan(book.id_ksiazki)}>
                  📖 Wypożycz
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}