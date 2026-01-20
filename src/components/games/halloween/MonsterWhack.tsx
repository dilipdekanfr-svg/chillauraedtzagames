import { useState, useEffect } from "react";

interface Monster {
  id: number;
  emoji: string;
  position: number;
  isUp: boolean;
}

const MONSTERS = ["👻", "🧟", "🧛", "👹", "💀"];

const MonsterWhack = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [monsters, setMonsters] = useState<Monster[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      emoji: MONSTERS[Math.floor(Math.random() * MONSTERS.length)],
      position: i,
      isUp: false
    }))
  );

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
  };

  const whackMonster = (id: number) => {
    const monster = monsters.find(m => m.id === id);
    if (monster?.isUp) {
      setScore(s => s + 10);
      setMonsters(prev => prev.map(m => 
        m.id === id ? { ...m, isUp: false } : m
      ));
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMonsters(prev => {
        const upMonsters = prev.filter(m => m.isUp).length;
        if (upMonsters < 3) {
          const downMonsters = prev.filter(m => !m.isUp);
          if (downMonsters.length > 0) {
            const randomMonster = downMonsters[Math.floor(Math.random() * downMonsters.length)];
            return prev.map(m => 
              m.id === randomMonster.id 
                ? { ...m, isUp: true, emoji: MONSTERS[Math.floor(Math.random() * MONSTERS.length)] } 
                : m
            );
          }
        }
        return prev;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMonsters(prev => prev.map(m => 
        m.isUp && Math.random() > 0.7 ? { ...m, isUp: false } : m
      ));
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) setIsPlaying(false);
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-halloween-orange">Score: {score}</span>
        <span className="text-halloween-purple">Time: {timeLeft}s</span>
      </div>

      <div className="relative w-full p-4 bg-gradient-to-b from-halloween-purple/20 to-halloween-orange/20 rounded-xl">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 rounded-xl">
            <p className="text-halloween-orange mb-2">{timeLeft === 0 ? `Game Over! Score: ${score}` : "Whack the monsters!"}</p>
            <button onClick={startGame} className="px-4 py-2 bg-halloween-purple text-foreground rounded-lg font-display">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {monsters.map(m => (
            <button
              key={m.id}
              onClick={() => whackMonster(m.id)}
              className={`h-16 rounded-lg bg-background/50 flex items-center justify-center text-3xl transition-all duration-200 ${
                m.isUp ? 'scale-110 bg-halloween-purple/30' : 'opacity-50'
              }`}
            >
              {m.isUp ? m.emoji : "🕳️"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">Click monsters when they appear!</p>
    </div>
  );
};

export default MonsterWhack;
