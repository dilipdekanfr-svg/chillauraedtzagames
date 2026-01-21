import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Crop {
  id: number;
  type: number;
  x: number;
}

const HarvestSort = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [targetType, setTargetType] = useState(0);

  const cropTypes = ["🎃", "🌽", "🥕", "🍠"];

  const spawnCrop = () => {
    setCrops((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: Math.floor(Math.random() * 4),
        x: Math.random() * 80 + 10,
      },
    ]);
  };

  const sortCrop = (id: number, type: number) => {
    if (type === targetType) {
      setScore((prev) => prev + 10);
    } else {
      setWrong((prev) => prev + 1);
    }
    setCrops((prev) => prev.filter((c) => c.id !== id));
    setTargetType(Math.floor(Math.random() * 4));
  };

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(spawnCrop, 1200);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (wrong >= 5) {
      setGameActive(false);
    }
  }, [wrong]);

  const startGame = () => {
    setCrops([]);
    setScore(0);
    setWrong(0);
    setTargetType(Math.floor(Math.random() * 4));
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Score: {score}</span>
        <span className="text-autumn-red font-display">Wrong: {wrong}/5</span>
      </div>

      <div className="mb-4 p-3 bg-autumn-gold/20 rounded-lg border-2 border-autumn-orange/30">
        <p className="text-sm text-muted-foreground">Harvest only:</p>
        <span className="text-4xl">{cropTypes[targetType]}</span>
      </div>

      <div className="relative h-48 bg-gradient-to-b from-autumn-gold/10 to-autumn-brown/20 rounded-lg overflow-hidden border-2 border-autumn-orange/30">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => sortCrop(crop.id, crop.type)}
            className="absolute text-3xl hover:scale-125 transition-transform cursor-pointer animate-float"
            style={{ left: `${crop.x}%`, top: "40%" }}
          >
            {cropTypes[crop.type]}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🌾 Harvest Sort 🌾</p>
              {score > 0 && <p className="text-autumn-orange mb-2">Final Score: {score}</p>}
              <Button onClick={startGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
                {score > 0 ? "Play Again" : "Start Harvesting"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestSort;
