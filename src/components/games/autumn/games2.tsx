import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

// Game 11: Acorn Drop - Catch falling acorns
export const AcornDrop = () => {
  const [pos, setPos] = useState(50);
  const [acorns, setAcorns] = useState<{id:number;x:number;y:number}[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setAcorns(prev => [...prev.slice(-10), {id: Date.now(), x: Math.random()*80+10, y: 0}]);
    }, 800);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setAcorns(prev => {
        return prev.map(a => ({...a, y: a.y + 2})).filter(a => {
          if (a.y > 85 && Math.abs(a.x - pos) < 12) { setScore(s => s + 5); return false; }
          return a.y < 100;
        });
      });
    }, 50);
    return () => clearInterval(int);
  }, [pos]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Score: {score}</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-orange-200 to-amber-100 rounded-xl overflow-hidden"
        onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPos(((e.clientX - rect.left) / rect.width) * 100); }}>
        {acorns.map(a => <span key={a.id} className="absolute text-xl" style={{left:`${a.x}%`,top:`${a.y}%`}}>🌰</span>)}
        <div className="absolute text-2xl" style={{left:`${pos}%`,bottom:"5%",transform:"translateX(-50%)"}}>🧺</div>
      </div>
    </div>
  );
};

// Game 12: Maple Match - Memory matching with leaves
export const MapleMatch = () => {
  const leaves = ["🍁", "🍂", "🌿", "🍃"];
  const [cards, setCards] = useState<{id:number;emoji:string;flipped:boolean;matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffled = [...leaves, ...leaves].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((e, i) => ({id: i, emoji: e, flipped: false, matched: false})));
  }, []);

  const flip = (id: number) => {
    if (flipped.length === 2 || cards[id].matched || cards[id].flipped) return;
    const newCards = cards.map(c => c.id === id ? {...c, flipped: true} : c);
    setCards(newCards);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, matched: true} : c));
        setMatches(m => m + 1);
        setFlipped([]);
      } else {
        setTimeout(() => { setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, flipped: false} : c)); setFlipped([]); }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Matches: {matches}/4</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)} className={`w-10 h-10 rounded text-xl ${c.flipped || c.matched ? "bg-orange-200" : "bg-amber-700"}`}>
            {c.flipped || c.matched ? c.emoji : "🍁"}
          </button>
        ))}
      </div>
    </div>
  );
};

// Game 13: Hedgehog Hide - Click to hide before spotted
export const HedgehogHide = () => {
  const [hiding, setHiding] = useState(false);
  const [danger, setDanger] = useState(false);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      const isDanger = Math.random() > 0.6;
      setDanger(isDanger);
      if (isDanger && !hiding) setCaught(c => c + 1);
      else if (!isDanger && !hiding) setScore(s => s + 1);
      setTimeout(() => setDanger(false), 500);
    }, 1500);
    return () => clearInterval(int);
  }, [hiding]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-600">Score: {score}</span>
        <span className="text-red-500">Caught: {caught}</span>
      </div>
      <div className={`text-6xl transition-all ${hiding ? "scale-50 opacity-50" : ""}`}>{danger ? "🦅" : "🦔"}</div>
      <Button onMouseDown={() => setHiding(true)} onMouseUp={() => setHiding(false)} onMouseLeave={() => setHiding(false)}
        className="mt-4 bg-amber-600">Hold to Hide!</Button>
    </div>
  );
};

// Game 14: Pumpkin Roll - Roll pumpkin by clicking
export const PumpkinRoll = () => {
  const [distance, setDistance] = useState(0);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!rolling) return;
    const int = setInterval(() => setDistance(d => d + 1), 50);
    return () => clearInterval(int);
  }, [rolling]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Distance: {distance}m</div>
      <div className={`text-5xl transition-transform ${rolling ? "animate-spin" : ""}`}>🎃</div>
      <Button onMouseDown={() => setRolling(true)} onMouseUp={() => setRolling(false)} className="mt-4 bg-orange-500">
        Hold to Roll!
      </Button>
    </div>
  );
};

// Game 15: Owl Watch - Spot the owl when it appears
export const OwlWatch = () => {
  const [owlPos, setOwlPos] = useState({x: 50, y: 50});
  const [visible, setVisible] = useState(false);
  const [spotted, setSpotted] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setOwlPos({x: Math.random()*70+15, y: Math.random()*60+20});
      setVisible(true);
      setTimeout(() => setVisible(false), 800);
    }, 2000);
    return () => clearInterval(int);
  }, []);

  const spot = () => { if (visible) { setSpotted(s => s + 1); setVisible(false); } };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Spotted: {spotted}</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl overflow-hidden" onClick={spot}>
        {visible && <span className="absolute text-3xl cursor-pointer" style={{left:`${owlPos.x}%`,top:`${owlPos.y}%`,transform:"translate(-50%,-50%)"}}>🦉</span>}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/50">Click when you see the owl!</span>
      </div>
    </div>
  );
};

// Game 16: Cider Press - Click to press apples
export const CiderPress = () => {
  const [apples, setApples] = useState(0);
  const [cider, setCider] = useState(0);

  const press = () => {
    setApples(a => a + 1);
    if (apples >= 4) { setCider(c => c + 1); setApples(0); }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-red-500">Apples: {apples}/5</span>
        <span className="font-display text-amber-600">Cider: {cider} 🍺</span>
      </div>
      <div className="text-5xl">🍎</div>
      <Button onClick={press} className="mt-4 bg-red-500">Press Apple!</Button>
    </div>
  );
};

