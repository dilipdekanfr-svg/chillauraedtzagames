import { useState, useEffect } from "react";

const PatternMatch = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [level, setLevel] = useState(1);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const start = () => { setIsPlaying(true); setLevel(1); generatePattern(2); };

  const generatePattern = (length: number) => {
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 9));
    setPattern(newPattern);
    setPlayerPattern([]);
    setShowPattern(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < newPattern.length) { setActiveCell(newPattern[i]); i++; }
      else { setActiveCell(null); clearInterval(interval); setShowPattern(false); }
    }, 600);
  };

  const handleClick = (index: number) => {
    if (showPattern) return;
    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);
    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      setIsPlaying(false);
    } else if (newPlayerPattern.length === pattern.length) {
      setLevel(l => l + 1);
      setTimeout(() => generatePattern(level + 2), 500);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 font-display text-primary">Level: {level}</div>
      {!isPlaying ? (
        <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          {level > 1 ? `Level ${level - 1} - Again?` : "Start"}
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <button key={i} onClick={() => handleClick(i)}
              className={`w-12 h-12 rounded-lg transition-all ${activeCell === i ? 'bg-primary scale-110' : 'bg-muted hover:bg-muted/80'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatternMatch;
