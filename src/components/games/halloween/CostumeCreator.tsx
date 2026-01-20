import { useState } from "react";

const COSTUMES = [
  { emoji: "🧛", name: "Vampire" },
  { emoji: "🧟", name: "Zombie" },
  { emoji: "🎃", name: "Pumpkin" },
  { emoji: "👻", name: "Ghost" },
  { emoji: "🧙", name: "Witch" },
  { emoji: "💀", name: "Skeleton" },
];

const ACCESSORIES = ["🎩", "👑", "🎀", "🕶️", "⭐", "🌙"];
const BACKGROUNDS = ["🌑", "🌕", "🏚️", "🌲", "⚰️", "🕯️"];

const CostumeCreator = () => {
  const [costume, setCostume] = useState(COSTUMES[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [creations, setCreations] = useState(0);

  const saveCostume = () => {
    setCreations(c => c + 1);
  };

  const randomize = () => {
    setCostume(COSTUMES[Math.floor(Math.random() * COSTUMES.length)]);
    setAccessory(ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)]);
    setBackground(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-halloween-orange">Creations: {creations}</span>
        <button onClick={randomize} className="text-halloween-purple hover:underline text-sm">
          🎲 Randomize
        </button>
      </div>

      {/* Preview */}
      <div className="w-48 h-48 bg-gradient-to-b from-halloween-purple/30 to-halloween-orange/30 rounded-xl flex flex-col items-center justify-center mb-4 relative">
        <div className="absolute top-2 right-2 text-2xl">{background}</div>
        <div className="absolute top-8 text-2xl">{accessory}</div>
        <div className="text-6xl">{costume.emoji}</div>
        <p className="mt-2 font-display text-sm">{costume.name}</p>
      </div>

      {/* Costume Selection */}
      <div className="w-full mb-3">
        <p className="text-xs text-muted-foreground mb-1">Costume:</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {COSTUMES.map(c => (
            <button
              key={c.name}
              onClick={() => setCostume(c)}
              className={`text-2xl p-1 rounded ${costume.name === c.name ? 'bg-halloween-purple' : 'bg-muted'}`}
            >
              {c.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Accessory Selection */}
      <div className="w-full mb-3">
        <p className="text-xs text-muted-foreground mb-1">Accessory:</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {ACCESSORIES.map(a => (
            <button
              key={a}
              onClick={() => setAccessory(a)}
              className={`text-2xl p-1 rounded ${accessory === a ? 'bg-halloween-orange' : 'bg-muted'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div className="w-full mb-4">
        <p className="text-xs text-muted-foreground mb-1">Background:</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {BACKGROUNDS.map(b => (
            <button
              key={b}
              onClick={() => setBackground(b)}
              className={`text-2xl p-1 rounded ${background === b ? 'bg-halloween-purple' : 'bg-muted'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveCostume}
        className="px-4 py-2 bg-halloween-orange hover:bg-halloween-orange/80 rounded-lg font-display"
      >
        ✨ Save Creation
      </button>
    </div>
  );
};

export default CostumeCreator;
