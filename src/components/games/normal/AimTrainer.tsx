import { useState, useEffect } from "react";

const AimTrainer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(20);

  const start = () => { setIsPlaying(true); setScore(0); setTimeLeft(20); moveTarget(); };
  const moveTarget = () => setTarget({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });

  const hit = () => { setScore(s => s + 10); moveTarget(); };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => { if (timeLeft <= 1) setIsPlaying(false); setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      <div className="relative w-full h-48 bg-muted/30 rounded-xl overflow-hidden">
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              {timeLeft === 0 ? `Score: ${score} - Again?` : "Start"}
            </button>
          </div>
        ) : (
          <button onClick={hit} className="absolute w-8 h-8 bg-primary rounded-full hover:scale-110 transition"
            style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }} />
        )}
      </div>
    </div>
  );
};

export default AimTrainer;
