import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 

function App() {
  return (
    // This <Router> wrapper is necessary to make useNavigate() and <Route> work!
    <Router>
      <Routes>
        {/* Default route: Go to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* Main Dashboard - where all the action happens */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;