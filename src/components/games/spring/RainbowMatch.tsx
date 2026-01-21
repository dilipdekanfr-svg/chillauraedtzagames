import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const RainbowMatch = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const colors = [
    { color: "bg-red-500", name: "🔴" },
    { color: "bg-orange-500", name: "🟠" },
    { color: "bg-yellow-500", name: "🟡" },
    { color: "bg-green-500", name: "🟢" },
    { color: "bg-blue-500", name: "🔵" },
    { color: "bg-purple-500", name: "🟣" },
  ];

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 6)]);
    setPlayerSequence([]);
    setGameOver(false);
    setScore(0);
  };

  const showSequence = async () => {
    setIsShowingSequence(true);
    for (const colorIndex of sequence) {
      await new Promise((r) => setTimeout(r, 300));
      setActiveColor(colorIndex);
      await new Promise((r) => setTimeout(r, 500));
      setActiveColor(null);
    }
    setIsShowingSequence(false);
  };

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      showSequence();
    }
  }, [sequence]);

  const handleColorClick = (index: number) => {
    if (isShowingSequence || gameOver) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    setActiveColor(index);
    setTimeout(() => setActiveColor(null), 200);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore((prev) => prev + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        setSequence((prev) => [...prev, Math.floor(Math.random() * 6)]);
      }, 500);
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-spring-pink font-display">Level: {score + 1}</span>
        <span className="text-spring-green font-display">Score: {score}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleColorClick(i)}
            disabled={isShowingSequence}
            className={`h-16 rounded-lg ${c.color} transition-all duration-200 ${
              activeColor === i ? "scale-110 ring-4 ring-white" : "opacity-70 hover:opacity-100"
            }`}
          >
            <span className="text-2xl">{c.name}</span>
          </button>
        ))}
      </div>

      {(sequence.length === 0 || gameOver) && (
        <div className="text-center">
          {gameOver && <p className="text-spring-pink mb-2">Game Over! Score: {score}</p>}
          <Button onClick={startGame} className="bg-spring-pink hover:bg-spring-pink/80">
            {gameOver ? "Play Again" : "Start Game"}
          </Button>
        </div>
      )}

      {isShowingSequence && (
        <p className="text-muted-foreground animate-pulse">Watch the sequence...</p>
      )}
    </div>
  );
};

export default RainbowMatch;
