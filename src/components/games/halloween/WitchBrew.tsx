import { useState } from "react";

interface Cauldron {
  ingredients: string[];
  result: string | null;
}

const INGREDIENTS = ["🦎", "🍄", "🕷️", "🦴", "👁️", "🐸", "🌙", "⭐"];
const RECIPES: { [key: string]: string } = {
  "🦎🍄🕷️": "🧪 Poison Potion!",
  "🦴👁️🐸": "👻 Ghost Spell!",
  "🌙⭐🍄": "✨ Magic Dust!",
  "🕷️🦴🐸": "🧟 Zombie Brew!",
  "👁️🌙⭐": "🔮 Fortune Teller!",
};

const WitchBrew = () => {
  const [cauldron, setCauldron] = useState<Cauldron>({ ingredients: [], result: null });
  const [score, setScore] = useState(0);
  const [brews, setBrews] = useState(0);

  const addIngredient = (ingredient: string) => {
    if (cauldron.ingredients.length >= 3 || cauldron.result) return;
    
    const newIngredients = [...cauldron.ingredients, ingredient];
    setCauldron({ ingredients: newIngredients, result: null });

    if (newIngredients.length === 3) {
      const key = newIngredients.sort().join("");
      const result = RECIPES[key];
      
      setTimeout(() => {
        if (result) {
          setScore(s => s + 50);
          setCauldron({ ingredients: [], result });
        } else {
          setCauldron({ ingredients: [], result: "💥 Exploded!" });
        }
        setBrews(b => b + 1);
      }, 500);
    }
  };

  const clearCauldron = () => {
    setCauldron({ ingredients: [], result: null });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-halloween-orange">Score: {score}</span>
        <span className="text-halloween-purple">Brews: {brews}</span>
      </div>

      <div className="w-full p-4 bg-gradient-to-b from-halloween-purple/20 to-halloween-orange/20 rounded-xl">
        {/* Cauldron */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-full flex items-center justify-center">
            <div className="absolute -top-2 w-36 h-4 bg-gray-800 rounded-full" />
            <div className="flex gap-1 text-2xl">
              {cauldron.ingredients.map((ing, i) => (
                <span key={i} className="animate-bounce">{ing}</span>
              ))}
            </div>
            {cauldron.result && (
              <div className="absolute inset-0 flex items-center justify-center text-lg font-display">
                {cauldron.result}
              </div>
            )}
          </div>
          <div className="text-4xl -mt-2">🔥</div>
        </div>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {INGREDIENTS.map(ing => (
            <button
              key={ing}
              onClick={() => addIngredient(ing)}
              disabled={cauldron.ingredients.length >= 3 || !!cauldron.result}
              className="text-2xl p-2 bg-background/50 rounded-lg hover:bg-halloween-purple/30 transition-colors disabled:opacity-50"
            >
              {ing}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={clearCauldron}
            className="px-4 py-2 bg-halloween-orange/50 hover:bg-halloween-orange rounded-lg font-display text-sm"
          >
            Clear Cauldron
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">Add 3 ingredients to brew! Find the recipes!</p>
    </div>
  );
};

export default WitchBrew;
