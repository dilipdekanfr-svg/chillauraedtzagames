import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Ghost {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

const GhostDodge = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
    setPlayerPos({ x: 50, y: 80 });
    setGhosts([]);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isPlaying) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerPos({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    });
  }, [isPlaying]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isPlaying) return;
    e.preventDefault();
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setPlayerPos({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    });
  }, [isPlaying]);

  // Spawn ghosts
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, speedX = 0, speedY = 0;
      const speed = 0.8 + Math.random() * 0.5;
      
      switch(side) {
        case 0: // Top
          x = Math.random() * 100;
          y = -5;
          speedX = (Math.random() - 0.5) * speed;
          speedY = speed;
          break;
        case 1: // Right
          x = 105;
          y = Math.random() * 100;
          speedX = -speed;
          speedY = (Math.random() - 0.5) * speed;
          break;
        case 2: // Bottom
          x = Math.random() * 100;
          y = 105;
          speedX = (Math.random() - 0.5) * speed;
          speedY = -speed;
          break;
        case 3: // Left
          x = -5;
          y = Math.random() * 100;
          speedX = speed;
          speedY = (Math.random() - 0.5) * speed;
          break;
      }
      
      setGhosts(prev => [...prev.slice(-15), { id: nextIdRef.current++, x, y, speedX, speedY }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Move ghosts and check collision
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setGhosts(prev => {
        return prev.map(ghost => {
          const newX = ghost.x + ghost.speedX;
          const newY = ghost.y + ghost.speedY;
          
          // Check collision
          const distance = Math.sqrt(
            Math.pow(newX - playerPos.x, 2) + Math.pow(newY - playerPos.y, 2)
          );
          
          if (distance < 8) {
            setIsPlaying(false);
            setGameOver(true);
            return ghost;
          }
          
          return { ...ghost, x: newX, y: newY };
        }).filter(ghost => 
          ghost.x > -10 && ghost.x < 110 && ghost.y > -10 && ghost.y < 110
        );
      });
      
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, playerPos]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">Score: {score}</span>
        <span className="font-display text-sm text-halloween-orange">Dodge the ghosts!</span>
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full h-80 bg-gradient-to-b from-halloween-purple/30 to-halloween-orange/20 rounded-lg overflow-hidden border-2 border-halloween-purple/50 cursor-none touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20">
            {gameOver && (
              <p className="text-2xl font-display mb-4 text-halloween-orange">
                Game Over! Score: {score} 👻
              </p>
            )}
            <Button onClick={startGame} className="gradient-halloween text-foreground font-display box-glow-halloween">
              {gameOver ? "Try Again" : "Start Game"}
            </Button>
          </div>
        )}

        {/* Ghosts */}
        {ghosts.map(ghost => (
          <div
            key={ghost.id}
            className="absolute text-3xl pointer-events-none select-none animate-pulse"
            style={{
              left: `${ghost.x}%`,
              top: `${ghost.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            👻
          </div>
        ))}

        {/* Player - Pumpkin */}
        <div
          className="absolute text-3xl transition-all duration-75 ease-out pointer-events-none"
          style={{ 
            left: `${playerPos.x}%`, 
            top: `${playerPos.y}%`,
            transform: 'translate(-50%, -50%)' 
          }}
        >
          🎃
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        Move your mouse or finger to avoid the ghosts!
      </p>
    </div>
  );
};

export default GhostDodge;
