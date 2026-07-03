import Dynamic3DGame from "./Dynamic3DGame";

// Generate shooting game names
const generateShootingGameName = (index: number): string => {
  const prefixes = ['Cosmic', 'Neon', 'Cyber', 'Quantum', 'Hyper', 'Ultra', 'Mega', 'Super', 'Astro', 'Galactic', 'Stellar', 'Nova', 'Plasma', 'Vortex', 'Nebula', 'Orbit'];
  const suffixes = ['Shooter', 'Blaster', 'Striker', 'Fighter', 'Destroyer', 'Hunter', 'Slayer', 'Assault', 'Battle', 'Combat', 'Gunner', 'Sniper', 'Defense', 'Guardian'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate racing game names
const generateRacingGameName = (index: number): string => {
  const prefixes = ['Turbo', 'Nitro', 'Speed', 'Velocity', 'Hyper', 'Ultra', 'Thunder', 'Lightning', 'Blaze', 'Flash', 'Sonic', 'Rapid', 'Extreme', 'Insane', 'Fury', 'Storm'];
  const suffixes = ['Racer', 'Racing', 'Rush', 'Dash', 'Sprint', 'Chase', 'Drift', 'Circuit', 'Rally', 'Grand Prix', 'Championship', 'Speedway', 'Highway', 'Street'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate platformer game names
const generatePlatformerName = (index: number): string => {
  const prefixes = ['Super', 'Mega', 'Ultra', 'Epic', 'Amazing', 'Incredible', 'Fantastic', 'Wonder', 'Dream', 'Cloud', 'Sky', 'Star', 'Moon', 'Crystal', 'Magic', 'Pixel'];
  const suffixes = ['Jumper', 'Hopper', 'Runner', 'Climber', 'Bouncer', 'Leaper', 'Adventure', 'Quest', 'Journey', 'World', 'Land', 'Kingdom', 'Island', 'Paradise'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate puzzle game names
const generatePuzzleName = (index: number): string => {
  const prefixes = ['Cube', 'Block', 'Shape', 'Color', 'Pattern', 'Logic', 'Mind', 'Brain', 'Genius', 'Smart', 'Clever', 'Tricky', 'Mystery', 'Enigma', 'Riddle', 'Maze'];
  const suffixes = ['Puzzle', 'Challenge', 'Quest', 'Master', 'Solver', 'Builder', 'Stacker', 'Matcher', 'Breaker', 'Crusher', 'Blitz', 'Mania', 'Frenzy', 'Rush'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate adventure game names
const generateAdventureName = (index: number): string => {
  const prefixes = ['Lost', 'Hidden', 'Secret', 'Ancient', 'Mystic', 'Shadow', 'Dark', 'Golden', 'Emerald', 'Crystal', 'Dragon', 'Knight', 'Wizard', 'Hero', 'Legend', 'Epic'];
  const suffixes = ['Temple', 'Dungeon', 'Castle', 'Forest', 'Cave', 'Realm', 'Kingdom', 'World', 'Quest', 'Journey', 'Saga', 'Chronicles', 'Tales', 'Adventure'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate sports game names
const generateSportsName = (index: number): string => {
  const prefixes = ['Pro', 'Super', 'Ultra', 'Mega', 'Champion', 'All-Star', 'Legend', 'Elite', 'Premier', 'World', 'Global', 'Ultimate', 'Extreme', 'Power', 'Thunder', 'Storm'];
  const suffixes = ['Soccer', 'Basketball', 'Tennis', 'Golf', 'Boxing', 'Wrestling', 'Hockey', 'Baseball', 'Football', 'Bowling', 'Archery', 'Skiing', 'Surfing', 'Skating'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate mech/tank warfare game names
const generateMechName = (index: number): string => {
  const prefixes = ['Titan', 'Iron', 'Steel', 'Chrome', 'Atomic', 'Nuclear', 'Phantom', 'Rogue', 'Alpha', 'Omega', 'Vanguard', 'Sentinel', 'Colossus', 'Havoc', 'Rampage', 'Overlord'];
  const suffixes = ['Mech', 'Titan', 'Warmachine', 'Bruiser', 'Crusher', 'Behemoth', 'Ravager', 'Warfare', 'Battalion', 'Legion', 'Squadron', 'Onslaught', 'Uprising', 'Dominion'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Generate hovercraft/futuristic race names
const generateHoverName = (index: number): string => {
  const prefixes = ['Neo', 'Cyber', 'Anti-Grav', 'Zero-G', 'Photon', 'Ion', 'Warp', 'Pulse', 'Chrono', 'Void', 'Aether', 'Quantum', 'Neon', 'Hyper', 'Flux', 'Skyline'];
  const suffixes = ['Hover', 'Glide', 'Skimmer', 'Levitator', 'Skyracer', 'Drift', 'Repulse', 'Airborne', 'Floater', 'Zephyr', 'Skyway', 'Cloudline', 'Pathway', 'Corridor'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]}`;
};

// Game type configuration
const gameTypes = [
  { type: 'shooter', generator: generateShootingGameName, emojis: ['🎯', '🔫', '💥', '🚀', '👾', '🛸', '⚡', '💫', '🔥', '☄️'] },
  { type: 'racing', generator: generateRacingGameName, emojis: ['🏎️', '🏁', '🚗', '🏍️', '🛞', '⚡', '💨', '🌪️', '🔥', '✨'] },
  { type: 'platformer', generator: generatePlatformerName, emojis: ['🦘', '🏃', '⬆️', '🌟', '🍄', '🪙', '🎪', '🌈', '☁️', '🏔️'] },
  { type: 'puzzle', generator: generatePuzzleName, emojis: ['🧩', '🔲', '🎲', '💎', '🔮', '🧠', '💡', '🔑', '🎯', '⚙️'] },
  { type: 'adventure', generator: generateAdventureName, emojis: ['🗡️', '🛡️', '🏰', '🐉', '🧙', '💀', '🗺️', '🔱', '👑', '⚔️'] },
  { type: 'sports', generator: generateSportsName, emojis: ['⚽', '🏀', '🎾', '⛳', '🥊', '🤼', '🏒', '⚾', '🏈', '🎳'] },
  { type: 'mech', generator: generateMechName, emojis: ['🤖', '🦾', '⚙️', '🛡️', '🪖', '💣', '🎖️', '🚁', '🛰️', '🔧'] },
  { type: 'hover', generator: generateHoverName, emojis: ['🛸', '✈️', '🛩️', '🚀', '⚡', '💫', '🌌', '🌠', '💠', '🔷'] },
];

const generate3DGameName = (index: number): string => {
  const typeIndex = index % gameTypes.length;
  const gameIndex = Math.floor(index / gameTypes.length);
  return gameTypes[typeIndex].generator(gameIndex);
};

const get3DGameEmoji = (index: number): string => {
  const typeIndex = index % gameTypes.length;
  const gameIndex = Math.floor(index / gameTypes.length);
  return gameTypes[typeIndex].emojis[gameIndex % gameTypes[typeIndex].emojis.length];
};

// Generate 60000 unique 3D games across 6 genres
const threeDGames: { id: string; name: string; emoji: string; component: React.ReactNode }[] = [];

for (let i = 0; i < 60000; i++) {
  const id = `3d-game-${i + 1}`;
  const name = generate3DGameName(i);
  const emoji = get3DGameEmoji(i);
  const themeColors = ['bg-primary', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500'];
  const themeColor = themeColors[i % themeColors.length];
  
  threeDGames.push({
    id,
    name,
    emoji,
    component: <Dynamic3DGame key={id} gameId={5000 + i} category="3d" emoji={emoji} name={name} themeColor={themeColor} />
  });
}

export default threeDGames;
