import { useState, useEffect } from "react";

const WordScramble = () => {
  const words = ["REACT", "CODING", "GAMES", "PLAYER", "STREAM", "VIDEO", "MUSIC"];
  const [isPlaying, setIsPlaying] = useState(false);
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const scramble = (w: string) => w.split("").sort(() => Math.random() - 0.5).join("");
  const newWord = () => { const w = words[Math.floor(Math.random() * words.length)]; setWord(w); setScrambled(scramble(w)); setInput(""); };
  const start = () => { setIsPlaying(true); setScore(0); newWord(); };

  const check = () => {
    if (input.toUpperCase() === word) { setScore(s => s + 20); newWord(); }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 font-display text-primary">Score: {score}</div>
      {!isPlaying ? (
        <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Start</button>
      ) : (
        <>
          <div className="text-3xl font-mono mb-4 tracking-widest">{scrambled}</div>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
            className="text-xl text-center w-32 p-2 bg-muted rounded-lg mb-2" autoFocus />
          <button onClick={check} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Submit</button>
          <button onClick={newWord} className="mt-2 text-sm text-muted-foreground hover:underline">Skip</button>
        </>
      )}
    </div>
  );
};

export default WordScramble;
