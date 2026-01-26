import DynamicGame from "../DynamicGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate 60000 unique Autumn games
const autumnGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 60000; i++) {
  const id = `autumn-game-${i + 1}`;
  const name = generateGameName('autumn', i);
  const emoji = getGameEmoji('autumn', i);
  const themeColors = ['bg-autumn-red', 'bg-autumn-gold', 'bg-autumn-brown'];
  const themeColor = themeColors[i % themeColors.length];
  
  autumnGames.push({
    id,
    name,
    emoji,
    component: <DynamicGame key={id} gameId={3000 + i} category="autumn" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default autumnGames;
