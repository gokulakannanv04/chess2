import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const P2PChat = () => {
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [peerId, setPeerId] = useState(null);
  const predefinedPeerId = 'chess'; // Prefix for predefined peer IDs
  const maxAttempts = 10; // Maximum number of attempts to find an active peer
  const peerIds = [...Array(maxAttempts).keys()].map(i => predefinedPeerId + i); // Generate an array of possible peer IDs
  const [userCount] = useState(Math.floor(Math.random() * 10)); // Generate random number between 0 and 9
  const [isConnected, setIsConnected] = useState(false); // Flag to track connection status

  useEffect(() => {
    const initializePeer = () => {
      const newPeer = new Peer(`chess${userCount}`); // Use the random number directly for peer ID
      newPeer.on('open', id => {
        console.log('Peer connected with ID:', id);
        setPeer(newPeer); // Set the peer state once it's connected
        setPeerId(id); // Set the peer ID state
      });

      newPeer.on('connection', conn => {
        if (isConnected) { // Check if already connected
          console.log('Connection rejected: Already connected');
          return;
        }

        console.log('Received connection from peer:', conn.peer);
        setConnection(conn); // Set the connection state when a connection is received
        conn.on('data', data => {
          console.log('Received message:', data);
          setReceivedMessages(prevMessages => [...prevMessages, { from: conn.peer, message: data }]);
        });
        setIsConnected(true); // Set isConnected flag to true
      });

      // Return a cleanup function to disconnect the peer when the component unmounts
      return () => {
        console.log('Disconnecting peer');
        newPeer.disconnect();
      };
    };

    initializePeer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (peer && !isConnected) { // Check isConnected flag before attempting to connect
      console.log('Trying to connect to active peer...');
      for (let i = 0; i < peerIds.length; i++) {
        const conn = peer.connect(peerIds[i]);
        conn.on('open', () => {
          console.log('Connected to peer:', conn.peer);
          setConnection(conn);
          conn.on('data', data => {
            console.log('Received message:', data);
            setReceivedMessages(prevMessages => [...prevMessages, { from: conn.peer, message: data }]);
          });
        });
        conn.on('error', () => {
          console.log('Connection failed:', conn.peer);
        });
      }
    }
  }, [peer, isConnected, peerIds]);

  const sendMessage = () => {
    if (!connection) {
      console.error('Not connected to any peer');
      return;
    }

    if (!messageToSend.trim()) {
      console.error('Message cannot be empty');
      return;
    }

    connection.send(messageToSend);
    console.log('Sent message:', messageToSend);
    setMessageToSend('');
  };

  return (
    <div>
      <h1>Peer-to-Peer Chat</h1>
      <div>
        {receivedMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <input type="text" value={messageToSend} onChange={e => setMessageToSend(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div>Your Peer ID: {peerId}</div>
    </div>
  );
};

export default P2PChat;
