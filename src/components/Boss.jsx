import React from "react";
import '../styles/Battle.css';

// Function to generate boss based on the level
export const generateBoss = (level) => {
  const bossNames = ["Sharkboy", "Fire Lord", "Ice Queen", "Shadow Beast"];
  const bossName = bossNames[Math.floor(Math.random() * bossNames.length)];
  return {
    name: `${bossName} - Level ${level}`,
    health: 100 + level * 20, // Increase boss health as levels progress
    damage: 10 + level * 3, // Increase damage as levels progress
  };
};

const Boss = ({ boss, setPlayer, player, onDefeat, setActionLog, setIsAttacking }) => {
  return (
    <div className="boss-container">
      <h2>Boss: {boss.name}</h2> {/* Display the boss's name here */}
      <h3>Boss Health: {boss.health}</h3>
    </div>
  );
};

// This would handle the boss's turn (attacks, etc.)
const handleBossTurn = () => {
  const randomBossAction = Math.random();
  let bossDamage = 0;
  let actionMessage = "";

  if (randomBossAction < 0.3) {
    bossDamage = Math.floor(Math.random() * 5) + 3; // Light attack
    actionMessage = `${boss.name} strikes with a light attack for ${bossDamage} damage.`;
  } else if (randomBossAction < 0.6) {
    bossDamage = Math.floor(Math.random() * 15) + 8; // Heavy attack
    actionMessage = `${boss.name} delivers a heavy attack for ${bossDamage} damage.`;
  } else {
    bossDamage = Math.floor(Math.random() * 12) + 4; // Random attack
    actionMessage = `${boss.name} attacks with an unpredictable strike for ${bossDamage} damage.`;
  }

  const newPlayerHealth = player.health - bossDamage;
  setPlayer((prev) => ({ ...prev, health: newPlayerHealth }));

  setActionLog((prev) => [...prev, actionMessage]);

  if (newPlayerHealth <= 0) {
    onDefeat();
  }

  setIsAttacking(false);
};

export default Boss;
