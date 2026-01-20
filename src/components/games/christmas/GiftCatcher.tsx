import { useState, useEffect, useRef } from "react";

interface Gift {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

const GIFT_EMOJIS = ["🎁", "🎀", "📦", "🧸"];

const GiftCatcher = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [basketPos, setBasketPos] = useState(50);
  const gameRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGifts([]);
    setBasketPos(50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current || !isPlaying) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(5, Math.min(95, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameRef.current || !isPlaying) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(5, Math.min(95, x)));
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setGifts(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        y: 0,
        emoji: GIFT_EMOJIS[Math.floor(Math.random() * GIFT_EMOJIS.length)],
        speed: 1.5 + Math.random()
      }]);
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setGifts(prev => {
        const updated = prev.map(g => ({ ...g, y: g.y + g.speed }));
        updated.forEach(g => {
          if (g.y >= 85 && g.y <= 95 && Math.abs(g.x - basketPos) < 10) {
            setScore(s => s + 10);
            g.y = 200;
          }
        });
        return updated.filter(g => g.y < 100);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, basketPos]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-christmas-green">Score: {score}</span>
        <span className="text-christmas-red">Time: {timeLeft}s</span>
      </div>

      <div
        ref={gameRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-64 bg-gradient-to-b from-christmas-green/20 to-christmas-red/20 rounded-xl overflow-hidden cursor-none touch-none"
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
            <p className="text-christmas-red mb-2">{timeLeft === 0 ? `Game Over! Score: ${score}` : "Catch the gifts!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {gifts.map(gift => (
          <div
            key={gift.id}
            className="absolute text-3xl transition-none"
            style={{ left: `${gift.x}%`, top: `${gift.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {gift.emoji}
          </div>
        ))}

        <div
          className="absolute bottom-2 text-4xl transition-none"
          style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
        >
          🧺
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">Move mouse/touch to catch gifts</p>
    </div>
  );
};

export default GiftCatcher;
