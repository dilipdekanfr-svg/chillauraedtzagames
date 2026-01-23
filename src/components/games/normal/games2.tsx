import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

// Game 11: Simon Says - Repeat the pattern
export const SimonSays = () => {
  const colors = ["🔴", "🟢", "🔵", "🟡"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [level, setLevel] = useState(0);

  const startLevel = useCallback(() => {
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSeq([]);
    let i = 0;
    const show = setInterval(() => {
      if (i < newSeq.length) { setShowing(newSeq[i]); i++; }
      else { setShowing(-1); clearInterval(show); }
    }, 600);
  }, [sequence]);

  const play = (n: number) => {
    if (showing >= 0) return;
    const newPlayer = [...playerSeq, n];
    setPlayerSeq(newPlayer);
    if (newPlayer[newPlayer.length - 1] !== sequence[newPlayer.length - 1]) {
      setLevel(0); setSequence([]); return;
    }
    if (newPlayer.length === sequence.length) {
      setLevel(l => l + 1);
      setTimeout(() => startLevel(), 500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Level: {level}</div>
      {level === 0 ? (
        <Button onClick={() => {setLevel(1);setSequence([Math.floor(Math.random()*4)]);setTimeout(() => startLevel(), 500);}} className="bg-primary">Start</Button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {colors.map((c, i) => (
            <button key={i} onClick={() => play(i)} className={`w-16 h-16 rounded-lg text-2xl transition ${showing === i ? "scale-110 brightness-125" : ""} ${i === 0 ? "bg-red-500" : i === 1 ? "bg-green-500" : i === 2 ? "bg-blue-500" : "bg-yellow-500"}`}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// Game 12: Speed Match - Match shapes quickly
export const SpeedMatch = () => {
  const shapes = ["⭐", "❤️", "🔷", "🔶"];
  const [prev, setPrev] = useState("");
  const [current, setCurrent] = useState(shapes[0]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);

  const next = () => {
    setPrev(current);
    setCurrent(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  const answer = (same: boolean) => {
    if ((prev === current) === same) setScore(s => s + 10);
    else setWrong(w => w + 1);
    next();
  };

  useEffect(() => { next(); }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-red-500">Wrong: {wrong}</span>
      </div>
      <div className="text-5xl mb-4">{current}</div>
      <p className="text-sm mb-4">Same as previous?</p>
      <div className="flex gap-4">
        <Button onClick={() => answer(true)} className="bg-green-500">Yes</Button>
        <Button onClick={() => answer(false)} className="bg-red-500">No</Button>
      </div>
    </div>
  );
};

// Game 13: Tile Flip - Memory match
export const TileFlip = () => {
  const tiles = ["🎮", "🎲", "🎯", "🎪"];
  const [cards, setCards] = useState<{id:number;emoji:string;flipped:boolean;matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffled = [...tiles, ...tiles].sort(() => Math.random() - 0.5);
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
      <div className="mb-2 font-display text-primary">Matches: {matches}/4</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)} className={`w-10 h-10 rounded text-xl ${c.flipped || c.matched ? "bg-primary/20" : "bg-muted"}`}>
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
};

// Game 14: Quick Math - Fast arithmetic
export const QuickMath = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const generate = () => {
    const na = Math.floor(Math.random() * 10) + 1;
    const nb = Math.floor(Math.random() * 10) + 1;
    const nop = ["+", "-", "×"][Math.floor(Math.random() * 3)];
    let ans = nop === "+" ? na + nb : nop === "-" ? na - nb : na * nb;
    setA(na); setB(nb); setOp(nop); setAnswer(ans);
    const opts = [ans, ans + Math.floor(Math.random()*5)+1, ans - Math.floor(Math.random()*5)-1, ans + Math.floor(Math.random()*10)-5].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  useEffect(() => { generate(); }, []);

  const check = (n: number) => {
    if (n === answer) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="text-2xl font-mono mb-4">{a} {op} {b} = ?</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o, i) => <Button key={i} onClick={() => check(o)} variant="outline">{o}</Button>)}
      </div>
    </div>
  );
};

// Game 15: Color Blind - Click the word not color
export const ColorBlind = () => {
  const colors = [{word: "RED", class: "text-red-500"}, {word: "BLUE", class: "text-blue-500"}, {word: "GREEN", class: "text-green-500"}, {word: "YELLOW", class: "text-yellow-500"}];
  const [current, setCurrent] = useState({word: "RED", class: "text-blue-500"});
  const [target, setTarget] = useState("RED");
  const [score, setScore] = useState(0);

  const generate = () => {
    const word = colors[Math.floor(Math.random() * 4)];
    const color = colors[Math.floor(Math.random() * 4)];
    setCurrent({word: word.word, class: color.class});
    setTarget(Math.random() > 0.5 ? word.word : color.word.toUpperCase());
  };

  useEffect(() => { generate(); }, []);

  const answer = (isWord: boolean) => {
    const correct = isWord ? current.word === target : current.class.includes(target.toLowerCase());
    if (correct) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Click if this is {target}:</p>
      <div className={`text-4xl font-bold mb-4 ${current.class}`}>{current.word}</div>
      <div className="flex gap-4">
        <Button onClick={() => answer(true)} className="bg-green-500">Yes</Button>
        <Button onClick={() => answer(false)} className="bg-red-500">No</Button>
      </div>
    </div>
  );
};

// Game 16: Sequence Repeat - Remember and repeat
export const SequenceRepeat = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [level, setLevel] = useState(0);

  const start = () => {
    const seq = Array.from({length: level + 3}, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setPlayerIdx(0);
    let i = 0;
    const show = setInterval(() => {
      if (i < seq.length) { setShowing(seq[i]); i++; }
      else { setShowing(-1); clearInterval(show); }
    }, 600);
  };

  const play = (n: number) => {
    if (n === sequence[playerIdx]) {
      if (playerIdx === sequence.length - 1) { setLevel(l => l + 1); start(); }
      else setPlayerIdx(p => p + 1);
    } else { setLevel(0); }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Level: {level}</div>
      {level === 0 ? (
        <Button onClick={() => {setLevel(1);start();}} className="bg-primary">Start</Button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {[0,1,2,3].map(i => (
            <button key={i} onClick={() => play(i)} className={`w-14 h-14 rounded-lg text-2xl ${showing === i ? "bg-primary scale-110" : "bg-muted"}`}>
              {["🔴", "🟢", "🔵", "🟡"][i]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Game 17: Target Practice - Hit moving targets
export const TargetPractice = () => {
  const [targets, setTargets] = useState<{id:number;x:number;y:number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const t = setTimeout(() => { if (timeLeft <= 1) setActive(false); setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  useEffect(() => {
    if (!active) return;
    const int = setInterval(() => {
      setTargets(prev => [...prev.slice(-6), {id: Date.now(), x: Math.random()*70+15, y: Math.random()*60+20}]);
    }, 800);
    return () => clearInterval(int);
  }, [active]);

  const hit = (id: number) => { setScore(s => s + 10); setTargets(prev => prev.filter(t => t.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      <div className="relative w-full h-40 bg-muted/30 rounded-xl overflow-hidden">
        {!active ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={() => {setActive(true);setScore(0);setTimeLeft(20);setTargets([]);}} className="bg-primary">
              {timeLeft === 0 ? `Score: ${score}` : "Start"}
            </Button>
          </div>
        ) : (
          targets.map(t => <button key={t.id} onClick={() => hit(t.id)} className="absolute text-2xl hover:scale-125" style={{left:`${t.x}%`,top:`${t.y}%`}}>🎯</button>)
        )}
      </div>
    </div>
  );
};

// Game 18: Word Guess - Guess the scrambled word
export const WordGuess = () => {
  const words = ["GAME", "PLAY", "SCORE", "LEVEL", "POINT"];
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const scramble = (w: string) => w.split("").sort(() => Math.random() - 0.5).join("");
  const newWord = () => { const w = words[Math.floor(Math.random() * words.length)]; setWord(w); setScrambled(scramble(w)); setInput(""); };

  useEffect(() => { newWord(); }, []);

  const check = () => { if (input.toUpperCase() === word) { setScore(s => s + 20); } newWord(); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="text-3xl font-mono mb-4 tracking-widest">{scrambled}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
        className="text-xl text-center w-32 p-2 bg-muted rounded-lg mb-2" autoFocus />
      <Button onClick={check} className="bg-primary">Submit</Button>
    </div>
  );
};

// Game 19: Shape Sort - Sort shapes by clicking
export const ShapeSort = () => {
  const shapes = ["⭐", "❤️", "🔷", "🔶"];
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);

  useEffect(() => {
    setCurrent(Math.floor(Math.random() * 4));
    setTarget(Math.floor(Math.random() * 4));
  }, [score, wrong]);

  const sort = (bin: number) => {
    if (bin === target) setScore(s => s + 10);
    else setWrong(w => w + 1);
    setCurrent(Math.floor(Math.random() * 4));
    setTarget(Math.floor(Math.random() * 4));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-red-500">Wrong: {wrong}</span>
      </div>
      <div className="text-4xl mb-2">{shapes[current]}</div>
      <p className="text-sm mb-4">Put in bin #{target + 1}</p>
      <div className="flex gap-2">
        {[0,1,2,3].map(i => <button key={i} onClick={() => sort(i)} className="text-xl p-3 bg-muted rounded">📦</button>)}
      </div>
    </div>
  );
};

// Game 20: Timing Tap - Tap at the right moment
export const TimingTap = () => {
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const int = setInterval(() => setPos(p => (p + 2) % 100), 30);
    return () => clearInterval(int);
  }, [active]);

  const tap = () => {
    if (pos > 45 && pos < 55) setScore(s => s + 10);
    else setScore(s => Math.max(0, s - 5));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="w-full h-8 bg-muted rounded-full relative mb-4">
        <div className="absolute w-4 h-full bg-green-500" style={{left:"45%",width:"10%"}}/>
        <div className="absolute w-4 h-8 bg-primary rounded-full" style={{left:`${pos}%`}}/>
      </div>
      {!active ? (
        <Button onClick={() => setActive(true)} className="bg-primary">Start</Button>
      ) : (
        <Button onClick={tap} className="bg-primary">TAP!</Button>
      )}
    </div>
  );
};

// Games 21-30
export const PuzzlePiece = () => {
  const [pieces, setPieces] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [moves, setMoves] = useState(0);

  const shuffle = () => setPieces(pieces.sort(() => Math.random() - 0.5));
  const swap = (i: number) => {
    const emptyIdx = pieces.indexOf(8);
    if (Math.abs(i - emptyIdx) === 1 || Math.abs(i - emptyIdx) === 3) {
      const newPieces = [...pieces];
      [newPieces[i], newPieces[emptyIdx]] = [newPieces[emptyIdx], newPieces[i]];
      setPieces(newPieces);
      setMoves(m => m + 1);
    }
  };

  useEffect(() => { shuffle(); }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Moves: {moves}</div>
      <div className="grid grid-cols-3 gap-1">
        {pieces.map((p, i) => (
          <button key={i} onClick={() => swap(i)} className={`w-10 h-10 rounded flex items-center justify-center ${p === 8 ? "bg-transparent" : "bg-primary text-primary-foreground"}`}>
            {p !== 8 && p + 1}
          </button>
        ))}
      </div>
      <Button onClick={() => {shuffle();setMoves(0);}} className="mt-4" variant="outline">Shuffle</Button>
    </div>
  );
};

export const MemoryCards = () => {
  const emojis = ["🎮", "🎲", "🎯", "🎪"];
  const [cards, setCards] = useState<{id:number;emoji:string;flipped:boolean;matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((e, i) => ({id: i, emoji: e, flipped: false, matched: false})));
  }, []);

  const flip = (id: number) => {
    if (flipped.length === 2 || cards[id].matched || cards[id].flipped) return;
    const newCards = cards.map(c => c.id === id ? {...c, flipped: true} : c);
    setCards(newCards);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(m => m + 1);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, matched: true} : c));
        setFlipped([]);
      } else {
        setTimeout(() => { setCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, flipped: false} : c)); setFlipped([]); }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)} className={`w-10 h-10 rounded text-xl ${c.flipped || c.matched ? "bg-primary/20" : "bg-muted"}`}>
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
};

export const RefleXTest = () => {
  const [state, setState] = useState<"waiting"|"ready"|"go">("waiting");
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(999);

  const start = () => {
    setState("ready");
    const delay = 1000 + Math.random() * 3000;
    setTimeout(() => { setState("go"); setTime(Date.now()); }, delay);
  };

  const react = () => {
    if (state === "go") {
      const reaction = Date.now() - time;
      if (reaction < best) setBest(reaction);
      setState("waiting");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Best: {best === 999 ? "-" : `${best}ms`}</div>
      <div className={`w-32 h-32 rounded-xl flex items-center justify-center text-4xl ${state === "waiting" ? "bg-muted" : state === "ready" ? "bg-red-500" : "bg-green-500"}`}>
        {state === "waiting" ? "🎯" : state === "ready" ? "⏳" : "⚡"}
      </div>
      {state === "waiting" ? (
        <Button onClick={start} className="mt-4 bg-primary">Start</Button>
      ) : (
        <Button onClick={react} className="mt-4 bg-green-500">CLICK!</Button>
      )}
    </div>
  );
};

export const BrainTeaser = () => {
  const puzzles = [
    {q: "2 + 2 × 2 = ?", a: 6},
    {q: "10 - 3 - 2 = ?", a: 5},
    {q: "5 × 0 + 5 = ?", a: 5},
    {q: "12 ÷ 4 + 1 = ?", a: 4},
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");

  const check = () => {
    if (parseInt(input) === puzzles[current].a) setScore(s => s + 15);
    setCurrent(c => (c + 1) % puzzles.length);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="text-2xl font-mono mb-4">{puzzles[current].q}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
        className="text-xl text-center w-24 p-2 bg-muted rounded-lg mb-2" autoFocus />
      <Button onClick={check} className="bg-primary">Submit</Button>
    </div>
  );
};

export const ClickSpeed = () => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const t = setTimeout(() => { if (timeLeft <= 1) setActive(false); setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Clicks: {clicks}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      {!active ? (
        <Button onClick={() => {setActive(true);setClicks(0);setTimeLeft(10);}} className="bg-primary">
          {timeLeft === 0 ? `${clicks} clicks! Again?` : "Start"}
        </Button>
      ) : (
        <Button onClick={() => setClicks(c => c + 1)} className="w-32 h-32 bg-primary text-4xl">👆</Button>
      )}
    </div>
  );
};

export const PatternRecognition = () => {
  const patterns = [["⭐", "❤️", "⭐", "❤️", "?"], ["🔵", "🔵", "🔴", "🔵", "🔵", "?"], ["1", "2", "3", "5", "?"]];
  const answers = ["⭐", "🔴", "8"];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const check = (ans: string) => {
    if (ans === answers[current]) setScore(s => s + 15);
    setCurrent(c => (c + 1) % patterns.length);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="flex gap-2 mb-4">{patterns[current].map((p, i) => <span key={i} className="text-2xl">{p}</span>)}</div>
      <div className="flex gap-2">
        {["⭐", "❤️", "🔴", "8"].map(a => <button key={a} onClick={() => check(a)} className="text-2xl p-2 bg-muted rounded">{a}</button>)}
      </div>
    </div>
  );
};

export const MentalMath = () => {
  const [nums, setNums] = useState<number[]>([]);
  const [answer, setAnswer] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const generate = () => {
    const n = Array.from({length: 3}, () => Math.floor(Math.random() * 10) + 1);
    setNums(n);
    setAnswer(n.reduce((a, b) => a + b, 0));
    setInput("");
  };

  useEffect(() => { generate(); }, []);

  const check = () => {
    if (parseInt(input) === answer) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="text-2xl font-mono mb-4">{nums.join(" + ")} = ?</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
        className="text-xl text-center w-24 p-2 bg-muted rounded-lg mb-2" autoFocus />
      <Button onClick={check} className="bg-primary">Submit</Button>
    </div>
  );
};

export const VisualMemory = () => {
  const [grid, setGrid] = useState<boolean[]>(Array(9).fill(false));
  const [playerGrid, setPlayerGrid] = useState<boolean[]>(Array(9).fill(false));
  const [phase, setPhase] = useState<"show"|"play"|"result">("show");
  const [level, setLevel] = useState(3);

  const start = () => {
    const newGrid = Array(9).fill(false);
    const positions = Array.from({length: 9}, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, level);
    positions.forEach(p => newGrid[p] = true);
    setGrid(newGrid);
    setPlayerGrid(Array(9).fill(false));
    setPhase("show");
    setTimeout(() => setPhase("play"), 2000);
  };

  useEffect(() => { start(); }, []);

  const toggle = (i: number) => {
    if (phase !== "play") return;
    const newPlayer = [...playerGrid];
    newPlayer[i] = !newPlayer[i];
    setPlayerGrid(newPlayer);
  };

  const check = () => {
    const correct = grid.every((g, i) => g === playerGrid[i]);
    if (correct) setLevel(l => l + 1);
    else setLevel(l => Math.max(3, l - 1));
    start();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Level: {level - 2}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(phase === "show" ? grid : playerGrid).map((g, i) => (
          <button key={i} onClick={() => toggle(i)} className={`w-10 h-10 rounded ${g ? "bg-primary" : "bg-muted"}`}/>
        ))}
      </div>
      {phase === "play" && <Button onClick={check} className="bg-primary">Check</Button>}
      {phase === "show" && <p className="text-sm">Remember the pattern!</p>}
    </div>
  );
};

export const SpotDifference = () => {
  const [differences, setDifferences] = useState<{x:number;y:number;found:boolean}[]>([]);
  const [found, setFound] = useState(0);

  useEffect(() => {
    setDifferences(Array.from({length: 3}, () => ({x: Math.random()*70+15, y: Math.random()*60+20, found: false})));
  }, []);

  const spot = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDifferences(prev => prev.map(d => {
      if (!d.found && Math.abs(d.x - x) < 10 && Math.abs(d.y - y) < 10) {
        setFound(f => f + 1);
        return {...d, found: true};
      }
      return d;
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Found: {found}/3</div>
      <div className="relative w-full h-40 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl overflow-hidden cursor-crosshair" onClick={spot}>
        {differences.map((d, i) => (
          <div key={i} className={`absolute w-6 h-6 rounded-full ${d.found ? "bg-green-500/50 border-2 border-green-500" : ""}`} style={{left:`${d.x}%`,top:`${d.y}%`,transform:"translate(-50%,-50%)"}}/>
        ))}
      </div>
      {found >= 3 && <Button onClick={() => {setDifferences(Array.from({length: 3}, () => ({x: Math.random()*70+15, y: Math.random()*60+20, found: false})));setFound(0);}} className="mt-2" variant="outline">New Puzzle</Button>}
    </div>
  );
};

export const CountingGame = () => {
  const [items, setItems] = useState<{x:number;y:number}[]>([]);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const generate = () => {
    const n = Math.floor(Math.random() * 10) + 3;
    setItems(Array.from({length: n}, () => ({x: Math.random()*80+10, y: Math.random()*70+15})));
    setCount(n);
    setInput("");
  };

  useEffect(() => { generate(); }, []);

  const check = () => {
    if (parseInt(input) === count) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="relative w-full h-32 bg-muted/30 rounded-xl overflow-hidden mb-4">
        {items.map((item, i) => <span key={i} className="absolute text-xl" style={{left:`${item.x}%`,top:`${item.y}%`}}>⭐</span>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
        className="text-xl text-center w-24 p-2 bg-muted rounded-lg mb-2" placeholder="Count?" autoFocus />
      <Button onClick={check} className="bg-primary">Submit</Button>
    </div>
  );
};

// Games 31-40
export const ArrowKeys = () => {
  const arrows = ["⬆️", "⬇️", "⬅️", "➡️"];
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === keys[current]) { setScore(s => s + 5); setCurrent(Math.floor(Math.random() * 4)); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [active, current]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="text-6xl mb-4">{arrows[current]}</div>
      {!active ? (
        <Button onClick={() => setActive(true)} className="bg-primary">Start</Button>
      ) : (
        <p className="text-sm text-muted-foreground">Press the arrow key!</p>
      )}
    </div>
  );
};

export const ColorCycle = () => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];
  const [cycle, setCycle] = useState(0);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setCycle(c => (c + 1) % 4), 200);
    return () => clearInterval(int);
  }, []);

  const stop = () => {
    if (cycle === target) { setScore(s => s + 10); }
    setTarget(Math.floor(Math.random() * 4));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Stop on <span className={`${colors[target]} px-2 rounded text-white`}>this color</span></p>
      <div className={`w-20 h-20 rounded-xl ${colors[cycle]} mb-4`}/>
      <Button onClick={stop} className="bg-primary">STOP!</Button>
    </div>
  );
};

export const GridMemory = () => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [player, setPlayer] = useState<number[]>([]);
  const [showing, setShowing] = useState(true);
  const [level, setLevel] = useState(2);

  const start = () => {
    const p = Array.from({length: level}, () => Math.floor(Math.random() * 9));
    setPattern(p);
    setPlayer([]);
    setShowing(true);
    setTimeout(() => setShowing(false), 2000);
  };

  useEffect(() => { start(); }, []);

  const toggle = (i: number) => {
    if (showing) return;
    const newPlayer = [...player];
    if (newPlayer.includes(i)) newPlayer.splice(newPlayer.indexOf(i), 1);
    else newPlayer.push(i);
    setPlayer(newPlayer);
  };

  const check = () => {
    const correct = pattern.every(p => player.includes(p)) && player.every(p => pattern.includes(p));
    if (correct) setLevel(l => l + 1);
    else setLevel(l => Math.max(2, l - 1));
    start();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Level: {level - 1}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({length: 9}).map((_, i) => (
          <button key={i} onClick={() => toggle(i)} className={`w-10 h-10 rounded ${showing ? pattern.includes(i) ? "bg-primary" : "bg-muted" : player.includes(i) ? "bg-primary" : "bg-muted"}`}/>
        ))}
      </div>
      {!showing && <Button onClick={check} className="bg-primary">Check</Button>}
    </div>
  );
};

export const SpeedType = () => {
  const words = ["cat", "dog", "run", "jump", "fast", "slow", "big", "small"];
  const [word, setWord] = useState(words[0]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const t = setTimeout(() => { if (timeLeft <= 1) setActive(false); setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  useEffect(() => {
    if (input.toLowerCase() === word.toLowerCase()) {
      setScore(s => s + 10);
      setWord(words[Math.floor(Math.random() * words.length)]);
      setInput("");
    }
  }, [input, word]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-muted-foreground">Time: {timeLeft}s</span>
      </div>
      {!active ? (
        <Button onClick={() => {setActive(true);setScore(0);setTimeLeft(20);}} className="bg-primary">
          {timeLeft === 0 ? `Score: ${score}` : "Start"}
        </Button>
      ) : (
        <>
          <div className="text-3xl font-mono mb-4">{word}</div>
          <input value={input} onChange={(e) => setInput(e.target.value)} className="text-xl text-center w-32 p-2 bg-muted rounded-lg" autoFocus />
        </>
      )}
    </div>
  );
};

export const NumberSequence = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [next, setNext] = useState(1);
  const [time, setTime] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setNumbers(Array.from({length: 9}, (_, i) => i + 1).sort(() => Math.random() - 0.5));
    setNext(1);
    setComplete(false);
  }, []);

  useEffect(() => {
    if (complete) return;
    const int = setInterval(() => setTime(t => t + 0.1), 100);
    return () => clearInterval(int);
  }, [complete]);

  const click = (n: number) => {
    if (n === next) {
      setNext(nx => nx + 1);
      if (next >= 9) setComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Time: {time.toFixed(1)}s</div>
      <div className="grid grid-cols-3 gap-2">
        {numbers.map((n, i) => (
          <button key={i} onClick={() => click(n)} className={`w-12 h-12 rounded text-xl font-bold ${n < next ? "bg-green-500 text-white" : "bg-muted"}`}>{n}</button>
        ))}
      </div>
      {complete && <p className="mt-4 text-green-500 font-bold">Complete! {time.toFixed(1)}s</p>}
    </div>
  );
};

export const MatchingGame = () => {
  const emojis = ["🎮", "🎲", "🎯", "🎪"];
  const [cards, setCards] = useState<{id:number;emoji:string;flipped:boolean;matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
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
      <div className="mb-2 font-display text-primary">Matches: {matches}/4</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)} className={`w-10 h-10 rounded text-xl ${c.flipped || c.matched ? "bg-primary/20" : "bg-muted"}`}>
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
};

export const RapidFire = () => {
  const [targets, setTargets] = useState<{id:number;x:number;y:number}[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setTargets(prev => [...prev.slice(-12), {id: Date.now(), x: Math.random()*80+10, y: Math.random()*70+15}]);
    }, 300);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setTargets(prev => prev.filter(t => Date.now() - t.id < 2000));
    }, 100);
    return () => clearInterval(int);
  }, []);

  const hit = (id: number) => { setScore(s => s + 5); setTargets(prev => prev.filter(t => t.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="relative w-full h-40 bg-muted/30 rounded-xl overflow-hidden">
        {targets.map(t => <button key={t.id} onClick={() => hit(t.id)} className="absolute text-xl hover:scale-125 transition" style={{left:`${t.x}%`,top:`${t.y}%`}}>🎯</button>)}
      </div>
    </div>
  );
};

export const LogicPuzzle = () => {
  const puzzles = [
    {q: "If A > B and B > C, then A > C?", a: true},
    {q: "If all cats are animals, are all animals cats?", a: false},
    {q: "Is 15 divisible by 3?", a: true},
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (ans: boolean) => {
    if (ans === puzzles[current].a) setScore(s => s + 15);
    setCurrent(c => (c + 1) % puzzles.length);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-center mb-4 px-4">{puzzles[current].q}</p>
      <div className="flex gap-4">
        <Button onClick={() => answer(true)} className="bg-green-500">True</Button>
        <Button onClick={() => answer(false)} className="bg-red-500">False</Button>
      </div>
    </div>
  );
};

export const EyeSpy = () => {
  const items = ["🍎", "🌟", "🔵", "🟢", "❤️"];
  const [target, setTarget] = useState(items[0]);
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const newTarget = items[Math.floor(Math.random() * items.length)];
    setTarget(newTarget);
    const newGrid = Array.from({length: 16}, () => items[Math.floor(Math.random() * items.length)]);
    if (!newGrid.includes(newTarget)) newGrid[Math.floor(Math.random() * 16)] = newTarget;
    setGrid(newGrid);
  }, [score]);

  const spy = (i: number) => {
    if (grid[i] === target) setScore(s => s + 10);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Find: {target}</p>
      <div className="grid grid-cols-4 gap-1">
        {grid.map((g, i) => <button key={i} onClick={() => spy(i)} className="w-10 h-10 bg-muted rounded text-xl">{g}</button>)}
      </div>
    </div>
  );
};

export const DigitDash = () => {
  const [pos, setPos] = useState(50);
  const [digits, setDigits] = useState<{id:number;x:number;value:number}[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setDigits(prev => [...prev.slice(-8), {id: Date.now(), x: Math.random()*80+10, value: Math.floor(Math.random()*9)+1}]);
    }, 800);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setDigits(prev => {
        const caught = prev.filter(d => Math.abs(d.x - pos) < 12);
        caught.forEach(c => setScore(s => s + c.value));
        return prev.filter(d => !caught.includes(d)).slice(-6);
      });
    }, 500);
    return () => clearInterval(int);
  }, [pos]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="relative w-full h-24 bg-muted/30 rounded-xl overflow-hidden"
        onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPos(((e.clientX - rect.left) / rect.width) * 100); }}>
        {digits.map(d => <span key={d.id} className="absolute text-xl font-bold" style={{left:`${d.x}%`,top:"30%"}}>{d.value}</span>)}
        <div className="absolute text-2xl" style={{left:`${pos}%`,bottom:"10%",transform:"translateX(-50%)"}}>🏃</div>
      </div>
    </div>
  );
};

