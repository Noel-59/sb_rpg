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
    inventory: [], // Add inventory to player state
  });

  const [boss, setBoss] = useState(generateBoss(currentLevel)); // Initial boss at level 1

  // List of possible items
  const itemList = [
    { name: "Health Potion", effect: "Restore 50 health", restore: 50 },
    { name: "Power Boost", effect: "Increase damage by 5 for next battle", damageBoost: 5 },
    { name: "Defense Shield", effect: "Increase defense by 3 for next battle", defenseBoost: 3 },
  ];

  // Function to generate a random item
  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * itemList.length);
    return itemList[randomIndex];
  };

  // Handle player victory and move to the next level
  const handleVictory = () => {
    setGameOver(true);
    setPlayer((prev) => {
      const newItem = getRandomItem(); // Get a random item after victory
      return {
        ...prev,
        xp: prev.xp + 100,
        level: currentLevel + 1,
        inventory: [...prev.inventory, newItem], // Add the new item to the player's inventory
      };
    });
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
      {gameOver && player.inventory.length > 0 && (
        <div className="inventory">
          <h3>Your Inventory:</h3>
          <ul>
            {player.inventory.map((item, index) => (
              <li key={index}>
                {item.name}: {item.effect}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
