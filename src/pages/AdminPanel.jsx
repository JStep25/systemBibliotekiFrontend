import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList";
import AddBookModal from "../components/AddBookModal";
import LogoutButton from "../components/LogoutButton";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  return (
    <div className="container">
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h1>🛡️ Panel Admina</h1>
        <LogoutButton />
      </header>
      
      <button onClick={() => setShowModal(true)}>➕ Dodaj Książkę</button>
      
      <div className="mt">
        <BookList books={books} refreshList={fetchBooks} isAdmin={true} />
      </div>

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onAdded={fetchBooks} />}
    </div>
  );
}