// Game 17: Haystack Jump - Timing jump game
export const HaystackJump = () => {
  const [jumping, setJumping] = useState(false);
  const [haystacks, setHaystacks] = useState<{id:number;x:number}[]>([]);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  const jump = useCallback(() => {
    if (jumping || !active) return;
    setJumping(true);
    setTimeout(() => setJumping(false), 500);
  }, [jumping, active]);

  useEffect(() => {
    if (!active) return;
    const int = setInterval(() => { setHaystacks(prev => [...prev.slice(-4), {id: Date.now(), x: 100}]); }, 1500);
    return () => clearInterval(int);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const int = setInterval(() => {
      setHaystacks(prev => {
        const next = prev.map(h => ({...h, x: h.x - 4})).filter(h => h.x > -10);
        next.forEach(h => { if (h.x < 25 && h.x > 10 && !jumping) setActive(false); });
        return next;
      });
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(int);
  }, [active, jumping]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Score: {score}</div>
      <div className="relative w-full h-28 bg-gradient-to-b from-blue-200 to-amber-200 rounded-xl overflow-hidden" onClick={jump}>
        {!active ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={() => {setActive(true);setScore(0);setHaystacks([]);}} className="bg-amber-500">{score > 0 ? "Again?" : "Start"}</Button>
          </div>
        ) : (
          <>
            <div className="absolute text-2xl transition-all" style={{left:"20%",bottom: jumping ? "60%" : "10%"}}>🧑‍🌾</div>
            {haystacks.map(h => <span key={h.id} className="absolute text-xl" style={{left:`${h.x}%`,bottom:"10%"}}>🌾</span>)}
          </>
        )}
      </div>
    </div>
  );
};

// Game 18: Chestnut Roast - Click when ready
export const ChestnutRoast = () => {
  const [heat, setHeat] = useState(0);
  const [roasted, setRoasted] = useState(0);
  const [burned, setBurned] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setHeat(h => {
        if (h >= 100) { setBurned(b => b + 1); return 0; }
        return h + 2;
      });
    }, 100);
    return () => clearInterval(int);
  }, []);

  const grab = () => {
    if (heat >= 70 && heat < 90) { setRoasted(r => r + 1); }
    setHeat(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Roasted: {roasted}</span>
        <span className="text-red-500">Burned: {burned}</span>
      </div>
      <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-4">
        <div className={`h-full transition-all ${heat >= 70 && heat < 90 ? "bg-amber-500" : heat >= 90 ? "bg-red-500" : "bg-yellow-300"}`} style={{width:`${heat}%`}}/>
      </div>
      <div className="text-4xl">🌰</div>
      <Button onClick={grab} className="mt-4 bg-amber-600">Grab! (70-90%)</Button>
    </div>
  );
};

// Game 19: Rake Leaves - Click to rake
export const RakeLeaves = () => {
  const [leaves, setLeaves] = useState(20);
  const [piles, setPiles] = useState(0);

  const rake = () => {
    if (leaves > 0) setLeaves(l => l - 1);
    if (leaves === 1) { setPiles(p => p + 1); setLeaves(20); }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-orange-500">Leaves: {leaves}</span>
        <span className="font-display text-amber-700">Piles: {piles}</span>
      </div>
      <div className="text-4xl mb-4">{"🍂".repeat(Math.min(leaves, 5))}</div>
      <Button onClick={rake} className="bg-orange-500">Rake! 🧹</Button>
    </div>
  );
};

// Game 20: Fall Festival - Collect tickets
export const FallFestival = () => {
  const [tickets, setTickets] = useState(0);
  const [rides, setRides] = useState(0);

  const collect = () => setTickets(t => t + 1);
  const ride = () => { if (tickets >= 5) { setRides(r => r + 1); setTickets(t => t - 5); } };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-orange-500">🎟️ {tickets}</span>
        <span className="font-display text-amber-600">Rides: {rides}</span>
      </div>
      <div className="text-5xl mb-4">🎡</div>
      <div className="flex gap-2">
        <Button onClick={collect} className="bg-orange-500">Get Ticket</Button>
        <Button onClick={ride} disabled={tickets < 5} className="bg-amber-600">Ride (5🎟️)</Button>
      </div>
    </div>
  );
};

// Games 21-30
export const CornMaze = () => {
  const [pos, setPos] = useState({x: 0, y: 0});
  const [moves, setMoves] = useState(0);
  const goal = {x: 3, y: 3};
  const move = (dx: number, dy: number) => { setPos(p => ({x: Math.max(0, Math.min(3, p.x + dx)), y: Math.max(0, Math.min(3, p.y + dy))})); setMoves(m => m + 1); };
  const won = pos.x === goal.x && pos.y === goal.y;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-1 mb-4">
        {Array.from({length: 16}).map((_, i) => {
          const x = i % 4, y = Math.floor(i / 4);
          return <div key={i} className={`w-8 h-8 rounded flex items-center justify-center ${pos.x === x && pos.y === y ? "bg-amber-500" : goal.x === x && goal.y === y ? "bg-green-500" : "bg-amber-200"}`}>
            {pos.x === x && pos.y === y ? "🧑" : goal.x === x && goal.y === y ? "🚪" : "🌽"}
          </div>;
        })}
      </div>
      {won ? <p className="text-green-500 font-bold">Escaped! 🎉</p> : (
        <div className="grid grid-cols-3 gap-1">
          <div/><Button size="sm" onClick={() => move(0,-1)}>↑</Button><div/>
          <Button size="sm" onClick={() => move(-1,0)}>←</Button>
          <Button size="sm" onClick={() => {setPos({x:0,y:0});setMoves(0);}}>⟳</Button>
          <Button size="sm" onClick={() => move(1,0)}>→</Button>
          <div/><Button size="sm" onClick={() => move(0,1)}>↓</Button><div/>
        </div>
      )}
    </div>
  );
};

