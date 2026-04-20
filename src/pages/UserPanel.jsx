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
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>📖 Katalog Książek</h1>
        <LogoutButton />
      </header>

      <div className="mt">
        <BookList books={books} refreshList={fetchData} isAdmin={false} />
      </div>

      <h2 className="mt"> Moje Wypożyczenia</h2>
      {loans.map(l => (
        <div key={l.id_wypozyczenia} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h4>{l.tytul}</h4>
            <p className="status">{l.autor} — <span className={l.status_wypozyczenia === 'aktywne' ? 'available' : ''}>{l.status_wypozyczenia}</span></p>
          </div>
          {l.status_wypozyczenia === 'aktywne' && (
            <button onClick={() => handleReturn(l.id_wypozyczenia, l.id_ksiazki)}>Oddaj</button>
          )}
        </div>
      ))}
    </div>
  );
}