// Games 41-50
export const FlashCards = () => {
  const cards = [{q: "5 × 7", a: "35"}, {q: "12 ÷ 4", a: "3"}, {q: "8 + 9", a: "17"}, {q: "15 - 6", a: "9"}];
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);

  const next = (knew: boolean) => {
    if (knew) setCorrect(c => c + 1);
    setCurrent(c => (c + 1) % cards.length);
    setShowAnswer(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Correct: {correct}</div>
      <div className="w-40 h-24 bg-muted rounded-lg flex items-center justify-center text-2xl font-mono mb-4">
        {showAnswer ? cards[current].a : cards[current].q}
      </div>
      {!showAnswer ? (
        <Button onClick={() => setShowAnswer(true)} className="bg-primary">Show Answer</Button>
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => next(true)} className="bg-green-500">Knew it</Button>
          <Button onClick={() => next(false)} className="bg-red-500">Didn't know</Button>
        </div>
      )}
    </div>
  );
};

export const TrailFollow = () => {
  const [trail, setTrail] = useState<{x:number;y:number}[]>([]);
  const [playerTrail, setPlayerTrail] = useState<{x:number;y:number}[]>([]);
  const [phase, setPhase] = useState<"show"|"draw">("show");
  const [score, setScore] = useState(0);

  const generate = () => {
    const newTrail = Array.from({length: 5}, () => ({x: Math.random()*80+10, y: Math.random()*70+15}));
    setTrail(newTrail);
    setPlayerTrail([]);
    setPhase("show");
    setTimeout(() => setPhase("draw"), 3000);
  };

  useEffect(() => { generate(); }, []);

  const draw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "draw") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerTrail(p => [...p, {x, y}]);
  };

  const check = () => {
    if (playerTrail.length >= trail.length) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="relative w-full h-40 bg-muted/30 rounded-xl overflow-hidden" onClick={draw}>
        {phase === "show" && trail.map((t, i) => <div key={i} className="absolute w-4 h-4 bg-primary rounded-full" style={{left:`${t.x}%`,top:`${t.y}%`}}/>)}
        {phase === "draw" && playerTrail.map((t, i) => <div key={i} className="absolute w-3 h-3 bg-green-500 rounded-full" style={{left:`${t.x}%`,top:`${t.y}%`}}/>)}
      </div>
      {phase === "draw" && <Button onClick={check} className="mt-2 bg-primary">Check</Button>}
    </div>
  );
};

