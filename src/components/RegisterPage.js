import React, { useState,useEffect } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
function RegisterPage ()  {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async() => {
    // navigate('/login');
    setLoading(true);
    try {
      // const response = await fetch('http://localhost:4000/register', {
      const response = await fetch('https://chess2backend.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // setRegistrationStatus('success');
        console.log('User registered successfully');
        console.log('Login successful');
        setLoading(false);
        // Navigate to the login page upon successful registration
        navigate('/login');
      } else {
        // setRegistrationStatus('failure');
        console.error('Registration failed');
        setLoading(false);
      }
    } catch (error) {
      // setRegistrationStatus('failure');
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Register</h2>
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
        <button className="login-button" onClick={handleSubmit} disabled={loading}>
        {loading ? <div className="spinner"></div> : 'Register'}
      </button>
      </div>
    </div>
  );
};

export default RegisterPage;
