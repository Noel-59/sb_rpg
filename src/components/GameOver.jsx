import React from "react";

const GameOver = ({ onRestart }) => {
  return (
    <div className="game-over">
      <h1>You Were Defeated</h1>
      <p>Try Again</p>
      <button onClick={onRestart}>Retry</button>
    </div>
  );
};

export default GameOver;
