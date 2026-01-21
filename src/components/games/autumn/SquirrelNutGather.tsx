import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SquirrelNutGather = () => {
  const [squirrelPos, setSquirrelPos] = useState(50);
  const [nuts, setNuts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [collected, setCollected] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!gameActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setSquirrelPos((prev) => Math.max(5, prev - 5));
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setSquirrelPos((prev) => Math.min(95, prev + 5));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setNuts((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 80 + 10, y: 0 },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setNuts((prev) => {
        const remaining = prev
          .map((n) => ({ ...n, y: n.y + 3 }))
          .filter((n) => {
            if (n.y > 85 && n.y < 100 && Math.abs(n.x - squirrelPos) < 10) {
              setCollected((c) => c + 1);
              return false;
            }
            return n.y < 100;
          });
        return remaining;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameActive, squirrelPos]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setCollected(0);
    setNuts([]);
    setTimeLeft(30);
    setSquirrelPos(50);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">🌰 Nuts: {collected}</span>
        <span className="text-autumn-brown font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-autumn-gold/20 to-autumn-brown/30 rounded-lg overflow-hidden border-2 border-autumn-brown/30">
        {nuts.map((nut) => (
          <div
            key={nut.id}
            className="absolute text-2xl"
            style={{ left: `${nut.x}%`, top: `${nut.y}%` }}
          >
            🌰
          </div>
        ))}
        
        <div
          className="absolute bottom-2 text-4xl transition-all duration-100"
          style={{ left: `${squirrelPos}%`, transform: "translateX(-50%)" }}
        >
          🐿️
        </div>

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🐿️ Squirrel Nut Gather 🌰</p>
              <p className="text-sm text-muted-foreground mb-2">Use ← → or A/D to move</p>
              {collected > 0 && <p className="text-autumn-orange mb-2">Nuts Collected: {collected}</p>}
              <Button onClick={startGame} className="bg-autumn-brown hover:bg-autumn-brown/80">
                {collected > 0 ? "Gather Again" : "Start Gathering"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquirrelNutGather;
