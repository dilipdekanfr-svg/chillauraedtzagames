import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SnowflakeCatcher from "./games/SnowflakeCatcher";
import MemoryMatch from "./games/MemoryMatch";
import GhostDodge from "./games/GhostDodge";
import PumpkinSmash from "./games/PumpkinSmash";
import ReactionGame from "./games/ReactionGame";
import ClickerGame from "./games/ClickerGame";
// Christmas imports
import GiftCatcher from "./games/christmas/GiftCatcher";
import SantaRun from "./games/christmas/SantaRun";
import OrnamentPop from "./games/christmas/OrnamentPop";
import ElfSort from "./games/christmas/ElfSort";
import ReindeerRace from "./games/christmas/ReindeerRace";
import CookieDecorator from "./games/christmas/CookieDecorator";
import SnowballFight from "./games/christmas/SnowballFight";
import ChristmasQuiz from "./games/christmas/ChristmasQuiz";
// Halloween imports
import CandyCollector from "./games/halloween/CandyCollector";
import SpiderEscape from "./games/halloween/SpiderEscape";
import BatCatcher from "./games/halloween/BatCatcher";
import MonsterWhack from "./games/halloween/MonsterWhack";
import WitchBrew from "./games/halloween/WitchBrew";
import SkeletonDefense from "./games/halloween/SkeletonDefense";
import ZombieRun from "./games/halloween/ZombieRun";
import CostumeCreator from "./games/halloween/CostumeCreator";
// Normal imports
import ColorMatch from "./games/normal/ColorMatch";
import NumberMemory from "./games/normal/NumberMemory";
import TypingSpeed from "./games/normal/TypingSpeed";
import MathQuiz from "./games/normal/MathQuiz";
import AimTrainer from "./games/normal/AimTrainer";
import PatternMatch from "./games/normal/PatternMatch";
import WordScramble from "./games/normal/WordScramble";
import BalloonPop from "./games/normal/BalloonPop";
// Spring imports
import FlowerCatcher from "./games/spring/FlowerCatcher";
import ButterflyChase from "./games/spring/ButterflyChase";
import GardenGrow from "./games/spring/GardenGrow";
import EggHunt from "./games/spring/EggHunt";
import BeePollenCollector from "./games/spring/BeePollenCollector";
import RainbowMatch from "./games/spring/RainbowMatch";
import BirdNest from "./games/spring/BirdNest";
import PuddleJump from "./games/spring/PuddleJump";
import SeedSort from "./games/spring/SeedSort";
import KiteFlying from "./games/spring/KiteFlying";
// Autumn imports
import LeafCatcher from "./games/autumn/LeafCatcher";
import SquirrelNutGather from "./games/autumn/SquirrelNutGather";
import ApplePicking from "./games/autumn/ApplePicking";
import HarvestSort from "./games/autumn/HarvestSort";
import CrowScare from "./games/autumn/CrowScare";
import MushroomHunt from "./games/autumn/MushroomHunt";
import PieRecipe from "./games/autumn/PieRecipe";
import FoggyForest from "./games/autumn/FoggyForest";
import WindyDay from "./games/autumn/WindyDay";
import ThanksgivingMatch from "./games/autumn/ThanksgivingMatch";

type GameCategory = "christmas" | "halloween" | "spring" | "autumn" | "normal";

interface Game {
  id: string;
  name: string;
  emoji: string;
  component: React.ReactNode;
}

const christmasGames: Game[] = [
  { id: "snowflake", name: "Snowflake Catcher", emoji: "❄️", component: <SnowflakeCatcher /> },
  { id: "memory", name: "Christmas Memory", emoji: "🎄", component: <MemoryMatch /> },
  { id: "gift", name: "Gift Catcher", emoji: "🎁", component: <GiftCatcher /> },
  { id: "santa", name: "Santa Run", emoji: "🎅", component: <SantaRun /> },
  { id: "ornament", name: "Ornament Pop", emoji: "🔮", component: <OrnamentPop /> },
  { id: "elf", name: "Elf Sort", emoji: "🧝", component: <ElfSort /> },
  { id: "reindeer", name: "Reindeer Race", emoji: "🦌", component: <ReindeerRace /> },
  { id: "cookie", name: "Cookie Decorator", emoji: "🍪", component: <CookieDecorator /> },
  { id: "snowball", name: "Snowball Fight", emoji: "⛄", component: <SnowballFight /> },
  { id: "quiz", name: "Christmas Quiz", emoji: "❓", component: <ChristmasQuiz /> },
];

const halloweenGames: Game[] = [
  { id: "ghost", name: "Ghost Dodge", emoji: "👻", component: <GhostDodge /> },
  { id: "pumpkin", name: "Pumpkin Smash", emoji: "🎃", component: <PumpkinSmash /> },
  { id: "candy", name: "Candy Collector", emoji: "🍬", component: <CandyCollector /> },
  { id: "spider", name: "Spider Escape", emoji: "🕷️", component: <SpiderEscape /> },
  { id: "bat", name: "Bat Catcher", emoji: "🦇", component: <BatCatcher /> },
  { id: "monster", name: "Monster Whack", emoji: "👹", component: <MonsterWhack /> },
  { id: "witch", name: "Witch Brew", emoji: "🧙‍♀️", component: <WitchBrew /> },
  { id: "skeleton", name: "Skeleton Defense", emoji: "💀", component: <SkeletonDefense /> },
  { id: "zombie", name: "Zombie Run", emoji: "🧟", component: <ZombieRun /> },
  { id: "costume", name: "Costume Creator", emoji: "🎭", component: <CostumeCreator /> },
];

