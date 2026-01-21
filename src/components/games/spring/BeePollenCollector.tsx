import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

const BeePollenCollector = () => {
  const [beePos, setBeePos] = useState({ x: 50, y: 50 });
  const [flowers, setFlowers] = useState<{ x: number; y: number; hasPollen: boolean }[]>([]);
  const [pollen, setPollen] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const initFlowers = useCallback(() => {
    const newFlowers = [];
    for (let i = 0; i < 6; i++) {
      newFlowers.push({
        x: Math.random() * 70 + 15,
        y: Math.random() * 70 + 15,
        hasPollen: true,
      });
    }
    setFlowers(newFlowers);
  }, []);

  useEffect(() => {
    if (!gameActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      setBeePos((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" || e.key === "w") y = Math.max(5, y - 5);
        if (e.key === "ArrowDown" || e.key === "s") y = Math.min(95, y + 5);
        if (e.key === "ArrowLeft" || e.key === "a") x = Math.max(5, x - 5);
        if (e.key === "ArrowRight" || e.key === "d") x = Math.min(95, x + 5);
        return { x, y };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    flowers.forEach((flower, i) => {
      if (flower.hasPollen) {
        const dist = Math.sqrt((beePos.x - flower.x) ** 2 + (beePos.y - flower.y) ** 2);
        if (dist < 10) {
          setFlowers((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, hasPollen: false } : f))
          );
          setPollen((prev) => prev + 10);
        }
      }
    });
  }, [beePos, flowers, gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setFlowers((prev) =>
        prev.map((f) => (!f.hasPollen && Math.random() < 0.1 ? { ...f, hasPollen: true } : f))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setPollen(0);
    setBeePos({ x: 50, y: 50 });
    setTimeLeft(30);
    initFlowers();
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-yellow font-display">🍯 Pollen: {pollen}</span>
        <span className="text-spring-green font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-br from-spring-sky/20 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-yellow/30">
        {gameActive && (
          <>
            {flowers.map((flower, i) => (
              <div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
              >
                {flower.hasPollen ? "🌻" : "🥀"}
              </div>
            ))}
            <div
              className="absolute text-3xl transition-all duration-100"
              style={{ left: `${beePos.x}%`, top: `${beePos.y}%`, transform: "translate(-50%, -50%)" }}
            >
              🐝
            </div>
          </>
        )}
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🐝 Bee Pollen Collector 🐝</p>
              <p className="text-sm text-muted-foreground mb-2">Use arrow keys or WASD to move</p>
              {pollen > 0 && <p className="text-spring-yellow mb-2">Pollen Collected: {pollen}</p>}
              <Button onClick={startGame} className="bg-spring-yellow text-background hover:bg-spring-yellow/80">
                {pollen > 0 ? "Play Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeePollenCollector;
