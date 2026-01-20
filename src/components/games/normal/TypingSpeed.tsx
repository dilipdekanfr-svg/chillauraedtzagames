import { useState, useEffect } from "react";

const TypingSpeed = () => {
  const words = ["apple", "banana", "orange", "grape", "mango", "peach", "cherry", "lemon"];
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const startGame = () => { setIsPlaying(true); setScore(0); setTimeLeft(30); newWord(); };
  const newWord = () => { setCurrent(words[Math.floor(Math.random() * words.length)]); setInput(""); };

  useEffect(() => {
    if (input.toLowerCase() === current.toLowerCase() && isPlaying) {
      setScore(s => s + 10);
      newWord();
    }
  }, [input, current, isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      {!isPlaying ? (
        <button onClick={startGame} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          {timeLeft === 0 ? `Score: ${score} - Again?` : "Start"}
        </button>
      ) : (
        <>
          <div className="text-3xl font-mono mb-4">{current}</div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-xl text-center w-40 p-2 bg-muted rounded-lg"
            autoFocus
          />
        </>
      )}
    </div>
  );
};

export default TypingSpeed;
