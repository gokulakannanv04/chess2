// canMove.js
const canMove = (piece, fromRow, fromCol, toRow, toCol, board) => {
    console.log(piece, fromRow, fromCol, toRow, toCol, board);
    switch (piece) {
      case 'bpawn':
        return canMoveBlackPawn(fromRow, fromCol, toRow, toCol, board);
      case 'wpawn':
        return canMoveWhitePawn(fromRow, fromCol, toRow, toCol, board);
      case 'bknight':
      case 'wknight':
        return canMoveKnight(fromRow, fromCol, toRow, toCol);
      case 'bbishop':
      case 'wbishop':
        return canMoveBishop(fromRow, fromCol, toRow, toCol, board);
      case 'brook':
      case 'wrook':
        return canMoveRook(fromRow, fromCol, toRow, toCol, board);
      case 'bqueen':
      case 'wqueen':
        return canMoveQueen(fromRow, fromCol, toRow, toCol, board);
      case 'bking':
      case 'wking':
        return canMoveKing(fromRow, fromCol, toRow, toCol, board);
      default:
        return false; // Invalid piece
    }
  };
  
  const canMoveBlackPawn = (fromRow, fromCol, toRow, toCol, board) => {
    console.log(fromRow, fromCol, toRow, toCol, board);

    // Black pawn can move forward by one square
    if (toRow -1 === fromRow  && toCol === fromCol && board[toRow][toCol] === 'Empty') {
      return true;
    }
    // Black pawn can move forward by two squares on its first move
    if (fromRow === 6 && toRow === 4 && toCol === fromCol && board[toRow][toCol] === 'Empty' && board[5][fromCol] === 'Empty') {
      return true;
    }
    // Black pawn can capture diagonally
    if (toRow === fromRow - 1 && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol].charAt(0) === 'w') {
      return true;
    }
    return false;
  };
  
  const canMoveWhitePawn = (fromRow, fromCol, toRow, toCol, board) => {
    // White pawn can move forward by one square
    if (toRow === fromRow + 1 && toCol === fromCol && board[toRow][toCol] === 'Empty') {
      return true;
    }
    // White pawn can move forward by two squares on its first move
    if (fromRow === 1 && toRow === 3 && toCol === fromCol && board[toRow][toCol] === 'Empty' && board[2][fromCol] === 'Empty') {
      return true;
    }
    // White pawn can capture diagonally
    if (toRow === fromRow + 1 && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol].charAt(0) === 'b') {
      return true;
    }
    return false;
  };
  
  const canMoveKnight = (fromRow, fromCol, toRow, toCol) => {
    // Knight moves in "L" shape: two squares in one direction and one square perpendicular to that direction
    return (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) ||
           (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 2);
  };
  
  const canMoveBishop = (fromRow, fromCol, toRow, toCol, board) => {
    // Bishop moves diagonally any number of squares
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
      return false;
    }
    const rowIncrement = toRow > fromRow ? 1 : -1;
    const colIncrement = toCol > fromCol ? 1 : -1;
    let row = fromRow + rowIncrement;
    let col = fromCol + colIncrement;
    while (row !== toRow && col !== toCol) {
      if (board[row][col] !== 'Empty') {
        return false; // Path is blocked
      }
      row += rowIncrement;
      col += colIncrement;
    }
    return true;
  };
  
  const canMoveRook = (fromRow, fromCol, toRow, toCol, board) => {
    // Rook moves horizontally or vertically any number of squares
    if (fromRow !== toRow && fromCol !== toCol) {
      return false;
    }
    if (fromRow === toRow) {
      const colIncrement = toCol > fromCol ? 1 : -1;
      let col = fromCol + colIncrement;
      while (col !== toCol) {
        if (board[fromRow][col] !== 'Empty') {
          return false; // Path is blocked
        }
        col += colIncrement;
      }
    } else {
      const rowIncrement = toRow > fromRow ? 1 : -1;
      let row = fromRow + rowIncrement;
      while (row !== toRow) {
        if (board[row][fromCol] !== 'Empty') {
          return false; // Path is blocked
        }
        row += rowIncrement;
      }
    }
    return true;
  };
  const canMoveQueen = (fromRow, fromCol, toRow, toCol, board) => {
    // Queen combines the movement of rooks and bishops: can move horizontally, vertically, or diagonally any number of squares
    return canMoveRook(fromRow, fromCol, toRow, toCol, board) || canMoveBishop(fromRow, fromCol, toRow, toCol, board);
  };
  
  const canMoveKing = (fromRow, fromCol, toRow, toCol, board) => {
    // King can move one square in any direction
    return Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1;
  };
  
  export default canMove;
  