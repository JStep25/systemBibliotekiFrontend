import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookList from "../components/BookList.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

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
      <header>
        <h1>Panel administracyjny</h1>
        <LogoutButton />
      </header>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Zasoby biblioteczne</h2>
        <button onClick={() => setShowModal(true)}>Dodaj nową książkę</button>
      </div>
      
      <BookList books={books} refreshList={fetchBooks} isAdmin={true} />

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onAdded={fetchBooks} />}
    </div>
  );
}