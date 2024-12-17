import React, { useState, useEffect, useRef } from "react";
import "../styles/Battle.css";
import { weaponNames, monsterNames } from "../components/themedNames"; // Import themed names
import Player from "./Player"; // Import Player component

const startingWeapon = { name: "Grim Reaper's Scythe", damage: 5 }; // Default weapon

const Battle = ({ player, setPlayer, boss, setBoss, onVictory, onDefeat }) => {
  const [level, setLevel] = useState(player.level);
  const [actionLog, setActionLog] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isSpecialReady, setIsSpecialReady] = useState(false);
  const [healCooldown, setHealCooldown] = useState(0); // Heal cooldown in turns
  const [inventory, setInventory] = useState([startingWeapon]);
  const [equippedWeapon, setEquippedWeapon] = useState(startingWeapon);
  const [equippedSpecialItem, setEquippedSpecialItem] = useState(null); // Track special item
  const [turnCounter, setTurnCounter] = useState(0); // To track turns
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Track if it's player's turn

  const logRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the log whenever a new action is added
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [actionLog]);

  // Handle player attack
  const handleAttack = () => {
    if (!isPlayerTurn || isAttacking || healCooldown > 0) return; // Ensure only one action per turn

    setIsPlayerTurn(false); // Disable player's actions while it's boss's turn
    setIsAttacking(true);

    // Check that equippedWeapon is not undefined
    const playerDamage = Math.floor(Math.random() * 5) + (equippedWeapon?.damage || 0);  // Default to 0 if undefined
    const newBossHealth = boss.health - playerDamage;

    setBoss((prev) => ({ ...prev, health: newBossHealth }));

    const attackMessages = [
      `You swung ${equippedWeapon?.name} and dealt ${playerDamage} damage!`,
      `Your attack with ${equippedWeapon?.name} hit hard, dealing ${playerDamage} damage!`,
      `You slash with ${equippedWeapon?.name}, causing ${playerDamage} damage to ${boss.name}!`,
    ];
    setActionLog((prev) => [
      ...prev,
      attackMessages[Math.floor(Math.random() * attackMessages.length)],
    ]);

    if (newBossHealth <= 0) {
      handleVictory();
    } else {
      setTimeout(handleBossTurn, 2000); // Delay for boss turn (2 seconds)
    }

    // End the turn by incrementing the turn counter
    setTurnCounter((prev) => prev + 1); // Increment turn count
    setIsAttacking(false); // End turn after action
  };

  // Handle player healing
  const handleHeal = () => {
    if (!isPlayerTurn || healCooldown > 0) return; // Prevent healing if cooldown is active or it's not the player's turn

    setIsPlayerTurn(false); // Disable player's actions while it's boss's turn

    const healAmount = 20;
    setPlayer((prev) => ({
      ...prev,
      health: Math.min(prev.health + healAmount, 100),
    }));

    const healMessages = [
      `You rest and heal for ${healAmount} health.`,
      `A quick heal restores ${healAmount} health.`,
      `You take a moment to catch your breath and heal ${healAmount} health.`,
    ];
    setActionLog((prev) => [
      ...prev,
      healMessages[Math.floor(Math.random() * healMessages.length)],
    ]);

    // Set a cooldown of 2 to 4 turns
    setHealCooldown(Math.floor(Math.random() * 3) + 2); // Random cooldown between 2 and 4 turns

    // End the turn by incrementing the turn counter
    setTurnCounter((prev) => prev + 1); // Increment turn count

    setTimeout(handleBossTurn, 2000); // After healing, trigger the boss's turn
  };

  // Handle special attack
  const handleSpecialAttack = () => {
    if (!isPlayerTurn || !isSpecialReady) return; // Ensure it's player's turn and special attack is ready

    setIsPlayerTurn(false); // Disable player's actions while it's boss's turn
    setIsSpecialReady(false);

    const specialDamage = 30;
    const newBossHealth = boss.health - specialDamage;

    setBoss((prev) => ({ ...prev, health: newBossHealth }));

    const specialMessages = [
      `You unleash a mighty special attack, dealing ${specialDamage} damage!`,
      `With all your strength, you deliver a special blow for ${specialDamage} damage!`,
      `A powerful special attack lands, dealing ${specialDamage} damage to ${boss.name}!`,
    ];
    setActionLog((prev) => [
      ...prev,
      specialMessages[Math.floor(Math.random() * specialMessages.length)],
    ]);

    if (newBossHealth <= 0) {
      handleVictory();
    } else {
      setTimeout(handleBossTurn, 2000); // Delay for boss turn (2 seconds)
    }

    // End the turn by incrementing the turn counter
    setTurnCounter((prev) => prev + 1); // Increment turn count
  };

  // Boss's turn
  const handleBossTurn = () => {
    const bossDamage = boss.damage || 0; // Default to 0 if boss.damage is undefined
    setPlayer((prev) => {
      const newHealth = prev.health - bossDamage;
      if (newHealth <= 0) {
        // Handle loss scenario
        setActionLog((prev) => [
          ...prev,
          `${boss.name} dealt ${bossDamage} damage to you. You have been defeated!`,
        ]);
        alert("You have been defeated! Game Over.");
        onDefeat(); // Notify App component of defeat
        return { ...prev, health: 0 }; // Set health to 0
      }
      return { ...prev, health: newHealth };
    });

    const bossMessages = [
      `${boss.name} strikes with fury, dealing ${bossDamage} damage!`,
      `${boss.name} hits you with a devastating attack, causing ${bossDamage} damage!`,
      `${boss.name} lunges at you, inflicting ${bossDamage} damage!`,
    ];
    setActionLog((prev) => [
      ...prev,
      bossMessages[Math.floor(Math.random() * bossMessages.length)],
    ]);

    if (Math.random() < 0.2) setIsSpecialReady(true);

    // Enable player's turn after boss's turn is finished
    setIsPlayerTurn(true);
  };

  // Handle victory
  const handleVictory = () => {
    if (level >= 20) {
      setActionLog((prev) => [
        ...prev,
        `Congratulations! You've reached the max level and defeated ${boss.name}!`,
      ]);
      alert("You have completed the game! Victory!");
      return;
    }

    const newWeapon = generateWeapon(level + 1);
    setInventory((prev) => [...prev, newWeapon]);

    setActionLog((prev) => [
      ...prev,
      `You defeated ${boss.name}! You received a new weapon: ${newWeapon.name} (Damage: ${newWeapon.damage}).`,
    ]);

    setLevel((prev) => prev + 1);
    setBoss(generateBoss(level + 1)); // Generate new boss based on level
    setPlayer((prev) => ({ ...prev, health: 100 }));
    onVictory(); // Notify App component of victory
  };

  // Generate new weapon
  const generateWeapon = (level) => {
    const name = weaponNames[Math.floor(Math.random() * weaponNames.length)];
    const damage = Math.floor(10 + level * 2 + Math.random() * 5);

    return { name, damage };
  };

  // Generate boss for current level
  function generateBoss(level) {
    const bossName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
    return {
      name: bossName,
      health: 100 + level * 20,
      damage: 10 + level * 2,  // Ensure this value is set properly
    };
  }

  // Update the cooldown every turn
  useEffect(() => {
    if (healCooldown > 0) {
      // Decrease the heal cooldown by 1 each time the player takes a turn
      setHealCooldown((prev) => prev - 1);
    }
  }, [turnCounter, healCooldown]); // The cooldown updates based on turnCounter

  return (
    <div className="battle-container">
      <Player player={player} healCooldown={healCooldown} turnCounter={turnCounter} />

      <div className="battle-stats">
        <h2>Boss: {boss.name}</h2> {/* Added this line to show the boss name */}
        <h3>Boss Health: {boss.health}</h3>
        <h3>Level: {level}</h3>
        <h3>
          Equipped Weapon: {equippedWeapon.name} (Damage: {equippedWeapon.damage})
        </h3>
        {equippedSpecialItem && (
          <h3>Equipped Special Item: {equippedSpecialItem.name}</h3>
        )}
      </div>

      <div className="battle-actions">
        <button
          onClick={handleAttack}
          disabled={!isPlayerTurn || isAttacking || healCooldown > 0}
        >
          Attack
        </button>
        <button
          onClick={handleSpecialAttack}
          disabled={!isPlayerTurn || !isSpecialReady}
          className={isSpecialReady ? "special-attack-ready" : ""}
        >
          Special Attack
        </button>
        <button
          onClick={handleHeal}
          disabled={!isPlayerTurn || healCooldown > 0}
        >
          Heal {healCooldown > 0 ? `(${healCooldown} turn cooldown)` : ""}
        </button>
      </div>

      <div className="battle-log" ref={logRef}>
        {actionLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>

      <div className="inventory">
        <h3>Inventory</h3>
        {inventory.map((item, index) => (
          <div key={index}>
            <p>
              {item.name} {item.damage ? `(Damage: ${item.damage})` : ""} 
              <button onClick={() => setEquippedWeapon(item)}>
                Equip Weapon
              </button>
              <button onClick={() => setEquippedSpecialItem(item)}>
                Equip Special Item
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Battle;
