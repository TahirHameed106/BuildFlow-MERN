import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Engineer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 👇 THIS IS YOUR LIVE BACKEND URL
// REPLACE with your new Vercel Backend link
 const API_URL = "https://build-flow-mern-backend.vercel.app";
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegistering ? "register" : "login";
    
    const payload = isRegistering 
      ? { name, email, password, role } 
      : { email, password };
      
    try {
      // ✅ CHANGED: Now using the live Back4App URL instead of localhost
      const res = await axios.post(`${API_URL}/auth/${endpoint}`, payload);

      alert(`${isRegistering ? "Registration" : "Login"} Successful!`);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 
      navigate("/dashboard"); 
      
    } catch (err) {
      console.error(err);
      alert(`${isRegistering ? "Registration" : "Login"} Failed: ` + (err.response?.data?.msg || "Server Error"));
    }
    setLoading(false);
  };

  const formTitle = isRegistering ? "Create New Account" : "Login to BuildFlow";
  const buttonText = isRegistering ? "Register" : "Login";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{formTitle}</h2>
        <form onSubmit={handleAuth}>

          {isRegistering && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          {isRegistering && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Role:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={styles.input}
                required
              >
                <option value="Manager">Manager (Full Control)</option>
                <option value="Engineer">Engineer (Tasks & Summaries)</option>
                <option value="HR">HR (Applications & Documents)</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Processing..." : buttonText}
          </button>
        </form>

        <div style={styles.switch}>
          <span style={styles.switchText}>
            {isRegistering ? "Already have an account?" : "Need an account?"}
          </span>
          <button onClick={() => setIsRegistering(!isRegistering)} style={styles.switchButton}>
            {isRegistering ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F4F6F7',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '350px',
        textAlign: 'center'
    },
    title: {
        color: '#0A1A2F',
        marginBottom: '25px',
        fontSize: '24px'
    },
    inputGroup: {
        marginBottom: '15px',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#1C1C1E'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #bdc3c7',
        borderRadius: '5px',
        boxSizing: 'border-box',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#0E7C86',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '10px',
        transition: '0.2s',
    },
    switch: {
        marginTop: '20px',
        borderTop: '1px solid #bdc3c7',
        paddingTop: '15px'
    },
    switchText: {
        color: '#A0A4A8',
        marginRight: '10px'
    },
    switchButton: {
        backgroundColor: 'transparent',
        color: '#E74C3C',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    }
};

export default Login;