import { useEffect, useState } from "react";
import { getBooks, getMyLoans, returnBook } from "../services/api";
import BookList from "../components/BookList.jsx";
import LogoutButton from "../components/LogoutButton";

export default function UserPanel() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);

  const fetchData = async () => {
    const b = await getBooks();
    const l = await getMyLoans();
    setBooks(b.data);
    setLoans(l.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleReturn = async (loanId, bookId) => {
    await returnBook({ id_wypozyczenia: loanId, id_ksiazki: bookId });
    fetchData();
  };

  return (
    <div className="container">
      <header>
        <h1>Panel Czytelnika</h1>
        <LogoutButton />
      </header>

      <section>
        <h2>Dostępne książki</h2>
        <BookList books={books} refreshList={fetchData} isAdmin={false} />
      </section>

      <section className="mt" style={{ paddingTop: '40px' }}>
        <h2>Twoje aktywne wypożyczenia</h2>
        <div className="book-grid mt">
          {loans.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Brak aktywnych wypożyczeń.</p>}
          {loans.map(l => (
            <div key={l.id_wypozyczenia} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ marginBottom: '4px' }}>{l.tytul}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{l.autor}</p>
              <div className="mt" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  Status: {l.status_wypozyczenia}
                </span>
                {l.status_wypozyczenia === 'aktywne' && (
                  <button onClick={() => handleReturn(l.id_wypozyczenia, l.id_ksiazki)}>
                    Zwróć
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}