export const QuickDraw = () => {
  const shapes = ["circle", "square", "triangle"];
  const [target, setTarget] = useState(shapes[0]);
  const [drawn, setDrawn] = useState<{x:number;y:number}[]>([]);
  const [score, setScore] = useState(0);

  const draw = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawn(d => [...d, {x, y}]);
  };

  const submit = () => {
    if (drawn.length >= 3) setScore(s => s + 10);
    setDrawn([]);
    setTarget(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Draw a {target}!</p>
      <div className="relative w-full h-32 bg-muted/30 rounded-xl overflow-hidden cursor-crosshair" onMouseMove={draw}>
        {drawn.map((d, i) => <div key={i} className="absolute w-2 h-2 bg-primary rounded-full" style={{left:`${d.x}%`,top:`${d.y}%`}}/>)}
      </div>
      <Button onClick={submit} className="mt-2 bg-primary">Done!</Button>
    </div>
  );
};

export const SymbolMatch = () => {
  const symbols = ["⭐", "❤️", "🔷", "🔶", "⚡", "🌙"];
  const [pair, setPair] = useState<[string, string]>(["⭐", "⭐"]);
  const [score, setScore] = useState(0);

  const generate = () => {
    const s1 = symbols[Math.floor(Math.random() * symbols.length)];
    const s2 = Math.random() > 0.5 ? s1 : symbols[Math.floor(Math.random() * symbols.length)];
    setPair([s1, s2]);
  };

  useEffect(() => { generate(); }, []);

  const answer = (same: boolean) => {
    if ((pair[0] === pair[1]) === same) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="flex gap-8 text-5xl mb-4">
        <span>{pair[0]}</span>
        <span>{pair[1]}</span>
      </div>
      <p className="text-sm mb-4">Same symbols?</p>
      <div className="flex gap-4">
        <Button onClick={() => answer(true)} className="bg-green-500">Yes</Button>
        <Button onClick={() => answer(false)} className="bg-red-500">No</Button>
      </div>
    </div>
  );
};

