import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Mushroom {
  id: number;
  x: number;
  y: number;
  type: "good" | "poison";
  visible: boolean;
}

const MushroomHunt = () => {
  const [mushrooms, setMushrooms] = useState<Mushroom[]>([]);
  const [collected, setCollected] = useState(0);
  const [poisoned, setPoisoned] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const initMushrooms = () => {
    const newMushrooms: Mushroom[] = [];
    for (let i = 0; i < 15; i++) {
      newMushrooms.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        type: Math.random() > 0.3 ? "good" : "poison",
        visible: true,
      });
    }
    setMushrooms(newMushrooms);
  };

  const collectMushroom = (id: number) => {
    const mushroom = mushrooms.find((m) => m.id === id);
    if (mushroom) {
      if (mushroom.type === "good") {
        setCollected((prev) => prev + 1);
      } else {
        setPoisoned((prev) => prev + 1);
      }
      setMushrooms((prev) => prev.filter((m) => m.id !== id));
    }
  };

  useEffect(() => {
    if (poisoned >= 3) {
      setGameActive(false);
    }
  }, [poisoned]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setCollected(0);
    setPoisoned(0);
    setTimeLeft(30);
    initMushrooms();
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-brown font-display">🍄 Good: {collected}</span>
        <span className="text-autumn-red font-display">☠️ Poison: {poisoned}/3</span>
        <span className="text-autumn-orange font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-autumn-brown/20 to-autumn-gold/20 rounded-lg overflow-hidden border-2 border-autumn-brown/30">
        {mushrooms.map((mushroom) => (
          <button
            key={mushroom.id}
            onClick={() => collectMushroom(mushroom.id)}
            className="absolute text-2xl hover:scale-125 transition-transform cursor-pointer"
            style={{ left: `${mushroom.x}%`, top: `${mushroom.y}%` }}
          >
            {mushroom.type === "good" ? "🍄" : "🍄‍🟫"}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🍄 Mushroom Hunt 🍄</p>
              <p className="text-sm text-muted-foreground mb-2">Collect 🍄, avoid 🍄‍🟫!</p>
              {collected > 0 && <p className="text-autumn-brown mb-2">Mushrooms: {collected}</p>}
              <Button onClick={startGame} className="bg-autumn-brown hover:bg-autumn-brown/80">
                {collected > 0 ? "Hunt Again" : "Start Hunt"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MushroomHunt;
