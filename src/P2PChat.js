import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const P2PChat = () => {
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [peerId, setPeerId] = useState('');

  useEffect(() => {
    const initializePeer = () => {
      // Specify a custom ID for the peer
      const customPeerId = 'chess'; // Modify this line with your custom peer ID
      const newPeer = new Peer(customPeerId); // Create a new Peer instance with the custom ID
      newPeer.on('open', id => {
        console.log('Peer connected with ID:', id);
        setPeer(newPeer);
        setPeerId(id);
      });

      newPeer.on('connection', conn => {
        console.log('Received connection from peer:', conn.peer);
        setConnection(conn);
        conn.on('data', data => {
          console.log('Received message:', data);
          setReceivedMessages(prevMessages => [...prevMessages, { from: conn.peer, message: data }]);
        });
      });

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

    const conn = peer.connect(prompt('Enter peer ID:'));
    conn.on('open', () => {
      console.log('Connected to peer:', conn.peer);
      setConnection(conn);
      conn.on('data', data => {
        console.log('Received message:', data);
        setReceivedMessages(prevMessages => [...prevMessages, { from: conn.peer, message: data }]);
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
      <div>Your Peer ID: {peerId}</div>
    </div>
  );
};

export default P2PChat;
