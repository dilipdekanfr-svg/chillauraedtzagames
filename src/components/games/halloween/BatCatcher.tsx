import { useState, useEffect } from "react";

interface Bat {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

const BatCatcher = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [bats, setBats] = useState<Bat[]>([]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(25);
    setBats([]);
  };

  const catchBat = (id: number) => {
    setBats(prev => prev.map(b => 
      b.id === id && !b.caught ? { ...b, caught: true } : b
    ));
    setScore(s => s + 15);
    setTimeout(() => {
      setBats(prev => prev.filter(b => b.id !== id));
    }, 200);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (bats.length < 8) {
        setBats(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 85 + 5,
          y: Math.random() * 70 + 10,
          caught: false
        }]);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying, bats.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBats(prev => prev.map(b => ({
        ...b,
        x: Math.max(5, Math.min(95, b.x + (Math.random() - 0.5) * 20)),
        y: Math.max(10, Math.min(80, b.y + (Math.random() - 0.5) * 15))
      })));
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-halloween-orange">Score: {score}</span>
        <span className="text-halloween-purple">Time: {timeLeft}s</span>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-halloween-purple/30 to-background rounded-xl overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-halloween-orange mb-2">{timeLeft === 0 ? `Game Over! Score: ${score}` : "Catch the bats!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {bats.map(b => (
          <button
            key={b.id}
            onClick={() => catchBat(b.id)}
            className={`absolute text-3xl transition-all duration-300 hover:scale-125 ${b.caught ? 'scale-0 opacity-0' : ''}`}
            style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            🦇
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click bats to catch them!</p>
    </div>
  );
};

export default BatCatcher;
