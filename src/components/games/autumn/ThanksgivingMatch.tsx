import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ThanksgivingMatch = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const emojis = ["🦃", "🥧", "🌽", "🍂", "🎃", "🍎"];

  const initGame = () => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  const flipCard = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = flippedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameComplete(true);
    }
  }, [cards]);

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4">
        <span className="text-autumn-orange font-display">Moves: {moves}</span>
        <span className="text-autumn-brown font-display">
          Matched: {cards.filter((c) => c.isMatched).length / 2}/{emojis.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`h-14 rounded-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? "bg-autumn-gold/30"
                : "bg-autumn-brown/50 hover:bg-autumn-brown/70"
            }`}
          >
            <span className={`text-2xl ${card.isFlipped || card.isMatched ? "" : "invisible"}`}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>

      {gameComplete && (
        <div className="text-center">
          <p className="text-autumn-orange mb-2">🎉 Complete in {moves} moves! 🎉</p>
          <Button onClick={initGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
            Play Again
          </Button>
        </div>
      )}

      {!gameComplete && cards.length === 0 && (
        <Button onClick={initGame} className="bg-autumn-orange hover:bg-autumn-orange/80">
          Start Game
        </Button>
      )}
    </div>
  );
};

export default ThanksgivingMatch;
