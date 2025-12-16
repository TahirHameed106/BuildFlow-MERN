import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Register from "./pages/Register"; // ✅ 1. Import the Register Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Go to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* ✅ 2. Add the Register Route so users can sign up */}
        <Route path="/register" element={<Register />} />
        
        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;