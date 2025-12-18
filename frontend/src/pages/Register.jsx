import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Engineer", // Default matches your Backend
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use your specific backend URL directly
      const API_URL = "https://build-flow-mern-backend.vercel.app";
      
      const response = await axios.post(
        `${API_URL}/auth/register`,
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        alert("Registration Successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  // ✅ RESPONSIVE STYLES
  const containerStyle = {
    maxWidth: "400px",
    margin: "40px auto", // Centers it vertically and horizontally
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Nice shadow card effect
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif"
  };

  const inputStyle = {
    padding: "10px",
    margin: "8px 0",
    width: "100%", // Full width of container
    boxSizing: "border-box", // Prevents padding from breaking width
    borderRadius: "4px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0070f3", // Vercel Blue
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input 
          type="text" name="name" onChange={handleChange} placeholder="John Doe" required 
          style={inputStyle}
        />

        <label>Email Address</label>
        <input 
          type="email" name="email" onChange={handleChange} placeholder="john@example.com" required 
          style={inputStyle}
        />

        <label>Password</label>
        <input 
          type="password" name="password" onChange={handleChange} placeholder="••••••••" required 
          style={inputStyle}
        />
        
        <label>Select Role</label>
        <select name="role" onChange={handleChange} value={formData.role} style={inputStyle}>
          <option value="Engineer">Engineer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
        </select>

        <button type="submit" style={buttonStyle}>Register</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account? <Link to="/login" style={{ color: "#0070f3" }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;