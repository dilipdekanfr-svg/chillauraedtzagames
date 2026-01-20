import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CHRISTMAS_EMOJIS = ["🎄", "🎅", "⭐", "🎁", "❄️", "🦌"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = () => {
    const shuffled = [...CHRISTMAS_EMOJIS, ...CHRISTMAS_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ));
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);
      
      if (card1?.emoji === card2?.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isWon = matches === CHRISTMAS_EMOJIS.length;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-foreground">
        <span className="font-display">Moves: {moves}</span>
        <span className="font-display">Matches: {matches}/{CHRISTMAS_EMOJIS.length}</span>
      </div>

      <div className="relative">
        {isWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20 rounded-lg">
            <p className="text-2xl font-display mb-4 text-christmas-green">
              🎄 You Won in {moves} moves! 🎄
            </p>
            <Button onClick={initializeGame} className="gradient-christmas text-foreground font-display box-glow-christmas">
              Play Again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-b from-christmas-green/20 to-christmas-red/20 rounded-lg border-2 border-christmas-green/50">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl md:text-3xl rounded-lg transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? "bg-card rotate-0 scale-100"
                  : "bg-christmas-red/60 hover:bg-christmas-red/80 rotate-0 scale-95"
              } ${card.isMatched ? "box-glow-christmas" : ""}`}
              disabled={card.isFlipped || card.isMatched || isLocked}
            >
              {card.isFlipped || card.isMatched ? card.emoji : "🎁"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={initializeGame} 
          variant="outline" 
          className="font-display border-christmas-green/50 text-christmas-green hover:bg-christmas-green/10"
        >
          Restart
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        Find all matching pairs!
      </p>
    </div>
  );
};

export default MemoryMatch;
