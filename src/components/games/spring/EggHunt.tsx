import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Egg {
  id: number;
  x: number;
  y: number;
  color: string;
  found: boolean;
}

const EggHunt = () => {
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [found, setFound] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const eggColors = ["🥚", "🪺", "🐣", "🐤"];

  const startGame = useCallback(() => {
    const newEggs: Egg[] = [];
    for (let i = 0; i < 12; i++) {
      newEggs.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        color: eggColors[Math.floor(Math.random() * eggColors.length)],
        found: false,
      });
    }
    setEggs(newEggs);
    setFound(0);
    setTimeLeft(30);
    setGameActive(true);
  }, []);

  const findEgg = (id: number) => {
    setEggs((prev) =>
      prev.map((egg) => (egg.id === id ? { ...egg, found: true } : egg))
    );
    setFound((prev) => prev + 1);
  };

  useEffect(() => {
    if (found === 12 && gameActive) {
      setGameActive(false);
    }
  }, [found, gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Found: {found}/12</span>
        <span className="text-spring-green font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-br from-spring-pink/10 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-pink/30">
        {eggs.map((egg) => (
          <button
            key={egg.id}
            onClick={() => !egg.found && findEgg(egg.id)}
            className={`absolute text-2xl transition-all cursor-pointer ${
              egg.found ? "opacity-50 scale-75" : "hover:scale-125 animate-pulse"
            }`}
            style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
            disabled={egg.found}
          >
            {egg.color}
          </button>
        ))}
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🥚 Egg Hunt 🥚</p>
              {found > 0 && <p className="text-spring-pink mb-2">Eggs Found: {found}/12</p>}
              <Button onClick={startGame} className="bg-spring-pink hover:bg-spring-pink/80">
                {found > 0 ? "Hunt Again" : "Start Hunt"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EggHunt;
