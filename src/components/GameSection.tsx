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
import * as ChristmasGames2 from "./games/christmas/games2";
// Halloween imports
import CandyCollector from "./games/halloween/CandyCollector";
import SpiderEscape from "./games/halloween/SpiderEscape";
import BatCatcher from "./games/halloween/BatCatcher";
import MonsterWhack from "./games/halloween/MonsterWhack";
import WitchBrew from "./games/halloween/WitchBrew";
import SkeletonDefense from "./games/halloween/SkeletonDefense";
import ZombieRun from "./games/halloween/ZombieRun";
import CostumeCreator from "./games/halloween/CostumeCreator";
import * as HalloweenGames2 from "./games/halloween/games2";
// Normal imports
import ColorMatch from "./games/normal/ColorMatch";
import NumberMemory from "./games/normal/NumberMemory";
import TypingSpeed from "./games/normal/TypingSpeed";
import MathQuiz from "./games/normal/MathQuiz";
import AimTrainer from "./games/normal/AimTrainer";
import PatternMatch from "./games/normal/PatternMatch";
import WordScramble from "./games/normal/WordScramble";
import BalloonPop from "./games/normal/BalloonPop";
import * as NormalGames2 from "./games/normal/games2";
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
import * as SpringGames2 from "./games/spring/games2";
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
import * as AutumnGames2 from "./games/autumn/games2";

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
  // Games 11-60
  { id: "sleigh", name: "Sleigh Ride", emoji: "🛷", component: <ChristmasGames2.SleighRide /> },
  { id: "angel", name: "Angel Catcher", emoji: "👼", component: <ChristmasGames2.AngelCatcher /> },
  { id: "candycane", name: "Candy Cane Crush", emoji: "🍬", component: <ChristmasGames2.CandyCaneCrush /> },
  { id: "northpole", name: "North Pole Run", emoji: "🏔️", component: <ChristmasGames2.NorthPoleRun /> },
  { id: "stocking", name: "Stocking Stuffer", emoji: "🧦", component: <ChristmasGames2.StockingStuffer /> },
  { id: "carol", name: "Carol Sing", emoji: "🎵", component: <ChristmasGames2.CarolSing /> },
  { id: "tree", name: "Tree Decorator", emoji: "🌲", component: <ChristmasGames2.TreeDecorator /> },
  { id: "presentwrap", name: "Present Wrap", emoji: "🎀", component: <ChristmasGames2.PresentWrap /> },
  { id: "chimney", name: "Chimney Climb", emoji: "🏠", component: <ChristmasGames2.ChimneyClimb /> },
  { id: "star", name: "Star Catcher", emoji: "⭐", component: <ChristmasGames2.StarCatcher /> },
  { id: "snowman", name: "Snowman Builder", emoji: "⛄", component: <ChristmasGames2.SnowmanBuilder /> },
  { id: "iceskate", name: "Ice Skating", emoji: "⛸️", component: <ChristmasGames2.IceSkating /> },
  { id: "hotchoc", name: "Hot Chocolate", emoji: "☕", component: <ChristmasGames2.HotChocolate /> },
  { id: "mistletoe", name: "Mistletoe Match", emoji: "💋", component: <ChristmasGames2.MistletoeMatch /> },
  { id: "gingerbread", name: "Gingerbread Run", emoji: "🏃", component: <ChristmasGames2.GingerbreadRun /> },
  { id: "bellring", name: "Bell Ringer", emoji: "🔔", component: <ChristmasGames2.BellRinger /> },
  { id: "snowglobe", name: "Snow Globe Shake", emoji: "🌨️", component: <ChristmasGames2.SnowGlobeShake /> },
  { id: "toyfactory", name: "Toy Factory", emoji: "🧸", component: <ChristmasGames2.ToyFactory /> },
  { id: "polarbear", name: "Polar Bear Dash", emoji: "🐻‍❄️", component: <ChristmasGames2.PolarBearDash /> },
  { id: "frost", name: "Frost Pattern", emoji: "❄️", component: <ChristmasGames2.FrostPattern /> },
  { id: "penguin", name: "Penguin Slide", emoji: "🐧", component: <ChristmasGames2.PenguinSlide /> },
  { id: "wreath", name: "Wreath Maker", emoji: "🎄", component: <ChristmasGames2.WreathMaker /> },
  { id: "nutcracker", name: "Nutcracker Dance", emoji: "🤴", component: <ChristmasGames2.NutcrackerDance /> },
  { id: "aurora", name: "Aurora Chase", emoji: "🌌", component: <ChristmasGames2.AuroraChase /> },
  { id: "igloo", name: "Igloo Builder", emoji: "🏔️", component: <ChristmasGames2.IglooBuilder /> },
  { id: "reindeerfeed", name: "Reindeer Feed", emoji: "🦌", component: <ChristmasGames2.ReindeerFeed /> },
  { id: "frozenlake", name: "Frozen Lake", emoji: "🧊", component: <ChristmasGames2.FrozenLake /> },
  { id: "winterwonder", name: "Winter Wonderland", emoji: "🏔️", component: <ChristmasGames2.WinterWonderland /> },
  { id: "xmaslights", name: "Christmas Lights", emoji: "💡", component: <ChristmasGames2.ChristmasLights /> },
  { id: "sugarplum", name: "Sugar Plum Fairy", emoji: "🧚", component: <ChristmasGames2.SugarPlumFairy /> },
  { id: "yulelog", name: "Yule Log", emoji: "🪵", component: <ChristmasGames2.YuleLog /> },
  { id: "jinglebells", name: "Jingle Bells", emoji: "🔔", component: <ChristmasGames2.JingleBells /> },
  { id: "northstar", name: "North Star", emoji: "⭐", component: <ChristmasGames2.NorthStar /> },
  { id: "holidaybaking", name: "Holiday Baking", emoji: "🥧", component: <ChristmasGames2.HolidayBaking /> },
  { id: "snowangel", name: "Snow Angel", emoji: "👼", component: <ChristmasGames2.SnowAngel /> },
  { id: "fireplace", name: "Cozy Fireplace", emoji: "🔥", component: <ChristmasGames2.CozyFireplace /> },
  { id: "winterbirds", name: "Winter Birds", emoji: "🐦", component: <ChristmasGames2.WinterBirds /> },
  { id: "holidaycards", name: "Holiday Cards", emoji: "💌", component: <ChristmasGames2.HolidayCards /> },
  { id: "snowstorm", name: "Snowstorm Dash", emoji: "🌨️", component: <ChristmasGames2.SnowstormDash /> },
  { id: "xmaseve", name: "Christmas Eve", emoji: "🌙", component: <ChristmasGames2.ChristmasEve /> },
  { id: "tinsel", name: "Tinsel Toss", emoji: "✨", component: <ChristmasGames2.TinselToss /> },
  { id: "fruitcake", name: "Fruitcake Fling", emoji: "🍰", component: <ChristmasGames2.FruitcakeFling /> },
  { id: "eggnog", name: "Egg Nog Chug", emoji: "🥛", component: <ChristmasGames2.EggNogChug /> },
  { id: "merrymaze", name: "Merry Maze", emoji: "🎄", component: <ChristmasGames2.MerryMaze /> },
  { id: "poinsettia", name: "Poinsettia Match", emoji: "🌺", component: <ChristmasGames2.PoinsettiaMatch /> },
  { id: "santahat", name: "Santa Hat Toss", emoji: "🎅", component: <ChristmasGames2.SantaHatToss /> },
  { id: "icicle", name: "Icicle Breaker", emoji: "🧊", component: <ChristmasGames2.IcicleBreaker /> },
  { id: "holly", name: "Holly Jump", emoji: "🌿", component: <ChristmasGames2.HollyJump /> },
  { id: "snowflakedesign", name: "Snowflake Design", emoji: "❄️", component: <ChristmasGames2.SnowflakeDesign /> },
  { id: "miracle", name: "Christmas Miracle", emoji: "✨", component: <ChristmasGames2.ChristmasMiracle /> },
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
  // Games 11-60
  { id: "haunted", name: "Haunted House", emoji: "🏚️", component: <HalloweenGames2.HauntedHouse /> },
  { id: "vampire", name: "Vampire Dodge", emoji: "🧛", component: <HalloweenGames2.VampireDodge /> },
  { id: "mummy", name: "Mummy Wrap", emoji: "🧟", component: <HalloweenGames2.MummyWrap /> },
  { id: "werewolf", name: "Werewolf Howl", emoji: "🐺", component: <HalloweenGames2.WerewolfHowl /> },
  { id: "graveyard", name: "Graveyard Dash", emoji: "⚰️", component: <HalloweenGames2.GraveyardDash /> },
  { id: "potion", name: "Potion Mix", emoji: "🧪", component: <HalloweenGames2.PotionMix /> },
  { id: "owl", name: "Owl Hoot", emoji: "🦉", component: <HalloweenGames2.OwlHoot /> },
  { id: "blackcat", name: "Black Cat Cross", emoji: "🐱", component: <HalloweenGames2.BlackCatCross /> },
  { id: "scarystory", name: "Scary Story", emoji: "📖", component: <HalloweenGames2.ScaryStory /> },
  { id: "trickortreat", name: "Trick or Treat", emoji: "🍭", component: <HalloweenGames2.TrickOrTreat /> },
  { id: "phantom", name: "Phantom Chase", emoji: "👻", component: <HalloweenGames2.PhantomChase /> },
  { id: "cobweb", name: "Cobweb Clear", emoji: "🕸️", component: <HalloweenGames2.CobwebClear /> },
  { id: "bone", name: "Bone Collector", emoji: "🦴", component: <HalloweenGames2.BoneCollector /> },
  { id: "eyeball", name: "Eyeball Bounce", emoji: "👁️", component: <HalloweenGames2.EyeballBounce /> },
  { id: "creepy", name: "Creepy Crawly", emoji: "🐛", component: <HalloweenGames2.CreepyCrawly /> },
  { id: "goblin", name: "Goblin Grab", emoji: "👺", component: <HalloweenGames2.GoblinGrab /> },
  { id: "hauntedmirror", name: "Haunted Mirror", emoji: "🪞", component: <HalloweenGames2.HauntedMirror /> },
  { id: "nightmare", name: "Nightmare Dodge", emoji: "😱", component: <HalloweenGames2.NightmareDodge /> },
  { id: "curseddoll", name: "Cursed Doll", emoji: "🎎", component: <HalloweenGames2.CursedDoll /> },
  { id: "fognav", name: "Fog Navigator", emoji: "🌫️", component: <HalloweenGames2.FogNavigator /> },
  { id: "candle", name: "Candle Lighter", emoji: "🕯️", component: <HalloweenGames2.CandleLighter /> },
  { id: "crypt", name: "Crypt Explorer", emoji: "⚱️", component: <HalloweenGames2.CryptExplorer /> },
  { id: "soul", name: "Soul Catcher", emoji: "💀", component: <HalloweenGames2.SoulCatcher /> },
  { id: "frankenstein", name: "Frankenstein Fix", emoji: "🧟‍♂️", component: <HalloweenGames2.FrankensteinFix /> },
  { id: "cauldron", name: "Cauldron Bubble", emoji: "🫧", component: <HalloweenGames2.CauldronBubble /> },
  { id: "broomstick", name: "Broomstick Race", emoji: "🧹", component: <HalloweenGames2.BroomstickRace /> },
  { id: "jackolantern", name: "Jack O'Lantern", emoji: "🎃", component: <HalloweenGames2.JackOLantern /> },
  { id: "monstermash", name: "Monster Mash", emoji: "👹", component: <HalloweenGames2.MonsterMash /> },
  { id: "hauntedforest", name: "Haunted Forest", emoji: "🌲", component: <HalloweenGames2.HauntedForest /> },
  { id: "ghoul", name: "Ghoul Gather", emoji: "👻", component: <HalloweenGames2.GhoulGather /> },
  { id: "scream", name: "Scream Reaction", emoji: "😱", component: <HalloweenGames2.ScreamReaction /> },
  { id: "pumpkinpatch", name: "Pumpkin Patch", emoji: "🎃", component: <HalloweenGames2.PumpkinPatch /> },
  { id: "spell", name: "Spell Caster", emoji: "✨", component: <HalloweenGames2.SpellCaster /> },
  { id: "darkmaze", name: "Dark Maze", emoji: "🌑", component: <HalloweenGames2.DarkMaze /> },
  { id: "thunder", name: "Thunder Strike", emoji: "⚡", component: <HalloweenGames2.ThunderStrike /> },
  { id: "creeper", name: "Creeper Sneak", emoji: "🕷️", component: <HalloweenGames2.CreeperSneak /> },
  { id: "horrorquiz", name: "Horror Quiz", emoji: "❓", component: <HalloweenGames2.HorrorQuiz /> },
  { id: "demon", name: "Demon Dodge", emoji: "👿", component: <HalloweenGames2.DemonDodge /> },
  { id: "fullmoon", name: "Full Moon", emoji: "🌕", component: <HalloweenGames2.FullMoon /> },
  { id: "halloweenparty", name: "Halloween Party", emoji: "🎉", component: <HalloweenGames2.HalloweenParty /> },
  { id: "batswarm", name: "Bat Swarm", emoji: "🦇", component: <HalloweenGames2.BatSwarm /> },
  { id: "witchhat", name: "Witch Hat", emoji: "🎩", component: <HalloweenGames2.WitchHat /> },
  { id: "coffin", name: "Coffin Dash", emoji: "⚰️", component: <HalloweenGames2.CoffinDash /> },
  { id: "ghostlywail", name: "Ghostly Wail", emoji: "👻", component: <HalloweenGames2.GhostlyWail /> },
  { id: "spiderweb", name: "Spider Web", emoji: "🕸️", component: <HalloweenGames2.SpiderWeb /> },
  { id: "creepyclown", name: "Creepy Clown", emoji: "🤡", component: <HalloweenGames2.CreepyClown /> },
  { id: "shadowcatch", name: "Shadow Catch", emoji: "👤", component: <HalloweenGames2.ShadowCatch /> },
  { id: "haunteddance", name: "Haunted Dance", emoji: "💃", component: <HalloweenGames2.HauntedDance /> },
  { id: "midnight", name: "Midnight Hour", emoji: "🕛", component: <HalloweenGames2.MidnightHour /> },
  { id: "freakshow", name: "Freak Show", emoji: "🎪", component: <HalloweenGames2.FreakShow /> },
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
  // Games 11-60
  { id: "sunshine", name: "Sunshine Chase", emoji: "☀️", component: <SpringGames2.SunshineChase /> },
  { id: "daisy", name: "Daisy Pick", emoji: "🌼", component: <SpringGames2.DaisyPick /> },
  { id: "ladybug", name: "Ladybug Land", emoji: "🐞", component: <SpringGames2.LadybugLand /> },
  { id: "cloud", name: "Cloud Hopper", emoji: "☁️", component: <SpringGames2.CloudHopper /> },
  { id: "dragonfly", name: "Dragonfly Catch", emoji: "🪰", component: <SpringGames2.DragonflyCatch /> },
  { id: "tulip", name: "Tulip Sort", emoji: "🌷", component: <SpringGames2.TulipSort /> },
  { id: "rabbit", name: "Rabbit Hop", emoji: "🐰", component: <SpringGames2.RabbitHop /> },
  { id: "worm", name: "Worm Digger", emoji: "🪱", component: <SpringGames2.WormDigger /> },
  { id: "blossom", name: "Blossoms Match", emoji: "🌸", component: <SpringGames2.BlossomsMatch /> },
  { id: "stream", name: "Stream Jump", emoji: "🏞️", component: <SpringGames2.StreamJump /> },
  { id: "nestbuild", name: "Nest Builder", emoji: "🪺", component: <SpringGames2.NestBuilder /> },
  { id: "pollen", name: "Pollen Dash", emoji: "🌻", component: <SpringGames2.PollenDash /> },
  { id: "frog", name: "Frog Leap", emoji: "🐸", component: <SpringGames2.FrogLeap /> },
  { id: "cherry", name: "Cherry Bloom", emoji: "🌸", component: <SpringGames2.CherryBloom /> },
  { id: "dew", name: "Dew Drop", emoji: "💧", component: <SpringGames2.DewDrop /> },
  { id: "caterpillar", name: "Caterpillar Crawl", emoji: "🐛", component: <SpringGames2.CaterpillarCrawl /> },
  { id: "picnic", name: "Picnic Rush", emoji: "🧺", component: <SpringGames2.PicnicRush /> },
  { id: "kiterace", name: "Kite Race", emoji: "🪁", component: <SpringGames2.KiteRace /> },
  { id: "bluebell", name: "Bluebell Chime", emoji: "🔔", component: <SpringGames2.BluebellChime /> },
  { id: "duck", name: "Duck Pond", emoji: "🦆", component: <SpringGames2.DuckPond /> },
  { id: "meadow", name: "Meadow Run", emoji: "🌾", component: <SpringGames2.MeadowRun /> },
  { id: "rose", name: "Rose Petal", emoji: "🌹", component: <SpringGames2.RosePetal /> },
  { id: "birdsong", name: "Bird Song", emoji: "🎵", component: <SpringGames2.BirdSong /> },
  { id: "clover", name: "Clover Hunt", emoji: "🍀", component: <SpringGames2.CloverHunt /> },
  { id: "sparrow", name: "Sparrow Fly", emoji: "🐦", component: <SpringGames2.SparrowFly /> },
  { id: "flowershop", name: "Flower Shop", emoji: "💐", component: <SpringGames2.FlowerShop /> },
  { id: "snail", name: "Snail Race", emoji: "🐌", component: <SpringGames2.SnailRace /> },
  { id: "greenthumb", name: "Green Thumb", emoji: "🪴", component: <SpringGames2.GreenThumb /> },
  { id: "april", name: "April Showers", emoji: "🌧️", component: <SpringGames2.AprilShowers /> },
  { id: "sunflower", name: "Sunflower Grow", emoji: "🌻", component: <SpringGames2.SunflowerGrow /> },
  { id: "honeycomb", name: "Honey Comb", emoji: "🍯", component: <SpringGames2.HoneyComb /> },
  { id: "windchime", name: "Wind Chime", emoji: "🎐", component: <SpringGames2.WindChime /> },
  { id: "teagarden", name: "Tea Garden", emoji: "🍵", component: <SpringGames2.TeaGarden /> },
  { id: "cricket", name: "Cricket Chirp", emoji: "🦗", component: <SpringGames2.CricketChirp /> },
  { id: "morningglory", name: "Morning Glory", emoji: "🌺", component: <SpringGames2.MorningGlory /> },
  { id: "birdwatch", name: "Bird Watch", emoji: "🔭", component: <SpringGames2.BirdWatch /> },
  { id: "petaldance", name: "Petal Dance", emoji: "🌸", component: <SpringGames2.PetalDance /> },
  { id: "gardenmaze", name: "Garden Maze", emoji: "🌿", component: <SpringGames2.GardenMaze /> },
  { id: "breezy", name: "Breezy Catch", emoji: "🍃", component: <SpringGames2.BreezyCatch /> },
  { id: "springfest", name: "Spring Festival", emoji: "🎊", component: <SpringGames2.SpringFestival /> },
  { id: "lilypad", name: "Lily Pad", emoji: "🌱", component: <SpringGames2.LilyPad /> },
  { id: "parrot", name: "Parrot Mimic", emoji: "🦜", component: <SpringGames2.ParrotMimic /> },
  { id: "vine", name: "Vine Swing", emoji: "🌿", component: <SpringGames2.VineSwing /> },
  { id: "pondskip", name: "Pond Skip", emoji: "🪨", component: <SpringGames2.PondSkip /> },
  { id: "hummingbird", name: "Hummingbird Hover", emoji: "🐦", component: <SpringGames2.HummingbirdHover /> },
  { id: "maydance", name: "May Dance", emoji: "💃", component: <SpringGames2.MayDance /> },
  { id: "tadpole", name: "Tadpole Tank", emoji: "🐸", component: <SpringGames2.TadpoleTank /> },
  { id: "rainbowride", name: "Rainbow Ride", emoji: "🌈", component: <SpringGames2.RainbowRide /> },
  { id: "willow", name: "Willow Wisp", emoji: "✨", component: <SpringGames2.WillowWisp /> },
  { id: "springclean", name: "Spring Clean", emoji: "🧹", component: <SpringGames2.SpringClean /> },
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
  // Games 11-60
  { id: "acorn", name: "Acorn Drop", emoji: "🌰", component: <AutumnGames2.AcornDrop /> },
  { id: "maple", name: "Maple Match", emoji: "🍁", component: <AutumnGames2.MapleMatch /> },
  { id: "hedgehog", name: "Hedgehog Hide", emoji: "🦔", component: <AutumnGames2.HedgehogHide /> },
  { id: "pumpkinroll", name: "Pumpkin Roll", emoji: "🎃", component: <AutumnGames2.PumpkinRoll /> },
  { id: "owlwatch", name: "Owl Watch", emoji: "🦉", component: <AutumnGames2.OwlWatch /> },
  { id: "cider", name: "Cider Press", emoji: "🍎", component: <AutumnGames2.CiderPress /> },
  { id: "haystack", name: "Haystack Jump", emoji: "🌾", component: <AutumnGames2.HaystackJump /> },
  { id: "chestnut", name: "Chestnut Roast", emoji: "🌰", component: <AutumnGames2.ChestnutRoast /> },
  { id: "rake", name: "Rake Leaves", emoji: "🧹", component: <AutumnGames2.RakeLeaves /> },
  { id: "fallfest", name: "Fall Festival", emoji: "🎡", component: <AutumnGames2.FallFestival /> },
  { id: "cornmaze", name: "Corn Maze", emoji: "🌽", component: <AutumnGames2.CornMaze /> },
  { id: "turkeytrot", name: "Turkey Trot", emoji: "🦃", component: <AutumnGames2.TurkeyTrot /> },
  { id: "scarecrow", name: "Scarecrow Build", emoji: "🧑‍🌾", component: <AutumnGames2.ScarecrowBuild /> },
  { id: "nutcracker", name: "Nut Cracker", emoji: "🌰", component: <AutumnGames2.NutCracker /> },
  { id: "migration", name: "Migration Path", emoji: "🦅", component: <AutumnGames2.MigrationPath /> },
  { id: "grape", name: "Grape Harvest", emoji: "🍇", component: <AutumnGames2.GrapeHarvest /> },
  { id: "spicy", name: "Spicy Chili", emoji: "🌶️", component: <AutumnGames2.SpicyChili /> },
  { id: "woodchop", name: "Wood Chop", emoji: "🪵", component: <AutumnGames2.WoodChop /> },
  { id: "campfire", name: "Campfire Story", emoji: "🔥", component: <AutumnGames2.CampfireStory /> },
  { id: "autumnrain", name: "Autumn Rain", emoji: "🌧️", component: <AutumnGames2.AutumnRain /> },
  { id: "boots", name: "Boots & Puddles", emoji: "👢", component: <AutumnGames2.BootsAndPuddles /> },
  { id: "hotcocoa", name: "Hot Cocoa", emoji: "☕", component: <AutumnGames2.HotCocoa /> },
  { id: "pinecone", name: "Pine Cone Collect", emoji: "🌲", component: <AutumnGames2.PineConeCollect /> },
  { id: "fox", name: "Fox Dash", emoji: "🦊", component: <AutumnGames2.FoxDash /> },
  { id: "pear", name: "Pear Picking", emoji: "🍐", component: <AutumnGames2.PearPicking /> },
  { id: "blanket", name: "Blanket Fort", emoji: "🏕️", component: <AutumnGames2.BlanketFort /> },
  { id: "leafpile", name: "Leaf Pile", emoji: "🍂", component: <AutumnGames2.LeafPile /> },
  { id: "soup", name: "Soup Stir", emoji: "🥣", component: <AutumnGames2.SoupStir /> },
  { id: "oaktree", name: "Oak Tree", emoji: "🌳", component: <AutumnGames2.OakTree /> },
  { id: "sweater", name: "Sweater Weather", emoji: "🧣", component: <AutumnGames2.SweaterWeather /> },
  { id: "gratitude", name: "Gratitude Match", emoji: "🙏", component: <AutumnGames2.GratitudeMatch /> },
  { id: "canning", name: "Canning Jars", emoji: "🫙", component: <AutumnGames2.CanningJars /> },
  { id: "bonfire", name: "Bonfire Night", emoji: "🔥", component: <AutumnGames2.BonfireNight /> },
  { id: "deer", name: "Deer Spot", emoji: "🦌", component: <AutumnGames2.DeerSpot /> },
  { id: "harvestmoon", name: "Harvest Moon", emoji: "🌕", component: <AutumnGames2.HarvestMoon /> },
  { id: "crispair", name: "Crisp Air", emoji: "🍃", component: <AutumnGames2.CrispAir /> },
  { id: "applebob", name: "Apple Bobbing", emoji: "🍎", component: <AutumnGames2.AppleBobbing /> },
  { id: "scarecrowdance", name: "Scarecrow Dance", emoji: "🎭", component: <AutumnGames2.ScarecrowDance /> },
  { id: "wildberry", name: "Wild Berry", emoji: "🫐", component: <AutumnGames2.WildBerry /> },
  { id: "farmermarket", name: "Farmer's Market", emoji: "🧺", component: <AutumnGames2.FarmerMarket /> },
  { id: "misty", name: "Misty Morning", emoji: "🌫️", component: <AutumnGames2.MistyMorning /> },
  { id: "walnut", name: "Walnut Wack", emoji: "🥜", component: <AutumnGames2.WalnutWack /> },
  { id: "haybale", name: "Haybale Stack", emoji: "🌾", component: <AutumnGames2.HaybaleStack /> },
  { id: "plaid", name: "Plaid Pattern", emoji: "🧶", component: <AutumnGames2.PlaidPattern /> },
  { id: "spookypath", name: "Spooky Path", emoji: "🛤️", component: <AutumnGames2.SpookyPath /> },
  { id: "candyapple", name: "Candy Apple", emoji: "🍎", component: <AutumnGames2.CandyApple /> },
  { id: "owlflight", name: "Owl Flight", emoji: "🦉", component: <AutumnGames2.OwlFlight /> },
  { id: "cavern", name: "Cavern Explore", emoji: "🕳️", component: <AutumnGames2.CavernExplore /> },
  { id: "truffle", name: "Truffle Dig", emoji: "🍄", component: <AutumnGames2.TruffleDig /> },
  { id: "autumnsunset", name: "Autumn Sunset", emoji: "🌅", component: <AutumnGames2.AutumnSunset /> },
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
  // Games 11-60
  { id: "simon", name: "Simon Says", emoji: "🔴", component: <NormalGames2.SimonSays /> },
  { id: "speedmatch", name: "Speed Match", emoji: "⚡", component: <NormalGames2.SpeedMatch /> },
  { id: "tileflip", name: "Tile Flip", emoji: "🃏", component: <NormalGames2.TileFlip /> },
  { id: "quickmath", name: "Quick Math", emoji: "🔢", component: <NormalGames2.QuickMath /> },
  { id: "colorblind", name: "Color Blind", emoji: "👁️", component: <NormalGames2.ColorBlind /> },
  { id: "sequence", name: "Sequence Repeat", emoji: "🔄", component: <NormalGames2.SequenceRepeat /> },
  { id: "target", name: "Target Practice", emoji: "🎯", component: <NormalGames2.TargetPractice /> },
  { id: "wordguess", name: "Word Guess", emoji: "💭", component: <NormalGames2.WordGuess /> },
  { id: "shapesort", name: "Shape Sort", emoji: "🔷", component: <NormalGames2.ShapeSort /> },
  { id: "timingtap", name: "Timing Tap", emoji: "⏱️", component: <NormalGames2.TimingTap /> },
  { id: "puzzle", name: "Puzzle Piece", emoji: "🧩", component: <NormalGames2.PuzzlePiece /> },
  { id: "memorycards", name: "Memory Cards", emoji: "🎴", component: <NormalGames2.MemoryCards /> },
  { id: "reflextest", name: "Reflex Test", emoji: "⚡", component: <NormalGames2.RefleXTest /> },
  { id: "brainteaser", name: "Brain Teaser", emoji: "🧠", component: <NormalGames2.BrainTeaser /> },
  { id: "clickspeed", name: "Click Speed", emoji: "🖱️", component: <NormalGames2.ClickSpeed /> },
  { id: "patternrec", name: "Pattern Recognition", emoji: "📊", component: <NormalGames2.PatternRecognition /> },
  { id: "mentalmath", name: "Mental Math", emoji: "🧮", component: <NormalGames2.MentalMath /> },
  { id: "visualmemory", name: "Visual Memory", emoji: "👀", component: <NormalGames2.VisualMemory /> },
  { id: "spotdiff", name: "Spot Difference", emoji: "🔍", component: <NormalGames2.SpotDifference /> },
  { id: "counting", name: "Counting Game", emoji: "🔢", component: <NormalGames2.CountingGame /> },
  { id: "arrowkeys", name: "Arrow Keys", emoji: "⬆️", component: <NormalGames2.ArrowKeys /> },
  { id: "colorcycle", name: "Color Cycle", emoji: "🌈", component: <NormalGames2.ColorCycle /> },
  { id: "gridmemory", name: "Grid Memory", emoji: "📱", component: <NormalGames2.GridMemory /> },
  { id: "speedtype", name: "Speed Type", emoji: "⌨️", component: <NormalGames2.SpeedType /> },
  { id: "numberseq", name: "Number Sequence", emoji: "1️⃣", component: <NormalGames2.NumberSequence /> },
  { id: "matchinggame", name: "Matching Game", emoji: "🃏", component: <NormalGames2.MatchingGame /> },
  { id: "rapidfire", name: "Rapid Fire", emoji: "🔥", component: <NormalGames2.RapidFire /> },
  { id: "logicpuzzle", name: "Logic Puzzle", emoji: "🧠", component: <NormalGames2.LogicPuzzle /> },
  { id: "eyespy", name: "Eye Spy", emoji: "👁️", component: <NormalGames2.EyeSpy /> },
  { id: "digitdash", name: "Digit Dash", emoji: "🔢", component: <NormalGames2.DigitDash /> },
  { id: "flashcards", name: "Flash Cards", emoji: "📇", component: <NormalGames2.FlashCards /> },
  { id: "trailfollow", name: "Trail Follow", emoji: "➡️", component: <NormalGames2.TrailFollow /> },
  { id: "quickdraw", name: "Quick Draw", emoji: "🎨", component: <NormalGames2.QuickDraw /> },
  { id: "symbolmatch", name: "Symbol Match", emoji: "⭐", component: <NormalGames2.SymbolMatch /> },
  { id: "taptempo", name: "Tap Tempo", emoji: "🥁", component: <NormalGames2.TapTempo /> },
  { id: "mazerunner", name: "Maze Runner", emoji: "🌀", component: <NormalGames2.MazeRunner /> },
  { id: "colorpop", name: "Color Pop", emoji: "🟡", component: <NormalGames2.ColorPop /> },
  { id: "wordchain", name: "Word Chain", emoji: "🔗", component: <NormalGames2.WordChain /> },
  { id: "focustest", name: "Focus Test", emoji: "🎯", component: <NormalGames2.FocusTest /> },
  { id: "binary", name: "Binary Blitz", emoji: "💻", component: <NormalGames2.BinaryBlitz /> },
  { id: "catchlight", name: "Catch the Light", emoji: "💡", component: <NormalGames2.CatchTheLight /> },
  { id: "hexmatch", name: "Hex Match", emoji: "⬡", component: <NormalGames2.HexMatch /> },
  { id: "doubledigit", name: "Double Digit", emoji: "🔢", component: <NormalGames2.DoubleDigit /> },
  { id: "shapeshift", name: "Shape Shift", emoji: "🔄", component: <NormalGames2.ShapeShift /> },
  { id: "circuit", name: "Circuit Connect", emoji: "🔌", component: <NormalGames2.CircuitConnect /> },
  { id: "tileslide", name: "Tile Slide", emoji: "🔲", component: <NormalGames2.TileSlide /> },
  { id: "neonclick", name: "Neon Click", emoji: "💫", component: <NormalGames2.NeonClick /> },
  { id: "zenfocus", name: "Zen Focus", emoji: "🧘", component: <NormalGames2.ZenFocus /> },
  { id: "pixelpop", name: "Pixel Pop", emoji: "👾", component: <NormalGames2.PixelPop /> },
  { id: "infinityrun", name: "Infinity Run", emoji: "♾️", component: <NormalGames2.InfinityRun /> },
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
      <div className="container max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-4 text-glow-cyan">
          🎮 Play Games
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {getGames().length} games in this category!
        </p>

        <Tabs value={category} onValueChange={(v) => { setCategory(v as GameCategory); setSelectedGame(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 mb-8">
            <TabsTrigger value="christmas" className="font-display text-xs md:text-sm data-[state=active]:bg-christmas-red data-[state=active]:text-foreground">
              🎄 <span className="hidden md:inline ml-1">Christmas</span>
            </TabsTrigger>
            <TabsTrigger value="halloween" className="font-display text-xs md:text-sm data-[state=active]:bg-halloween-orange data-[state=active]:text-foreground">
              🎃 <span className="hidden md:inline ml-1">Halloween</span>
            </TabsTrigger>
            <TabsTrigger value="spring" className="font-display text-xs md:text-sm data-[state=active]:bg-spring-pink data-[state=active]:text-foreground">
              🌸 <span className="hidden md:inline ml-1">Spring</span>
            </TabsTrigger>
            <TabsTrigger value="autumn" className="font-display text-xs md:text-sm data-[state=active]:bg-autumn-orange data-[state=active]:text-foreground">
              🍂 <span className="hidden md:inline ml-1">Autumn</span>
            </TabsTrigger>
            <TabsTrigger value="normal" className="font-display text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🕹️ <span className="hidden md:inline ml-1">Normal</span>
            </TabsTrigger>
          </TabsList>

          {["christmas", "halloween", "spring", "autumn", "normal"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {!selectedGame ? (
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto p-2">
                  {getGames().map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`group relative p-3 rounded-xl bg-card border-2 ${styles.border} transition-all duration-300 hover:scale-105`}
                    >
                      <div className="text-2xl md:text-3xl mb-1 group-hover:animate-float">{game.emoji}</div>
                      <h3 className={`font-display text-xs ${styles.text} truncate`}>{game.name}</h3>
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
