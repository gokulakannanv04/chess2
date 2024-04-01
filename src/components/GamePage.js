import React, { useState, useEffect } from 'react';
import './GamePage.css'; // Import the CSS file for styling

function GamePage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWhite, setIsWhite] = useState(false); // Track if the user is playing as white

  useEffect(() => {
    // Check if a game document already exists in MongoDB when component mounts
    checkGameDocument();
  }, []);

  const createGameDocument = async () => {
    try {
      setIsConnecting(true);
      // Make a POST request to create a new game document in MongoDB
      const response = await fetch('https://server-aimq.onrender.com/create', { method: 'POST' });
      const data = await response.json();
      if (data.isWhite) {
        setIsWhite(true); // Set the player as white if specified by the backend
      }
      setIsConnecting(false);
    } catch (error) {
      console.error('Error creating game document:', error);
      setIsConnecting(false);
    }
  };

  const checkGameDocument = async () => {
    try {
      setIsConnecting(true);
      // Make a GET request to check if a game document already exists in MongoDB
      const response = await fetch('https://server-aimq.onrender.com/check');
      const data = await response.json();
      if (data.exists) {
        if (data.isWhite) {
          setIsWhite(false); // Set the player as black if the game exists and white is already taken
        } else {
          setIsWhite(true); // Set the player as white if the game exists and white is available
        }
      }
      setIsConnecting(false);
    } catch (error) {
      console.error('Error checking game document:', error);
      setIsConnecting(false);
    }
  };

  const handlePlay = () => {
    if (!isConnecting) {
      if (!isWhite) {
        // If the player is black, join the existing game
        joinGame();
      } else {
        // If the player is white, create a new game
        createGameDocument();
      }
    }
  };

  const joinGame = async () => {
    // Logic to join an existing game can be added here
    console.log('Joining existing game...');
  };

  return (
    <div className="game-container">
      <div className="connecting-circle">
        {!isConnecting && <span className="connecting-text">Connecting...</span>}
      </div>
      {isConnecting && (
        <button onClick={handlePlay} className="play-button">
          {isWhite ? 'Play as White' : 'Play as Black'}
        </button>
      )}
    </div>
  );
}

export default GamePage;
