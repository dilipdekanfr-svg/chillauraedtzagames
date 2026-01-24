import Dynamic3DGame from "./Dynamic3DGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Add 3D-specific name generators
const generate3DGameName = (index: number): string => {
  const prefixes = [
    'Cosmic', 'Neon', 'Cyber', 'Quantum', 'Hyper', 'Ultra', 'Mega', 'Super',
    'Astro', 'Galactic', 'Stellar', 'Nova', 'Plasma', 'Vortex', 'Nebula', 'Orbit',
    'Crystal', 'Prism', 'Hologram', 'Virtual', 'Digital', 'Matrix', 'Pixel', 'Vector',
    'Fusion', 'Pulse', 'Infinity', 'Zero', 'Apex', 'Prime', 'Core', 'Edge',
    'Shadow', 'Light', 'Void', 'Flux', 'Wave', 'Beam', 'Spark', 'Glow'
  ];
  const suffixes = [
    'Runner', 'Dash', 'Chase', 'Quest', 'Hunter', 'Racer', 'Rider', 'Walker',
    'Jumper', 'Climber', 'Diver', 'Flyer', 'Glider', 'Shooter', 'Blaster', 'Striker',
    'Collector', 'Catcher', 'Grabber', 'Seeker', 'Finder', 'Breaker', 'Crusher', 'Smasher',
    'Defender', 'Guardian', 'Warrior', 'Knight', 'Master', 'Champion', 'Hero', 'Legend',
    'Sphere', 'Cube', 'Orb', 'Ring', 'Star', 'Crystal', 'Gem', 'Diamond',
    'Escape', 'Adventure', 'Journey', 'Voyage', 'Mission', 'Challenge', 'Trial', 'Battle'
  ];
  
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

const get3DGameEmoji = (index: number): string => {
  const emojis = [
    '🎮', '🕹️', '🚀', '🛸', '👾', '🤖', '🌟', '💫', '⭐', '🌙',
    '🔮', '💎', '🎯', '🏆', '🎪', '🎨', '🎭', '🎲', '🃏', '🎰',
    '🌌', '🌠', '💠', '🔷', '🔶', '⚡', '🔥', '❄️', '🌀', '🎇',
    '🎆', '✨', '💥', '💢', '🌈', '🎵', '🎶', '🔔', '🎁', '🏅'
  ];
  return emojis[index % emojis.length];
};

// Generate 1000 unique 3D games
const threeDGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 1000; i++) {
  const id = `3d-game-${i + 1}`;
  const name = generate3DGameName(i);
  const emoji = get3DGameEmoji(i);
  const themeColors = ['bg-primary', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500'];
  const themeColor = themeColors[i % themeColors.length];
  
  threeDGames.push({
    id,
    name,
    emoji,
    component: <Dynamic3DGame key={id} gameId={5000 + i} category="3d" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default threeDGames;
