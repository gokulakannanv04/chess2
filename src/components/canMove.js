// canMove.js

// Function to determine if a piece can move from one position to another
const canMove = (piece, fromRow, fromCol, toRow, toCol, board) => {
  // Check the type of piece and call the appropriate function
  switch (piece) {
    case 'bpawn':
      return canMoveBlackPawn(fromRow, fromCol, toRow, toCol, board);
    case 'wpawn':
      return canMoveWhitePawn(fromRow, fromCol, toRow, toCol, board);
    case 'bknight':
      return canMoveBlackKnight(fromRow, fromCol, toRow, toCol);
    case 'wknight':
      return canMoveWhiteKnight(fromRow, fromCol, toRow, toCol);
    // case 'bbishop':
    //   return canMoveBlackBishop(fromRow, fromCol, toRow, toCol, board);
    // case 'wbishop':
    //   return canMoveWhiteBishop(fromRow, fromCol, toRow, toCol, board);
    // case 'brook':
    //   return canMoveBlackRook(fromRow, fromCol, toRow, toCol, board);
    // case 'wrook':
    //   return canMoveWhiteRook(fromRow, fromCol, toRow, toCol, board);
    // case 'bqueen':
    //   return canMoveBlackQueen(fromRow, fromCol, toRow, toCol, board);
    // case 'wqueen':
    //   return canMoveWhiteQueen(fromRow, fromCol, toRow, toCol, board);
    // case 'bking':
    //   return canMoveBlackKing(fromRow, fromCol, toRow, toCol, board);
    // case 'wking':
    //   return canMoveWhiteKing(fromRow, fromCol, toRow, toCol, board);
    default:
      return false; // Invalid piece
  }
};

// Function to determine if a white pawn can move from one position to another
const canMoveWhitePawn = (fromRow, fromCol, toRow, toCol, board) => {
  // Check if the pawn can move forward by one square
  if (toRow === fromRow - 1 && toCol === fromCol && board[toRow][toCol] === 'Empty') {
    return true;
  }
  // Check if the pawn can move forward by two squares on its first move
  if (fromRow === 6 && toRow === 4 && toCol === fromCol && board[toRow][toCol] === 'Empty' && board[5][fromCol] === 'Empty') {
    return true;
  }
  // Check if the pawn can capture diagonally
  if (toRow === fromRow - 1 && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol].charAt(0) === 'b') {
    return true;
  }
  return false;
};

// Function to determine if a black pawn can move from one position to another
const canMoveBlackPawn = (fromRow, fromCol, toRow, toCol, board) => {
  // Check if the pawn can move forward by one square
  if (toRow === fromRow + 1 && toCol === fromCol && board[toRow][toCol] === 'Empty') {
    return true;
  }
  // Check if the pawn can move forward by two squares on its first move
  if (fromRow === 1 && toRow === 3 && toCol === fromCol && board[toRow][toCol] === 'Empty' && board[2][fromCol] === 'Empty') {
    return true;
  }
  // Check if the pawn can capture diagonally
  if (toRow === fromRow + 1 && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol].charAt(0) === 'w') {
    return true;
  }
  return false;
};

// Function to determine if a white knight can move from one position to another
const canMoveWhiteKnight = (fromRow, fromCol, toRow, toCol) => {
  // Knight moves in "L" shape: two squares in one direction and one square perpendicular to that direction
  return (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) ||
         (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 2);
};

// Function to determine if a black knight can move from one position to another
const canMoveBlackKnight = (fromRow, fromCol, toRow, toCol) => {
  // Knight moves in "L" shape: two squares in one direction and one square perpendicular to that direction
  return (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) ||
         (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 2);
};

// Add similar functions for other pieces...

export default canMove;
