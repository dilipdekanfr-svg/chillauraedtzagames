import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  type: string;
  speed: number;
}

const WindyDay = () => {
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const itemTypes = ["🧣", "🎩", "📰", "🍂", "☂️"];

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: -10,
          y: Math.random() * 70 + 15,
          type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
          speed: Math.random() * 2 + 2,
        },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setItems((prev) => {
        const remaining = prev
          .map((item) => ({ ...item, x: item.x + item.speed }))
          .filter((item) => {
            if (item.x > 100) {
              setMissed((m) => m + 1);
              return false;
            }
            return true;
          });
        return remaining;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const catchItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCaught((prev) => prev + 1);
  };

  const startGame = () => {
    setItems([]);
    setCaught(0);
    setMissed(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Caught: {caught}</span>
        <span className="text-autumn-red font-display">Missed: {missed}</span>
        <span className="text-autumn-brown font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-r from-autumn-gold/20 to-autumn-brown/20 rounded-lg overflow-hidden border-2 border-autumn-orange/30">
        {/* Wind effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white animate-pulse"
              style={{
                top: `${20 + i * 15}%`,
                left: 0,
                right: 0,
              }}
            />
          ))}
        </div>

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => catchItem(item.id)}
            className="absolute text-3xl hover:scale-125 transition-transform cursor-pointer"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.x * 3}deg)`,
            }}
          >
            {item.type}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">💨 Windy Day 💨</p>
              <p className="text-sm text-muted-foreground mb-2">Catch flying items before they blow away!</p>
              {caught > 0 && <p className="text-autumn-orange mb-2">Items Caught: {caught}</p>}
              <Button onClick={startGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
                {caught > 0 ? "Try Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindyDay;
