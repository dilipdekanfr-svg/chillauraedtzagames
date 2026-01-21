import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Seed {
  id: number;
  type: number;
  x: number;
}

const SeedSort = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(0);

  const seedTypes = ["🌻", "🌸", "🌺", "🌷"];

  const spawnSeed = () => {
    setSeeds((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: Math.floor(Math.random() * 4),
        x: Math.random() * 80 + 10,
      },
    ]);
  };

  const sortSeed = (id: number, type: number) => {
    if (type === currentTarget) {
      setScore((prev) => prev + 10);
    } else {
      setWrong((prev) => prev + 1);
    }
    setSeeds((prev) => prev.filter((s) => s.id !== id));
    setCurrentTarget(Math.floor(Math.random() * 4));
  };

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(spawnSeed, 1500);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (wrong >= 5) {
      setGameActive(false);
    }
  }, [wrong]);

  const startGame = () => {
    setSeeds([]);
    setScore(0);
    setWrong(0);
    setCurrentTarget(Math.floor(Math.random() * 4));
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-green font-display">Score: {score}</span>
        <span className="text-spring-pink font-display">Wrong: {wrong}/5</span>
      </div>

      <div className="mb-4 p-3 bg-spring-green/20 rounded-lg border-2 border-spring-green/30">
        <p className="text-sm text-muted-foreground">Click only:</p>
        <span className="text-4xl">{seedTypes[currentTarget]}</span>
      </div>

      <div className="relative h-48 bg-gradient-to-b from-spring-sky/10 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-pink/30">
        {seeds.map((seed) => (
          <button
            key={seed.id}
            onClick={() => sortSeed(seed.id, seed.type)}
            className="absolute text-3xl hover:scale-125 transition-transform cursor-pointer animate-float"
            style={{ left: `${seed.x}%`, top: "30%" }}
          >
            {seedTypes[seed.type]}
          </button>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🌱 Seed Sort 🌱</p>
              {score > 0 && <p className="text-spring-green mb-2">Final Score: {score}</p>}
              <Button onClick={startGame} className="bg-spring-pink hover:bg-spring-pink/80">
                {score > 0 ? "Play Again" : "Start Sorting"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedSort;
