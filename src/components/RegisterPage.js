import React, { useState,useEffect } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
function RegisterPage ()  {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async() => {
    // navigate('/login');
    try {
      const response = await fetch('http://localhost:4000/register', {
      // const response = await fetch('https://server-aimq.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // setRegistrationStatus('success');
        console.log('User registered successfully');

        // Navigate to the login page upon successful registration
        navigate('/login');
      } else {
        // setRegistrationStatus('failure');
        console.error('Registration failed');
      }
    } catch (error) {
      // setRegistrationStatus('failure');
      console.error(error);
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
        <button className="login-button" onClick={handleSubmit}>Register</button>
      </div>
    </div>
  );
};

export default RegisterPage;
