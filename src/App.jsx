import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route path="/user/books" element={<UserPanel />} />

        {/* ADMIN */}
        <Route path="/admin/books" element={<AdminPanel />} />

      </Routes>
    </BrowserRouter>
  );
}