export const TurkeyTrot = () => {
  const [steps, setSteps] = useState(0);
  const [turkeys, setTurkeys] = useState(0);
  const step = () => { setSteps(s => s + 1); if (steps > 0 && steps % 10 === 9) setTurkeys(t => t + 1); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Steps: {steps}</span>
        <span className="font-display text-orange-500">Turkeys: {turkeys} 🦃</span>
      </div>
      <div className="text-5xl">{steps % 2 === 0 ? "🦃" : "🏃"}</div>
      <Button onClick={step} className="mt-4 bg-amber-600">Trot!</Button>
    </div>
  );
};

export const ScarecrowBuild = () => {
  const parts = ["👒", "👕", "👖", "🧤"];
  const [built, setBuilt] = useState<string[]>([]);
  const add = (p: string) => { if (!built.includes(p)) setBuilt(b => [...b, p]); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Parts: {built.length}/4</div>
      <div className="h-20 flex flex-col items-center">{built.map((p, i) => <span key={i} className="text-xl">{p}</span>)}</div>
      <div className="flex gap-2 mt-4">
        {parts.map(p => <button key={p} onClick={() => add(p)} disabled={built.includes(p)} className={`text-2xl p-2 rounded ${built.includes(p) ? "opacity-50" : "bg-muted"}`}>{p}</button>)}
      </div>
      {built.length === 4 && <Button onClick={() => setBuilt([])} className="mt-2" variant="outline">Reset</Button>}
    </div>
  );
};

export const NutCracker = () => {
  const [nuts, setNuts] = useState(0);
  const [cracked, setCracked] = useState(0);
  const crack = () => { setCracked(c => c + 1); setNuts(n => n + Math.floor(Math.random() * 3) + 1); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Cracked: {cracked}</span>
        <span className="font-display text-amber-500">Nuts: {nuts} 🥜</span>
      </div>
      <div className="text-5xl">🌰</div>
      <Button onClick={crack} className="mt-4 bg-amber-600">Crack!</Button>
    </div>
  );
};

export const MigrationPath = () => {
  const [birds, setBirds] = useState<{id:number;x:number}[]>([]);
  const [guided, setGuided] = useState(0);

  useEffect(() => {
    const int = setInterval(() => { setBirds(prev => [...prev.slice(-6), {id: Date.now(), x: Math.random()*80+10}]); }, 1000);
    return () => clearInterval(int);
  }, []);

  const guide = (id: number) => { setGuided(g => g + 1); setBirds(prev => prev.filter(b => b.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Guided: {guided} 🦅</div>
      <div className="relative w-full h-32 bg-gradient-to-b from-blue-300 to-blue-100 rounded-xl overflow-hidden">
        {birds.map(b => <button key={b.id} onClick={() => guide(b.id)} className="absolute text-2xl hover:scale-125" style={{left:`${b.x}%`,top:"40%"}}>🦅</button>)}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-blue-600">Click birds to guide south!</div>
      </div>
    </div>
  );
};

export const GrapeHarvest = () => {
  const [grapes, setGrapes] = useState<{id:number;x:number;y:number}[]>([]);
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    const int = setInterval(() => { setGrapes(prev => [...prev.slice(-8), {id: Date.now(), x: Math.random()*80+10, y: Math.random()*60+20}]); }, 700);
    return () => clearInterval(int);
  }, []);

  const pick = (id: number) => { setPicked(p => p + 1); setGrapes(prev => prev.filter(g => g.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-purple-600">Picked: {picked} 🍇</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-green-200 to-green-300 rounded-xl overflow-hidden">
        {grapes.map(g => <button key={g.id} onClick={() => pick(g.id)} className="absolute text-2xl hover:scale-125" style={{left:`${g.x}%`,top:`${g.y}%`}}>🍇</button>)}
      </div>
    </div>
  );
};

export const SpicyChili = () => {
  const ingredients = ["🌶️", "🍅", "🧅", "🫘"];
  const [pot, setPot] = useState<string[]>([]);
  const [heat, setHeat] = useState(0);

  const add = (ing: string) => { setPot(p => [...p, ing]); if (ing === "🌶️") setHeat(h => h + 20); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-red-500">Heat: {"🔥".repeat(Math.floor(heat/20))}</span>
        <span className="text-amber-600">Items: {pot.length}</span>
      </div>
      <div className="h-12 flex gap-1 mb-4">{pot.slice(-6).map((i, idx) => <span key={idx}>{i}</span>)}</div>
      <div className="flex gap-2">
        {ingredients.map(i => <button key={i} onClick={() => add(i)} className="text-2xl p-2 bg-muted rounded">{i}</button>)}
      </div>
      <Button onClick={() => {setPot([]);setHeat(0);}} className="mt-2" variant="outline" size="sm">Clear</Button>
    </div>
  );
};

export const WoodChop = () => {
  const [chops, setChops] = useState(0);
  const [logs, setLogs] = useState(0);
  const chop = () => { setChops(c => c + 1); if (chops > 0 && chops % 5 === 4) setLogs(l => l + 1); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Chops: {chops}</span>
        <span className="font-display text-amber-500">Logs: {logs} 🪵</span>
      </div>
      <div className="text-5xl">🪓</div>
      <Button onClick={chop} className="mt-4 bg-amber-700">Chop!</Button>
    </div>
  );
};

export const CampfireStory = () => {
  const words = ["🐻", "🌲", "🏕️", "⭐", "🦊"];
  const [story, setStory] = useState<string[]>([]);
  const add = (w: string) => setStory(s => [...s.slice(-7), w]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Story: {story.length} parts</div>
      <div className="h-12 flex gap-1 mb-4">{story.map((w, i) => <span key={i} className="text-xl">{w}</span>)}</div>
      <div className="flex gap-2">
        {words.map(w => <button key={w} onClick={() => add(w)} className="text-2xl p-2 bg-muted rounded">{w}</button>)}
      </div>
    </div>
  );
};

export const AutumnRain = () => {
  const [pos, setPos] = useState(50);
  const [drops, setDrops] = useState<{id:number;x:number;y:number}[]>([]);
  const [dry, setDry] = useState(0);
  const [wet, setWet] = useState(0);

  useEffect(() => {
    const int = setInterval(() => { setDrops(prev => [...prev.slice(-20), {id: Date.now(), x: Math.random()*100, y: 0}]); }, 100);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setDrops(prev => {
        return prev.map(d => ({...d, y: d.y + 3})).filter(d => {
          if (d.y > 80) { if (Math.abs(d.x - pos) < 10) setDry(dr => dr + 1); else setWet(w => w + 1); return false; }
          return true;
        });
      });
    }, 50);
    return () => clearInterval(int);
  }, [pos]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-blue-500">Blocked: {dry}</span>
        <span className="text-blue-300">Wet: {wet}</span>
      </div>
      <div className="relative w-full h-32 bg-gradient-to-b from-gray-400 to-gray-200 rounded-xl overflow-hidden"
        onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPos(((e.clientX - rect.left) / rect.width) * 100); }}>
        {drops.map(d => <span key={d.id} className="absolute text-sm" style={{left:`${d.x}%`,top:`${d.y}%`}}>💧</span>)}
        <div className="absolute text-2xl" style={{left:`${pos}%`,bottom:"5%",transform:"translateX(-50%)"}}>☂️</div>
      </div>
    </div>
  );
};

