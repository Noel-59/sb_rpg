import React from "react";

const VictoryScreen = ({ player, onNextLevel }) => {
  return (
    <div className="victory-screen">
      <h1>You Won!</h1>
      <p>Level: {player.level}</p>
      <p>Health: {player.health}</p>
      <button onClick={onNextLevel}>Next Level</button>
    </div>
  );
};

export default VictoryScreen;
