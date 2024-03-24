// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import Chessboard from './components/Chessboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Square from './components/Square';




function App() {
  // const slides =[
  //   {url : cake1, title: 'cake1'},
  //   {url : cake2, title: 'cake2'},
  //   {url : cake3, title: 'cake3'}
  // ];

  // const containerstyle = {
  //   width: '500px',
  //   height: '280px',
  //   margin: '0px auto'
  // };

  return (

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chessboard" element={<Chessboard />} />
          <Route path="/square" element={<Square />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
 
  );
}

export default App;