// Games 31-40
export const BootsAndPuddles = () => {
  const [splashes, setSplashes] = useState(0);
  const [splashing, setSplashing] = useState(false);

  const splash = () => { setSplashing(true); setSplashes(s => s + 1); setTimeout(() => setSplashing(false), 300); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-blue-500">Splashes: {splashes}</div>
      <div className={`text-5xl ${splashing ? "animate-bounce" : ""}`}>👢</div>
      <div className="text-3xl">💦</div>
      <Button onClick={splash} className="mt-4 bg-blue-500">Splash!</Button>
    </div>
  );
};

export const HotCocoa = () => {
  const ingredients = ["☕", "🥛", "🍫", "🍬"];
  const [cup, setCup] = useState<string[]>([]);
  const add = (i: string) => setCup(c => [...c, i]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Ingredients: {cup.length}</div>
      <div className="text-5xl mb-2">☕</div>
      <div className="h-8 flex gap-1 mb-4">{cup.slice(-4).map((i, idx) => <span key={idx}>{i}</span>)}</div>
      <div className="flex gap-2">
        {ingredients.map(i => <button key={i} onClick={() => add(i)} className="text-xl p-2 bg-muted rounded">{i}</button>)}
      </div>
      <Button onClick={() => setCup([])} className="mt-2" variant="outline" size="sm">New Cup</Button>
    </div>
  );
};

