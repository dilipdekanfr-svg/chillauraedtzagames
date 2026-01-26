import DynamicGame from "../DynamicGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate 6000 unique Christmas games
const christmasGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 6000; i++) {
  const id = `christmas-game-${i + 1}`;
  const name = generateGameName('christmas', i);
  const emoji = getGameEmoji('christmas', i);
  const themeColors = ['bg-christmas-red', 'bg-christmas-green', 'bg-christmas-gold'];
  const themeColor = themeColors[i % themeColors.length];
  
  christmasGames.push({
    id,
    name,
    emoji,
    component: <DynamicGame key={id} gameId={i} category="christmas" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default christmasGames;
