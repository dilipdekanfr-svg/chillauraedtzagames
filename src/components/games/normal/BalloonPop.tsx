import { useState, useEffect } from "react";

const BalloonPop = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [balloons, setBalloons] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const colors = ["🎈", "🔴", "🟢", "🔵", "🟡"];

  const start = () => { setIsPlaying(true); setScore(0); setTimeLeft(25); setBalloons([]); };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBalloons(prev => [...prev.slice(-12), {
        id: Date.now(), x: Math.random() * 85 + 5, y: 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }]);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBalloons(prev => prev.map(b => ({ ...b, y: b.y - 2 })).filter(b => b.y > -10));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => { if (timeLeft <= 1) setIsPlaying(false); setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const pop = (id: number) => { setScore(s => s + 5); setBalloons(prev => prev.filter(b => b.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      <div className="relative w-full h-48 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-xl overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              {timeLeft === 0 ? `Score: ${score} - Again?` : "Start"}
            </button>
          </div>
        )}
        {balloons.map(b => (
          <button key={b.id} onClick={() => pop(b.id)} className="absolute text-2xl hover:scale-125 transition"
            style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}>{b.color}</button>
        ))}
      </div>
    </div>
  );
};

export default BalloonPop;