export const TapTempo = () => {
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState(0);

  const tap = () => {
    const now = Date.now();
    const newTaps = [...taps, now].slice(-4);
    setTaps(newTaps);
    if (newTaps.length >= 2) {
      const intervals = newTaps.slice(1).map((t, i) => t - newTaps[i]);
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setBpm(Math.round(60000 / avgInterval));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">BPM: {bpm}</div>
      <Button onClick={tap} className="w-32 h-32 bg-primary text-4xl rounded-full">🥁</Button>
      <p className="text-xs mt-4 text-muted-foreground">Tap to find the tempo!</p>
    </div>
  );
};

export const MazeRunner = () => {
  const [pos, setPos] = useState({x: 0, y: 0});
  const [moves, setMoves] = useState(0);
  const goal = {x: 3, y: 3};

  const move = (dx: number, dy: number) => {
    setPos(p => ({x: Math.max(0, Math.min(3, p.x + dx)), y: Math.max(0, Math.min(3, p.y + dy))}));
    setMoves(m => m + 1);
  };

  const won = pos.x === goal.x && pos.y === goal.y;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-1 mb-4">
        {Array.from({length: 16}).map((_, i) => {
          const x = i % 4, y = Math.floor(i / 4);
          return <div key={i} className={`w-8 h-8 rounded flex items-center justify-center ${pos.x === x && pos.y === y ? "bg-primary" : goal.x === x && goal.y === y ? "bg-green-500" : "bg-muted"}`}>
            {pos.x === x && pos.y === y ? "🏃" : goal.x === x && goal.y === y ? "🏁" : ""}
          </div>;
        })}
      </div>
      {won ? <p className="text-green-500 font-bold">You made it!</p> : (
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

export const ColorPop = () => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
  const [bubbles, setBubbles] = useState<{id:number;x:number;y:number;color:string}[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setBubbles(prev => [...prev.slice(-10), {id: Date.now(), x: Math.random()*80+10, y: Math.random()*70+15, color: colors[Math.floor(Math.random()*5)]}]);
    }, 500);
    return () => clearInterval(int);
  }, []);

  const pop = (id: number) => { setScore(s => s + 5); setBubbles(prev => prev.filter(b => b.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="relative w-full h-40 bg-muted/30 rounded-xl overflow-hidden">
        {bubbles.map(b => (
          <button key={b.id} onClick={() => pop(b.id)} className={`absolute w-8 h-8 rounded-full ${b.color} hover:scale-125 transition`} style={{left:`${b.x}%`,top:`${b.y}%`}}/>
        ))}
      </div>
    </div>
  );
};

export const WordChain = () => {
  const [words, setWords] = useState<string[]>(["cat"]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const submit = () => {
    const lastWord = words[words.length - 1];
    if (input.length > 0 && input[0].toLowerCase() === lastWord[lastWord.length - 1].toLowerCase()) {
      setWords(w => [...w, input]);
      setScore(s => s + input.length);
    }
    setInput("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Last letter: <span className="font-bold">{words[words.length - 1].slice(-1).toUpperCase()}</span></p>
      <div className="h-8 mb-4 text-sm">{words.slice(-4).join(" → ")}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
        className="text-lg text-center w-32 p-2 bg-muted rounded-lg mb-2" placeholder="Word..." autoFocus />
      <Button onClick={submit} className="bg-primary">Submit</Button>
    </div>
  );
};

export const FocusTest = () => {
  const [target, setTarget] = useState({x: 50, y: 50});
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setTarget({x: Math.random()*70+15, y: Math.random()*60+20});
    }, 1500);
    return () => clearInterval(int);
  }, []);

  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (Math.abs(x - target.x) < 10 && Math.abs(y - target.y) < 10) setScore(s => s + 10);
    else setMisses(m => m + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-red-500">Misses: {misses}</span>
      </div>
      <div className="relative w-full h-40 bg-muted/30 rounded-xl overflow-hidden cursor-crosshair" onClick={click}>
        <div className="absolute w-8 h-8 bg-primary rounded-full" style={{left:`${target.x}%`,top:`${target.y}%`,transform:"translate(-50%,-50%)"}}/>
      </div>
    </div>
  );
};

