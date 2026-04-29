import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);
    
    if (user.role === "admin") {
      return <Navigate to="/admin/books" replace />;
    }
    return <Navigate to="/user/books" replace />;
  } catch (err) {
   
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        

        <Route path="/" element={<HomeRedirect />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/user/books" element={<UserPanel />} />


        <Route path="/admin/books" element={<AdminPanel />} />


        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}