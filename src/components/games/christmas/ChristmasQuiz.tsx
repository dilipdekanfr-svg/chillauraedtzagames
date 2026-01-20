import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  { question: "What color is Rudolph's nose?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1 },
  { question: "How many reindeer pull Santa's sleigh?", options: ["6", "7", "8", "9"], correct: 3 },
  { question: "What do we leave for Santa?", options: ["Pizza", "Cookies", "Cake", "Candy"], correct: 1 },
  { question: "What tops a Christmas tree?", options: ["Hat", "Crown", "Star", "Ball"], correct: 2 },
  { question: "What do you hang on the door?", options: ["Wreath", "Photo", "Mirror", "Clock"], correct: 0 },
  { question: "Santa lives at the..?", options: ["South Pole", "North Pole", "Moon", "Beach"], correct: 1 },
  { question: "Frosty is a..?", options: ["Reindeer", "Elf", "Snowman", "Penguin"], correct: 2 },
  { question: "Christmas is on December..?", options: ["24", "25", "26", "31"], correct: 1 },
];

const ChristmasQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    
    if (index === QUESTIONS[currentQ].correct) {
      setScore(s => s + 10);
    }

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(q => q + 1);
        setSelected(null);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const q = QUESTIONS[currentQ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 font-display">
        <span className="text-christmas-green">Score: {score}</span>
        <span className="text-muted-foreground">{currentQ + 1}/{QUESTIONS.length}</span>
      </div>

      <div className="w-full p-4 bg-gradient-to-b from-christmas-green/20 to-christmas-red/20 rounded-xl">
        {(!isPlaying || gameOver) && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-christmas-red mb-2 text-lg">
              {gameOver ? `Quiz Complete! Score: ${score}/${QUESTIONS.length * 10}` : "Test your Christmas knowledge!"}
            </p>
            <button onClick={startGame} className="px-4 py-2 bg-christmas-green text-foreground rounded-lg font-display">
              {gameOver ? "Play Again" : "Start Quiz"}
            </button>
          </div>
        )}

        {isPlaying && !gameOver && (
          <>
            <h3 className="text-lg font-display text-center mb-4 text-christmas-red">
              🎄 {q.question}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`p-3 rounded-lg font-display transition-all ${
                    selected === null 
                      ? 'bg-card hover:bg-christmas-green/30' 
                      : i === q.correct 
                        ? 'bg-christmas-green' 
                        : selected === i 
                          ? 'bg-christmas-red' 
                          : 'bg-card opacity-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChristmasQuiz;
