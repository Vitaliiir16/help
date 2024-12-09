import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Graph from './components/Graph/Graph';
import RedBlackTree from './components/RedBlackTree/RedBlackTree';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/rbt" element={<RedBlackTree />} />
      </Routes>
    </Router>
  );
}

export default App;
