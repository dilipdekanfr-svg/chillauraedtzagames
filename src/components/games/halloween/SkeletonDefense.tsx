import { useState, useEffect } from "react";

interface Skeleton {
  id: number;
  x: number;
  hit: boolean;
}

const SkeletonDefense = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [skeletons, setSkeletons] = useState<Skeleton[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(5);
    setSkeletons([]);
    setGameOver(false);
  };

  const hitSkeleton = (id: number) => {
    setSkeletons(prev => prev.map(s => 
      s.id === id ? { ...s, hit: true } : s
    ));
    setScore(s => s + 10);
    setTimeout(() => {
      setSkeletons(prev => prev.filter(s => s.id !== id));
    }, 200);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setSkeletons(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 85 + 5,
        hit: false
      }]);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setSkeletons(prev => {
        const escaped = prev.filter(s => !s.hit);
        if (escaped.length > 5) {
          const toRemove = escaped[0];
          setLives(l => {
            if (l <= 1) {
              setGameOver(true);
              setIsPlaying(false);
              return 0;
            }
            return l - 1;
          });
          return prev.filter(s => s.id !== toRemove.id);
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-halloween-orange">Score: {score}</span>
        <span className="text-halloween-purple">Lives: {"💀".repeat(lives)}</span>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-halloween-purple/20 to-background rounded-xl overflow-hidden">
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-halloween-orange mb-2">{gameOver ? `Game Over! Score: ${score}` : "Stop the skeletons!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-halloween-purple/30 flex items-center justify-center">
          🏰 Your Castle
        </div>

        {skeletons.map(s => (
          <button
            key={s.id}
            onClick={() => hitSkeleton(s.id)}
            className={`absolute bottom-12 text-3xl transition-all duration-200 hover:scale-125 ${s.hit ? 'opacity-0 scale-150' : 'animate-bounce'}`}
            style={{ left: `${s.x}%`, transform: 'translateX(-50%)' }}
          >
            💀
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click skeletons before they reach your castle!</p>
    </div>
  );
};

export default SkeletonDefense;
