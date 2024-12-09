import React from 'react';

const controlButtons = ({ setView, currentView }) => (
  <div className="controlButtons">
    <button onClick={() => setView('edges')} disabled={currentView==='edges'}>
      Список Суміжності
    </button>
    <button onClick={() => setView('matrix')} disabled={currentView==='matrix'}>
      Матриця Суміжності
    </button>
  </div>
);

export default controlButtons;
