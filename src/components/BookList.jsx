export default function BookList({ books, refreshList, isAdmin }) {

  const handleDelete = async (id) => {
    if (window.confirm("Usunąć książkę?")) {
      await deleteBook(id);
      refreshList();
    }
  };

  const handleLoan = async (id) => {
    try {
      await loanBook({ id_ksiazki: id });
      refreshList();
    } catch {
      alert("Niedostępna");
    }
  };

  return (
    <div className="book-grid">
      {books.map((b) => (
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
                <button onClick={() => handleLoan(b.id_ksiazki)}>
                  Wypożycz
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}