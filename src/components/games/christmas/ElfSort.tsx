import { useState, useEffect } from "react";

interface Gift {
  id: number;
  color: "red" | "green" | "blue";
  emoji: string;
}

const GIFT_TYPES: { color: "red" | "green" | "blue"; emoji: string }[] = [
  { color: "red", emoji: "🎁" },
  { color: "green", emoji: "🎄" },
  { color: "blue", emoji: "❄️" },
];

const ElfSort = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setGameOver(false);
    spawnGift();
  };

  const spawnGift = () => {
    const type = GIFT_TYPES[Math.floor(Math.random() * GIFT_TYPES.length)];
    setCurrentGift({ id: Date.now(), ...type });
  };

  const sortGift = (bin: "red" | "green" | "blue") => {
    if (!currentGift || !isPlaying) return;
    
    if (currentGift.color === bin) {
      setScore(s => s + 10);
    } else {
      setLives(l => {
        if (l <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return l - 1;
      });
    }
    spawnGift();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const timer = setTimeout(() => {
      setLives(l => {
        if (l <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return l - 1;
      });
      spawnGift();
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentGift, isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-christmas-green">Score: {score}</span>
        <span className="text-christmas-red">Lives: {"❤️".repeat(lives)}</span>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-christmas-green/20 to-christmas-red/20 rounded-xl overflow-hidden flex flex-col items-center justify-center">
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <p className="text-christmas-red mb-2">{gameOver ? `Game Over! Score: ${score}` : "Sort the gifts!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        {currentGift && (
          <div className="text-6xl mb-8 animate-bounce">
            {currentGift.emoji}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => sortGift("red")}
            className="px-6 py-3 bg-christmas-red/50 hover:bg-christmas-red rounded-lg text-2xl transition-colors"
          >
            🔴
          </button>
          <button
            onClick={() => sortGift("green")}
            className="px-6 py-3 bg-christmas-green/50 hover:bg-christmas-green rounded-lg text-2xl transition-colors"
          >
            🟢
          </button>
          <button
            onClick={() => sortGift("blue")}
            className="px-6 py-3 bg-blue-500/50 hover:bg-blue-500 rounded-lg text-2xl transition-colors"
          >
            🔵
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">🎁=Red 🎄=Green ❄️=Blue</p>
    </div>
  );
};

export default ElfSort;
