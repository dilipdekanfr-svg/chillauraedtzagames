import Dynamic3DGame from "./Dynamic3DGame";
import { generateGameName, getGameEmoji } from "../gameGenerators";

// Generate shooting game names
const generateShootingGameName = (index: number): string => {
  const prefixes = [
    'Cosmic', 'Neon', 'Cyber', 'Quantum', 'Hyper', 'Ultra', 'Mega', 'Super',
    'Astro', 'Galactic', 'Stellar', 'Nova', 'Plasma', 'Vortex', 'Nebula', 'Orbit',
    'Laser', 'Photon', 'Turbo', 'Rapid', 'Blazing', 'Thunder', 'Lightning', 'Storm',
    'Atomic', 'Nuclear', 'Fusion', 'Pulse', 'Infinity', 'Zero', 'Apex', 'Prime'
  ];
  const suffixes = [
    'Shooter', 'Blaster', 'Striker', 'Fighter', 'Destroyer', 'Hunter', 'Slayer', 'Terminator',
    'Assault', 'Attack', 'Battle', 'Combat', 'Warfare', 'Gunner', 'Sniper', 'Marksman',
    'Defense', 'Guardian', 'Protector', 'Defender', 'Sentinel', 'Warrior', 'Champion', 'Hero'
  ];
  
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate racing game names
const generateRacingGameName = (index: number): string => {
  const prefixes = [
    'Turbo', 'Nitro', 'Speed', 'Velocity', 'Hyper', 'Ultra', 'Mega', 'Super',
    'Thunder', 'Lightning', 'Blaze', 'Flash', 'Sonic', 'Rapid', 'Swift', 'Quick',
    'Cosmic', 'Neon', 'Cyber', 'Quantum', 'Astro', 'Galactic', 'Stellar', 'Nova',
    'Extreme', 'Insane', 'Crazy', 'Wild', 'Fury', 'Rage', 'Storm', 'Tornado'
  ];
  const suffixes = [
    'Racer', 'Racing', 'Rush', 'Dash', 'Sprint', 'Chase', 'Pursuit', 'Drift',
    'Circuit', 'Track', 'Rally', 'Grand Prix', 'Championship', 'League', 'Cup', 'Trophy',
    'Velocity', 'Acceleration', 'Speedway', 'Highway', 'Boulevard', 'Street', 'Road', 'Lane'
  ];
  
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

const generate3DGameName = (index: number): string => {
  // Even = shooting, Odd = racing
  if (index % 2 === 0) {
    return generateShootingGameName(Math.floor(index / 2));
  } else {
    return generateRacingGameName(Math.floor(index / 2));
  }
};

const get3DGameEmoji = (index: number): string => {
  const shootingEmojis = ['🎯', '🔫', '💥', '🚀', '👾', '🛸', '⚡', '💫', '🔥', '☄️'];
  const racingEmojis = ['🏎️', '🏁', '🚗', '🏍️', '🛞', '⚡', '💨', '🌪️', '🔥', '✨'];
  
  if (index % 2 === 0) {
    return shootingEmojis[Math.floor(index / 2) % shootingEmojis.length];
  } else {
    return racingEmojis[Math.floor(index / 2) % racingEmojis.length];
  }
};

// Generate 2000 unique 3D games
const threeDGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 2000; i++) {
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
