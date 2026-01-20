import { useState } from "react";

const MathQuiz = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({ q: "", a: 0 });
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);

  const generate = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;
    if (op === "+") ans = a + b;
    else if (op === "-") ans = a - b;
    else ans = a * b;
    setQuestion({ q: `${a} ${op} ${b}`, a: ans });
    setInput("");
  };

  const check = () => {
    if (parseInt(input) === question.a) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    generate();
  };

  const start = () => { setIsPlaying(true); setScore(0); setStreak(0); generate(); };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-primary">Score: {score}</span>
        <span className="text-muted-foreground">🔥 {streak}</span>
      </div>
      {!isPlaying ? (
        <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Start</button>
      ) : (
        <>
          <div className="text-3xl font-mono mb-4">{question.q} = ?</div>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
            className="text-xl text-center w-24 p-2 bg-muted rounded-lg mb-2" autoFocus />
          <button onClick={check} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Submit</button>
        </>
      )}
    </div>
  );
};

export default MathQuiz;
