import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  x: number;
  y: number;
  type: string;
  found: boolean;
}

const FoggyForest = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [found, setFound] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [fogPosition, setFogPosition] = useState({ x: 50, y: 50 });

  const itemTypes = ["🍄", "🌰", "🍂", "🦔", "🦉", "🐿️"];

  const initItems = () => {
    const newItems: Item[] = [];
    for (let i = 0; i < 8; i++) {
      newItems.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
        found: false,
      });
    }
    setItems(newItems);
  };

  useEffect(() => {
    if (!gameActive) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("forest")?.getBoundingClientRect();
      if (rect) {
        setFogPosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [gameActive]);

  const findItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, found: true } : item))
    );
    setFound((prev) => prev + 1);
  };

  useEffect(() => {
    if (found === 8 && gameActive) {
      setGameActive(false);
    }
  }, [found, gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setFound(0);
    setTimeLeft(45);
    initItems();
    setGameActive(true);
  };

  const isVisible = (x: number, y: number) => {
    const dist = Math.sqrt((x - fogPosition.x) ** 2 + (y - fogPosition.y) ** 2);
    return dist < 20;
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-brown font-display">Found: {found}/8</span>
        <span className="text-autumn-orange font-display">Time: {timeLeft}s</span>
      </div>

      <div
        id="forest"
        className="relative h-64 bg-gradient-to-b from-autumn-brown/40 to-autumn-gold/20 rounded-lg overflow-hidden border-2 border-autumn-brown/30"
      >
        {/* Fog overlay */}
        <div
          className="absolute inset-0 bg-gray-800/80 pointer-events-none"
          style={{
            maskImage: gameActive
              ? `radial-gradient(circle 60px at ${fogPosition.x}% ${fogPosition.y}%, transparent 0%, black 100%)`
              : "none",
            WebkitMaskImage: gameActive
              ? `radial-gradient(circle 60px at ${fogPosition.x}% ${fogPosition.y}%, transparent 0%, black 100%)`
              : "none",
          }}
        />

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.found && isVisible(item.x, item.y) && findItem(item.id)}
            className={`absolute text-2xl transition-transform cursor-pointer ${
              item.found ? "opacity-50 scale-75" : "hover:scale-125"
            }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            disabled={item.found}
          >
            {item.type}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🌫️ Foggy Forest 🌫️</p>
              <p className="text-sm text-muted-foreground mb-2">Move mouse to clear fog and find items!</p>
              {found > 0 && <p className="text-autumn-brown mb-2">Items Found: {found}/8</p>}
              <Button onClick={startGame} className="bg-autumn-brown hover:bg-autumn-brown/80">
                {found > 0 ? "Explore Again" : "Enter Forest"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoggyForest;
