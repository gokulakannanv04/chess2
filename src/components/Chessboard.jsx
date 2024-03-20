import React, { useState } from 'react';
import Square from './Square';
import canMove from './canMove'; // Import the canMove function
import '../components/Chessboard.css'; // Import the CSS file

// Define the initial board configuration
const INITIAL_BOARD = [
  ['brook', 'bknight', 'bbishop', 'bqueen', 'bking', 'bbishop', 'bknight', 'brook'],
  ['bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn'],    
  ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
  ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
  ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
  ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
  ['wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn'],   
  ['wrook', 'wknight', 'wbishop', 'wqueen', 'wking', 'wbishop', 'wknight', 'wrook'],
];

const Chessboard = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];


    if (selectedPiece === null) {
      if (piece !== 'Empty') {
        setSelectedPiece({ piece, row, col });
        
      }
    } else {
      console.log('Selected piece:', selectedPiece);

      const { piece: selectedPieceName, row: selectedRow, col: selectedCol } = selectedPiece;
      if (canMove(selectedPieceName, selectedRow, selectedCol, row, col, board)) { // Pass the board as an argument


        const newBoard = [...board];
        newBoard[row][col] = selectedPieceName;
        newBoard[selectedRow][selectedCol] = 'Empty';
        setBoard(newBoard);
      }
      setSelectedPiece(null);
    }
  };

  const renderSquare = (piece, rowIndex, colIndex) => {
    return (
      <Square 
        key={`${rowIndex}-${colIndex}`} 
        piece={piece} 
        onClick={() => handleSquareClick(rowIndex, colIndex)} 
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

  return <div className="chessboard">{renderBoard()}</div>;
};

export default Chessboard;
