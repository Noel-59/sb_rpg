import React from "react";
import "../styles/Battle.css";

const Player = ({ player, healCooldown, turnCounter }) => {
  return (
    <div className="player-container">
      <h2 style={{ color: player.health < 30 ? "red" : "green" }}>
        Player Health: {player.health}
      </h2>
      <h3>
        Heal Cooldown: {healCooldown > 0 ? `${healCooldown} turns` : "Ready!"}
      </h3>
      <h3>Turn: {turnCounter}</h3>
    </div>
  );
};

export default Player;
