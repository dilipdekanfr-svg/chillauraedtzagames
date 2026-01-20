import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const SnowflakeCatcher = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [catcherX, setCatcherX] = useState(50);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setSnowflakes([]);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isPlaying) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setCatcherX(Math.max(5, Math.min(95, x)));
  }, [isPlaying]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isPlaying) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setCatcherX(Math.max(5, Math.min(95, x)));
  }, [isPlaying]);

  // Spawn snowflakes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSnowflakes(prev => [
        ...prev,
        {
          id: nextIdRef.current++,
          x: Math.random() * 90 + 5,
          y: 0,
          size: Math.random() * 15 + 15,
          speed: Math.random() * 1.5 + 1
        }
      ]);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Move snowflakes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const newFlakes: Snowflake[] = [];
        prev.forEach(flake => {
          const newY = flake.y + flake.speed;
          
          // Check if caught
          if (newY >= 85 && newY <= 95 && Math.abs(flake.x - catcherX) < 10) {
            setScore(s => s + 1);
            return; // Don't add back - caught!
          }
          
          // Remove if off screen
          if (newY > 100) return;
          
          newFlakes.push({ ...flake, y: newY });
        });
        return newFlakes;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, catcherX]);

  // Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">Score: {score}</span>
        <span className="font-display">Time: {timeLeft}s</span>
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full h-80 bg-gradient-to-b from-christmas-green/20 to-christmas-red/20 rounded-lg overflow-hidden border-2 border-christmas-green/50 cursor-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20">
            {timeLeft === 0 && (
              <p className="text-2xl font-display mb-4 text-christmas-red">
                Final Score: {score}! 🎄
              </p>
            )}
            <Button onClick={startGame} className="gradient-christmas text-foreground font-display box-glow-christmas">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </Button>
          </div>
        )}

        {/* Snowflakes */}
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute text-foreground pointer-events-none select-none"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            ❄️
          </div>
        ))}

        {/* Catcher basket */}
        <div
          className="absolute bottom-2 text-4xl transition-all duration-75 ease-out pointer-events-none"
          style={{ left: `${catcherX}%`, transform: 'translateX(-50%)' }}
        >
          🧺
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        Move your mouse or finger to catch snowflakes!
      </p>
    </div>
  );
};

export default SnowflakeCatcher;
