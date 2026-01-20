import { useState } from "react";

interface Decoration {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const TOPPINGS = ["🍬", "❤️", "⭐", "🎀", "✨", "🔴", "🟢"];

const CookieDecorator = () => {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [selectedTopping, setSelectedTopping] = useState(TOPPINGS[0]);
  const [score, setScore] = useState(0);

  const handleCookieClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDecorations(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      emoji: selectedTopping
    }]);
    setScore(s => s + 1);
  };

  const clearCookie = () => {
    setDecorations([]);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-christmas-green">Decorations: {score}</span>
        <button onClick={clearCookie} className="text-christmas-red hover:underline text-sm">
          Clear Cookie
        </button>
      </div>

      <div 
        onClick={handleCookieClick}
        className="relative w-48 h-48 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full cursor-pointer shadow-lg border-4 border-amber-900/50 hover:scale-105 transition-transform"
      >
        {decorations.map(d => (
          <span
            key={d.id}
            className="absolute text-lg pointer-events-none"
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {d.emoji}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        {TOPPINGS.map(topping => (
          <button
            key={topping}
            onClick={() => setSelectedTopping(topping)}
            className={`text-2xl p-2 rounded-lg transition-all ${
              selectedTopping === topping 
                ? 'bg-christmas-green scale-125' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {topping}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">Select a topping and click on the cookie!</p>
    </div>
  );
};

export default CookieDecorator;
