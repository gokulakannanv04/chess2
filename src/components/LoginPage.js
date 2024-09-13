import React, { useState, useEffect } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    navigate('/register'); 
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // const response = await fetch('http://localhost:4000/login', {
      const response = await fetch('https://chess2backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // const data = await response.json();
        // Save username and password to localStorage if rememberMe is checked
        if (true) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        } else {
          // Clear saved credentials from localStorage if rememberMe is not checked
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        // Navigate to the home page upon successful login
        navigate('/');
        setLoading(false);
        console.log('Login successful');
      } else {
        console.error('Login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there are saved credentials in localStorage and auto-fill the form
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <div className="fulllogin-button">
          <button className="login-buttonr" onClick={handleSubmit} disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Login'}
          </button>
          <button className="login-buttonr" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
