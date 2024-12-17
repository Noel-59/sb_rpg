import React, { useState, useEffect } from "react";
import Battle from "./components/Battle";
import VictoryScreen from "./components/VictoryScreen";
import GameOver from "./components/GameOver";
import './styles/App.css';

const App = () => {
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState({
    health: 100, // Make sure health is initialized correctly
    level: 1,
    xp: 0,
    buffs: [],
    debuffs: [],
    specialMeter: 0, // Ensure specialMeter exists if it's being used
  });

  const [boss, setBoss] = useState({ name: "Sharkboy", health: 150, damage: 10 }); // Ensure damage is set for boss

  useEffect(() => {
    // Charge special meter as player takes damage or does actions
    if (player.health < 100) {
      setPlayer(prev => ({ ...prev, specialMeter: prev.specialMeter + 1 }));
    }
  }, [player.health]);

  const handleVictory = () => {
    setGameOver(true);
    setPlayer(prev => ({ ...prev, xp: prev.xp + 50 }));
  };

  const handleDefeat = () => {
    setGameOver(true);
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
        <VictoryScreen player={player} />
      ) : (
        <GameOver onRestart={() => window.location.reload()} />
      )}
    </div>
  );
};

export default App;
