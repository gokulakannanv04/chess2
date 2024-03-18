import React from 'react';
import Square from './Square';
import '../components/Chessboard.css'; // Import the CSS file

// Define the initial board configuration
const INITIAL_BOARD = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
];

const Chessboard = () => {
  const renderSquare = (piece, rowIndex, colIndex) => {
    let pieceImage = null;
    if (piece) {
      const color = piece === piece.toUpperCase() ? 'w' : 'b'; // Check if piece is uppercase
      pieceImage = require(`../images/${color}${piece.toLowerCase()}.png`).default;
    }
    return <Square key={`${rowIndex}-${colIndex}`} piece={pieceImage} />;
  };

  const renderBoard = () => {
    return INITIAL_BOARD.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="board-row">
        {row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
      </div>
    ));
  };

  return (
    <div className="chessboard">
      {renderBoard()}
    </div>
  );
};

export default Chessboard;
