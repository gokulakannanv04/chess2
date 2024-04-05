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

  let game;

  for (const gameId in games) {
    if (games[gameId].players < 2) {
      game = games[gameId];
      break;
    }
  }

  if (!game) {
    const gameId = generateGameId();
    console.log("gs", gameId);
    games[gameId] = {
      players: 0,
      board: initializeBoard()
    };
    game = games[gameId];
    console.log("gs", gameId);
  }

  game.players++;
  console.log("gs", game.players);
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const gameId = data.gameId;
    const foundGame = games[gameId]; // Rename game to foundGame to avoid conflict
console.log(data,"1");
    // if (!foundGame) {
    //   // Handle error condition where game is not found
    //   ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
    //   return;
    // }

    if (data.type === 'getValidMoves') {
      const { row, col, color, piece ,board} = data;
      const validMoves = getValidMoves(piece, row, col, color, board);
      // Emit validMoves to the connected client
      ws.send(JSON.stringify({ type: 'validMoves', validMoves }));
    } else if (data.type === 'move') {
      const { from, to, color } = data;
      console.log(from, to, color);
      // Validate the move
      const isValidMove = validateMove(from, to, color, foundGame.board);
      if (isValidMove) {
        // Update the board
        updateBoard(from, to, foundGame.board);
        const winner = checkGameOver(foundGame.board);
        // Broadcast the updated board and game status to all players
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'updateBoard', board: foundGame.board }));
            if (winner) {
              client.send(JSON.stringify({ type: 'gameOver', winner }));
            }
          }
        });
      } else {
        // Inform the player that the move is invalid
        ws.send(JSON.stringify({ type: 'invalidMove' }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    game.players--;
  });
});

function generateGameId() {
  return Math.random().toString(36).substring(7);
}

function initializeBoard() {
  const initialBoard = [
    ['brook', 'bknight', 'bbishop', 'bqueen', 'bking', 'bbishop', 'bknight', 'brook'],
    ['bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn'],
    ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
    ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
    ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
    ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
    ['wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn'],
    ['wrook', 'wknight', 'wbishop', 'wqueen', 'wking', 'wbishop', 'wknight', 'wrook']
  ];
  return initialBoard;
}

// Check if there are exactly two players in the game room
function hasTwoPlayers(gameId) {
  const game = games[gameId];
  return game.players === 2;
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
