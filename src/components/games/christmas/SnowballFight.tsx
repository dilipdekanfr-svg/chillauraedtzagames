import { useState, useEffect } from "react";

interface Target {
  id: number;
  x: number;
  y: number;
  hit: boolean;
}

const SnowballFight = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [targets, setTargets] = useState<Target[]>([]);
  const [snowballs, setSnowballs] = useState(20);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(25);
    setTargets([]);
    setSnowballs(20);
  };

  const throwSnowball = (id: number) => {
    if (snowballs <= 0) return;
    
    setSnowballs(s => s - 1);
    setTargets(prev => prev.map(t => 
      t.id === id ? { ...t, hit: true } : t
    ));
    setScore(s => s + 10);
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 200);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (targets.length < 6) {
        setTargets(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          hit: false
        }]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying, targets.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTargets(prev => prev.filter(t => !t.hit).slice(-8));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1 || snowballs <= 0) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, snowballs]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display text-sm">
        <span className="text-christmas-green">Score: {score}</span>
        <span className="text-muted-foreground">❄️ {snowballs}</span>
        <span className="text-christmas-red">Time: {timeLeft}s</span>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-blue-200/20 to-white/20 rounded-xl overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-christmas-red mb-2">
              {timeLeft === 0 || snowballs === 0 ? `Game Over! Score: ${score}` : "Hit the snowmen!"}
            </p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {targets.map(t => (
          <button
            key={t.id}
            onClick={() => throwSnowball(t.id)}
            className={`absolute text-4xl transition-all duration-200 hover:scale-110 ${t.hit ? 'opacity-0 scale-150' : ''}`}
            style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            ⛄
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click snowmen to throw snowballs!</p>
    </div>
  );
};

export default SnowballFight;
