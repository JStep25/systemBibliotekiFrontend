import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
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
      setError("Nie udało się pobrać książek.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdded = () => {
    setSuccess("Książka została dodana.");
    fetchBooks();
  };

  return (
    <div className="container">
      <header>
        <h1>Panel administracyjny</h1>
        <LogoutButton />
      </header>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px"
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px"
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <h2>Zasoby biblioteczne</h2>
        <button onClick={() => setShowModal(true)}>
          Dodaj nową książkę
        </button>
      </div>

      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <BookList
          books={books}
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