export const PineConeCollect = () => {
  const [cones, setCones] = useState<{id:number;x:number;y:number}[]>([]);
  const [collected, setCollected] = useState(0);

  useEffect(() => {
    const int = setInterval(() => { setCones(prev => [...prev.slice(-10), {id: Date.now(), x: Math.random()*80+10, y: Math.random()*60+20}]); }, 600);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => { setCones(prev => prev.filter(c => Date.now() - c.id < 3000)); }, 100);
    return () => clearInterval(int);
  }, []);

  const collect = (id: number) => { setCollected(c => c + 1); setCones(prev => prev.filter(c => c.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Collected: {collected} 🌲</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-green-700 to-green-900 rounded-xl overflow-hidden">
        {cones.map(c => <button key={c.id} onClick={() => collect(c.id)} className="absolute text-xl hover:scale-125" style={{left:`${c.x}%`,top:`${c.y}%`}}>🌲</button>)}
      </div>
    </div>
  );
};

export const FoxDash = () => {
  const [pos, setPos] = useState(50);
  const [rabbits, setRabbits] = useState<{id:number;x:number}[]>([]);
  const [caught, setCaught] = useState(0);

  useEffect(() => {
    const int = setInterval(() => { setRabbits(prev => [...prev.slice(-4), {id: Date.now(), x: Math.random()*80+10}]); }, 1500);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPos(p => Math.max(10, p - 10));
      if (e.key === "ArrowRight") setPos(p => Math.min(90, p + 10));
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  useEffect(() => {
    setRabbits(prev => {
      const near = prev.filter(r => Math.abs(r.x - pos) < 10);
      if (near.length > 0) setCaught(c => c + near.length);
      return prev.filter(r => Math.abs(r.x - pos) >= 10);
    });
  }, [pos]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Caught: {caught} 🐰</div>
      <div className="relative w-full h-24 bg-gradient-to-b from-amber-200 to-green-300 rounded-xl overflow-hidden">
        {rabbits.map(r => <span key={r.id} className="absolute text-xl" style={{left:`${r.x}%`,top:"40%"}}>🐰</span>)}
        <div className="absolute text-2xl" style={{left:`${pos}%`,bottom:"10%",transform:"translateX(-50%)"}}>🦊</div>
      </div>
      <p className="text-xs mt-2 text-muted-foreground">Arrow keys to move!</p>
    </div>
  );
};

export const PearPicking = () => {
  const [pears, setPears] = useState(9);
  const [basket, setBasket] = useState(0);
  const pick = () => { if (pears > 0) { setPears(p => p - 1); setBasket(b => b + 1); } };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-green-500">On Tree: {pears}</span>
        <span className="font-display text-amber-600">Basket: {basket} 🍐</span>
      </div>
      <div className="text-5xl">🌳</div>
      <Button onClick={pick} disabled={pears === 0} className="mt-4 bg-green-500">Pick Pear 🍐</Button>
      {pears === 0 && <Button onClick={() => {setPears(9);setBasket(0);}} className="mt-2" variant="outline">Regrow</Button>}
    </div>
  );
};

export const BlanketFort = () => {
  const materials = ["🛋️", "🛏️", "🧸", "💡"];
  const [fort, setFort] = useState<string[]>([]);
  const add = (m: string) => { if (fort.length < 8) setFort(f => [...f, m]); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Fort: {fort.length} items</div>
      <div className="h-16 flex gap-1 flex-wrap justify-center mb-4">{fort.map((m, i) => <span key={i} className="text-xl">{m}</span>)}</div>
      <div className="flex gap-2">
        {materials.map(m => <button key={m} onClick={() => add(m)} className="text-2xl p-2 bg-muted rounded">{m}</button>)}
      </div>
      <Button onClick={() => setFort([])} className="mt-2" variant="outline" size="sm">Clear</Button>
    </div>
  );
};

export const LeafPile = () => {
  const [pile, setPile] = useState(0);
  const [jumping, setJumping] = useState(false);

  const addLeaves = () => setPile(p => p + 5);
  const jump = () => { setJumping(true); setPile(0); setTimeout(() => setJumping(false), 500); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Pile: {"🍂".repeat(Math.min(Math.floor(pile/5), 6))}</div>
      <div className={`text-5xl ${jumping ? "animate-bounce" : ""}`}>{jumping ? "😄" : "🍂"}</div>
      <div className="flex gap-2 mt-4">
        <Button onClick={addLeaves} className="bg-orange-500">Rake Leaves</Button>
        <Button onClick={jump} disabled={pile < 10} className="bg-amber-600">Jump! (10+)</Button>
      </div>
    </div>
  );
};

export const SoupStir = () => {
  const [stirs, setStirs] = useState(0);
  const [ready, setReady] = useState(false);

  const stir = () => { setStirs(s => s + 1); if (stirs >= 19) setReady(true); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Stirs: {stirs}/20</div>
      <div className={`text-5xl ${stirs % 2 === 0 ? "" : "rotate-12"} transition-transform`}>🥣</div>
      {ready ? (
        <div className="mt-4 text-center">
          <p className="text-green-500 font-bold">Soup is ready! 🍲</p>
          <Button onClick={() => {setStirs(0);setReady(false);}} className="mt-2" variant="outline">New Soup</Button>
        </div>
      ) : (
        <Button onClick={stir} className="mt-4 bg-orange-500">Stir!</Button>
      )}
    </div>
  );
};

export const OakTree = () => {
  const [acorns, setAcorns] = useState<{id:number;x:number;y:number}[]>([]);
  const [caught, setCaught] = useState(0);
  const [pos, setPos] = useState(50);

  useEffect(() => {
    const int = setInterval(() => { setAcorns(prev => [...prev.slice(-8), {id: Date.now(), x: Math.random()*80+10, y: 0}]); }, 600);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setAcorns(prev => prev.map(a => ({...a, y: a.y + 2})).filter(a => {
        if (a.y > 85 && Math.abs(a.x - pos) < 12) { setCaught(c => c + 1); return false; }
        return a.y < 100;
      }));
    }, 50);
    return () => clearInterval(int);
  }, [pos]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Caught: {caught}</div>
      <div className="relative w-full h-36 bg-gradient-to-b from-green-600 to-amber-200 rounded-xl overflow-hidden"
        onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPos(((e.clientX - rect.left) / rect.width) * 100); }}>
        {acorns.map(a => <span key={a.id} className="absolute text-lg" style={{left:`${a.x}%`,top:`${a.y}%`}}>🌰</span>)}
        <div className="absolute text-2xl" style={{left:`${pos}%`,bottom:"5%",transform:"translateX(-50%)"}}>🧤</div>
      </div>
    </div>
  );
};

