import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Plant {
  id: number;
  stage: number;
  type: number;
}

const GardenGrow = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [water, setWater] = useState(100);
  const [score, setScore] = useState(0);

  const plantTypes = [
    ["🌱", "🌿", "🌸"],
    ["🌱", "🌿", "🌷"],
    ["🌱", "🌿", "🌻"],
  ];

  const plantSeed = (index: number) => {
    if (plants.find((p) => p.id === index) || water < 10) return;
    setPlants((prev) => [...prev, { id: index, stage: 0, type: Math.floor(Math.random() * 3) }]);
    setWater((prev) => prev - 10);
  };

  const waterPlant = (id: number) => {
    if (water < 5) return;
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === id && p.stage < 2) {
          setWater((w) => w - 5);
          if (p.stage === 1) setScore((s) => s + 10);
          return { ...p, stage: p.stage + 1 };
        }
        return p;
      })
    );
  };

  const harvestPlant = (id: number) => {
    const plant = plants.find((p) => p.id === id);
    if (plant && plant.stage === 2) {
      setScore((prev) => prev + 25);
      setPlants((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const resetGame = () => {
    setPlants([]);
    setWater(100);
    setScore(0);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Score: {score}</span>
        <span className="text-spring-sky font-display">💧 Water: {water}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[...Array(8)].map((_, i) => {
          const plant = plants.find((p) => p.id === i);
          return (
            <button
              key={i}
              onClick={() => {
                if (!plant) plantSeed(i);
                else if (plant.stage < 2) waterPlant(i);
                else harvestPlant(i);
              }}
              className="h-16 bg-spring-green/20 rounded-lg border-2 border-spring-green/30 flex items-center justify-center text-2xl hover:bg-spring-green/30 transition-colors"
            >
              {plant ? plantTypes[plant.type][plant.stage] : "🕳️"}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Click empty spot to plant (10💧) • Click seedling to water (5💧) • Click flower to harvest
      </div>

      <Button onClick={resetGame} variant="outline" className="border-spring-pink text-spring-pink">
        Reset Garden
      </Button>
    </div>
  );
};

export default GardenGrow;
