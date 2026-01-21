import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Crow {
  id: number;
  x: number;
  y: number;
}

const CrowScare = () => {
  const [crows, setCrows] = useState<Crow[]>([]);
  const [scared, setScared] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setCrows((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 10 },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setCrows((prev) => {
        const remaining = prev.filter((crow) => {
          if (Math.random() < 0.1) {
            setEscaped((e) => e + 1);
            return false;
          }
          return true;
        });
        return remaining;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const scareCrow = (id: number) => {
    setCrows((prev) => prev.filter((c) => c.id !== id));
    setScared((prev) => prev + 1);
  };

  const startGame = () => {
    setCrows([]);
    setScared(0);
    setEscaped(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Scared: {scared}</span>
        <span className="text-autumn-red font-display">Escaped: {escaped}</span>
        <span className="text-autumn-brown font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-autumn-gold/20 to-autumn-brown/30 rounded-lg overflow-hidden border-2 border-autumn-orange/30">
        {/* Scarecrow */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-4xl">
          🧑‍🌾
        </div>

        {crows.map((crow) => (
          <button
            key={crow.id}
            onClick={() => scareCrow(crow.id)}
            className="absolute text-3xl hover:scale-125 transition-transform cursor-pointer animate-float"
            style={{ left: `${crow.x}%`, top: `${crow.y}%` }}
          >
            🐦‍⬛
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🧑‍🌾 Crow Scare 🐦‍⬛</p>
              <p className="text-sm text-muted-foreground mb-2">Click crows to scare them away!</p>
              {scared > 0 && <p className="text-autumn-orange mb-2">Crows Scared: {scared}</p>}
              <Button onClick={startGame} className="bg-autumn-brown hover:bg-autumn-brown/80">
                {scared > 0 ? "Scare Again" : "Start Game"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrowScare;
