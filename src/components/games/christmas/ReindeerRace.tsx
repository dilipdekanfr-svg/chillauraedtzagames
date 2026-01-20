import { useState, useEffect, useCallback } from "react";

const ReindeerRace = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState(0);
  const [opponentPos, setOpponentPos] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setPlayerPos(0);
    setOpponentPos(0);
    setClicks(0);
    setWinner(null);
  };

  const handleClick = useCallback(() => {
    if (!isPlaying || winner) return;
    setClicks(c => c + 1);
    setPlayerPos(p => {
      const newPos = Math.min(p + 3, 100);
      if (newPos >= 100) {
        setWinner("You");
        setIsPlaying(false);
      }
      return newPos;
    });
  }, [isPlaying, winner]);

  useEffect(() => {
    if (!isPlaying || winner) return;
    const interval = setInterval(() => {
      setOpponentPos(p => {
        const newPos = Math.min(p + (1 + Math.random() * 2), 100);
        if (newPos >= 100) {
          setWinner("Opponent");
          setIsPlaying(false);
        }
        return newPos;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, winner]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-display text-christmas-green">Clicks: {clicks}</div>

      <div className="w-full h-48 bg-gradient-to-r from-christmas-green/20 to-christmas-red/20 rounded-xl overflow-hidden p-4">
        {(!isPlaying || winner) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 rounded-xl">
            <p className="text-christmas-red mb-2 text-lg">
              {winner ? `${winner} Win${winner === "You" ? "" : "s"}!` : "Race to the finish!"}
            </p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {winner ? "Race Again" : "Start Race"}
            </button>
          </div>
        )}

        <div className="relative mb-6">
          <div className="h-2 bg-muted rounded-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2">🏁</div>
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-100"
            style={{ left: `${playerPos}%` }}
          >
            🦌
          </div>
          <p className="text-xs text-muted-foreground mt-1">You</p>
        </div>

        <div className="relative">
          <div className="h-2 bg-muted rounded-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2">🏁</div>
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-100"
            style={{ left: `${opponentPos}%` }}
          >
            🦌
          </div>
          <p className="text-xs text-muted-foreground mt-1">Opponent</p>
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={!isPlaying || !!winner}
        className="mt-4 px-8 py-4 bg-christmas-red hover:bg-christmas-red/80 disabled:opacity-50 rounded-lg font-display text-lg"
      >
        🏃 CLICK TO RUN!
      </button>
    </div>
  );
};

export default ReindeerRace;
