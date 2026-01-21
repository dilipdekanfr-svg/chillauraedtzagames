import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Leaf {
  id: number;
  x: number;
  y: number;
  type: string;
  speed: number;
}

const LeafCatcher = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const leafTypes = ["🍂", "🍁", "🍃", "🌾"];

  const spawnLeaf = useCallback(() => {
    const newLeaf: Leaf = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: 0,
      type: leafTypes[Math.floor(Math.random() * leafTypes.length)],
      speed: Math.random() * 2 + 1,
    };
    setLeaves((prev) => [...prev, newLeaf]);
  }, []);

  const catchLeaf = (id: number) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
    setScore((prev) => prev + 10);
  };

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(spawnLeaf, 600);
    return () => clearInterval(interval);
  }, [gameActive, spawnLeaf]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setLeaves((prev) =>
        prev
          .map((l) => ({ ...l, y: l.y + l.speed, x: l.x + Math.sin(l.y / 10) * 0.5 }))
          .filter((l) => l.y < 100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setLeaves([]);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Score: {score}</span>
        <span className="text-autumn-brown font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-autumn-gold/20 to-autumn-brown/20 rounded-lg overflow-hidden border-2 border-autumn-orange/30">
        {leaves.map((leaf) => (
          <button
            key={leaf.id}
            onClick={() => catchLeaf(leaf.id)}
            className="absolute text-3xl transition-transform hover:scale-125 cursor-pointer"
            style={{ left: `${leaf.x}%`, top: `${leaf.y}%` }}
          >
            {leaf.type}
          </button>
        ))}
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🍂 Leaf Catcher 🍂</p>
              {score > 0 && <p className="text-autumn-orange mb-2">Final Score: {score}</p>}
              <Button onClick={startGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
                {score > 0 ? "Play Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafCatcher;
