import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type GameState = "waiting" | "ready" | "go" | "clicked" | "early";

const ReactionGame = () => {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState("ready");
    setReactionTime(null);
    
    // Random delay between 1.5 and 4.5 seconds
    const delay = 1500 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("go");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState("early");
    } else if (gameState === "go") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState("clicked");
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getBackgroundClass = () => {
    switch (gameState) {
      case "ready":
        return "bg-destructive/30 border-destructive/50";
      case "go":
        return "bg-neon-green/30 border-neon-green/50";
      case "early":
        return "bg-halloween-orange/30 border-halloween-orange/50";
      case "clicked":
        return "bg-primary/30 border-primary/50";
      default:
        return "bg-muted border-border";
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case "waiting":
        return "Click 'Start' to begin";
      case "ready":
        return "Wait for green...";
      case "go":
        return "CLICK NOW! 🎯";
      case "early":
        return "Too early! 😅";
      case "clicked":
        return `${reactionTime}ms! ${reactionTime && reactionTime < 250 ? "⚡ Amazing!" : reactionTime && reactionTime < 350 ? "🔥 Fast!" : "👍 Good!"}`;
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">Best: {bestTime ? `${bestTime}ms` : "---"}</span>
        <span className="font-display text-sm text-primary">Test your reflexes!</span>
      </div>

      <div
        onClick={handleClick}
        className={`relative w-full h-80 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer flex items-center justify-center ${getBackgroundClass()}`}
      >
        <div className="text-center p-6">
          <p className="text-2xl md:text-3xl font-display mb-4">
            {getMessage()}
          </p>
          
          {(gameState === "waiting" || gameState === "clicked" || gameState === "early") && (
            <Button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="gradient-neon text-primary-foreground font-display box-glow-cyan"
            >
              {gameState === "waiting" ? "Start" : "Try Again"}
            </Button>
          )}
          
          {gameState === "clicked" && reactionTime && (
            <div className="mt-6 space-y-2 text-muted-foreground text-sm">
              <p>⚡ &lt;200ms: Superhuman</p>
              <p>🔥 200-300ms: Excellent</p>
              <p>👍 300-400ms: Average</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        {gameState === "ready" ? "Wait for the screen to turn green, then click!" : "Click start, wait for green, then click as fast as you can!"}
      </p>
    </div>
  );
};

export default ReactionGame;
