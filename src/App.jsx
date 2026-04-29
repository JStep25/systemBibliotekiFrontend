import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; // Przywrócony Home
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
      
        <Route path="/" element={<Home />} />

      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      
        <Route path="/user/books" element={<UserPanel />} />

       
        <Route path="/admin/books" element={<AdminPanel />} />

       
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}