//імпорти
import React, { useState,  useRef } from 'react';
import { Link } from 'react-router-dom';
import './RedBlackTree.css';
import { insertNode, deleteNode, searchNodeWithSteps, NIL } from './rbtOperations';

function RedBlackTree() {
  const [tree, setTree] = useState(NIL);
  const [value, setValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState(null);
  const searchStepsRef = useRef([]);
  const searchIntervalRef = useRef(null);

  const handleInsert = () => {
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      alert('Будь ласка, введіть коректне числове значення.');
      return;
    }
    const newTree = insertNode(tree, intValue);
    setTree(newTree);
    setValue('');
  };

  const handleDelete = () => {
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      alert('Будь ласка, введіть коректне числове значення.');
      return;
    }
    const newTree = deleteNode(tree, intValue);
    setTree(newTree);
    setValue('');
  };

  const handleSearch = () => {
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      alert('Будь ласка, введіть коректне числове значення.');
      return;
    }

    const { found, steps } = searchNodeWithSteps(tree, intValue);
    if (steps.length === 0) {
      alert('Дерево порожнє або вузол не знайдено.');
      return;
    }

    if (searchIntervalRef.current) {
      clearInterval(searchIntervalRef.current);
      searchIntervalRef.current = null;
    }

    searchStepsRef.current = steps;
    setValue('');

    let index = 0;
    searchIntervalRef.current = setInterval(() => {
      if (index < searchStepsRef.current.length) {
        setHighlightedNode(searchStepsRef.current[index]);
        index++;
      } else {
        clearInterval(searchIntervalRef.current);
        searchIntervalRef.current = null;
        if (!found) {
          alert('Вузол не знайдено.');
        } else {
          alert('Вузол знайдено!');
        }
      }
    }, 1000);
  };

  const renderTree = () => {
    const renderNode = (node, x, y, angle, depth) => {
      if (node === NIL || node === null) {
        return null;
      }

      const leftX = x - 200 / depth;
      const rightX = x + 200 / depth;
      const childY = y + 70;

      return (
        <g key={node.id}>
          {node.left !== NIL && node.left !== null && (
            <line x1={x} y1={y} x2={leftX} y2={childY} stroke="black" />
          )}
          {node.right !== NIL && node.right !== null && (
            <line x1={x} y1={y} x2={rightX} y2={childY} stroke="black" />
          )}
          <circle
            cx={x}
            cy={y}
            r="20"
            fill={node.color}
            stroke={highlightedNode === node ? 'yellow' : 'black'}
            strokeWidth={highlightedNode === node ? 3 : 1}
          />
          <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="15">
            {node.value}
          </text>
          {renderNode(node.left, leftX, childY, angle - 20, depth + 1)}
          {renderNode(node.right, rightX, childY, angle + 20, depth + 1)}
        </g>
      );
    };

    return (
      <svg width="1300" height="600">
        {renderNode(tree, 400, 50, 0, 1)}
      </svg>
    );
  };

  return (
    <div className="rbt-container">
      <h1>Red-Black Tree</h1>
      <div className="controls">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введіть значення"
        />
        <button onClick={handleInsert}>Додати</button>
        <button onClick={handleDelete}>Видалити</button>
        <button onClick={handleSearch}>Пошук</button>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <div className="tree-area">{renderTree()}</div>
    </div>
  );
}

export default RedBlackTree;