export const BinaryBlitz = () => {
  const [decimal, setDecimal] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const generate = () => {
    const d = Math.floor(Math.random() * 16);
    setDecimal(d);
    const correct = d.toString(2).padStart(4, "0");
    const opts = [correct, ...Array.from({length: 3}, () => Math.floor(Math.random()*16).toString(2).padStart(4, "0"))].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  useEffect(() => { generate(); }, []);

  const check = (bin: string) => {
    if (parseInt(bin, 2) === decimal) setScore(s => s + 15);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <p className="text-sm mb-2">Convert to binary:</p>
      <div className="text-3xl font-mono mb-4">{decimal}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o, i) => <Button key={i} onClick={() => check(o)} variant="outline" className="font-mono">{o}</Button>)}
      </div>
    </div>
  );
};

// Games 51-60
export const CatchTheLight = () => {
  const [lightPos, setLightPos] = useState({x: 50, y: 50});
  const [caught, setCaught] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const int = setInterval(() => {
      setLightPos({x: Math.random()*70+15, y: Math.random()*60+20});
      setOn(true);
      setTimeout(() => setOn(false), 800);
    }, 1200);
    return () => clearInterval(int);
  }, []);

  const catchLight = () => { if (on) { setCaught(c => c + 1); setOn(false); } };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Caught: {caught}</div>
      <div className="relative w-full h-40 bg-gray-900 rounded-xl overflow-hidden" onClick={catchLight}>
        {on && <div className="absolute w-10 h-10 bg-yellow-400 rounded-full animate-pulse" style={{left:`${lightPos.x}%`,top:`${lightPos.y}%`,transform:"translate(-50%,-50%)"}}/>}
      </div>
    </div>
  );
};

