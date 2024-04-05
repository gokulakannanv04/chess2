import React, { useState, useEffect } from 'react';
import Square from './Square';
import '../components/Chessboard.css'; // Import the CSS file

const Chessboard = () => {
  const [board, setBoard] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [ws, setWs] = useState(null);
  const [gameId, setGameId] = useState(null); // State to store the game ID
  const [inputGameId, setInputGameId] = useState(''); // State to store input game ID

  useEffect(() => {
    const newGameId = generateGameId(); // Generate a new game ID
    setGameId(newGameId); // Set the game ID state

    const ws = new WebSocket('ws://localhost:4000'); // Replace with your server URL
    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'updateBoard') {
        setBoard(data.board);
      } else if (data.type === 'gameOver') {
        setWinner(data.winner);
      } else if (data.type === 'validMoves') {
        setValidMoves(data.moves);
      } else if (data.type === 'gameRoomInitialized') {
        setGameId(data.gameId);
      } else if (data.type === 'gameStarted') {
        setBoard(data.board);
      } else if (data.type === 'updateBoard') {
        setBoard(data.move);
      }
    };
    setWs(ws);

    return () => ws.close();
  }, []);

  const initializeGame = () => {
    // Check if gameId is already set, if not, generate a new one
    const gameIdToUse = gameId || generateGameId();
    setGameId(gameIdToUse);
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
    setBoard(initialBoard);
    if (ws) {
      ws.send(JSON.stringify({ type: 'initializeGame', gameId: gameIdToUse, board: initialBoard }));
    }
  };

  const joinGameRoom = () => {
    if (ws && inputGameId) {
      ws.send(JSON.stringify({ type: 'joinGameRoom', gameId: inputGameId }));
    }
  };

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
      }
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };
  const canMove = (toRow, toCol, validMoves) => {
    return validMoves.some(move => move.row === toRow && move.col === toCol);
  };
  const renderSquare = (piece, rowIndex, colIndex) => {
    const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
    const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
    const isHighlighted = isSelected || isValidMove;
    return (
      <Square
        key={`${rowIndex}-${colIndex}`}
        piece={piece}
        onClick={() => handleSquareClick(rowIndex, colIndex)}
        highlight={isHighlighted}
      />
    );
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="board-row">
        {row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
      </div>
    ));
  };

  return (
    <div>
      <button onClick={initializeGame}>Start Game</button>
      <div>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={inputGameId}
          onChange={(e) => setInputGameId(e.target.value)}
        />
        <button onClick={joinGameRoom}>Join Game</button>
      </div>
      <div className="chessboard">{board && renderBoard()}</div>
      {winner && <div className="winner-message">{`${winner} wins!`}</div>}
    </div>
  );
};

export default Chessboard;

// Function to generate a unique game ID
function generateGameId() {
  return Math.random().toString(36).substring(7);
}
