import React, { useEffect } from 'react';
// import { navigate } from 'react-router-dom'; // Import navigate function
import './HomePage.css';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    // Add event listener to disable scrolling when HomePage is mounted
    document.body.style.overflow = 'hidden';

    // Clean up function to enable scrolling when HomePage is unmounted
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const handleLoginClick = () => {
    // Navigate to the login page when the button is clicked using navigate function
    navigate('/login');
  };

  return (
    <div className="home-container">
      <img
        src="https://wallpapercave.com/wp/wp2883566.jpg"
        alt="Home"
        className="home-image"
      />
      <div className="content-overlay">
        <div>
          <ul>
            <li style={{ float: 'right' }}>
              {/* Replace the About link with a styled Login button */}
              <button className="login-button" onClick={handleLoginClick}>Login</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
