import React from 'react';

const Controls = ({
  onAddNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
  onStartDFS,
  onPauseDFS,
  onUndoDFS,
  onResetGraph,
  isRunning,
  isPaused,
  delay,
  setDelay,
}) => (
  <div className="controls">
    <button onClick={onAddNode}>Додати Вершину</button>
    <button onClick={onDeleteNode}>Видалити Вершину</button>
    <button onClick={onAddEdge}>Додати Ребро</button>
    <button onClick={onDeleteEdge}>Видалити Ребро</button>
    <button onClick={onStartDFS} disabled={isRunning}>
      Старт
    </button>
    <button onClick={onPauseDFS} disabled={!isRunning}>
      {isPaused?'Продовжити':'Пауза'}
    </button>
    <button onClick={onUndoDFS} disabled={!isRunning}>
      Назад
    </button>
    <button onClick={onResetGraph}>Скинути</button>
    <div className="delay-control">
      <label htmlFor="delay-input">Затримка (мс): </label>
      <input
        id="delay-input"
        type="number"
        value={delay}
        onChange={(e)=>setDelay(Number(e.target.value))}
        min="100"
        step="100"
      />
    </div>
  </div>
);

export default Controls;
