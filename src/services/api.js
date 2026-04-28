import axios from "axios";

const API = axios.create({ 
  baseURL: "https://systembibliotekibackend.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const getBooks = () => API.get("/books");
export const addBook = (data) => API.post("/books", data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

export const loanBook = (data) => API.post("/loans", data);
export const returnBook = (data) => API.post("/loans/return", data);
export const getMyLoans = () => API.get("/loans/my");

export default API;