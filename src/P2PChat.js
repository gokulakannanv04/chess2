import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const P2PChat = () => {
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');

  useEffect(() => {
    const initializePeer = () => {
      const newPeer = new Peer(); // Create a new Peer instance
      newPeer.on('open', () => {
        console.log('Peer connected with ID:', newPeer.id);
        setPeer(newPeer); // Set the peer state once it's connected
      });

      newPeer.on('connection', conn => {
        console.log('Received connection from peer:', conn.peer);
        setConnection(conn); // Set the connection state when a connection is received
        conn.on('data', data => {
          console.log('Received message:', data);
          setReceivedMessages(prevMessages => [...prevMessages, { from: conn.peer, message: data }]);
        });
      });

      // Return a cleanup function to disconnect the peer when the component unmounts
      return () => {
        console.log('Disconnecting peer');
        newPeer.disconnect();
      };
    };

    initializePeer();
  }, []);

  const connectToPeer = () => {
    if (!peer) {
      console.error('Peer is not initialized yet');
      return;
    }

    const peerId = prompt('Enter peer ID:');
    if (!peerId) return;

    const conn = peer.connect(peerId);
    conn.on('open', () => {
      console.log('Connected to peer:', peerId);
      setConnection(conn);
      conn.on('data', data => {
        console.log('Received message:', data);
        setReceivedMessages(prevMessages => [...prevMessages, { from: peerId, message: data }]);
      });
    });
  };

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
      <button onClick={connectToPeer}>Connect to Peer</button>
    </div>
  );
};

export default P2PChat;
