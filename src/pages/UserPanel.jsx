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

      <section style={{ marginTop: "40px" }}>
        <h2>Historia Twoich wypożyczeń</h2>
        <div className="book-grid">
          {loans.length === 0 ? (
            <p>Brak historii wypożyczeń.</p>
          ) : (
            loans.map((l) => (
              <div 
                key={l.id_wypozyczenia} 
                className="card" 
                style={{ 
                  borderLeft: l.status_wypozyczenia === 'aktywne' ? "5px solid #2563eb" : "5px solid #94a3b8",
                  background: l.status_wypozyczenia === 'oddana' ? "#f8fafc" : "#fff"
                }}
              >
                <h4 style={{ margin: 0 }}>{l.tytul}</h4>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{l.autor}</p>
                
                {/* Dodanie daty, jeśli backend ją przesyła */}
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "10px" }}>
                  {l.data_wypozyczenia && <span>Od: {new Date(l.data_wypozyczenia).toLocaleDateString()}</span>}
                  {l.data_zwrotu && <span> | Do: {new Date(l.data_zwrotu).toLocaleDateString()}</span>}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span 
                    style={{ 
                      fontSize: "0.8rem", 
                      padding: "2px 8px", 
                      borderRadius: "4px",
                      background: l.status_wypozyczenia === 'aktywne' ? "#dbeafe" : "#e2e8f0",
                      color: l.status_wypozyczenia === 'aktywne' ? "#1e40af" : "#475569",
                      fontWeight: "bold"
                    }}
                  >
                    {l.status_wypozyczenia.toUpperCase()}
                  </span>

                  {l.status_wypozyczenia === 'aktywne' && (
                    <button 
                      onClick={() => handleReturn(l.id_wypozyczenia)} 
                      disabled={loadingId === l.id_wypozyczenia}
                      style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                    >
                      {loadingId === l.id_wypozyczenia ? "..." : "Zwróć teraz"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}