import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ClickerGame = () => {
  const [clicks, setClicks] = useState(0);
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; x: number; y: number }[]>([]);

  const autoClickerCost = Math.floor(50 * Math.pow(1.5, autoClickers));
  const multiplierCost = Math.floor(100 * Math.pow(2, multiplier - 1));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClicks(c => c + multiplier);
    
    // Add floating number
    const id = Date.now();
    setFloatingNumbers(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== id));
    }, 1000);
  };

  const buyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setClicks(c => c - autoClickerCost);
      setAutoClickers(a => a + 1);
    }
  };

  const buyMultiplier = () => {
    if (clicks >= multiplierCost) {
      setClicks(c => c - multiplierCost);
      setMultiplier(m => m + 1);
    }
  };

  // Auto clickers
  useEffect(() => {
    if (autoClickers === 0) return;
    const interval = setInterval(() => {
      setClicks(c => c + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Calculate CPS
  useEffect(() => {
    setClicksPerSecond(autoClickers);
  }, [autoClickers]);

  const resetGame = () => {
    setClicks(0);
    setMultiplier(1);
    setAutoClickers(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">🎮 {clicks.toLocaleString()} pts</span>
        <span className="font-display text-sm text-primary">+{clicksPerSecond}/s</span>
      </div>

      <div className="relative w-full h-60 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-lg overflow-hidden border-2 border-primary/50 flex items-center justify-center">
        <button
          onClick={handleClick}
          className="relative text-8xl transition-all duration-100 active:scale-90 hover:scale-110 select-none animate-float"
        >
          🕹️
          
          {/* Floating numbers */}
          {floatingNumbers.map(({ id, x, y }) => (
            <span
              key={id}
              className="absolute text-xl font-display text-primary pointer-events-none animate-[float_1s_ease-out_forwards]"
              style={{ 
                left: x, 
                top: y,
                animation: 'floatUp 1s ease-out forwards'
              }}
            >
              +{multiplier}
            </span>
          ))}
        </button>
      </div>

      {/* Upgrades */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          onClick={buyAutoClicker}
          disabled={clicks < autoClickerCost}
          variant="outline"
          className="flex flex-col h-auto py-3 border-neon-green/50 text-neon-green hover:bg-neon-green/10 disabled:opacity-50"
        >
          <span className="text-lg">🤖 Auto-Clicker</span>
          <span className="text-xs">Own: {autoClickers}</span>
          <span className="text-xs">Cost: {autoClickerCost}</span>
        </Button>
        
        <Button
          onClick={buyMultiplier}
          disabled={clicks < multiplierCost}
          variant="outline"
          className="flex flex-col h-auto py-3 border-secondary/50 text-secondary hover:bg-secondary/10 disabled:opacity-50"
        >
          <span className="text-lg">✨ x{multiplier + 1} Multi</span>
          <span className="text-xs">Current: x{multiplier}</span>
          <span className="text-xs">Cost: {multiplierCost}</span>
        </Button>
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={resetGame} 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-destructive"
        >
          Reset Game
        </Button>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
      `}</style>
    </div>
  );
};

export default ClickerGame;
