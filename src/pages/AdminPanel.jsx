import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      setError("Nie udało się pobrać listy książek.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdded = () => {
    setSuccess("Dodano książkę.");
    fetchBooks();
    setTimeout(() => setSuccess(""), 3000);
  };

  const filteredBooks = books.filter(book =>
    book.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Panel Administracyjny</h1>
        <LogoutButton />
      </header>

      {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "10px", marginBottom: "10px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "10px", marginBottom: "10px" }}>{success}</div>}

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        gap: "15px", 
        marginBottom: "30px"
      }}>
        <input 
          type="text" 
          placeholder="Wyszukaj książkę..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button onClick={() => setShowModal(true)}>+ Dodaj</button>
      </div>

      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <BookList
          books={filteredBooks}
          refreshList={fetchBooks}
          isAdmin={true}
        />
      )}

      {showModal && (
        <AddBookModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}