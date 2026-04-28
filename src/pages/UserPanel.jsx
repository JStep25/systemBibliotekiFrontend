import { useEffect, useState } from "react";
import { getBooks, getMyLoans, returnBook, loanBook } from "../services/api";
import BookList from "../components/BookList.jsx";
import LogoutButton from "../components/LogoutButton";

export default function UserPanel() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      const [booksRes, loansRes] = await Promise.all([getBooks(), getMyLoans()]);
      setBooks(booksRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      setError("Nie udało się pobrać danych.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLoan = async (id) => {
    try {
      setLoadingId(id);
      await loanBook({ id_ksiazki: id });
      setSuccess("Wypożyczono!");
      fetchData();
    } catch (err) {
      setError("Błąd wypożyczania.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReturn = async (id) => {
    try {
      setLoadingId(id);
      await returnBook({ id_wypozyczenia: id });
      setSuccess("Zwrócono!");
      fetchData();
    } catch (err) {
      setError("Błąd zwrotu.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredBooks = books.filter(b =>
    b.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Panel Czytelnika</h1>
        <LogoutButton />
      </header>

      {error && <div style={{ background: "#fee2e2", padding: "10px", borderRadius: "8px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", padding: "10px", borderRadius: "8px" }}>{success}</div>}

      <section style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px", background: "#f3f4f6", padding: "15px", borderRadius: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Wyszukaj książkę:</label>
          <input 
            type="text" 
            placeholder="Wpisz tytuł lub autora..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <h2>Dostępne książki</h2>
        <BookList 
          books={filteredBooks} 
          refreshList={fetchData} 
          isAdmin={false} 
          onLoan={handleLoan} 
          loadingId={loadingId}
        />
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Twoje aktywne wypożyczenia</h2>
        <div className="book-grid">
          {loans.filter(l => l.status_wypozyczenia === 'aktywne').map((l) => (
            <div key={l.id_wypozyczenia} className="card">
              <h4>{l.tytul}</h4>
              <p>{l.autor}</p>
              <button onClick={() => handleReturn(l.id_wypozyczenia)} disabled={loadingId === l.id_wypozyczenia}>
                {loadingId === l.id_wypozyczenia ? "Czekaj..." : "Zwróć"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}