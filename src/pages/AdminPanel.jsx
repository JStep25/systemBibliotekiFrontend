import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

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

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Szukaj w zasobach:</label>
          <input 
            type="text" 
            placeholder="Tytuł / Autor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <button onClick={() => setShowModal(true)} style={{ height: "42px" }}>+ Dodaj książkę</button>
      </div>

      <section style={{ marginTop: "30px" }}>
        <BookList books={filteredBooks} refreshList={fetchBooks} isAdmin={true} />
      </section>

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onAdded={() => { fetchBooks(); setSuccess("Dodano!"); }} />}
    </div>
  );
}