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
      setError("");
      const [booksRes, loansRes] = await Promise.all([
        getBooks(),
        getMyLoans()
      ]);
      setBooks(booksRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      setError("Nie udało się pobrać danych z serwera.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoan = async (bookId) => {
    try {
      setError("");
      setSuccess("");
      setLoadingId(bookId);
      await loanBook({ id_ksiazki: bookId });
      setSuccess("Książka została wypożyczona!");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd wypożyczania.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      setError("");
      setSuccess("");
      setLoadingId(loanId);
      await returnBook({ id_wypozyczenia: loanId });
      setSuccess("Książka została zwrócona.");
      await fetchData();
    } catch (err) {
      setError("Nie udało się zwrócić książki.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredBooks = books.filter(book =>
    book.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Panel Czytelnika</h1>
        <LogoutButton />
      </header>

      {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "10px", marginBottom: "10px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "10px", marginBottom: "10px" }}>{success}</div>}

      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", gap: "10px" }}>
          <h2>Dostępne książki</h2>
          <input 
            type="text" 
            placeholder="Szukaj po tytule lub autorze..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minWidth: "250px" }}
          />
        </div>
        <BookList 
          books={filteredBooks} 
          refreshList={fetchData} 
          isAdmin={false} 
          onLoan={handleLoan} 
          loadingId={loadingId}
        />
      </section>

      <hr />

      <section className="mt" style={{ paddingTop: "20px" }}>
        <h2>Twoje aktywne wypożyczenia</h2>
        <div className="book-grid mt">
          {loans.filter(l => l.status_wypozyczenia === "aktywne").length === 0 ? (
            <p style={{ color: "#666" }}>Brak aktywnych wypożyczeń.</p>
          ) : (
            loans.filter(l => l.status_wypozyczenia === "aktywne").map((l) => (
              <div key={l.id_wypozyczenia} className="card" style={{ borderLeft: "4px solid #2563eb", padding: "15px", marginBottom: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{l.tytul}</h4>
                <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 10px 0" }}>{l.autor}</p>
                <button 
                  onClick={() => handleReturn(l.id_wypozyczenia)} 
                  disabled={loadingId === l.id_wypozyczenia}
                >
                  {loadingId === l.id_wypozyczenia ? "Zwracanie..." : "Zwróć"}
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}