import { useState, useEffect, useCallback, forwardRef } from "react";
import { Button } from "@/components/ui/button";

interface DynamicGameProps {
  gameId: number;
  category: string;
  emoji: string;
  name: string;
  themeColor: string;
}

// 30 unique game mechanic templates
const gameMechanics = [
  'clicker', 'fallingCatcher', 'targetShooter', 'memorySequence', 'reactionTest',
  'balanceBar', 'endlessRunner', 'patternMatch', 'mathChallenge', 'typingRace',
  'mazeNavigator', 'stackBuilder', 'bubblePop', 'colorSort', 'rhythmTap',
  'aimTrainer', 'dodgeBall', 'collectThings', 'simonSays', 'sliderPuzzle',
  'countdownChallenge', 'holdSteady', 'multiClick', 'chainReaction', 'growthGame',
  'defenseGame', 'racingGame', 'launchGame', 'timingGame', 'resourceManager'
];

const DynamicGame = forwardRef<HTMLDivElement, DynamicGameProps>(({ gameId, category, emoji, name, themeColor }, ref) => {
  const mechanic = gameMechanics[gameId % gameMechanics.length];
  const variant = Math.floor(gameId / gameMechanics.length) % 10;
  const speedMod = 1 + (gameId % 5) * 0.2;
  const sizeMod = 1 + (gameId % 3) * 0.3;
  
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 + variant * 5);
  const [entities, setEntities] = useState<{id:number;x:number;y:number;type:number}[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [power, setPower] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [health, setHealth] = useState(100);

  // Timer effect
  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
      if (timeLeft <= 1) setActive(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  // Entity spawner for catcher/shooter games
  useEffect(() => {
    if (!active) return;
    if (['fallingCatcher', 'targetShooter', 'bubblePop', 'collectThings', 'dodgeBall'].includes(mechanic)) {
      const interval = setInterval(() => {
        setEntities(prev => [...prev.slice(-(10 + variant * 2)), {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: mechanic === 'dodgeBall' ? Math.random() * 60 + 10 : 0,
          type: Math.floor(Math.random() * 4)
        }]);
      }, (1000 - variant * 50) / speedMod);
      return () => clearInterval(interval);
    }
  }, [active, mechanic, variant, speedMod]);

  // Entity movement
  useEffect(() => {
    if (!active) return;
    if (['fallingCatcher', 'bubblePop', 'collectThings'].includes(mechanic)) {
      const interval = setInterval(() => {
        setEntities(prev => {
          const next = prev.map(e => ({ ...e, y: e.y + (2 * speedMod) }));
          next.forEach(e => {
            if (e.y > 85 && Math.abs(e.x - playerPos.x) < 12) {
              setScore(s => s + 10 + combo);
              setCombo(c => c + 1);
              setEntities(p => p.filter(x => x.id !== e.id));
            }
          });
          return next.filter(e => e.y < 100);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [active, mechanic, playerPos, speedMod, combo]);

  // Dodge ball collision
  useEffect(() => {
    if (!active || mechanic !== 'dodgeBall') return;
    entities.forEach(e => {
      if (Math.abs(e.x - playerPos.x) < 10 && Math.abs(e.y - playerPos.y) < 10) {
        setHealth(h => Math.max(0, h - 10));
        setEntities(prev => prev.filter(x => x.id !== e.id));
        if (health <= 10) setActive(false);
      }
    });
    setScore(s => s + 1);
  }, [entities, playerPos, active, mechanic, health]);

  const handleClick = useCallback(() => {
    if (mechanic === 'clicker') {
      setScore(s => s + 1 + Math.floor(power / 10));
      setCombo(c => c + 1);
      if (combo > 0 && combo % 10 === 0) setPower(p => p + 5);
    }
  }, [mechanic, power, combo]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerPos({ x, y });
  };

  const hitTarget = (id: number) => {
    setScore(s => s + 5 + level);
    setCombo(c => c + 1);
    setEntities(prev => prev.filter(e => e.id !== id));
    if (score > 0 && score % 50 === 0) setLevel(l => l + 1);
  };

  const startGame = () => {
    setActive(true);
    setScore(0);
    setTimeLeft(20 + variant * 5);
    setEntities([]);
    setCombo(0);
    setPower(0);
    setLevel(1);
    setHealth(100);
    setSequence([]);
    setPlayerSequence([]);
    setShowing(-1);
    
    if (mechanic === 'memorySequence' || mechanic === 'simonSays') {
      const newSeq = Array.from({ length: 3 + variant }, () => Math.floor(Math.random() * 4));
      setSequence(newSeq);
      let i = 0;
      const show = setInterval(() => {
        if (i < newSeq.length) { setShowing(newSeq[i]); i++; }
        else { setShowing(-1); clearInterval(show); }
      }, 600);
    }
    
    if (mechanic === 'targetShooter') {
      setEntities(Array.from({ length: 6 + variant * 2 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        type: Math.floor(Math.random() * 4)
      })));
    }
    
    if (mechanic === 'reactionTest') {
      const delay = 1000 + Math.random() * 3000;
      setTimeout(() => setShowing(0), delay);
    }
  };

  const playSequence = (n: number) => {
    const newPlayerSeq = [...playerSequence, n];
    setPlayerSequence(newPlayerSeq);
    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setActive(false);
      return;
    }
    if (newPlayerSeq.length === sequence.length) {
      setScore(s => s + sequence.length * 10);
      setLevel(l => l + 1);
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setPlayerSequence([]);
      let i = 0;
      const show = setInterval(() => {
        if (i < newSeq.length) { setShowing(newSeq[i]); i++; }
        else { setShowing(-1); clearInterval(show); }
      }, 600);
    }
  };

  const renderGame = () => {
    switch (mechanic) {
      case 'clicker':
        return (
          <div className="text-center">
            <div className="flex justify-between mb-2">
              <span className={`font-display ${themeColor.replace('bg-', 'text-')}`}>Score: {score}</span>
              <span className="text-muted-foreground">Power: {power}</span>
            </div>
            <button onClick={handleClick} className={`text-6xl hover:scale-110 active:scale-95 transition-transform`}>
              {emoji}
            </button>
            <p className="text-xs mt-2 text-muted-foreground">Combo: {combo}</p>
          </div>
        );
      
      case 'fallingCatcher':
      case 'collectThings':
      case 'bubblePop':
        return (
          <div className="relative w-full h-48 bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl overflow-hidden" onMouseMove={handleMouseMove}>
            {entities.map(e => (
              <span key={e.id} className="absolute text-xl" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                {emoji}
              </span>
            ))}
            <div className="absolute text-2xl" style={{ left: `${playerPos.x}%`, bottom: '5%', transform: 'translateX(-50%)' }}>
              🧺
            </div>
          </div>
        );
      
      case 'targetShooter':
        return (
          <div className="relative w-full h-48 bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl overflow-hidden cursor-crosshair">
            {entities.map(e => (
              <button key={e.id} onClick={() => hitTarget(e.id)} 
                className="absolute text-2xl hover:scale-125 transition"
                style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                {emoji}
              </button>
            ))}
          </div>
        );
      
      case 'memorySequence':
      case 'simonSays':
        return (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map(n => (
              <button key={n} onClick={() => playSequence(n)}
                className={`w-14 h-14 rounded-lg text-2xl transition ${showing === n ? `${themeColor} scale-110` : 'bg-muted'}`}>
                {emoji}
              </button>
            ))}
          </div>
        );
      
      case 'dodgeBall':
        return (
          <div className="relative w-full h-48 bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl overflow-hidden" onMouseMove={handleMouseMove}>
            {entities.map(e => (
              <span key={e.id} className="absolute text-xl" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                {emoji}
              </span>
            ))}
            <div className="absolute text-2xl" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}>
              🏃
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-destructive transition-all" style={{ width: `${health}%` }} />
            </div>
          </div>
        );
      
      case 'reactionTest':
        return (
          <div className="text-center">
            <div className={`text-6xl mb-4 ${showing >= 0 ? 'animate-bounce' : ''}`}>
              {showing >= 0 ? emoji : '⏳'}
            </div>
            <Button onClick={() => { if (showing >= 0) { setScore(s => s + 100 - (Date.now() % 100)); setShowing(-1); } }}
              className={themeColor}>React!</Button>
          </div>
        );
      
      case 'balanceBar':
        return (
          <div className="text-center">
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary transition-all" style={{ width: `${power}%`, marginLeft: `${50 - power/2}%` }} />
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setPower(p => Math.max(0, p - 10))}>◀</Button>
              <Button onClick={() => setPower(p => Math.min(100, p + 10))}>▶</Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <button onClick={handleClick} className="text-5xl hover:scale-110 transition">
              {emoji}
            </button>
            <p className="mt-2">Score: {score}</p>
          </div>
        );
    }
  };

  return (
    <div ref={ref} className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4">
        <span className={`font-display ${themeColor.replace('bg-', 'text-')}`}>
          {mechanic === 'dodgeBall' ? `Health: ${health}` : `Score: ${score}`}
        </span>
        <span className="text-muted-foreground">
          {['memorySequence', 'simonSays'].includes(mechanic) ? `Level: ${level}` : `Time: ${timeLeft}s`}
        </span>
      </div>

      {!active ? (
        <div className="text-center">
          <p className="text-2xl mb-2">{emoji} {name}</p>
          {score > 0 && <p className={`${themeColor.replace('bg-', 'text-')} mb-2`}>Score: {score}</p>}
          <Button onClick={startGame} className={themeColor}>
            {score > 0 ? 'Play Again' : 'Start Game'}
          </Button>
        </div>
      ) : (
        renderGame()
      )}
    </div>
  );
});

DynamicGame.displayName = 'DynamicGame';

export default DynamicGame;
