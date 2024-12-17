import React, { useState, useEffect } from "react";
import Battle from "./components/Battle";
import VictoryScreen from "./components/VictoryScreen";
import GameOver from "./components/GameOver";
import './styles/App.css';
import { generateBoss } from './components/Boss'; // Import the generateBoss function

const App = () => {
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1); // Track current level
  const [player, setPlayer] = useState({
    health: 100,
    level: 1,
    xp: 0,
    buffs: [],
    debuffs: [],
  });

  const [boss, setBoss] = useState(generateBoss(currentLevel)); // Initial boss at level 1

  // Handle player victory and move to the next level
  const handleVictory = () => {
    setGameOver(true);
    setPlayer((prev) => ({
      ...prev,
      xp: prev.xp + 100,
      level: currentLevel + 1,
    }));
  };

  // Handle defeat and end game
  const handleDefeat = () => {
    setGameOver(true);
  };

  // Restart the current level
  const handleRestart = () => {
    setGameOver(false);
    setPlayer((prev) => ({ ...prev, health: 100 }));
    setBoss(generateBoss(currentLevel)); // Regenerate the boss at the current level
  };

  // Move to the next level
  const handleNextLevel = () => {
    setGameOver(false);
    setCurrentLevel((prev) => prev + 1); // Increment level
    setBoss(generateBoss(currentLevel + 1)); // Generate a stronger boss
    setPlayer((prev) => ({ ...prev, health: 100 })); // Reset health
  };

  return (
    <div className="app-container">
      {!gameOver ? (
        <Battle
          player={player}
          setPlayer={setPlayer}
          boss={boss}
          setBoss={setBoss}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
        />
      ) : player.health > 0 ? (
        <VictoryScreen player={player} onNextLevel={handleNextLevel} />
      ) : (
        <GameOver onRestart={handleRestart} />
      )}
    </div>
  );
};

export default App;