export const HexMatch = () => {
  const hexColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
  const [target, setTarget] = useState(hexColors[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const generate = () => {
    const t = hexColors[Math.floor(Math.random() * hexColors.length)];
    setTarget(t);
    setOptions([t, ...hexColors.filter(h => h !== t).slice(0, 3)].sort(() => Math.random() - 0.5));
  };

  useEffect(() => { generate(); }, []);

  const check = (hex: string) => {
    if (hex === target) setScore(s => s + 10);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="w-20 h-20 rounded-xl mb-4" style={{backgroundColor: target}}/>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o, i) => <button key={i} onClick={() => check(o)} className="w-12 h-12 rounded-lg border-2" style={{backgroundColor: o}}/>)}
      </div>
    </div>
  );
};

export const DoubleDigit = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"show"|"input">("show");

  const generate = () => {
    const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 90) + 10);
    setNumbers(nums);
    setPhase("show");
    setInput("");
    setTimeout(() => setPhase("input"), 3000);
  };

  useEffect(() => { generate(); }, []);

  const check = () => {
    const inputNums = input.split(" ").map(n => parseInt(n));
    if (inputNums.every((n, i) => n === numbers[i])) setScore(s => s + 20);
    generate();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      {phase === "show" ? (
        <div className="text-2xl font-mono mb-4">{numbers.join(" ")}</div>
      ) : (
        <>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
            className="text-lg text-center w-40 p-2 bg-muted rounded-lg mb-2" placeholder="Enter numbers..." autoFocus />
          <Button onClick={check} className="bg-primary">Submit</Button>
        </>
      )}
    </div>
  );
};

