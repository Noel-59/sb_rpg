import React from "react";
import '../styles/VictoryScreen.css';

const VictoryScreen = ({ player }) => {
  return (
    <div className="victory-screen">
      <div className="victory-message">
        <h1>You Won!</h1>
        <p>Level: {player.level}</p>
        <p>Health: {player.health}</p>
        <p>XP Earned: 100</p>
      </div>
    </div>
  );
};

export default VictoryScreen;
