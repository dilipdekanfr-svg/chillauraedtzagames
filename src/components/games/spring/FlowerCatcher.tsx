import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Flower {
  id: number;
  x: number;
  y: number;
  type: string;
}

const FlowerCatcher = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const flowerTypes = ["🌸", "🌷", "🌹", "🌻", "🌺"];

  const spawnFlower = useCallback(() => {
    const newFlower: Flower = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: 0,
      type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
    };
    setFlowers((prev) => [...prev, newFlower]);
  }, []);

  const catchFlower = (id: number) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id));
    setScore((prev) => prev + 10);
  };

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(spawnFlower, 800);
    return () => clearInterval(interval);
  }, [gameActive, spawnFlower]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setFlowers((prev) =>
        prev
          .map((f) => ({ ...f, y: f.y + 3 }))
          .filter((f) => f.y < 100)
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
    setFlowers([]);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Score: {score}</span>
        <span className="text-spring-green font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-spring-sky/20 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-pink/30">
        {flowers.map((flower) => (
          <button
            key={flower.id}
            onClick={() => catchFlower(flower.id)}
            className="absolute text-3xl transition-transform hover:scale-125 cursor-pointer"
            style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
          >
            {flower.type}
          </button>
        ))}
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🌸 Flower Catcher 🌸</p>
              {score > 0 && <p className="text-spring-pink mb-2">Final Score: {score}</p>}
              <Button onClick={startGame} className="bg-spring-pink hover:bg-spring-pink/80">
                {score > 0 ? "Play Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowerCatcher;
