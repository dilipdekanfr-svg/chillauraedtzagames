import { useState, useEffect, useRef } from "react";

const ZombieRun = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(50);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setPlayerY(50);
    setObstacles([]);
    setGameOver(false);
  };

  const handleMove = (clientY: number) => {
    if (!gameRef.current || !isPlaying) return;
    const rect = gameRef.current.getBoundingClientRect();
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPlayerY(Math.max(10, Math.min(90, y)));
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => [...prev, {
        id: Date.now(),
        x: 100,
        y: Math.random() * 80 + 10,
        type: ["🪦", "🌳", "🦴"][Math.floor(Math.random() * 3)]
      }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(o => ({ ...o, x: o.x - 3 }));
        updated.forEach(o => {
          if (o.x < 15 && o.x > 5 && Math.abs(o.y - playerY) < 15) {
            setGameOver(true);
            setIsPlaying(false);
          }
        });
        return updated.filter(o => o.x > -10);
      });
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, playerY]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-display text-halloween-orange">Score: {score}</div>

      <div
        ref={gameRef}
        onMouseMove={(e) => handleMove(e.clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        className="relative w-full h-48 bg-gradient-to-r from-halloween-purple/20 to-background rounded-xl overflow-hidden cursor-none touch-none"
      >
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-halloween-orange mb-2">{gameOver ? `Game Over! Score: ${score}` : "Run from obstacles!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        <div
          className="absolute left-8 text-3xl transition-all duration-100"
          style={{ top: `${playerY}%`, transform: 'translateY(-50%)' }}
        >
          🧟
        </div>

        {obstacles.map(o => (
          <div
            key={o.id}
            className="absolute text-2xl"
            style={{ left: `${o.x}%`, top: `${o.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {o.type}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Move up/down to avoid obstacles!</p>
    </div>
  );
};

export default ZombieRun;
