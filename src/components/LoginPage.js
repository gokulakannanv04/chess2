import React, { useState,useEffect } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
function LoginPage () {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRegister = () => {
    navigate('/register'); 
  }
  const handleSubmit = async() => {
    // navigate('/register'); 
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
        const a=await response.json();
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        // setName(a.username);
        navigate('/'); 
        // setPass(a.password);
        // setLoginStatus(username);
        console.log(a.username);
        console.log('Login successful');
       
        setLoading(false);
        // setName(username);
        // // setPass(password);
        // const a=await response.json();
        // setData(a);

        // Redirect to the home page upon successful login
        // navigate('/');

      } else {
        // setLogin('failure');
        // setLoginStatus('failure');
        console.error('Login failed');
        setLoading(false);
      }
    } catch (error) {
      // setLoginStatus('failure');
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
        </div ><div className="fulllogin-button">
        <button className="login-buttonr" onClick={handleSubmit} disabled={loading}>
        {loading ? <div className="spinner"></div> : 'Login'}
      </button>
        <button className="login-buttonr" onClick={handleRegister}>Register</button>
      </div></div>
    </div>
  );
};

export default LoginPage;