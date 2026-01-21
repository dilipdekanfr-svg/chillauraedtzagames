import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ButterflyChase = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const moveButterfly = () => {
    setPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  };

  const catchButterfly = () => {
    setScore((prev) => prev + 1);
    moveButterfly();
  };

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(moveButterfly, 1500);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameActive(true);
    moveButterfly();
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Caught: {score}</span>
        <span className="text-spring-green font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-br from-spring-green/20 to-spring-sky/20 rounded-lg overflow-hidden border-2 border-spring-green/30">
        {gameActive && (
          <button
            onClick={catchButterfly}
            className="absolute text-4xl transition-all duration-300 hover:scale-125 cursor-pointer animate-float"
            style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
          >
            🦋
          </button>
        )}
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🦋 Butterfly Chase 🦋</p>
              {score > 0 && <p className="text-spring-green mb-2">Butterflies Caught: {score}</p>}
              <Button onClick={startGame} className="bg-spring-green hover:bg-spring-green/80">
                {score > 0 ? "Play Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButterflyChase;
