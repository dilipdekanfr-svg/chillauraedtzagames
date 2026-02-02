import { useEffect } from 'react';
import { useAchievements } from '@/contexts/AchievementsContext';

const AchievementPopup = () => {
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements();

  useEffect(() => {
    if (newlyUnlocked) {
      const timer = setTimeout(() => {
        clearNewlyUnlocked();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

  if (!newlyUnlocked) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right-full duration-500">
      <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-primary/50 max-w-sm">
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-bounce">{newlyUnlocked.emoji}</div>
          <div>
            <p className="text-xs text-primary-foreground/80 uppercase tracking-wider font-semibold">
              Achievement Unlocked!
            </p>
            <h3 className="text-lg font-bold text-primary-foreground">
              {newlyUnlocked.name}
            </h3>
            <p className="text-sm text-primary-foreground/90">
              {newlyUnlocked.description}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
