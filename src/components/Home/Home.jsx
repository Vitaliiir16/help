import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <section>
      <h1>Алгоритм та Структура Даних</h1>
      <div className="sections">
        <div className="graph">
          <h2>Graph Algorithm DFS</h2>
          <Link to="/graph">
            <button className="start">Start</button>
          </Link>
        </div>
        <div className="rbt">
          <h2>Data Structure Red Black Tree</h2>
          <Link to="/rbt">
            <button className="start">Start</button>
          </Link>
        </div>
      </div>
      <footer>
        <p>Internet of Things 2024</p>
      </footer>
    </section>
  );
}

export default Home;
