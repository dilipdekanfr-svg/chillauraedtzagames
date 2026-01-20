import { useState, useEffect } from "react";

const NumberMemory = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [number, setNumber] = useState("");
  const [input, setInput] = useState("");
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<"show" | "input">("show");
  const [score, setScore] = useState(0);

  const startGame = () => { setIsPlaying(true); setLevel(1); setScore(0); generateNumber(1); };

  const generateNumber = (len: number) => {
    const num = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
    setNumber(num);
    setPhase("show");
    setInput("");
    setTimeout(() => setPhase("input"), 2000);
  };

  const checkAnswer = () => {
    if (input === number) {
      setScore(s => s + level * 10);
      setLevel(l => l + 1);
      generateNumber(level + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Level: {level}</span>
        <span className="text-muted-foreground">Score: {score}</span>
      </div>
      {!isPlaying ? (
        <div className="text-center">
          <p className="mb-2">{score > 0 ? `Game Over! Score: ${score}` : "Remember the numbers!"}</p>
          <button onClick={startGame} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Start</button>
        </div>
      ) : phase === "show" ? (
        <div className="text-4xl font-mono font-bold text-primary">{number}</div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-2xl text-center w-32 p-2 bg-muted rounded-lg"
            autoFocus
          />
          <button onClick={checkAnswer} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Submit</button>
        </div>
      )}
    </div>
  );
};

export default NumberMemory;
