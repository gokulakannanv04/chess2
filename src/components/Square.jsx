import React from 'react';

const Square = ({ piece }) => {
  return (
    <div className="square">
      {piece && <img src={piece} alt="Piece" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
    </div>
  );
};

export default Square;
