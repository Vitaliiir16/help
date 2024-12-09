import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Controls from './Controls';
import Visualization from './Visualization';
import ControlButtons from './controlButtons';
import CurrentNode from './CurrentNode';
import AdjacencyMatrix from './AdjacencyMatrix/AdjacencyMatrix';
import List from './list/List';
import {
  initializeDFS,
  startDFSProcess,
  performDFSStep,
  pauseDFSProcess,
  undoDFSProcess,
  resetDFSProcess
} from './algorithms/dfs';
import './Graph.css';

const Graph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const [representation, setRepresentation] = useState('matrix');
  const [delay, setDelay] = useState(1000);
  const [stack, setStack] = useState([]);
  const isPausedRef = useRef(isPaused);
  const nodesRef = useRef(nodes);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = () => {
    const initialNodes = [
      { id: 1, label: 'V1', x: 200, y: 100, state: 'unvisited' },
      { id: 2, label: 'V2', x: 400, y: 100, state: 'unvisited' },
      { id: 3, label: 'V3', x: 600, y: 100, state: 'unvisited' },
      { id: 4, label: 'V4', x: 200, y: 200, state: 'unvisited' },
      { id: 5, label: 'V5', x: 400, y: 200, state: 'unvisited' },
      { id: 6, label: 'V6', x: 600, y: 200, state: 'unvisited' },
    ];
    const initialEdges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ];
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const addNode = () => {
    if (nodes.length >= 15) {
      alert('Максимальна кількість вершин досягнута');
      return;
    }
    const newNodeId = nodes.length + 1;
    const predefinedPositions = {
      7: { x: 200, y: 300 },
      8: { x: 400, y: 300 },
      9: { x: 600, y: 300 },
      10: { x: 200, y: 400 },
      11: { x: 400, y: 400 },
      12: { x: 600, y: 400 },
      13: { x: 200, y: 500 },
      14: { x: 400, y: 500 },
      15: { x: 600, y: 500 },
    };
    const position = predefinedPositions[newNodeId];
    if (!position) {
      alert('Немає визначеної позиції для нової вершини.');
      return;
    }
    const newNode = {
      id: newNodeId,
      label: `V${newNodeId}`,
      x: position.x,
      y: position.y,
      state: 'unvisited',
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = () => {
    const nodeId = parseInt(prompt('Введіть ID вершини для видалення:'), 10);
    if (isNaN(nodeId) || !nodes.some((node) => node.id === nodeId)) {
      alert('Некоректний ID вершини');
      return;
    }
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.from !== nodeId && edge.to !== nodeId)
    );
  };

  const addEdge = () => {
    const fromId = parseInt(prompt('Введіть ID вихідної вершини:'), 10);
    const toId = parseInt(prompt('Введіть ID цільової вершини:'), 10);
    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !nodes.some((node) => node.id === fromId) ||
      !nodes.some((node) => node.id === toId)
    ) {
      alert('Некоректні ID вершин');
      return;
    }
    setEdges((prev) => [...prev, { from: fromId, to: toId }]);
  };

  const deleteEdge = () => {
    const fromId = parseInt(prompt('Введіть ID вихідної вершини для видалення ребра:'),10);
    const toId = parseInt(prompt('Введіть ID цільової вершини для видалення ребра:'),10);
    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !edges.some((edge) => edge.from === fromId && edge.to === toId)
    ) {
      alert('Ребро не знайдено');
      return;
    }
    setEdges((prev) =>
      prev.filter((edge) => !(edge.from === fromId && edge.to === toId))
    );
  };

  const updateNodeState = useCallback((id, state) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, state } : node
      )
    );
    setCurrentNode(id);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timeoutRef.current = setTimeout(async () => {
        await performDFSStep({
          nodesRef,
          edges,
          stack,
          setStack,
          updateNodeState,
          setStepHistory,
          delay,
          targetNode,
          isPausedRef,
          setIsRunning
        })
      }, delay);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isRunning, isPaused, stack, edges, delay, targetNode, updateNodeState]);

  const startDFS = () => {
    const startNodeId = parseInt(prompt('Введіть ID початкової вершини:'),10);
    const endNodeId = parseInt(prompt('Введіть ID кінцевої вершини:'),10);
    if (
      isNaN(startNodeId) ||
      isNaN(endNodeId) ||
      !nodes.some((node) => node.id === startNodeId) ||
      !nodes.some((node) => node.id === endNodeId)
    ) {
      alert('Некоректний ID вершини');
      return;
    }
    const { nodes: initNodes, stepHistory: initStepHistory, currentNode: initCurrentNode, targetNode: initTargetNode } = initializeDFS(nodes, endNodeId);
    setNodes(initNodes);
    setStepHistory(initStepHistory);
    setCurrentNode(initCurrentNode);
    setTargetNode(initTargetNode);
    startDFSProcess(startNodeId, endNodeId, setIsRunning, setIsPaused, setTargetNode, setStack, setNodes);
  };

  const pauseDFS = () => {
    pauseDFSProcess(isRunning,setIsPaused,isPaused)
  };

  const undoDFS = () => {
    undoDFSProcess(stepHistory,setStepHistory,setNodes,setStack,setCurrentNode)
  };

  const resetGraph = () => {
    resetDFSProcess(setNodes,setStepHistory,setCurrentNode,setTargetNode,setIsRunning,setIsPaused,setStack)
  };

  return (
    <div className="graph-container">
      <h1>Алгоритм Пошуку в Глибину (DFS)</h1>
      <Visualization nodes={nodes} edges={edges} target={targetNode} />
      <Controls
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onAddEdge={addEdge}
        onDeleteEdge={deleteEdge}
        onStartDFS={startDFS}
        onPauseDFS={pauseDFS}
        onUndoDFS={undoDFS}
        onResetGraph={resetGraph}
        isRunning={isRunning}
        isPaused={isPaused}
        delay={delay}
        setDelay={setDelay}
      />
      <CurrentNode node={currentNode} />
      <ControlButtons
      setView={setRepresentation}
      currentView={representation}
      />
      {representation === 'matrix' ? (
        <AdjacencyMatrix nodes={nodes} edges={edges} />
      ) : (
        <List edges={edges} />
      )}
      {isRunning && (
        <div className="current-stack">
          <p>Current Stack: {stack.join(', ')}</p>
        </div>
      )}
      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
};

export default Graph;
