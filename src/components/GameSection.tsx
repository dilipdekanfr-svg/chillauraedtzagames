import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

// Import 1000 games per category
import christmasGamesAll from "./games/christmas/gamesAll";
import halloweenGamesAll from "./games/halloween/gamesAll";
import springGamesAll from "./games/spring/gamesAll";
import autumnGamesAll from "./games/autumn/gamesAll";
import normalGamesAll from "./games/normal/gamesAll";
import threeDGamesAll from "./games/3d/gamesAll";

type GameCategory = "christmas" | "halloween" | "spring" | "autumn" | "normal" | "3d";

interface Game {
  id: string;
  name: string;
  emoji: string;
  component: React.ReactNode;
}

const GAMES_PER_PAGE = 50;

const GameSection = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [category, setCategory] = useState<GameCategory>("christmas");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const getGames = (): Game[] => {
    switch (category) {
      case "christmas": return christmasGamesAll;
      case "halloween": return halloweenGamesAll;
      case "spring": return springGamesAll;
      case "autumn": return autumnGamesAll;
      case "normal": return normalGamesAll;
      case "3d": return threeDGamesAll;
      default: return christmasGamesAll;
    }
  };

  const allGames = getGames();
  
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    return allGames.filter(game => 
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allGames, searchQuery]);

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice(
    currentPage * GAMES_PER_PAGE, 
    (currentPage + 1) * GAMES_PER_PAGE
  );

  const getCategoryStyles = () => {
    switch (category) {
      case "christmas":
        return { border: "border-christmas-red", glow: "shadow-christmas-red/20", text: "text-christmas-red", bg: "bg-christmas-red" };
      case "halloween":
        return { border: "border-halloween-orange", glow: "shadow-halloween-orange/20", text: "text-halloween-orange", bg: "bg-halloween-orange" };
      case "spring":
        return { border: "border-spring-pink", glow: "shadow-spring-pink/20", text: "text-spring-pink", bg: "bg-spring-pink" };
      case "autumn":
        return { border: "border-autumn-red", glow: "shadow-autumn-red/20", text: "text-autumn-red", bg: "bg-autumn-red" };
      case "3d":
        return { border: "border-purple-500", glow: "shadow-purple-500/20", text: "text-purple-500", bg: "bg-purple-500" };
      default:
        return { border: "border-primary", glow: "shadow-primary/20", text: "text-primary", bg: "bg-primary" };
    }
  };

  const styles = getCategoryStyles();
  const selectedGameData = allGames.find(g => g.id === selectedGame);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as GameCategory);
    setSelectedGame(null);
    setCurrentPage(0);
    setSearchQuery("");
  };

  return (
    <section id="games" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-display text-center mb-8 text-foreground">
          🎮 Play Games 🎮
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Choose a category and enjoy <span className={styles.text}>1000 unique games</span> per section! 
          <span className="text-purple-500 font-bold"> Now with crazy 3D games! 🚀</span>
        </p>

        <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="3d" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              🚀 3D Games
            </TabsTrigger>
            <TabsTrigger value="christmas" className="data-[state=active]:bg-christmas-red data-[state=active]:text-white">
              🎄 Christmas
            </TabsTrigger>
            <TabsTrigger value="halloween" className="data-[state=active]:bg-halloween-orange data-[state=active]:text-white">
              🎃 Halloween
            </TabsTrigger>
            <TabsTrigger value="spring" className="data-[state=active]:bg-spring-pink data-[state=active]:text-white">
              🌸 Spring
            </TabsTrigger>
            <TabsTrigger value="autumn" className="data-[state=active]:bg-autumn-red data-[state=active]:text-white">
              🍂 Autumn
            </TabsTrigger>
            <TabsTrigger value="normal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🎯 Normal
            </TabsTrigger>
          </TabsList>

          {["3d", "christmas", "halloween", "spring", "autumn", "normal"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {selectedGame && selectedGameData ? (
                <div className={`bg-card rounded-xl p-6 border-2 ${styles.border} shadow-lg ${styles.glow}`}>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className={`mb-4 ${styles.text} hover:underline flex items-center gap-2`}
                  >
                    ← Back to Games
                  </button>
                  <h3 className="text-2xl font-display mb-4 text-foreground">
                    {selectedGameData.emoji} {selectedGameData.name}
                  </h3>
                  {selectedGameData.component}
                </div>
              ) : (
                <>
                  {/* Search and Pagination Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                        className="pl-9"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground min-w-[100px] text-center">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {filteredGames.length} games
                    </span>
                  </div>

                  {/* Games Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
                    {paginatedGames.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className={`p-3 rounded-xl bg-card border-2 ${styles.border} hover:shadow-lg ${styles.glow} 
                          transition-all duration-200 hover:scale-105 flex flex-col items-center gap-1`}
                      >
                        <span className="text-2xl">{game.emoji}</span>
                        <span className="text-xs text-center text-foreground line-clamp-2">{game.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Page Jump */}
                  {totalPages > 10 && (
                    <div className="flex flex-wrap gap-1 mt-6 justify-center">
                      {[0, 4, 9, 14, 19].map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="text-xs"
                        >
                          {(page * GAMES_PER_PAGE) + 1}-{Math.min((page + 1) * GAMES_PER_PAGE, filteredGames.length)}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default GameSection;
