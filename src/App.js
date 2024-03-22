// // src/App.js
// import React from 'react';
// import './App.css';
// import Chessboard from './components/Chessboard';
// // import { INITIAL_BOARD } from './components/Chessboard';

// function App() {
  
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <h1>Chess Game</h1> */}
//         <Chessboard  />
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import './App.css';
import P2PChat from './P2PChat'; // Import the P2PChat component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Chess Game</h1> */}
        <P2PChat /> {/* Render the P2PChat component */}
      </header>
    </div>
  );
}

export default App;
