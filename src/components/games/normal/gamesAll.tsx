import DynamicGame from "../DynamicGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate 2000 unique Normal games
const normalGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 2000; i++) {
  const id = `normal-game-${i + 1}`;
  const name = generateGameName('normal', i);
  const emoji = getGameEmoji('normal', i);
  const themeColors = ['bg-primary', 'bg-secondary', 'bg-accent'];
  const themeColor = themeColors[i % themeColors.length];
  
  normalGames.push({
    id,
    name,
    emoji,
    component: <DynamicGame key={id} gameId={4000 + i} category="normal" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default normalGames;
