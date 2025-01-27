import React, { useState } from "react";
import "./style.css";

const BOARD_SIZE = 100;
const snakes = { 27: 0, 21: 0, 17: 0, 19: 0, 10: 0, 15: 0, 88: 0, 98: 0 }; // Snakes that bring players back to 0

const App = () => {
  const [positions, setPositions] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const rollDice = () => {
    if (rolling || winner) return; // Prevent multiple rolls during animation or after a win
    setRolling(true);

    // Simulate dice rolling animation
    const diceInterval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(diceInterval);
      const roll = Math.floor(Math.random() * 6) + 1;
      setDice(roll);
      movePlayer(roll);
      setRolling(false);
    }, 1000);
  };

  const movePlayer = (roll) => {
    const nextPosition = positions[currentPlayer] + roll;

    if (nextPosition >= BOARD_SIZE) {
      setWinner(currentPlayer); // Declare winner
      setMessage(`${currentPlayer} wins!`);
      setPositions((prev) => ({
        ...prev,
        [currentPlayer]: BOARD_SIZE,
      }));
      return;
    }

    let finalPosition = nextPosition;

    if (snakes[nextPosition] === 0) {
      finalPosition = 0;
      setMessage(`${currentPlayer} hit a snake and went back to start!`);
    } else {
      setMessage(`${currentPlayer} moved to ${finalPosition}.`);
    }

    setPositions((prev) => ({
      ...prev,
      [currentPlayer]: finalPosition,
    }));

    setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1");
  };

  return (
    <div className="game-container">
      <h1>Snake & Ludo</h1>
      <div className="board">
        {Array.from({ length: BOARD_SIZE }, (_, index) => {
          const position = BOARD_SIZE - index;
          const isSnake = snakes[position] === 0;
          const isGoal = position === BOARD_SIZE; // Goal is at position 100
          return (
            <div
              key={index}
              className={`cell ${
                positions.player1 === position ? "player1" : ""
              } ${positions.player2 === position ? "player2" : ""} ${
                isSnake ? "snake-cell" : ""
              } ${isGoal && winner ? "victory" : ""}`}
            >
              {position}
              {isSnake && !winner && (
                <div className="snake-head">
                  <span className="snake-number">{position}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="controls">
        <div className={`dice-container ${rolling ? "rolling" : ""}`}>
          <div className={`dice side-${dice}`}>
            <div className="front">{dice}</div>
            <div className="back">{dice}</div>
            <div className="top">{dice}</div>
            <div className="bottom">{dice}</div>
            <div className="left">{dice}</div>
            <div className="right">{dice}</div>
          </div>
        </div>
        <button onClick={rollDice} disabled={rolling || winner}>
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>
        <p>{message}</p>
        <p>
          Player 1 Position: {positions.player1} | Player 2 Position:{" "}
          {positions.player2}
        </p>
      </div>
    </div>
  );
};

export default App;