export const ShapeShift = () => {
  const shapes = ["⭐", "❤️", "🔷", "🔶"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const generate = () => {
    setSequence(Array.from({length: 4}, () => Math.floor(Math.random() * 4)));
    setCurrent(0);
  };

  useEffect(() => { generate(); }, []);

  const shift = (s: number) => {
    if (s === sequence[current]) {
      if (current === 3) { setScore(sc => sc + 20); generate(); }
      else setCurrent(c => c + 1);
    } else { generate(); }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Score: {score}</div>
      <div className="h-8 mb-4">{sequence.map((s, i) => <span key={i} className={`text-xl ${i < current ? "opacity-50" : ""}`}>{shapes[s]}</span>)}</div>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((s, i) => <button key={i} onClick={() => shift(i)} className="text-2xl p-3 bg-muted rounded">{s}</button>)}
      </div>
    </div>
  );
};

export const CircuitConnect = () => {
  const [connected, setConnected] = useState<number[]>([]);
  const [power, setPower] = useState(0);

  const connect = (i: number) => {
    if (!connected.includes(i)) {
      setConnected(c => [...c, i]);
      setPower(p => p + 20);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Power: {power}%</div>
      <div className="flex gap-2 mb-4">
        {Array.from({length: 5}).map((_, i) => (
          <button key={i} onClick={() => connect(i)} className={`w-10 h-10 rounded-lg text-xl ${connected.includes(i) ? "bg-green-500" : "bg-muted"}`}>
            {connected.includes(i) ? "⚡" : "🔌"}
          </button>
        ))}
      </div>
      {power >= 100 && <p className="text-green-500 font-bold">Fully powered! ⚡</p>}
      <Button onClick={() => {setConnected([]);setPower(0);}} className="mt-2" variant="outline">Reset</Button>
    </div>
  );
};

export const TileSlide = () => {
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);

  const shuffle = () => setTiles([...tiles].sort(() => Math.random() - 0.5));

  const slide = (i: number) => {
    const emptyIdx = tiles.indexOf(0);
    if (Math.abs(i - emptyIdx) === 1 || Math.abs(i - emptyIdx) === 3) {
      const newTiles = [...tiles];
      [newTiles[i], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[i]];
      setTiles(newTiles);
      setMoves(m => m + 1);
    }
  };

  useEffect(() => { shuffle(); }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Moves: {moves}</div>
      <div className="grid grid-cols-3 gap-1">
        {tiles.map((t, i) => (
          <button key={i} onClick={() => slide(i)} className={`w-10 h-10 rounded flex items-center justify-center text-lg font-bold ${t === 0 ? "bg-transparent" : "bg-primary text-primary-foreground"}`}>
            {t !== 0 && t}
          </button>
        ))}
      </div>
      <Button onClick={() => {shuffle();setMoves(0);}} className="mt-4" variant="outline">Shuffle</Button>
    </div>
  );
};

