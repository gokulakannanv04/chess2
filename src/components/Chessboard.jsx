import React, { useState } from 'react';
import Square from './Square';
import getValidMoves from './getValidMoves';
import '../components/Chessboard.css'; // Import the CSS file

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
  const [validMoves, setValidMoves] = useState([]);
  // const [currentTurn, setCurrentTurn] = useState('white'); // Track current turn

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];
    
    // Check if it's the correct player's turn
    // if (selectedPiece.charAt(0) !== currentTurn[0]) {
    //   console.log(selectedPiece.charAt(0));
    //   console.log(currentTurn);
    //   console.log("It's not your turn!");
    //   return;
    // }

    if (selectedPiece === null) {
      if (piece !== 'Empty') {
        setSelectedPiece({ piece, row, col });
        const moves = getValidMoves(piece, row, col, piece.charAt(0) === 'b' ? 'b' : 'w', board);
        setValidMoves(moves);
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

  return <div className="chessboard">{renderBoard()}</div>;
};

export default Chessboard;
