import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PuddleJump = () => {
  const [position, setPosition] = useState(0);
  const [puddles, setPuddles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    const generatePuddles = () => {
      const newPuddles = [];
      for (let i = 0; i < 5; i++) {
        if (Math.random() > 0.6) {
          newPuddles.push(i);
        }
      }
      setPuddles(newPuddles);
    };

    generatePuddles();
    const interval = setInterval(generatePuddles, 3000);
    return () => clearInterval(interval);
  }, [gameActive, gameOver]);

  const jump = (targetPos: number) => {
    if (gameOver || !gameActive) return;
    
    const distance = Math.abs(targetPos - position);
    if (distance > 2) return; // Can only jump to adjacent spots

    if (puddles.includes(targetPos)) {
      setGameOver(true);
      return;
    }

    setPosition(targetPos);
    setScore((prev) => prev + 10);
  };

  const startGame = () => {
    setPosition(0);
    setPuddles([]);
    setScore(0);
    setGameOver(false);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-green font-display">Score: {score}</span>
        <span className="text-spring-sky font-display">Position: {position + 1}</span>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => jump(i)}
            disabled={!gameActive || gameOver}
            className={`w-14 h-14 rounded-lg transition-all ${
              position === i
                ? "bg-spring-green ring-4 ring-spring-yellow"
                : puddles.includes(i)
                ? "bg-spring-sky/50"
                : "bg-spring-green/30 hover:bg-spring-green/50"
            }`}
          >
            {position === i ? (
              <span className="text-2xl">🐸</span>
            ) : puddles.includes(i) ? (
              <span className="text-2xl">💧</span>
            ) : (
              <span className="text-2xl">🪨</span>
            )}
          </button>
        ))}
      </div>

      {(!gameActive || gameOver) && (
        <div className="text-center">
          {gameOver && (
            <p className="text-spring-pink mb-2">Splash! You fell in a puddle! Score: {score}</p>
          )}
          <Button onClick={startGame} className="bg-spring-green hover:bg-spring-green/80">
            {gameOver ? "Try Again" : "Start Jumping"}
          </Button>
        </div>
      )}

      {gameActive && !gameOver && (
        <p className="text-sm text-muted-foreground">Click adjacent stones to jump! Avoid puddles!</p>
      )}
    </div>
  );
};

export default PuddleJump;