const springGames: Game[] = [
  { id: "flower", name: "Flower Catcher", emoji: "🌸", component: <FlowerCatcher /> },
  { id: "butterfly", name: "Butterfly Chase", emoji: "🦋", component: <ButterflyChase /> },
  { id: "garden", name: "Garden Grow", emoji: "🌱", component: <GardenGrow /> },
  { id: "egg", name: "Egg Hunt", emoji: "🥚", component: <EggHunt /> },
  { id: "bee", name: "Bee Pollen Collector", emoji: "🐝", component: <BeePollenCollector /> },
  { id: "rainbow", name: "Rainbow Match", emoji: "🌈", component: <RainbowMatch /> },
  { id: "bird", name: "Bird Nest", emoji: "🐦", component: <BirdNest /> },
  { id: "puddle", name: "Puddle Jump", emoji: "🐸", component: <PuddleJump /> },
  { id: "seed", name: "Seed Sort", emoji: "🌻", component: <SeedSort /> },
  { id: "kite", name: "Kite Flying", emoji: "🪁", component: <KiteFlying /> },
];

const autumnGames: Game[] = [
  { id: "leaf", name: "Leaf Catcher", emoji: "🍂", component: <LeafCatcher /> },
  { id: "squirrel", name: "Squirrel Nut Gather", emoji: "🐿️", component: <SquirrelNutGather /> },
  { id: "apple", name: "Apple Picking", emoji: "🍎", component: <ApplePicking /> },
  { id: "harvest", name: "Harvest Sort", emoji: "🌾", component: <HarvestSort /> },
  { id: "crow", name: "Crow Scare", emoji: "🐦‍⬛", component: <CrowScare /> },
  { id: "mushroom", name: "Mushroom Hunt", emoji: "🍄", component: <MushroomHunt /> },
  { id: "pie", name: "Pie Recipe", emoji: "🥧", component: <PieRecipe /> },
  { id: "foggy", name: "Foggy Forest", emoji: "🌫️", component: <FoggyForest /> },
  { id: "windy", name: "Windy Day", emoji: "💨", component: <WindyDay /> },
  { id: "thanksgiving", name: "Thanksgiving Match", emoji: "🦃", component: <ThanksgivingMatch /> },
];

const normalGames: Game[] = [
  { id: "reaction", name: "Reaction Test", emoji: "⚡", component: <ReactionGame /> },
  { id: "clicker", name: "Clicker Game", emoji: "🕹️", component: <ClickerGame /> },
  { id: "color", name: "Color Match", emoji: "🎨", component: <ColorMatch /> },
  { id: "number", name: "Number Memory", emoji: "🔢", component: <NumberMemory /> },
  { id: "typing", name: "Typing Speed", emoji: "⌨️", component: <TypingSpeed /> },
  { id: "math", name: "Math Quiz", emoji: "➕", component: <MathQuiz /> },
  { id: "aim", name: "Aim Trainer", emoji: "🎯", component: <AimTrainer /> },
  { id: "pattern", name: "Pattern Match", emoji: "🔷", component: <PatternMatch /> },
  { id: "word", name: "Word Scramble", emoji: "📝", component: <WordScramble /> },
  { id: "balloon", name: "Balloon Pop", emoji: "🎈", component: <BalloonPop /> },
];

const GameSection = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [category, setCategory] = useState<GameCategory>("normal");

  const getGames = () => {
    switch (category) {
      case "christmas": return christmasGames;
      case "halloween": return halloweenGames;
      case "spring": return springGames;
      case "autumn": return autumnGames;
      case "normal": return normalGames;
    }
  };

  const getCategoryStyles = () => {
    switch (category) {
      case "christmas": 
        return { border: "border-christmas-green/50", glow: "box-glow-christmas", text: "text-christmas-green" };
      case "halloween":
        return { border: "border-halloween-orange/50", glow: "box-glow-halloween", text: "text-halloween-orange" };
      case "spring":
        return { border: "border-spring-pink/50", glow: "box-glow-spring", text: "text-spring-pink" };
      case "autumn":
        return { border: "border-autumn-orange/50", glow: "box-glow-autumn", text: "text-autumn-orange" };
      case "normal":
        return { border: "border-primary/50", glow: "box-glow-cyan", text: "text-primary" };
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

        <Tabs value={category} onValueChange={(v) => { setCategory(v as GameCategory); setSelectedGame(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 mb-8">
            <TabsTrigger value="christmas" className="font-display text-xs md:text-sm data-[state=active]:bg-christmas-red data-[state=active]:text-foreground">
              🎄
            </TabsTrigger>
            <TabsTrigger value="halloween" className="font-display text-xs md:text-sm data-[state=active]:bg-halloween-orange data-[state=active]:text-foreground">
              🎃
            </TabsTrigger>
            <TabsTrigger value="spring" className="font-display text-xs md:text-sm data-[state=active]:bg-spring-pink data-[state=active]:text-foreground">
              🌸
            </TabsTrigger>
            <TabsTrigger value="autumn" className="font-display text-xs md:text-sm data-[state=active]:bg-autumn-orange data-[state=active]:text-foreground">
              🍂
            </TabsTrigger>
            <TabsTrigger value="normal" className="font-display text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🕹️
            </TabsTrigger>
          </TabsList>

          {["christmas", "halloween", "spring", "autumn", "normal"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {!selectedGame ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getGames().map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`group relative p-4 rounded-xl bg-card border-2 ${styles.border} transition-all duration-300 hover:scale-105`}
                    >
                      <div className="text-4xl mb-2 group-hover:animate-float">{game.emoji}</div>
                      <h3 className={`font-display text-sm ${styles.text}`}>{game.name}</h3>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedGame(null)} className={`mb-6 font-display text-sm ${styles.text} hover:underline flex items-center gap-2`}>
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
