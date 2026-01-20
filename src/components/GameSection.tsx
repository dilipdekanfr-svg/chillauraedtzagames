import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SnowflakeCatcher from "./games/SnowflakeCatcher";
import MemoryMatch from "./games/MemoryMatch";
import GhostDodge from "./games/GhostDodge";
import PumpkinSmash from "./games/PumpkinSmash";
import ReactionGame from "./games/ReactionGame";
import ClickerGame from "./games/ClickerGame";

type GameCategory = "christmas" | "halloween" | "normal";

interface Game {
  id: string;
  name: string;
  emoji: string;
  component: React.ReactNode;
}

const christmasGames: Game[] = [
  { id: "snowflake", name: "Snowflake Catcher", emoji: "❄️", component: <SnowflakeCatcher /> },
  { id: "memory", name: "Christmas Memory", emoji: "🎄", component: <MemoryMatch /> },
];

const halloweenGames: Game[] = [
  { id: "ghost", name: "Ghost Dodge", emoji: "👻", component: <GhostDodge /> },
  { id: "pumpkin", name: "Pumpkin Smash", emoji: "🎃", component: <PumpkinSmash /> },
];

const normalGames: Game[] = [
  { id: "reaction", name: "Reaction Test", emoji: "⚡", component: <ReactionGame /> },
  { id: "clicker", name: "Clicker Game", emoji: "🕹️", component: <ClickerGame /> },
];

const GameSection = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [category, setCategory] = useState<GameCategory>("normal");

  const getGames = () => {
    switch (category) {
      case "christmas": return christmasGames;
      case "halloween": return halloweenGames;
      case "normal": return normalGames;
    }
  };

  const getCategoryStyles = () => {
    switch (category) {
      case "christmas": 
        return {
          gradient: "gradient-christmas",
          border: "border-christmas-green/50",
          glow: "box-glow-christmas",
          text: "text-christmas-green"
        };
      case "halloween":
        return {
          gradient: "gradient-halloween",
          border: "border-halloween-orange/50",
          glow: "box-glow-halloween",
          text: "text-halloween-orange"
        };
      case "normal":
        return {
          gradient: "gradient-neon",
          border: "border-primary/50",
          glow: "box-glow-cyan",
          text: "text-primary"
        };
    }
  };

  const styles = getCategoryStyles();
  const currentGame = getGames().find(g => g.id === selectedGame);

  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-8 text-glow-cyan">
          🎮 Play Games
        </h2>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={(v) => { setCategory(v as GameCategory); setSelectedGame(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 mb-8">
            <TabsTrigger 
              value="christmas" 
              className="font-display data-[state=active]:bg-christmas-red data-[state=active]:text-foreground"
            >
              🎄 Christmas
            </TabsTrigger>
            <TabsTrigger 
              value="halloween"
              className="font-display data-[state=active]:bg-halloween-orange data-[state=active]:text-foreground"
            >
              🎃 Halloween
            </TabsTrigger>
            <TabsTrigger 
              value="normal"
              className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              🕹️ Normal
            </TabsTrigger>
          </TabsList>

          {["christmas", "halloween", "normal"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {!selectedGame ? (
                <div className="grid grid-cols-2 gap-4">
                  {getGames().map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`group relative p-6 rounded-xl bg-card border-2 ${styles.border} transition-all duration-300 hover:scale-105 hover:${styles.glow}`}
                    >
                      <div className="text-5xl mb-3 group-hover:animate-float">
                        {game.emoji}
                      </div>
                      <h3 className={`font-display text-lg ${styles.text}`}>
                        {game.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click to play!
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className={`mb-6 font-display text-sm ${styles.text} hover:underline flex items-center gap-2`}
                  >
                    ← Back to Games
                  </button>
                  
                  <div className={`p-6 rounded-xl bg-card border-2 ${styles.border}`}>
                    <h3 className={`font-display text-xl mb-4 text-center ${styles.text}`}>
                      {currentGame?.emoji} {currentGame?.name}
                    </h3>
                    {currentGame?.component}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default GameSection;
