import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface GameTemplateProps {
  title: string;
  emoji: string;
  gameType: "clicker" | "catcher" | "memory" | "reaction" | "quiz" | "dodge" | "sort" | "match" | "runner" | "shooter";
  themeColor: string;
  items?: string[];
  targetScore?: number;
}

const GameTemplate = ({ title, emoji, gameType, themeColor, items = [], targetScore = 10 }: GameTemplateProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [message, setMessage] = useState("");

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setMessage("");
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const moveInterval = setInterval(() => {
      setPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      });
    }, 1000 + Math.random() * 500);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  const handleClick = () => {
    if (!isPlaying) return;
    setScore((prev) => prev + 1);
    setMessage(items[Math.floor(Math.random() * items.length)] || "+1!");
    setTimeout(() => setMessage(""), 500);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-md text-lg font-display">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      {!isPlaying && !gameOver && (
        <Button onClick={startGame} className={`font-display ${themeColor}`}>
          Start {title}
        </Button>
      )}

      {isPlaying && (
        <div 
          className="relative w-full h-64 bg-muted/30 rounded-xl overflow-hidden cursor-crosshair"
          onClick={handleClick}
        >
          <div
            className="absolute text-4xl transition-all duration-200 hover:scale-125 cursor-pointer"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            {emoji}
          </div>
          {message && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold animate-ping">
              {message}
            </div>
          )}
        </div>
      )}

      {gameOver && (
        <div className="text-center">
          <p className="text-2xl font-display mb-4">
            {score >= targetScore ? "🎉 Amazing!" : "Good try!"}
          </p>
          <p className="text-lg mb-4">Final Score: {score}</p>
          <Button onClick={startGame} className={`font-display ${themeColor}`}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameTemplate;
