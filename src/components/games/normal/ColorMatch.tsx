import { useState, useEffect } from "react";

const ColorMatch = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState({ word: "RED", color: "text-red-500" });
  const [timeLeft, setTimeLeft] = useState(30);
  const colors = [
    { word: "RED", color: "text-red-500" },
    { word: "BLUE", color: "text-blue-500" },
    { word: "GREEN", color: "text-green-500" },
    { word: "YELLOW", color: "text-yellow-500" },
  ];

  const newRound = () => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setCurrent({ word: word.word, color: color.color });
  };

  const handleAnswer = (matches: boolean) => {
    const actualMatch = current.word === current.color.split("-")[1].toUpperCase().replace("500", "");
    if (matches === actualMatch) setScore(s => s + 10);
    newRound();
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => { setIsPlaying(true); setScore(0); setTimeLeft(30); newRound(); };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      {!isPlaying ? (
        <button onClick={startGame} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          {timeLeft === 0 ? "Play Again" : "Start Game"}
        </button>
      ) : (
        <>
          <div className={`text-4xl font-bold mb-6 ${current.color}`}>{current.word}</div>
          <p className="text-sm mb-4">Does the word match the color?</p>
          <div className="flex gap-4">
            <button onClick={() => handleAnswer(true)} className="px-6 py-3 bg-green-500 rounded-lg">Yes</button>
            <button onClick={() => handleAnswer(false)} className="px-6 py-3 bg-red-500 rounded-lg">No</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorMatch;
