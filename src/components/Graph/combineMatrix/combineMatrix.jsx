import React from 'react';
import './combineMatrix.css';

const combineMatrix = ({ nodes, edges }) => {
  const size=nodes.length
  const matrix=Array(size).fill(0).map(()=>Array(size).fill(0))
  edges.forEach(e=>{
    const fi=nodes.findIndex(n=>n.id===e.from)
    const ti=nodes.findIndex(n=>n.id===e.to)
    if(fi!==-1&&ti!==-1)matrix[fi][ti]=1
  })
  return (
    <div className="combine-matrix">
      <h3>Матриця Суміжності</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {nodes.map(n=><th key={n.id}>{n.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.map((rows,i)=>(
            <tr key={nodes[i].id}>
              <td>{nodes[i].label}</td>
              {rows.map((val,j)=>(
                <td key={j} className={val===0?'zero-cell':'one-cell'}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default combineMatrix;
