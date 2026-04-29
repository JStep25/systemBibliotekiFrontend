import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import EditBookModal from "../components/EditBookModal.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      showTemporaryError("Nie udało się odświeżyć listy książek.");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const showTemporaryError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  const showTemporarySuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const filteredBooks = books.filter(b =>
    b.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Panel Administracyjny</h1>
        <LogoutButton />
      </header>

      <div style={{ minHeight: "50px", marginTop: "10px" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", border: "1px solid #fecaca", display: "flex", alignItems: "center", fontWeight: "500" }}>
            <span style={{ marginRight: "10px" }}>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#dcfce7", color: "#15803d", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", fontWeight: "500" }}>
            <span style={{ marginRight: "10px" }}>✅</span> {success}
          </div>
        )}
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
        <strong style={{ whiteSpace: "nowrap" }}>Szukaj:</strong>
        <input 
          type="text" 
          placeholder="Tytuł / Autor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={() => setShowModal(true)} style={{ height: "40px", whiteSpace: "nowrap" }}>+ Dodaj książkę</button>
      </div>

      <section style={{ marginTop: "30px" }}>
        <BookList 
          books={filteredBooks} 
          refreshList={fetchBooks} 
          isAdmin={true} 
          onError={showTemporaryError}
          onSuccess={showTemporarySuccess}
          onEdit={(book) => setEditingBook(book)}
        />
      </section>

      {showModal && (
        <AddBookModal 
          onClose={() => setShowModal(false)} 
          onAdded={() => { 
            fetchBooks(); 
            showTemporarySuccess("Książka została dodana pomyślnie!"); 
          }} 
        />
      )}

      {editingBook && (
        <EditBookModal 
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onUpdated={() => {
            fetchBooks();
            showTemporarySuccess("Dane książki zostały zaktualizowane!");
          }}
        />
      )}
    </div>
  );
}