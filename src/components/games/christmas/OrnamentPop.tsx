import { useState, useEffect } from "react";

interface Ornament {
  id: number;
  x: number;
  y: number;
  emoji: string;
  popped: boolean;
}

const ORNAMENTS = ["🔴", "🟢", "🔵", "🟡", "⭐"];

const OrnamentPop = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(20);
    setOrnaments([]);
  };

  const popOrnament = (id: number) => {
    setOrnaments(prev => prev.map(o => 
      o.id === id && !o.popped ? { ...o, popped: true } : o
    ));
    setScore(s => s + 5);
    setTimeout(() => {
      setOrnaments(prev => prev.filter(o => o.id !== id));
    }, 200);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (ornaments.length < 12) {
        setOrnaments(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 10,
          emoji: ORNAMENTS[Math.floor(Math.random() * ORNAMENTS.length)],
          popped: false
        }]);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying, ornaments.length]);

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
        <span className="text-christmas-green">Score: {score}</span>
        <span className="text-christmas-red">Time: {timeLeft}s</span>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-christmas-red/20 to-christmas-green/20 rounded-xl overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-christmas-red mb-2">{timeLeft === 0 ? `Game Over! Score: ${score}` : "Pop the ornaments!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {ornaments.map(o => (
          <button
            key={o.id}
            onClick={() => popOrnament(o.id)}
            className={`absolute text-3xl transition-all duration-200 hover:scale-125 ${o.popped ? 'scale-150 opacity-0' : ''}`}
            style={{ left: `${o.x}%`, top: `${o.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {o.emoji}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click ornaments to pop them!</p>
    </div>
  );
};

export default OrnamentPop;
