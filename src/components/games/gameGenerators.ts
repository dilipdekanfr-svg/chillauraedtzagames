// Game generator utilities for creating unique game mechanics
export const gameTypes = [
  'clicker', 'catcher', 'runner', 'memory', 'match', 'sort', 'dodge', 'shooter',
  'puzzle', 'reaction', 'timing', 'balance', 'builder', 'collector', 'defender',
  'racer', 'jumper', 'slider', 'spinner', 'counter', 'pattern', 'sequence',
  'aim', 'stack', 'merge', 'swap', 'type', 'draw', 'rhythm', 'math'
] as const;

export const getGameEmoji = (category: string, index: number): string => {
  const emojiSets: Record<string, string[]> = {
    christmas: ['🎄', '🎅', '🤶', '🦌', '⛄', '🎁', '🔔', '❄️', '🌟', '🕯️', '🧦', '🍪', '🥛', '🎿', '⛷️', '🛷', '🧤', '🧣', '🎀', '✨'],
    halloween: ['🎃', '👻', '🦇', '🕷️', '🕸️', '💀', '🧛', '🧟', '🧙', '🦴', '🍬', '🍭', '🌙', '⚰️', '🔮', '🐱', '🦉', '🐺', '😱', '👹'],
    spring: ['🌸', '🌷', '🌻', '🌼', '🌺', '🦋', '🐝', '🐞', '🐰', '🐣', '🌈', '☀️', '🌱', '💐', '🪻', '🪷', '🦆', '🐦', '🌧️', '☂️'],
    autumn: ['🍂', '🍁', '🎃', '🌾', '🍎', '🌽', '🥧', '🦃', '🍄', '🌰', '🐿️', '🦔', '🍇', '🥜', '🌻', '🦊', '🌲', '🍐', '🌿', '🪵'],
    normal: ['🎮', '🎯', '🏆', '⭐', '💎', '🔥', '⚡', '💫', '🚀', '🎪', '🎨', '🎵', '🔮', '💡', '🧩', '🎲', '🃏', '🎰', '🏅', '🎳']
  };
  const emojis = emojiSets[category] || emojiSets.normal;
  return emojis[index % emojis.length];
};

export const generateGameName = (category: string, index: number): string => {
  const prefixes: Record<string, string[]> = {
    christmas: ['Santa', 'Elf', 'Reindeer', 'Snowman', 'Gingerbread', 'Candy', 'Gift', 'Star', 'Bell', 'Frost', 'Winter', 'North', 'Jingle', 'Merry', 'Holly', 'Mistletoe', 'Sleigh', 'Chimney', 'Cocoa', 'Carol'],
    halloween: ['Spooky', 'Haunted', 'Ghost', 'Witch', 'Vampire', 'Zombie', 'Skeleton', 'Pumpkin', 'Monster', 'Creepy', 'Dark', 'Shadow', 'Cursed', 'Phantom', 'Ghoul', 'Terror', 'Nightmare', 'Demon', 'Bat', 'Spider'],
    spring: ['Bloom', 'Petal', 'Garden', 'Sunny', 'Rainbow', 'Bunny', 'Flower', 'Butterfly', 'Bee', 'Bird', 'Rain', 'Fresh', 'Meadow', 'Blossom', 'Sprout', 'Nest', 'Dewdrop', 'Breeze', 'Tulip', 'Daisy'],
    autumn: ['Harvest', 'Leaf', 'Acorn', 'Pumpkin', 'Apple', 'Corn', 'Turkey', 'Maple', 'Oak', 'Crisp', 'Golden', 'Cozy', 'Rustic', 'Forest', 'Squirrel', 'Mushroom', 'Chestnut', 'Scarecrow', 'Haystack', 'Bonfire'],
    normal: ['Super', 'Mega', 'Ultra', 'Hyper', 'Turbo', 'Power', 'Quick', 'Flash', 'Speed', 'Smart', 'Pixel', 'Neon', 'Cosmic', 'Epic', 'Pro', 'Master', 'Elite', 'Prime', 'Max', 'Alpha']
  };
  const suffixes = ['Rush', 'Dash', 'Pop', 'Drop', 'Catch', 'Match', 'Stack', 'Jump', 'Run', 'Spin', 'Flip', 'Blast', 'Bounce', 'Smash', 'Dodge', 'Chase', 'Hunt', 'Quest', 'Race', 'Frenzy', 'Mayhem', 'Madness', 'Chaos', 'Storm', 'Burst', 'Surge', 'Wave', 'Strike', 'Attack', 'Defense', 'Guard', 'Patrol', 'Escape', 'Rescue', 'Save', 'Collect', 'Gather', 'Find', 'Seek', 'Hide', 'Build', 'Create', 'Make', 'Craft', 'Sort', 'Swap', 'Slide', 'Roll', 'Toss'];
  
  const pre = prefixes[category] || prefixes.normal;
  return `${pre[index % pre.length]} ${suffixes[Math.floor(index / pre.length) % suffixes.length]}`;
};

// Core game mechanics that can be parameterized
export interface GameConfig {
  type: typeof gameTypes[number];
  speed: number;
  targetCount: number;
  timeLimit: number;
  difficulty: number;
}

export const generateGameConfig = (index: number): GameConfig => {
  return {
    type: gameTypes[index % gameTypes.length],
    speed: 1 + (index % 5) * 0.5,
    targetCount: 5 + (index % 20),
    timeLimit: 15 + (index % 45),
    difficulty: 1 + (index % 10)
  };
};
