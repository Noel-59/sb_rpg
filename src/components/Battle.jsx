import React, { useState, useEffect, useRef } from "react";
import "../styles/Battle.css";
import { weaponNames, monsterNames } from "../components/themedNames"; // Import themed names
import Player from "./Player"; // Import Player component

const startingWeapon = { name: "Grim Reaper's Scythe", damage: 5 }; // Default weapon
const specialItems = [
  { name: "Soul Reaper's Poison", effect: "poison", damage: 10 }, // Poison effect
  { name: "Mega Heal Elixir", effect: "heal", healAmount: 50 },  // Heal effect
];

const Battle = ({ player, setPlayer, boss, setBoss, onVictory, onDefeat }) => {
  const [level, setLevel] = useState(player.level);
  const [actionLog, setActionLog] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isSpecialReady, setIsSpecialReady] = useState(false);
  const [healCooldown, setHealCooldown] = useState(0); // Heal cooldown in turns
  const [inventory, setInventory] = useState([startingWeapon, ...specialItems]); // Add special items to inventory
  const [equippedWeapon, setEquippedWeapon] = useState(startingWeapon); // Track equipped weapon
  const [equippedSpecialItem, setEquippedSpecialItem] = useState(null); // Track equipped special item
  const [turnCounter, setTurnCounter] = useState(0); // To track turns
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Track if it's player's turn
  const [poisoned, setPoisoned] = useState(false); // Track if the boss is poisoned

  const logRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the log whenever a new action is added
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [actionLog]);

  // Handle player attack
  const handleAttack = () => {
    if (!isPlayerTurn || isAttacking || healCooldown > 0) return; // Ensure only one action per turn
    
    setIsPlayerTurn(false);
    setIsAttacking(true);
    
    const playerDamage = Math.floor(Math.random() * 5) + (equippedWeapon?.damage || 0);
    const newBossHealth = boss.health - playerDamage;
  
    setBoss((prev) => ({ ...prev, health: newBossHealth }));
  
    setActionLog((prev) => [
      ...prev,
      `You swung ${equippedWeapon?.name} and dealt ${playerDamage} damage!`,
    ]);
  
    if (newBossHealth <= 0) {
      handleVictory();
    } else {
      setTimeout(handleBossTurn, 2000);
    }
  
    setTurnCounter((prev) => prev + 1);
    setIsAttacking(false);
  };  

  // Handle special attack
  const handleSpecialAttack = () => {
    if (!isPlayerTurn || !isSpecialReady || !equippedSpecialItem) return; // Ensure it's player's turn and special item is equipped

    setIsPlayerTurn(false); // Disable player's actions while it's boss's turn
    setIsSpecialReady(false);

    if (equippedSpecialItem.effect === "heal") {
      const healAmount = equippedSpecialItem.healAmount;
      setPlayer((prev) => ({
        ...prev,
        health: Math.min(prev.health + healAmount, 100),
      }));

      const healMessages = [
        `You use ${equippedSpecialItem.name} and heal for ${healAmount} health.`,
        `A powerful elixir heals you for ${healAmount} health.`,
      ];
      setActionLog((prev) => [
        ...prev,
        healMessages[Math.floor(Math.random() * healMessages.length)],
      ]);
    } else if (equippedSpecialItem.effect === "poison") {
      setPoisoned(true);
      const poisonMessages = [
        `You poisoned ${boss.name} with ${equippedSpecialItem.name}!`,
        `${boss.name} is now poisoned by ${equippedSpecialItem.name}!`,
      ];
      setActionLog((prev) => [
        ...prev,
        poisonMessages[Math.floor(Math.random() * poisonMessages.length)],
      ]);
    }

    setTimeout(handleBossTurn, 2000); // Delay for boss turn (2 seconds)

    // End the turn by incrementing the turn counter
    setTurnCounter((prev) => prev + 1); // Increment turn count
  };

  // Handle player healing
  const handleHeal = () => {
    if (!isPlayerTurn || healCooldown > 0) return; // Prevent healing if cooldown is active
    
    setIsPlayerTurn(false); // Disable actions during boss's turn
  
    if (equippedSpecialItem?.effect === "heal") {
      const healAmount = equippedSpecialItem.healAmount;
      setPlayer((prev) => ({
        ...prev,
        health: Math.min(prev.health + healAmount, 100),
      }));
  
      setActionLog((prev) => [
        ...prev,
        `You use ${equippedSpecialItem.name} and heal for ${healAmount} health.`,
      ]);
    }
  
    setHealCooldown(Math.floor(Math.random() * 3) + 2); // Random cooldown (2-4 turns)
    setTurnCounter((prev) => prev + 1);
  
    setTimeout(handleBossTurn, 2000); // Proceed to boss's turn after healing
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

    // Apply poison damage
    if (poisoned) {
      const poisonDamage = 5; // Poison damage per turn
      setBoss((prev) => ({
        ...prev,
        health: prev.health - poisonDamage,
      }));
      setActionLog((prev) => [
        ...prev,
        `${boss.name} is poisoned and takes ${poisonDamage} damage!`,
      ]);
      setPoisoned(false); // Poison lasts for one turn
    }

    // Enable player's turn after boss's turn is finished
    setIsPlayerTurn(true);
  };

  // Handle victory
  const handleVictory = () => {
    if (level >= 10) {
      setActionLog((prev) => [
        ...prev,
        `Congratulations! You've reached level 10 and defeated ${boss.name}!`,
      ]);
      alert("You have completed the game! Victory!");
      return;
    }
  
    // Randomly assign an item (healing potion, weapon, etc.) after a victory
    const newItem = generateItem(level + 1); // Generate a new item (weapon or potion)
    setInventory((prev) => [...prev, newItem]);
  
    setActionLog((prev) => [
      ...prev,
      `You defeated ${boss.name}! You received a new item: ${newItem.name}`,
    ]);
  
    setLevel((prev) => prev + 1);
    setBoss(generateBoss(level + 1)); // Generate new boss based on level
    setPlayer((prev) => ({ ...prev, health: 100 }));
    onVictory(); // Notify App component of victory
  };  

  // Generate new weapon
  const generateWeapon = (level) => {
    const names = [
      "The Dark Void Blade",
      "Reaper's Wrath",
      "Hell's Edge",
      "Grim Slaughterer",
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const damage = Math.floor(10 + level * 2 + Math.random() * 5);

    return { name, damage };
  };

  const generateItem = (level) => {
    const items = [
      { name: "Healing Potion", effect: "heal", healAmount: 30 },
      { name: "Power Sword", damage: 10 },
      { name: "Defense Shield", effect: "defense", defenseBoost: 5 },
    ];
  
    return items[Math.floor(Math.random() * items.length)];
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
        <h2>Boss: {boss.name}</h2>
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
  <h3>Inventory (Bag of Grey)</h3>
  {inventory.map((item, index) => (
    <div key={index}>
      <p>
        {item.name} {item.damage ? `(Damage: ${item.damage})` : ""}
        {item.healAmount ? `(Heal: ${item.healAmount})` : ""}
        <button onClick={() => item.damage ? setEquippedWeapon(item) : setEquippedSpecialItem(item)}>
          Equip
        </button>
      </p>
    </div>
  ))}
</div>


      {/* Your Hand Box */}
      <div className="your-hand">
        <h3>Your Hand</h3>
        <p>
          {equippedWeapon.name} (Damage: {equippedWeapon.damage})
          <button onClick={() => setEquippedWeapon(null)}>Unequip</button>
        </p>
        {equippedSpecialItem && (
          <p>
            {equippedSpecialItem.name}
            <button onClick={() => setEquippedSpecialItem(null)}>
              Unequip
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Battle;
