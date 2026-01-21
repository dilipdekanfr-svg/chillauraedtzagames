import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Bird {
  id: number;
  x: number;
  hasEgg: boolean;
}

const BirdNest = () => {
  const [nestPosition, setNestPosition] = useState(50);
  const [birds, setBirds] = useState<Bird[]>([]);
  const [eggs, setEggs] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (!gameActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setNestPosition((prev) => Math.max(10, prev - 8));
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setNestPosition((prev) => Math.min(90, prev + 8));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setBirds((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 80 + 10, hasEgg: true },
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setBirds((prev) => {
        const newBirds: Bird[] = [];
        prev.forEach((bird) => {
          if (bird.hasEgg) {
            const dist = Math.abs(bird.x - nestPosition);
            if (dist < 15) {
              setEggs((e) => e + 1);
            } else {
              setMissed((m) => m + 1);
            }
          }
        });
        return prev.filter((b) => b.hasEgg).map((b) => ({ ...b, hasEgg: false }));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [gameActive, nestPosition]);

  useEffect(() => {
    if (missed >= 5) {
      setGameActive(false);
    }
  }, [missed]);

  const startGame = () => {
    setEggs(0);
    setMissed(0);
    setBirds([]);
    setNestPosition(50);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-green font-display">🥚 Eggs: {eggs}</span>
        <span className="text-spring-pink font-display">❌ Missed: {missed}/5</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-spring-sky/30 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-green/30">
        {birds.map((bird) => (
          <div
            key={bird.id}
            className="absolute text-2xl animate-float"
            style={{ left: `${bird.x}%`, top: "10%" }}
          >
            🐦{bird.hasEgg && "🥚"}
          </div>
        ))}
        
        <div
          className="absolute bottom-4 text-4xl transition-all duration-100"
          style={{ left: `${nestPosition}%`, transform: "translateX(-50%)" }}
        >
          🪹
        </div>

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🐦 Bird Nest 🪹</p>
              <p className="text-sm text-muted-foreground mb-2">Use ← → or A/D to move</p>
              {eggs > 0 && <p className="text-spring-green mb-2">Eggs Caught: {eggs}</p>}
              <Button onClick={startGame} className="bg-spring-green hover:bg-spring-green/80">
                {eggs > 0 ? "Play Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirdNest;
