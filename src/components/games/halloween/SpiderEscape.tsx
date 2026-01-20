import { useState, useEffect, useRef } from "react";

const SpiderEscape = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [spiderPos, setSpiderPos] = useState({ x: 50, y: 90 });
  const [webs, setWebs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setSpiderPos({ x: 50, y: 90 });
    setWebs([]);
    setGameOver(false);
  };

  const handleMove = (clientX: number) => {
    if (!gameRef.current || !isPlaying) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSpiderPos(prev => ({ ...prev, x: Math.max(5, Math.min(95, x)) }));
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setWebs(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        y: 0
      }]);
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setWebs(prev => {
        const updated = prev.map(w => ({ ...w, y: w.y + 2 }));
        updated.forEach(w => {
          if (w.y > 80 && w.y < 95 && Math.abs(w.x - spiderPos.x) < 12) {
            setGameOver(true);
            setIsPlaying(false);
          }
        });
        return updated.filter(w => w.y < 100);
      });
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, spiderPos.x]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-display text-halloween-orange">Score: {score}</div>

      <div
        ref={gameRef}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        className="relative w-full h-64 bg-gradient-to-b from-halloween-purple/30 to-background rounded-xl overflow-hidden cursor-none touch-none"
      >
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-halloween-orange mb-2">{gameOver ? `Game Over! Score: ${score}` : "Avoid the webs!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {webs.map(w => (
          <div
            key={w.id}
            className="absolute text-2xl"
            style={{ left: `${w.x}%`, top: `${w.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            🕸️
          </div>
        ))}

        <div
          className="absolute text-3xl transition-none"
          style={{ left: `${spiderPos.x}%`, top: `${spiderPos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          🕷️
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">Move spider to avoid webs!</p>
    </div>
  );
};

export default SpiderEscape;
