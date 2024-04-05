const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { getValidMoves } = require('./src/components/getValidMoves');
const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Define games variable outside of the connection handler
const games = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'initializeGame' && Array.isArray(data.board)) {
      const gameId = generateGameId();
      games[gameId] = {
        players: 1,
        board: data.board
      };
      console.log(games[gameId],"start");
      console.log('Initialized game:', gameId);
    } else if (data.type === 'getValidMoves') {
      handleGetValidMoves(ws, data, games); // Pass games as a parameter
      console.log(data,"g");
    } else if (data.type === 'move') {
      handleMove(ws, data, games); // Also pass games here if needed
      console.log(data,"v");
    }
    // Add other message handlers here
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Add logic to handle player disconnection here
  });
});

function generateGameId() {
  return Math.random().toString(36).substring(7);
}


function handleGetValidMoves(ws, data, games) { // Accept games as a parameter
  const gameId = data.gameId;
  const game = games[gameId];
  console.log(games[gameId],"gi");
  // if (!game) {
  //   ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));

  //   return;
  // }
  const { row, col, color, piece } = data;
  // Implement getValidMoves logic here
  // Example:
  const validMoves = getValidMoves(piece, row, col, color, data.board);
  console.log(validMoves,"vm");
  ws.send(JSON.stringify({ type: 'validMoves', validMoves }));
}

function handleMove(ws, data) {
  const gameId = data.gameId;
  const game = games[gameId];
  if (!game) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
    return;
  }
  const { from, to, color } = data;
  // Implement move logic here
  // Example:
  const isValidMove = validateMove(from, to, color, game.board);
  if (isValidMove) {
    updateBoard(from, to, game.board);
    const winner = checkGameOver(game.board);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'updateBoard', board: game.board }));
        if (winner) {
          client.send(JSON.stringify({ type: 'gameOver', winner }));
        }
      }
    });
  } else {
    ws.send(JSON.stringify({ type: 'invalidMove' }));
  }
}

// Example functions (replace with actual implementations)
// function getValidMoves(piece, row, col, color, board) {
//   // Implement logic to calculate valid moves
//   return [];
// }

function validateMove(from, to, color, board) {
  // Implement move validation logic
  return true;
}

function updateBoard(from, to, board) {
  // Implement board update logic
}

function checkGameOver(board) {
  // Implement game over condition check
  return null; // Return winner's color or null if game is not over
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
