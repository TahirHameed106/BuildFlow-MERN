import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Engineer", // Default valid role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Use the Vercel link directly since you don't have .env setup
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

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="name" onChange={handleChange} placeholder="Full Name" required />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
        
        <label>Select Role:</label>
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="Engineer">Engineer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
        </select>

        <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;