export const SweaterWeather = () => {
  const colors = ["🔴", "🟡", "🟢", "🔵"];
  const [pattern, setPattern] = useState<string[]>([]);

  const add = (c: string) => setPattern(p => [...p.slice(-11), c]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-red-500">Pattern: {pattern.length}</div>
      <div className="h-8 flex gap-0.5 mb-4">{pattern.map((c, i) => <span key={i} className="text-sm">{c}</span>)}</div>
      <div className="text-4xl mb-4">🧣</div>
      <div className="flex gap-2">
        {colors.map(c => <button key={c} onClick={() => add(c)} className="text-xl p-2 bg-muted rounded">{c}</button>)}
      </div>
      <Button onClick={() => setPattern([])} className="mt-2" variant="outline" size="sm">Clear</Button>
    </div>
  );
};

// Games 41-50
export const GratitudeMatch = () => {
  const items = ["🙏", "❤️", "🌟", "😊"];
  const [cards, setCards] = useState<{id:number;emoji:string;flipped:boolean;matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffled = [...items, ...items].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((e, i) => ({id: i, emoji: e, flipped: false, matched: false})));
  }, []);

  const flip = (id: number) => {
    if (flipped.length === 2 || cards[id].matched || cards[id].flipped) return;
    const newCards = cards.map(c => c.id === id ? {...c, flipped: true} : c);
    setCards(newCards);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, matched: true} : c));
        setMatches(m => m + 1);
        setFlipped([]);
      } else {
        setTimeout(() => { setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, flipped: false} : c)); setFlipped([]); }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Matches: {matches}/4</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)} className={`w-10 h-10 rounded text-xl ${c.flipped || c.matched ? "bg-amber-200" : "bg-amber-600"}`}>
            {c.flipped || c.matched ? c.emoji : "🍂"}
          </button>
        ))}
      </div>
    </div>
  );
};

export const CanningJars = () => {
  const foods = ["🍎", "🍐", "🍇", "🥒"];
  const [jars, setJars] = useState<string[]>([]);
  const can = (f: string) => setJars(j => [...j, f]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Jars: {jars.length} 🫙</div>
      <div className="h-12 flex gap-1 mb-4">{jars.slice(-6).map((j, i) => <span key={i}>🫙{j}</span>)}</div>
      <div className="flex gap-2">
        {foods.map(f => <button key={f} onClick={() => can(f)} className="text-2xl p-2 bg-muted rounded">{f}</button>)}
      </div>
    </div>
  );
};

export const BonfireNight = () => {
  const [flames, setFlames] = useState(3);
  const [warmth, setWarmth] = useState(50);

  useEffect(() => {
    const int = setInterval(() => {
      setWarmth(w => Math.max(0, w - 2));
      if (warmth < 20 && flames > 0) { setFlames(f => f - 1); setWarmth(w => w + 30); }
    }, 500);
    return () => clearInterval(int);
  }, [warmth, flames]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-orange-500">Warmth: {warmth}%</span>
        <span className="text-amber-600">Logs: {flames} 🪵</span>
      </div>
      <div className="text-5xl">{"🔥".repeat(Math.max(1, Math.floor(warmth/30)))}</div>
      <Button onClick={() => setFlames(f => f + 1)} className="mt-4 bg-amber-600">Add Log</Button>
    </div>
  );
};

export const DeerSpot = () => {
  const [deerPos, setDeerPos] = useState({x: 50, y: 50});
  const [spotted, setSpotted] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      setDeerPos({x: Math.random()*70+15, y: Math.random()*50+25});
      setVisible(true);
      setTimeout(() => setVisible(false), 1500);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  const spot = () => { if (visible) { setSpotted(s => s + 1); setVisible(false); } };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Spotted: {spotted} 🦌</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-green-700 to-amber-600 rounded-xl overflow-hidden" onClick={spot}>
        {visible && <span className="absolute text-3xl cursor-pointer" style={{left:`${deerPos.x}%`,top:`${deerPos.y}%`,transform:"translate(-50%,-50%)"}}>🦌</span>}
      </div>
    </div>
  );
};

export const HarvestMoon = () => {
  const [phase, setPhase] = useState(0);
  const [harvests, setHarvests] = useState(0);
  const moons = ["🌑", "🌒", "🌓", "🌔", "🌕"];

  useEffect(() => {
    const int = setInterval(() => setPhase(p => (p + 1) % 5), 1500);
    return () => clearInterval(int);
  }, []);

  useEffect(() => { if (phase === 4) setHarvests(h => h + 1); }, [phase]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-500">Full Moons: {harvests}</div>
      <div className="text-6xl">{moons[phase]}</div>
      <p className="text-sm mt-4">Wait for the full moon! 🌕</p>
    </div>
  );
};

export const CrispAir = () => {
  const [breaths, setBreaths] = useState(0);
  const [breathing, setBreathing] = useState(false);

  const breathe = () => { setBreathing(true); setBreaths(b => b + 1); setTimeout(() => setBreathing(false), 1000); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-blue-400">Breaths: {breaths}</div>
      <div className={`text-5xl transition-transform ${breathing ? "scale-125" : ""}`}>🍃</div>
      <Button onClick={breathe} disabled={breathing} className="mt-4 bg-blue-400">{breathing ? "Breathing..." : "Breathe In"}</Button>
    </div>
  );
};

