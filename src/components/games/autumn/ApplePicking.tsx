import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Apple {
  id: number;
  x: number;
  y: number;
  ripe: boolean;
}

const ApplePicking = () => {
  const [apples, setApples] = useState<Apple[]>([]);
  const [basket, setBasket] = useState(0);
  const [rotten, setRotten] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const initApples = () => {
    const newApples: Apple[] = [];
    for (let i = 0; i < 12; i++) {
      newApples.push({
        id: i,
        x: (i % 4) * 25 + 10,
        y: Math.floor(i / 4) * 30 + 10,
        ripe: Math.random() > 0.3,
      });
    }
    setApples(newApples);
  };

  const pickApple = (id: number) => {
    const apple = apples.find((a) => a.id === id);
    if (apple) {
      if (apple.ripe) {
        setBasket((prev) => prev + 1);
      } else {
        setRotten((prev) => prev + 1);
      }
      setApples((prev) => prev.filter((a) => a.id !== id));
    }
  };

  useEffect(() => {
    if (apples.length === 0 && gameActive) {
      setGameActive(false);
    }
  }, [apples, gameActive]);

  useEffect(() => {
    if (rotten >= 3) {
      setGameActive(false);
    }
  }, [rotten]);

  const startGame = () => {
    setBasket(0);
    setRotten(0);
    initApples();
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-red font-display">🧺 Basket: {basket}</span>
        <span className="text-autumn-brown font-display">🤢 Rotten: {rotten}/3</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-autumn-gold/10 to-autumn-brown/20 rounded-lg overflow-hidden border-2 border-autumn-red/30">
        {apples.map((apple) => (
          <button
            key={apple.id}
            onClick={() => pickApple(apple.id)}
            className="absolute text-3xl hover:scale-125 transition-transform cursor-pointer"
            style={{ left: `${apple.x}%`, top: `${apple.y}%` }}
          >
            {apple.ripe ? "🍎" : "🍏"}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🍎 Apple Picking 🍎</p>
              <p className="text-sm text-muted-foreground mb-2">Pick red apples, avoid green ones!</p>
              {basket > 0 && <p className="text-autumn-red mb-2">Apples Picked: {basket}</p>}
              <Button onClick={startGame} className="bg-autumn-red hover:bg-autumn-red/80">
                {basket > 0 ? "Pick Again" : "Start Picking"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplePicking;
