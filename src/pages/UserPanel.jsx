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

  // Filtrowanie na dwie grupy
  const activeLoans = loans.filter(l => l.status_wypozyczenia === 'aktywne');
  const historyLoans = loans.filter(l => l.status_wypozyczenia === 'oddana');

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Panel Czytelnika</h1>
        <LogoutButton />
      </header>

      {error && <div style={{ background: "#fee2e2", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>{success}</div>}

      <section style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <strong style={{ whiteSpace: "nowrap" }}>Szukaj:</strong>
          <input 
            type="text" 
            placeholder="Wpisz tytuł lub autora..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
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

      {/* SEKCJA 1: AKTYWNE */}
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#2563eb" }}>Twoje aktualnie wypożyczone książki</h2>
        <div className="book-grid">
          {activeLoans.length === 0 ? (
            <p style={{ color: "#64748b" }}>Nie masz obecnie żadnych wypożyczonych książek.</p>
          ) : (
            activeLoans.map((l) => (
              <div key={l.id_wypozyczenia} className="card" style={{ borderLeft: "5px solid #2563eb" }}>
                <h4 style={{ margin: 0 }}>{l.tytul}</h4>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{l.autor}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#1e40af" }}>AKTYWNE</span>
                  <button 
                    onClick={() => handleReturn(l.id_wypozyczenia)} 
                    disabled={loadingId === l.id_wypozyczenia}
                  >
                    {loadingId === l.id_wypozyczenia ? "..." : "Oddaj książkę"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SEKCJA 2: HISTORIA */}
      <section style={{ marginTop: "40px", paddingBottom: "40px" }}>
        <h2 style={{ color: "#64748b" }}>Historia (zwrócone)</h2>
        <div className="book-grid">
          {historyLoans.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Brak historii zwrotów.</p>
          ) : (
            historyLoans.map((l) => (
              <div key={l.id_wypozyczenia} className="card" style={{ borderLeft: "5px solid #cbd5e1", background: "#f8fafc", opacity: 0.8 }}>
                <h4 style={{ margin: 0 }}>{l.tytul}</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{l.autor}</p>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "bold" }}>ODDANA</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}