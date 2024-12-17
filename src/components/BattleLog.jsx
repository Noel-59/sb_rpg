import React from "react";
import '../styles/Battle.css';

const BattleLog = ({ log }) => {
  return (
    <div className="battle-log">
      <ul>
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default BattleLog;
