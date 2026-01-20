import { useState, useEffect } from "react";

interface Candy {
  id: number;
  x: number;
  y: number;
  emoji: string;
  collected: boolean;
}

const CANDIES = ["🍬", "🍭", "🍫", "🍪", "🧁"];

const CandyCollector = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [candies, setCandies] = useState<Candy[]>([]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCandies([]);
  };

  const collectCandy = (id: number) => {
    setCandies(prev => prev.map(c => 
      c.id === id && !c.collected ? { ...c, collected: true } : c
    ));
    setScore(s => s + 5);
    setTimeout(() => {
      setCandies(prev => prev.filter(c => c.id !== id));
    }, 150);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (candies.length < 15) {
        setCandies(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 85 + 5,
          y: Math.random() * 75 + 10,
          emoji: CANDIES[Math.floor(Math.random() * CANDIES.length)],
          collected: false
        }]);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, candies.length]);

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

      <div className="relative w-full h-64 bg-gradient-to-b from-halloween-purple/20 to-halloween-orange/20 rounded-xl overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-halloween-orange mb-2">{timeLeft === 0 ? `Game Over! Score: ${score}` : "Collect all the candy!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {candies.map(c => (
          <button
            key={c.id}
            onClick={() => collectCandy(c.id)}
            className={`absolute text-2xl transition-all duration-150 hover:scale-125 ${c.collected ? 'scale-150 opacity-0' : ''}`}
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {c.emoji}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click candy to collect!</p>
    </div>
  );
};

export default CandyCollector;
