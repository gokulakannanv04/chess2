import React, { useState, useEffect } from 'react';
import Square from './Square';
import '../components/Chessboard.css'; // Import the CSS file
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import bknightImage from '../images/bknight.png';
import bbishopImage from '../images/bbishop.png';
import bqueenImage from '../images/bqueen.png';
import brookImage from '../images/brook.png';
import wbishopImage from '../images/wbishop.png';
import wknightImage from '../images/wknight.png';
import wrookImage from '../images/wrook.png';
import wqueenImage from '../images/wqueen.png';

const Chessboard = () => {
  const openPopup = () => setOpen(true);
  const [open, setOpen] = useState(false);
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
  const [clientColor, setClientColor] = useState('b');
  const[gameRoom,setGameRoom] =useState(null);
  const backgroundColor = winner==='Win' ? 'green' : 'red';
  useEffect(() => {
    const newGameId = generateGameId();
    setGameId(newGameId);
    const ws = new WebSocket('ws://localhost:4000');
    //     const ws = new WebSocket('wss://chess2backend.onrender.com'); // Replace with your server URL
    ws.onopen = () => {
      console.log('WebSocket connected');
      setLoading(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'updateBoard':
          setBoard(data.board);
          break;
        case 'gameOver':
          console.log(`${data.winner}`);
          setWinner(data.winner);
          setStart('0');
          break;
        case 'waitingForPlayer':
          console.log("Waiting for the second player to join...");
          setClientColor('w');
          setConnect('1');
          break;
        case 'validMoves':
          setValidMoves(data.moves);
          break;
        case 'gameRoomInitialized':
          setGameId(data.gameId);
          break;
        case 'ready':
          setStart('1');
          setConnect('0');
          console.log("Ready to start the game");
          break;
        case 'pawnPromotion':
          console.log("sd");
          setGameRoom(data.gameRoom);
          // setWs(data.ws);
          openPopup();
          break;
        default:
          break;
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
    const gameIdToUse = gameId || generateGameId();
    setGameId(gameIdToUse);
    setBoard(initialBoard);
    if (ws) {
      ws.send(JSON.stringify({ type: 'initializeGame', gameId: gameIdToUse, board: initialBoard }));
    }
  };
  const prom = (p) => {
    ws.send(JSON.stringify({ type: 'promotionUpdate', board, piece: p, color: clientColor,gameRoom }));
  
    setOpen(false);
  };

  const handleSquareClick = (row, col) => {
   
    if (!ws || !board) return;
    const piece = board[row][col];
    const color = piece.charAt(0);

    if (selectedPiece === null) {
      if (piece !== 'Empty') {
        setSelectedPiece({ piece, row, col });
        ws.send(JSON.stringify({ type: 'getValidMoves', gameId, piece, row, col, color, board }));
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
        ws.send(JSON.stringify({ type: 'move', gameId, from: { row: selectedRow, col: selectedCol }, to: { row, col }, board: newBoard }));
      }
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  const canMove = (toRow, toCol, validMoves) => {
    return validMoves.some(move => move.row === toRow && move.col === toCol);
  };

  const renderSquare = (piece, rowIndex, colIndex) => {
    const reversedPiece = clientColor === 'b' ? reversePiece(piece) : piece;
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
    return 7 - position;
  };

  const reversePiece = (piece) => {
    if (piece === 'Empty') {
      return piece;
    }
    return piece.charAt(0) === 'w' ? `w${piece.slice(1)}` : `b${piece.slice(1)}`;
  };

  const renderBoard = () => {
    const reversedBoard = clientColor === 'b' ? board.slice().reverse() : board;
    return reversedBoard.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="board-row">
        {clientColor === 'b' ? row.slice().reverse().map((piece, colIndex) => renderSquare(piece, boardchange(rowIndex), boardchange(colIndex))) :
          row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
      </div>
    ));
  };

  return (
    <div>
      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)} modal nested>
        <div className='modal'>
          <div className="image-grid">
            <div>
              <button className="image-button" onClick={() => {  setOpen(false);prom(clientColor === 'b' ? 'bqueen' : 'wqueen');}}>
                <img src={clientColor === 'b' ? bqueenImage : wqueenImage} alt='Queen' />
              </button>
              <h1>Queen</h1>
            </div>
            <div>
              <button className="image-button" onClick={() => {  setOpen(false); prom(clientColor === 'b' ? 'brook' : 'wrook');}}>
                <img src={clientColor === 'b' ? brookImage : wrookImage} alt='Rook' />
              </button>
              <h1>Rook</h1>
            </div>
            <div>
              <button className="image-button" onClick={() => { setOpen(false);prom(clientColor === 'b' ? 'bbishop' : 'wbishop');}}>
                <img src={clientColor === 'b' ? bbishopImage : wbishopImage} alt='Bishop' />
              </button>
              <h1>Bishop</h1>
            </div>
            <div>
              <button className="image-button" onClick={() => { setOpen(false);prom(clientColor === 'b' ? 'bknight' : 'wknight'); }}>
                <img src={clientColor === 'b' ? bknightImage : wknightImage} alt='Knight' />
              </button>
              <h1>Knight</h1>
            </div>
          </div>
        </div>
      </Popup>
      {startbutton === '1' ? (<button onClick={initializeGame} disabled={loading}>{loading ? <div className="spinner"></div> : 'Start'}</button>) : ('')}
      {start === '1' ? (<div className="chessboard">{board && renderBoard()}</div>) : ("")}
      {winner && <div className="winner-message"  style={{ backgroundColor }}><h1>{`You ${winner}`}</h1></div>}
      {connect === '1' ? (<div className="connect">
        <div className="circle">
          <p className="text">Connecting...</p>
        </div>
      </div>) : ("")}
    </div>
  );
};

export default Chessboard;

// Function to generate a unique game ID
function generateGameId() {
  return Math.random().toString(36).substring(7);
}
