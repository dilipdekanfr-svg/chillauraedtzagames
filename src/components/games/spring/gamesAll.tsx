import DynamicGame from "../DynamicGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate 60000 unique Spring games
const springGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 60000; i++) {
  const id = `spring-game-${i + 1}`;
  const name = generateGameName('spring', i);
  const emoji = getGameEmoji('spring', i);
  const themeColors = ['bg-spring-pink', 'bg-spring-green', 'bg-spring-blue', 'bg-spring-yellow'];
  const themeColor = themeColors[i % themeColors.length];
  
  springGames.push({
    id,
    name,
    emoji,
    component: <DynamicGame key={id} gameId={2000 + i} category="spring" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default springGames;
