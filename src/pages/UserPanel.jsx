import { useEffect, useState } from "react";
import { getBooks, getMyLoans, returnBook, loanBook } from "../services/api";
import BookList from "../components/BookList.jsx";
import LogoutButton from "../components/LogoutButton";

export default function UserPanel() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      setError("");
      // Pobieramy obie listy jednocześnie, aby stany były spójne
      const [booksRes, loansRes] = await Promise.all([
        getBooks(),
        getMyLoans()
      ]);
      setBooks(booksRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      setError("Nie udało się pobrać danych z serwera.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      setError("");
      setSuccess("");
      setLoadingId(loanId);

      await returnBook({ id_wypozyczenia: loanId });

      setSuccess("Książka została zwrócona.");
      // ODŚWIEŻENIE: To musi pobrać nowe statusy książek z API
      await fetchData(); 

    } catch (err) {
      setError("Nie udało się zwrócić książki.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleLoan = async (bookId) => {
    try {
      setError("");
      setSuccess("");
      setLoadingId(bookId);
      await loanBook({ id_ksiazki: bookId });
      setSuccess("Książka została wypożyczona!");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Książka nie jest już dostępna.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Panel Czytelnika</h1>
        <LogoutButton />
      </header>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>
          {success}
        </div>
      )}

      <section>
        <h2>Dostępne książki</h2>
        <BookList 
          books={books} 
          refreshList={fetchData} 
          isAdmin={false} 
          onLoan={handleLoan} 
          loadingId={loadingId}
        />
      </section>

      <section className="mt" style={{ paddingTop: "40px" }}>
        <h2>Twoje aktywne wypożyczenia</h2>
        <div className="book-grid mt">
          {loans.length === 0 && <p style={{ color: "var(--text-light)" }}>Brak aktywnych wypożyczeń.</p>}
          {loans.map((l) => (
            <div key={l.id_wypozyczenia} className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
              <h4>{l.tytul}</h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>{l.autor}</p>
              <div className="mt" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: l.status_wypozyczenia === "aktywne" ? "#16a34a" : "#64748b" }}>
                  {l.status_wypozyczenia}
                </span>
                {l.status_wypozyczenia === "aktywne" && (
                  <button onClick={() => handleReturn(l.id_wypozyczenia)} disabled={loadingId === l.id_wypozyczenia}>
                    {loadingId === l.id_wypozyczenia ? "Zwracanie..." : "Zwróć"}
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