import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const KiteFlying = () => {
  const [height, setHeight] = useState(20);
  const [wind, setWind] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setWind(Math.random() * 10 - 5);
    }, 2000);
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setHeight((prev) => {
        const newHeight = prev + wind * 0.5;
        if (newHeight < 0 || newHeight > 100) {
          setGameActive(false);
          return prev;
        }
        if (newHeight > 50 && newHeight < 80) {
          setScore((s) => s + 1);
        }
        return newHeight;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameActive, wind]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 1) setGameActive(false);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const pullString = () => {
    if (gameActive) {
      setHeight((prev) => Math.min(100, prev + 5));
    }
  };

  const releaseString = () => {
    if (gameActive) {
      setHeight((prev) => Math.max(0, prev - 5));
    }
  };

  const startGame = () => {
    setHeight(50);
    setScore(0);
    setWind(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Score: {score}</span>
        <span className="text-spring-sky font-display">Wind: {wind > 0 ? "↑" : "↓"} {Math.abs(wind).toFixed(1)}</span>
        <span className="text-spring-green font-display">Time: {timeLeft}s</span>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-spring-sky/30 to-spring-green/20 rounded-lg overflow-hidden border-2 border-spring-sky/30">
        {/* Target zone */}
        <div className="absolute left-0 right-0 h-16 bg-spring-green/20 border-y-2 border-spring-green/50" style={{ bottom: "50%" }} />
        
        {/* Kite */}
        <div
          className="absolute left-1/2 text-4xl transition-all duration-100"
          style={{ bottom: `${height}%`, transform: "translateX(-50%)" }}
        >
          🪁
        </div>

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <p className="text-2xl mb-2">🪁 Kite Flying 🪁</p>
              <p className="text-sm text-muted-foreground mb-2">Keep the kite in the green zone!</p>
              {score > 0 && <p className="text-spring-green mb-2">Final Score: {score}</p>}
              <Button onClick={startGame} className="bg-spring-sky hover:bg-spring-sky/80">
                {score > 0 ? "Fly Again" : "Start Flying"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {gameActive && (
        <div className="flex justify-center gap-4 mt-4">
          <Button onMouseDown={pullString} className="bg-spring-green hover:bg-spring-green/80">
            ⬆️ Pull Up
          </Button>
          <Button onMouseDown={releaseString} className="bg-spring-pink hover:bg-spring-pink/80">
            ⬇️ Release
          </Button>
        </div>
      )}
    </div>
  );
};

export default KiteFlying;
