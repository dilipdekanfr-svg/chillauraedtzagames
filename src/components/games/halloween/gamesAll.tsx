import DynamicGame from "../DynamicGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate 60000 unique Halloween games
const halloweenGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 60000; i++) {
  const id = `halloween-game-${i + 1}`;
  const name = generateGameName('halloween', i);
  const emoji = getGameEmoji('halloween', i);
  const themeColors = ['bg-halloween-orange', 'bg-halloween-purple', 'bg-halloween-green'];
  const themeColor = themeColors[i % themeColors.length];
  
  halloweenGames.push({
    id,
    name,
    emoji,
    component: <DynamicGame key={id} gameId={1000 + i} category="halloween" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default halloweenGames;