export const NeonClick = () => {
  const colors = ["bg-pink-500", "bg-cyan-500", "bg-yellow-400", "bg-green-400", "bg-purple-500"];
  const [clicks, setClicks] = useState(0);
  const [color, setColor] = useState(0);

  const click = () => {
    setClicks(c => c + 1);
    setColor(c => (c + 1) % colors.length);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Clicks: {clicks}</div>
      <button onClick={click} className={`w-24 h-24 rounded-full ${colors[color]} shadow-lg hover:scale-110 transition`}/>
    </div>
  );
};

export const ZenFocus = () => {
  const [breathing, setBreathing] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState("inhale");

  useEffect(() => {
    if (!breathing) return;
    const int = setInterval(() => {
      setPhase(p => {
        if (p === "inhale") return "hold";
        if (p === "hold") return "exhale";
        setCycles(c => c + 1);
        return "inhale";
      });
    }, 2000);
    return () => clearInterval(int);
  }, [breathing]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Cycles: {cycles}</div>
      <div className={`w-20 h-20 rounded-full bg-primary transition-transform duration-1000 ${phase === "inhale" ? "scale-125" : phase === "exhale" ? "scale-75" : ""}`}/>
      <p className="mt-4 text-lg capitalize">{phase}</p>
      <Button onClick={() => setBreathing(b => !b)} className="mt-4 bg-primary">
        {breathing ? "Stop" : "Start Breathing"}
      </Button>
    </div>
  );
};

export const PixelPop = () => {
  const [pixels, setPixels] = useState<{id:number;x:number;y:number}[]>([]);
  const [popped, setPopped] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setPixels(prev => [...prev.slice(-15), {id: Date.now(), x: Math.random()*85+5, y: Math.random()*75+10}]);
    }, 300);
    return () => clearInterval(int);
  }, []);

  const pop = (id: number) => { setPopped(p => p + 1); setPixels(prev => prev.filter(p => p.id !== id)); };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Popped: {popped}</div>
      <div className="relative w-full h-40 bg-gray-900 rounded-xl overflow-hidden">
        {pixels.map(p => (
          <button key={p.id} onClick={() => pop(p.id)} className="absolute w-4 h-4 bg-green-400 hover:bg-green-300" style={{left:`${p.x}%`,top:`${p.y}%`}}/>
        ))}
      </div>
    </div>
  );
};

export const InfinityRun = () => {
  const [distance, setDistance] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!running) return;
    const int = setInterval(() => setDistance(d => d + speed), 50);
    return () => clearInterval(int);
  }, [running, speed]);

  const boost = () => setSpeed(s => Math.min(5, s + 0.5));

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-primary">Distance: {Math.floor(distance)}m</div>
      <p className="text-sm mb-4">Speed: {"⚡".repeat(Math.floor(speed))}</p>
      <div className="text-5xl mb-4">{running ? "🏃" : "🧍"}</div>
      <div className="flex gap-2">
        <Button onClick={() => setRunning(r => !r)} className="bg-primary">{running ? "Stop" : "Run"}</Button>
        {running && <Button onClick={boost} variant="outline">Boost ⚡</Button>}
      </div>
    </div>
  );
};
