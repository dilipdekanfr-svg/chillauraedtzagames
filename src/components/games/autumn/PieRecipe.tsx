import { useState } from "react";
import { Button } from "@/components/ui/button";

const PieRecipe = () => {
  const [recipe, setRecipe] = useState<string[]>([]);
  const [playerRecipe, setPlayerRecipe] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const ingredients = ["🍎", "🎃", "🍯", "🥧", "🌰", "🍂"];

  const generateRecipe = (length: number) => {
    const newRecipe: string[] = [];
    for (let i = 0; i < length; i++) {
      newRecipe.push(ingredients[Math.floor(Math.random() * ingredients.length)]);
    }
    return newRecipe;
  };

  const startRound = () => {
    const newRecipe = generateRecipe(round + 3);
    setRecipe(newRecipe);
    setPlayerRecipe([]);
    setShowRecipe(true);
    setTimeout(() => setShowRecipe(false), 2000 + round * 500);
  };

  const addIngredient = (ingredient: string) => {
    if (showRecipe) return;
    
    const newPlayerRecipe = [...playerRecipe, ingredient];
    setPlayerRecipe(newPlayerRecipe);

    if (newPlayerRecipe.length === recipe.length) {
      if (JSON.stringify(newPlayerRecipe) === JSON.stringify(recipe)) {
        setScore((prev) => prev + recipe.length * 10);
        setRound((prev) => prev + 1);
        setTimeout(startRound, 1000);
      } else {
        setGameActive(false);
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setRound(0);
    setGameActive(true);
    setTimeout(() => {
      setRound(1);
    }, 100);
  };

  useEffect(() => {
    if (round > 0 && gameActive) {
      startRound();
    }
  }, [round, gameActive]);

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Score: {score}</span>
        <span className="text-autumn-brown font-display">Round: {round}</span>
      </div>

      <div className="mb-4 p-4 bg-autumn-gold/20 rounded-lg border-2 border-autumn-orange/30 min-h-16">
        {showRecipe ? (
          <div className="flex justify-center gap-2">
            {recipe.map((ing, i) => (
              <span key={i} className="text-3xl animate-pulse">{ing}</span>
            ))}
          </div>
        ) : playerRecipe.length > 0 ? (
          <div className="flex justify-center gap-2">
            {playerRecipe.map((ing, i) => (
              <span key={i} className="text-3xl">{ing}</span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Recreate the recipe!</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {ingredients.map((ing, i) => (
          <button
            key={i}
            onClick={() => addIngredient(ing)}
            disabled={showRecipe || !gameActive}
            className="h-14 rounded-lg bg-autumn-brown/30 hover:bg-autumn-brown/50 transition-colors text-3xl disabled:opacity-50"
          >
            {ing}
          </button>
        ))}
      </div>

      {!gameActive && (
        <Button onClick={startGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
          {score > 0 ? "Try Again" : "Start Baking"}
        </Button>
      )}
    </div>
  );
};

import { useEffect } from "react";
export default PieRecipe;
