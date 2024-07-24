
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in on component mount
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Navigate to the login page when the button is clicked using navigate function
    navigate('/');
    // Clear username from localStorage to log out the user completely
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    // Navigate to the login page when the button is clicked using navigate function
    navigate('/login');
  };
  const handlePlay = () => {
    // Navigate to the login page when the button is clicked using navigate function
    navigate('/chessboard');
  };

  return (
    <div className="home-container" >
      <img
        src="home.jpeg"
        alt="Home"
        className="home-image"
      />
      <div className="content-overlay">
        <div>
          <ul>
          <li style={{ float: 'right' }}>
           
           {isLoggedIn ? (
             <button className="login-button" onClick={handleLogout}>Logout</button>
           ) : (
             <button className="login-button" onClick={handleLogin}>Login</button>
           )}
         </li>
          <li style={{ float: 'right' }}>
            <div> {isLoggedIn ? (
      <button className="login-button" onClick={handlePlay}>Play</button>
      ) : ( <br></br> )}
    </div>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;