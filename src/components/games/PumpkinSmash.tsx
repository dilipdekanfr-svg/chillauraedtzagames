import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Pumpkin {
  id: number;
  x: number;
  y: number;
  isSmashed: boolean;
}

const PumpkinSmash = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [pumpkins, setPumpkins] = useState<Pumpkin[]>([]);
  const nextIdRef = useRef(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(20);
    setPumpkins([]);
  };

  const spawnPumpkin = useCallback(() => {
    const newPumpkin: Pumpkin = {
      id: nextIdRef.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      isSmashed: false
    };
    setPumpkins(prev => [...prev.slice(-8), newPumpkin]);
  }, []);

  const smashPumpkin = (id: number) => {
    setPumpkins(prev => prev.map(p => 
      p.id === id ? { ...p, isSmashed: true } : p
    ));
    setScore(s => s + 1);
    
    // Remove smashed pumpkin after animation
    setTimeout(() => {
      setPumpkins(prev => prev.filter(p => p.id !== id));
    }, 200);
  };

  // Spawn pumpkins
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(spawnPumpkin, 800);
    return () => clearInterval(interval);
  }, [isPlaying, spawnPumpkin]);

  // Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  // Auto-remove old pumpkins
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPumpkins(prev => prev.slice(-6));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">Score: {score}</span>
        <span className="font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative w-full h-80 bg-gradient-to-b from-halloween-purple/30 to-halloween-orange/20 rounded-lg overflow-hidden border-2 border-halloween-orange/50">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20">
            {timeLeft === 0 && (
              <p className="text-2xl font-display mb-4 text-halloween-orange">
                Smashed {score} pumpkins! 🎃
              </p>
            )}
            <Button onClick={startGame} className="gradient-halloween text-foreground font-display box-glow-halloween">
              {timeLeft === 0 ? "Play Again" : "Start Smashing!"}
            </Button>
          </div>
        )}

        {/* Pumpkins */}
        {pumpkins.map(pumpkin => (
          <button
            key={pumpkin.id}
            onClick={() => !pumpkin.isSmashed && smashPumpkin(pumpkin.id)}
            className={`absolute text-4xl transition-all duration-150 cursor-pointer select-none ${
              pumpkin.isSmashed 
                ? "scale-0 rotate-180 opacity-0" 
                : "hover:scale-110 animate-pulse"
            }`}
            style={{
              left: `${pumpkin.x}%`,
              top: `${pumpkin.y}%`,
              transform: pumpkin.isSmashed ? 'scale(0) rotate(180deg)' : 'translate(-50%, -50%)'
            }}
            disabled={pumpkin.isSmashed}
          >
            🎃
          </button>
        ))}

        {/* Decorative elements */}
        <div className="absolute bottom-2 left-2 text-2xl opacity-30">🕸️</div>
        <div className="absolute top-2 right-2 text-2xl opacity-30">🦇</div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        Click the pumpkins to smash them before they disappear!
      </p>
    </div>
  );
};

export default PumpkinSmash;
