import { useState, useEffect, useCallback } from "react";

interface Obstacle {
  id: number;
  x: number;
  type: string;
}

const SantaRun = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setObstacles([]);
    setGameOver(false);
    setIsJumping(false);
  };

  const jump = useCallback(() => {
    if (!isJumping && isPlaying) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => [...prev, {
        id: Date.now(),
        x: 100,
        type: ["🎄", "⛄", "🦌"][Math.floor(Math.random() * 3)]
      }]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(o => ({ ...o, x: o.x - 3 }));
        updated.forEach(o => {
          if (o.x < 20 && o.x > 10 && !isJumping) {
            setGameOver(true);
            setIsPlaying(false);
          }
        });
        return updated.filter(o => o.x > -10);
      });
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, isJumping]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-display text-christmas-green">Score: {score}</div>

      <div 
        onClick={jump}
        onTouchStart={jump}
        className="relative w-full h-48 bg-gradient-to-b from-blue-900/30 to-christmas-green/20 rounded-xl overflow-hidden cursor-pointer"
      >
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-christmas-red mb-2">{gameOver ? `Game Over! Score: ${score}` : "Help Santa run!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-red text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        <div 
          className={`absolute left-12 text-4xl transition-all duration-300 ${isJumping ? 'bottom-20' : 'bottom-4'}`}
        >
          🎅
        </div>

        {obstacles.map(o => (
          <div
            key={o.id}
            className="absolute bottom-4 text-3xl"
            style={{ left: `${o.x}%` }}
          >
            {o.type}
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/30" />
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click/Tap or Space to jump</p>
    </div>
  );
};

export default SantaRun;
