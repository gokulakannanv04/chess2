const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getValidMoves } = require('./src/components/getValidMoves');
const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://sampledb:sampledb@cluster0.vusts07.mongodb.net/?retryWrites=true&w=majority', {
// mongoose.connect('mongodb://localhost:27017/name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const User = mongoose.model('User', {
  username: String,
  password: String,
  Registerdate: {
    type: Date,
    required: true,
    default: Date.now,
    // get: function (value) {
    //   // Convert the stored UTC date to the desired timezone
    //   const adjustedDate = new Date(value);
    //   adjustedDate.setHours(adjustedDate.getHours() - 5, adjustedDate.getMinutes() + 30);
    //   return adjustedDate;
    // },
    set: function (value) {
      // Convert the provided date to UTC before storing
      const utcDate = new Date(value);
      utcDate.setHours(utcDate.getHours() +6, utcDate.getMinutes() - 30);
      return utcDate;
    }
  }
});
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already registered' });
    }
    const encrypted = AES.encrypt(password, 'secret-key').toString();
    // const randomBytes = crypto.randomBytes(32);
    // console.log(randomBytes);
    // const cipher = crypto.createCipher('aes-256-cbc','<Buffer 12 2a 13 9d 8a f5 1b b6 7b a6 3e c1 74 27 05 97 0f e2 88 e6 4b 24 1a 5d db 38 ba 12 2b c8 54 8b>');
    // let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
    // encryptedPassword += cipher.final('hex');
 
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password:encrypted});
    // const user = new User({ username, password});

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      // Removed comparison of hashed passwords
      // const passwordMatch = password ===user.password;
      // const decipher = crypto.createDecipher('aes-256-cbc',  Buffer.from('<Buffer 12 2a 13 9d 8a f5 1b b6 7b a6 3e c1 74 27 05 97 0f e2 88 e6 4b 24 1a 5d db 38 ba 12 2b c8 54 8b>', 'hex'));
      // let decryptedPassword = decipher.update(password, 'hex', 'utf-8');
      // decryptedPassword += decipher.final('utf-8');
      // setDecryptedPassword(decryptedPassword);
      const decrypted = AES.decrypt(user.password, 'secret-key').toString(
        CryptoJS.enc.Utf8
      );
      // const passwordMatch = await bcrypt.compare(password, user.password);
      const passwordMatch =decrypted === password;
      // Removed checking for password match
      if (passwordMatch) {
        // const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        const { _id, username, password, /* other user details */ } = user;
        // res.status(200).json({ _id, username, password /* other user details */ });
      
        res.status(200).json({ message: 'Login successful', _id,username,password });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
        console.log(user.password);
      }
    } else {
      // console.log(`Server is running on http://localhost:${PORT}`);
      res.status(401).json({ error: 'User not found' });
  
    }
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Define games variable outside of the connection handler
const games = {};
const gameRooms = {};
wss.on('connection', (ws) => {
  console.log('New client connected');
  let player = {
    ws: ws,
    gameRoomId: null
  };
ws.on('message', (message) => {
  const data = JSON.parse(message);
  if (data.type === 'joinGame') {
    joinGameRoom(player);
  }

  // Handle changing piece
  if (data.type === 'changePiece' && player.gameRoomId) {
    handleChangePiece(data, player.gameRoomId);
  }
  if (data.type === 'initializeGame' && Array.isArray(data.board)) {
    const gameId = generateGameId();
    gameRooms[gameId] = {
      players: [ws], // Initialize players array with the first player
      board: data.board
    };
    console.log('Initialized game room:', gameId);
    ws.send(JSON.stringify({ type: 'gameRoomInitialized', gameId })); // Send the gameId back to the first player
  } else if (data.type === 'joinGameRoom' && gameRooms[data.gameId]) {
    gameRooms[data.gameId].players.push(ws); // Add the second player to the players array
    const game = gameRooms[data.gameId];
    // Inform both players that the game has started
    game.players.forEach(player => {
      player.send(JSON.stringify({ type: 'gameStarted', board: game.board }));
    });

  } else if (data.type === 'getValidMoves') {
    handleGetValidMoves(ws, data, games); // Pass games as a parameter
    console.log(data,"g");
  }
   else if (data.type === 'move') {
    handleMove(ws, data);
    console.log(data, "v");
  }
  // Add other message handlers here
});

ws.on('close', () => {
  console.log('Client disconnected');
  // Remove the disconnected player from any game room
  if (player.gameRoomId) {
    removePlayerFromGameRoom(player);
  }
  // Object.keys(gameRooms).forEach(gameId => {
  //   const game = gameRooms[gameId];
  //   const index = game.players.indexOf(ws);
  //   if (index !== -1) {
  //     game.players.splice(index, 1);
  //     if (game.players.length === 0) {
  //       // Delete the game room if there are no players left
  //       delete gameRooms[gameId];
  //     }
  //   }
  // });
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
  ws.send(JSON.stringify({ type: 'validMoves', moves:validMoves }));
}

function handleMove(ws, data) {
  const gameId = data.gameId;
  const game = games[gameId];
  // if (!game) {
  //   ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
  //   return;
  // }
  const { from, to, color } = data;
  // Implement move logic here
  // Example:
  const isValidMove = validateMove(from, to, color, data.board);
  console.log("upadate");
  if (isValidMove) {
    updateBoard(from, to, data.board);
    const winner = checkGameOver(data.board);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
     
        client.send(JSON.stringify({ type: 'updateBoard', board: data.board }));
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
// 
function validateMove(from, to, color, board) {
  // Implement move validation logic
  return true;
}

function updateBoard(from, to, board) {

}

function joinGameRoom(player) {
  // Find an available game room with less than 2 players
  const availableGameRoom = findAvailableGameRoom();

  if (availableGameRoom) {
    // Add the player to the available game room
    addPlayerToGameRoom(player, availableGameRoom);
  } else {
    // If no available game room, create a new one
    const newGameRoom = createGameRoom();
    // Add the player to the newly created game room
    addPlayerToGameRoom(player, newGameRoom);
  }
}

function findAvailableGameRoom() {
  for (const roomId in gameRooms) {
    if (gameRooms[roomId].players.length < 2) {
      console.log(gameRooms[roomId]);
      return gameRooms[roomId];
    }
  }
  return null;
}

function createGameRoom() {
  const roomId = generateGameId();
  const newGameRoom = {
    id: roomId,
    players: []
  };
  gameRooms[roomId] = newGameRoom;
  return newGameRoom;
}

function addPlayerToGameRoom(player, gameRoom) {
  gameRoom.players.push(player);
  player.gameRoomId = gameRoom.id;

  // If the game room is now full, initialize the game
  if (gameRoom.players.length === 2) {
    initializeGame(gameRoom);
  }
}

function removePlayerFromGameRoom(player) {
  const gameRoom = gameRooms[player.gameRoomId];
  if (gameRoom) {
    gameRoom.players = gameRoom.players.filter(p => p !== player);
    player.gameRoomId = null;
  }
}

function initializeGame(gameRoom) {
  const gameId = generateGameId();
  gameRoom.gameId = gameId;

  // Send initialization message to all players in the game room
  gameRoom.players.forEach(player => {
    player.ws.send(JSON.stringify({ type: 'initializeGame', gameId }));
  });
}

function handleChangePiece(pieceData, gameRoomId) {
  const gameRoom = gameRooms[gameRoomId];

  // Broadcast the change to all players in the game room
  gameRoom.players.forEach(player => {
    player.ws.send(JSON.stringify({ type: 'changePiece', pieceData }));
  });
}

function checkGameOver(board) {
  // Implement game over condition check
  return null; // Return winner's color or null if game is not over
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