export const AppleBobbing = () => {
  const [apples, setApples] = useState([true, true, true, true, true]);
  const [caught, setCaught] = useState(0);

  const bob = () => {
    const available = apples.map((a, i) => a ? i : -1).filter(i => i >= 0);
    if (available.length === 0) return;
    const idx = available[Math.floor(Math.random() * available.length)];
    const newApples = [...apples];
    newApples[idx] = false;
    setApples(newApples);
    setCaught(c => c + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-red-500">Caught: {caught}/5</div>
      <div className="flex gap-2 mb-4">{apples.map((a, i) => <span key={i} className="text-2xl">{a ? "🍎" : "💧"}</span>)}</div>
      <Button onClick={bob} disabled={caught >= 5} className="bg-red-500">Bob!</Button>
      {caught >= 5 && <Button onClick={() => {setApples([true,true,true,true,true]);setCaught(0);}} className="mt-2" variant="outline">Reset</Button>}
    </div>
  );
};

export const ScarecrowDance = () => {
  const moves = ["👆", "👇", "👈", "👉"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerMove, setPlayerMove] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => { setSequence(Array.from({length: 4}, () => Math.floor(Math.random() * 4))); }, [score]);

  const dance = (m: number) => {
    if (m === sequence[playerMove]) {
      if (playerMove === 3) { setScore(s => s + 20); setPlayerMove(0); }
      else setPlayerMove(p => p + 1);
    } else setPlayerMove(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-600">Score: {score}</div>
      <div className="h-8 mb-4">{sequence.map((s, i) => <span key={i} className={`text-xl ${i < playerMove ? "opacity-50" : ""}`}>{moves[s]}</span>)}</div>
      <div className="grid grid-cols-2 gap-2">
        {moves.map((m, i) => <button key={i} onClick={() => dance(i)} className="text-2xl p-3 bg-muted rounded hover:bg-amber-200">{m}</button>)}
      </div>
    </div>
  );
};

export const WildBerry = () => {
  const [berries, setBerries] = useState<{id:number;x:number;y:number;type:string}[]>([]);
  const [picked, setPicked] = useState(0);
  const types = ["🫐", "🍓", "🍇"];

  useEffect(() => {
    const int = setInterval(() => {
      setBerries(prev => [...prev.slice(-10), {id: Date.now(), x: Math.random()*80+10, y: Math.random()*60+20, type: types[Math.floor(Math.random()*3)]}]);
    }, 700);
    return () => clearInterval(int);
  }, []);

  const pick = (id: number) => { setPicked(p => p + 1); setBerries(prev => prev.filter(b => b.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-purple-500">Picked: {picked}</div>
      <div className="relative w-full h-40 bg-gradient-to-b from-green-600 to-green-800 rounded-xl overflow-hidden">
        {berries.map(b => <button key={b.id} onClick={() => pick(b.id)} className="absolute text-xl hover:scale-125" style={{left:`${b.x}%`,top:`${b.y}%`}}>{b.type}</button>)}
      </div>
    </div>
  );
};

export const FarmerMarket = () => {
  const items = ["🍎", "🥕", "🌽", "🍞"];
  const [cart, setCart] = useState<string[]>([]);
  const [sold, setSold] = useState(0);

  const add = (i: string) => setCart(c => [...c, i]);
  const sell = () => { if (cart.length >= 3) { setSold(s => s + cart.length); setCart([]); } };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-600">Cart: {cart.length}</span>
        <span className="font-display text-green-500">Sold: {sold}</span>
      </div>
      <div className="h-12 flex gap-1 mb-4">{cart.map((i, idx) => <span key={idx}>{i}</span>)}</div>
      <div className="flex gap-2 mb-4">
        {items.map(i => <button key={i} onClick={() => add(i)} className="text-xl p-2 bg-muted rounded">{i}</button>)}
      </div>
      <Button onClick={sell} disabled={cart.length < 3} className="bg-green-500">Sell (3+)</Button>
    </div>
  );
};

// Games 51-60
export const MistyMorning = () => {
  const [visibility, setVisibility] = useState(20);
  const [found, setFound] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setVisibility(v => Math.min(100, v + 2)), 500);
    return () => clearInterval(int);
  }, []);

  const find = () => { if (visibility > 50) { setFound(f => f + 1); setVisibility(20); } };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-gray-500">Found: {found}</div>
      <div className="relative w-full h-32 rounded-xl overflow-hidden" style={{background: `rgba(200,200,200,${1-visibility/100})`}}>
        <div className="absolute text-3xl" style={{left:"50%",top:"50%",transform:"translate(-50%,-50%)",opacity:visibility/100}}>🦌</div>
      </div>
      <p className="text-xs mt-2">Visibility: {visibility}%</p>
      <Button onClick={find} disabled={visibility < 50} className="mt-2 bg-gray-500">Spot! (50%+)</Button>
    </div>
  );
};

export const WalnutWack = () => {
  const [wacks, setWacks] = useState(0);
  const [opened, setOpened] = useState(0);

  const wack = () => { setWacks(w => w + 1); if (wacks > 0 && wacks % 3 === 2) setOpened(o => o + 1); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Wacks: {wacks}</span>
        <span className="font-display text-amber-500">Opened: {opened}</span>
      </div>
      <div className="text-5xl">🥜</div>
      <Button onClick={wack} className="mt-4 bg-amber-700">Wack!</Button>
    </div>
  );
};

