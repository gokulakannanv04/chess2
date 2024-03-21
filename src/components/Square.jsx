import React from 'react';
import '../components/Square.css'; // Import the CSS file
import bknightImage from '../images/bknight.png';
import bbishopImage from '../images/bbishop.png';
import bqueenImage from '../images/bqueen.png';
import bkingImage from '../images/bking.png';
import bpawnImage from '../images/bpawn.png';
import brookImage from '../images/brook.png';
import wbishopImage from '../images/wbishop.png';
import wknightImage from '../images/wknight.png';
import wrookImage from '../images/wrook.png';
import wqueenImage from '../images/wqueen.png';
import wkingImage from '../images/wking.png';
import wpawnImage from '../images/wpawn.png';
const pieceImages = {
  // Mapping piece names to their respective image components
  'bknight': bknightImage,
  'bbishop': bbishopImage,
  'bqueen': bqueenImage,
  'bking': bkingImage,
  'bpawn': bpawnImage,
  'brook': brookImage,
  'wknight': wknightImage,
  'wbishop': wbishopImage,
  'wrook': wrookImage,
  'wqueen': wqueenImage,
  'wking': wkingImage,
  'wpawn': wpawnImage,
};

const Square = ({ piece, onClick, highlight }) => {
  // Define the border style based on the highlight prop
  const borderStyle = highlight ? '2px solid yellow' : 'none';
  const piecei = pieceImages[piece];
  return (
    <div className="square" onClick={onClick}>
      <div className="square-content" style={{ border: borderStyle }}>
      {piece !== 'Empty' && <img src={piecei} alt={piece} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
    </div>
    </div>
  );
};

export default Square;
