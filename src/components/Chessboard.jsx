import React, { useState, useEffect } from 'react';
import Square from './Square';
import '../components/Chessboard.css'; // Import the CSS file

const Chessboard = () => {
  const [board, setBoard] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [ws, setWs] = useState(null);
  const [gameId, setGameId] = useState(null);
const [start, setStart] = useState('0');
const [connect, setConnect] = useState('0');
const [startbutton, setStartButton] = useState('1');
const [loading, setLoading] = useState(true);
 // State to store the game ID
//   const [inputGameId, setInputGameId] = useState(''); // State to store input game ID
const [clientColor, setClientColor] = useState('b');
  useEffect(() => {
    const newGameId = generateGameId(); // Generate a new game ID
    setGameId(newGameId); // Set the game ID state
    const ws = new WebSocket('ws://localhost:4000'); 
//     const ws = new WebSocket('wss://chess2backend.onrender.com'); // Replace with your server URL
    ws.onopen = () => {console.log('WebSocket connected');
setLoading(false);
}

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'updateBoard') {
        setBoard(data.board);
      } else if (data.type === 'gameOver') {
  console.log(`${data.winner}`);
        setWinner(data.winner);
setStart('0');
      } else if (data.type === 'waitingForPlayer') {
          
  console.log("Waiting for the second player to join...");
  setClientColor('w');
  setConnect('1');

        } else if (data.type === 'validMoves') {
        setValidMoves(data.moves);
      } else if (data.type === 'gameRoomInitialized') {
        setGameId(data.gameId);
      } else if (data.type === 'ready') {
         setStart('1');
         setConnect('0');
         console.log("Ready to start the game");
      } else if (data.type === 'updateBoard') {
        setBoard(data.move);
      }
    };
    setWs(ws);

    return () => ws.close();
  }, []);

  const initializeGame = () => {
  setStartButton('0');
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
    // Check if gameId is already set, if not, generate a new one
    const gameIdToUse = gameId || generateGameId();
    setGameId(gameIdToUse);

  setBoard(initialBoard);
   
    if (ws) {
      ws.send(JSON.stringify({ type: 'initializeGame', gameId: gameIdToUse, board: initialBoard }));
    }

  };

//   const joinGameRoom = () => {
//     if (ws && inputGameId) {
//       ws.send(JSON.stringify({ type: 'joinGameRoom', gameId: inputGameId }));
//     }
//   };

  const handleSquareClick = (row, col) => {
    if (!ws || !board) return;
    const piece = board[row][col];
    const color = piece.charAt(0); // Extract the color from the piece name

    if (selectedPiece === null) {
      if (piece !== 'Empty') {
        setSelectedPiece({ piece, row, col });
        ws.send(JSON.stringify({ type: 'getValidMoves', gameId: gameId, piece, row, col, color, board }));
      }
    } else {
      const { row: selectedRow, col: selectedCol } = selectedPiece;
      if (row === selectedRow && col === selectedCol) {
  ws.send(JSON.stringify({ type: 'dontmove'}));
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }
      if (canMove(row, col, validMoves)) {
        const newBoard = [...board];
        newBoard[row][col] = selectedPiece.piece;
        newBoard[selectedRow][selectedCol] = 'Empty';
        setBoard(newBoard);
        ws.send(JSON.stringify({ type: 'move', gameId: gameId, from: { row: selectedRow, col: selectedCol }, to: { row, col }, board: newBoard }));
      }else{ws.send(JSON.stringify({ type: 'dontmove'}));}
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };
  const canMove = (toRow, toCol, validMoves) => {
    return validMoves.some(move => move.row === toRow && move.col === toCol);
  };
const renderSquare = (piece, rowIndex, colIndex) => {
  // Determine the color of the current player


  // Reverse the piece for the second player (if black)
  const reversedPiece = clientColor === 'b' ? reversePiece(piece) : piece;

  // Check if the current square is selected or a valid move
  const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
  const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
  const isHighlighted = isSelected || isValidMove;

  return (
    <Square
      key={`${rowIndex}-${colIndex}`}
      piece={reversedPiece}
      onClick={() => handleSquareClick(rowIndex, colIndex)}
      highlight={isHighlighted}
    />
  );
};

const boardchange = (position) => {
  if (clientColor === 'w') {
    return position;
  }
  return 7-position;
};
// Function to reverse the piece for the second player
const reversePiece = (piece) => {
  if (piece === 'Empty') {
    return piece;
  }
  return piece.charAt(0) === 'w' ? `w${piece.slice(1)}` : `b${piece.slice(1)}`;
};


//   const renderSquare = (piece, rowIndex, colIndex) => {
//     const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
//     const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
//     const isHighlighted = isSelected || isValidMove;
//     return (
//       <Square
//         key={`${rowIndex}-${colIndex}`}
//         piece={piece}
//         onClick={() => handleSquareClick(rowIndex, colIndex)}
//         highlight={isHighlighted}
//       />
//     );
//   };
const renderBoard = () => {
  // Determine the color of the current player


  // Reverse the board's rows for the second player (if black)
  const reversedBoard = clientColor === 'b' ? board.slice().reverse() : board;

  return reversedBoard.map((row, rowIndex) => (
    <div key={`row-${rowIndex}`} className="board-row">
      {/* Reverse the row's pieces for the second player */}
      {clientColor === 'b' ? row.slice().reverse().map((piece, colIndex) => renderSquare(piece,boardchange(rowIndex), boardchange(colIndex) )) :
        row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
    </div>
  ));
};

// const renderBoard = () => {
//   return board.map((row, rowIndex) => (
//     <div key={`row-${rowIndex}`} className="board-row">
//       {row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
//     </div>
//   ));
// };

  return (
    <div>
     {startbutton==='1'?( <button onClick={initializeGame}disabled={loading}>{loading ? <div className="spinner"></div> : 'Start'}</button>):('')}
    
     {start==='1'?( <div className="chessboard">{board && renderBoard()}</div>): ( "" )}
      {winner && <div className="winner-message">{`You ${winner}`}</div>}
{connect==='1'?(<div className="connect">
      <div className="circle">
      <p class="text">Connecting...</p>
      </div>
    </div>):("")}
    </div>
  );
};

export default Chessboard;

// Function to generate a unique game ID
function generateGameId() {
  return Math.random().toString(36).substring(7);
}