export const HaybaleStack = () => {
  const [bales, setBales] = useState(0);
  const [stacks, setStacks] = useState(0);

  const add = () => { setBales(b => b + 1); if (bales >= 4) { setStacks(s => s + 1); setBales(0); } };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-600">Bales: {bales}/5</span>
        <span className="font-display text-amber-500">Stacks: {stacks}</span>
      </div>
      <div className="flex flex-col-reverse">{Array.from({length: bales}).map((_, i) => <span key={i} className="text-xl">🌾</span>)}</div>
      <Button onClick={add} className="mt-4 bg-amber-600">Add Bale</Button>
    </div>
  );
};

export const PlaidPattern = () => {
  const colors = ["🟥", "🟨", "🟩", "🟦"];
  const [pattern, setPattern] = useState<string[][]>([]);

  const addRow = () => {
    const row = Array.from({length: 4}, () => colors[Math.floor(Math.random() * 4)]);
    setPattern(p => [...p.slice(-3), row]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-red-500">Rows: {pattern.length}</div>
      <div className="flex flex-col gap-1 mb-4">
        {pattern.map((row, i) => <div key={i} className="flex gap-0.5">{row.map((c, j) => <span key={j} className="text-sm">{c}</span>)}</div>)}
      </div>
      <div className="flex gap-2">
        <Button onClick={addRow} className="bg-red-500">Weave Row</Button>
        <Button onClick={() => setPattern([])} variant="outline">Clear</Button>
      </div>
    </div>
  );
};

export const SpookyPath = () => {
  const [pos, setPos] = useState(0);
  const [scares, setScares] = useState(0);

  const walk = () => {
    setPos(p => p + 1);
    if (Math.random() > 0.7) setScares(s => s + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-purple-500">Steps: {pos}</span>
        <span className="text-orange-500">Scares: {scares} 👻</span>
      </div>
      <div className="flex gap-1 mb-4">
        {Array.from({length: 10}).map((_, i) => <span key={i} className={`text-xl ${i === pos % 10 ? "" : "opacity-30"}`}>{i === pos % 10 ? "🚶" : "🌲"}</span>)}
      </div>
      <Button onClick={walk} className="bg-purple-600">Walk...</Button>
    </div>
  );
};

export const CandyApple = () => {
  const [dipped, setDipped] = useState(0);
  const [coating, setCoating] = useState(0);

  const dip = () => { setCoating(c => Math.min(100, c + 25)); };
  const finish = () => { if (coating >= 100) { setDipped(d => d + 1); setCoating(0); } };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-red-500">Made: {dipped} 🍎</div>
      <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-red-500 transition-all" style={{width:`${coating}%`}}/>
      </div>
      <div className="text-5xl">🍎</div>
      <div className="flex gap-2 mt-4">
        <Button onClick={dip} className="bg-red-500">Dip</Button>
        <Button onClick={finish} disabled={coating < 100} className="bg-amber-600">Done!</Button>
      </div>
    </div>
  );
};

export const OwlFlight = () => {
  const [height, setHeight] = useState(50);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setHeight(h => Math.max(10, h - 2));
      setDistance(d => d + 1);
    }, 100);
    return () => clearInterval(int);
  }, []);

  const flap = () => setHeight(h => Math.min(90, h + 15));

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-amber-700">Distance: {distance}m</div>
      <div className="relative w-full h-32 bg-gradient-to-b from-indigo-800 to-indigo-950 rounded-xl overflow-hidden" onClick={flap}>
        <div className="absolute text-2xl" style={{left:"30%",top:`${100-height}%`,transform:"translateY(-50%)"}}>🦉</div>
      </div>
      <p className="text-xs mt-2 text-muted-foreground">Click to flap!</p>
    </div>
  );
};

export const CavernExplore = () => {
  const [depth, setDepth] = useState(0);
  const [gems, setGems] = useState(0);

  const explore = () => {
    setDepth(d => d + 1);
    if (Math.random() > 0.6) setGems(g => g + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-gray-600">Depth: {depth}m</span>
        <span className="text-purple-500">Gems: {gems} 💎</span>
      </div>
      <div className="text-5xl">🕳️</div>
      <Button onClick={explore} className="mt-4 bg-gray-600">Explore Deeper</Button>
    </div>
  );
};

export const TruffleDig = () => {
  const [digs, setDigs] = useState(0);
  const [truffles, setTruffles] = useState(0);

  const dig = () => {
    setDigs(d => d + 1);
    if (Math.random() > 0.8) setTruffles(t => t + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-amber-700">Digs: {digs}</span>
        <span className="font-display text-amber-500">Truffles: {truffles} 🍄</span>
      </div>
      <div className="text-5xl">🐷</div>
      <Button onClick={dig} className="mt-4 bg-amber-700">Dig!</Button>
    </div>
  );
};

export const AutumnSunset = () => {
  const [colors, setColors] = useState(0);
  const [sunPos, setSunPos] = useState(20);

  useEffect(() => {
    const int = setInterval(() => {
      setSunPos(p => { if (p >= 80) { setColors(c => c + 1); return 20; } return p + 1; });
    }, 200);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-orange-500">Sunsets: {colors}</div>
      <div className="relative w-full h-32 bg-gradient-to-b from-orange-400 via-pink-400 to-purple-600 rounded-xl overflow-hidden">
        <div className="absolute text-3xl" style={{left:"50%",top:`${sunPos}%`,transform:"translate(-50%,-50%)"}}>☀️</div>
      </div>
    </div>
  );
};
