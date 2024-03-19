import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './component/HomePage';
import PokemonDetail from './component/PokemonDetail';
// import HomePageCopy from './component/HomePageCopy'



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/PokemonDetail/:name" element={<PokemonDetail />} />
    </Routes>
  );
};

export default App;
