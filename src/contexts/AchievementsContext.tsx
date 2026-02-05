import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'normal' | '3d' | 'fan' | 'premium' | 'event';
  requirement: number | string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface CategoryCounts {
  normal: number;
  '3d': number;
  christmas: number;
  halloween: number;
  spring: number;
  autumn: number;
}

interface AchievementsContextType {
  achievements: Achievement[];
  gamesPlayed: number;
  games3DPlayed: number;
  categoryCounts: CategoryCounts;
  subscribeClicked: boolean;
  ownerGreeting: boolean;
  trackGamePlay: (category?: string) => void;
  trackSubscribeClick: () => void;
  unlockOwnerGreeting: () => void;
  tryGreyGameAchievement: () => boolean;
  newlyUnlocked: Achievement | null;
  clearNewlyUnlocked: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  // Normal achievements
  { id: 'easy-gamer', name: 'Easy Gamer', description: 'Play 10 games', emoji: '🎮', category: 'normal', requirement: 10, unlocked: false },
  { id: 'medium-gamer', name: 'Medium Lvl Gamer', description: 'Play 50 games', emoji: '🕹️', category: 'normal', requirement: 50, unlocked: false },
  { id: 'elite-gamer', name: 'Elite Gamer', description: 'Play 100 games', emoji: '🏆', category: 'normal', requirement: 100, unlocked: false },
  { id: 'master-gamer', name: 'Master Lvl Gamer', description: 'Play 1000 games', emoji: '👑', category: 'normal', requirement: 1000, unlocked: false },
  
  // 3D achievements
  { id: '3d-gamer', name: '3D Gamer', description: 'Play 10 3D games', emoji: '🎲', category: '3d', requirement: 10, unlocked: false },
  { id: '3d-elite', name: '3D Elite Gamer', description: 'Play 100 3D games', emoji: '💎', category: '3d', requirement: 100, unlocked: false },
  { id: '3d-master', name: 'Master Lvl 3D Gamer', description: 'Play 1000 3D games', emoji: '🌟', category: '3d', requirement: 1000, unlocked: false },
  
  // Fan achievements
  { id: 'fan', name: 'Fan', description: 'Click on the subscribe button', emoji: '❤️', category: 'fan', requirement: 'subscribe', unlocked: false },
  
  // Premium achievements
  { id: 'owner-greeting', name: 'Owner Greeting', description: 'Ask the YouTuber for this!', emoji: '✨', category: 'premium', requirement: 'owner', unlocked: false },
  
  // Special achievements
  { id: 'all-rounder', name: '●●●', description: 'Play 6 games each of 3D, Christmas, Halloween, Spring, Autumn & Normal', emoji: '🌐', category: 'normal', requirement: 'all-categories', unlocked: false },
  { id: 'grey-one', name: 'THE GREY ONE', description: '1% chance when clicking a game', emoji: '🩶', category: 'premium', requirement: 'grey', unlocked: false },
  { id: 'enlightenment', name: 'Enlightenment', description: 'Press the 1 key', emoji: '💡', category: 'premium', requirement: '1-key', unlocked: false },
  { id: 'hacker', name: 'HACKER', description: 'Unlock every other achievement', emoji: '👾', category: 'premium', requirement: 'all', unlocked: false },
  
  // Event achievements
  { id: 'merry-christmas', name: 'Merry Christmas', description: 'Open the website on Christmas', emoji: '🎄', category: 'event', requirement: '12-25', unlocked: false },
  { id: 'trick-or-treat', name: 'Trick or Treat', description: 'Open the website on Halloween', emoji: '🎃', category: 'event', requirement: '10-31', unlocked: false },
  { id: 'bloom', name: 'Bloom', description: 'Open the website in Spring', emoji: '🌸', category: 'event', requirement: 'spring', unlocked: false },
  { id: 'melting-time', name: 'Melting Time', description: 'Open the website in Autumn', emoji: '🍂', category: 'event', requirement: 'autumn', unlocked: false },
  { id: 'new-year', name: 'New Year', description: 'Open the website on January 1st', emoji: '🎆', category: 'event', requirement: '01-01', unlocked: false },
];

export const AchievementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Achievement[];
        // Restore Date objects and merge with defaults (in case new achievements were added)
        const restoredAchievements = parsed.map(a => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
        }));
        // Merge: keep saved progress, add any new default achievements
        const savedIds = new Set(restoredAchievements.map(a => a.id));
        const newAchievements = defaultAchievements.filter(a => !savedIds.has(a.id));
        return [...restoredAchievements, ...newAchievements];
      } catch {
        return defaultAchievements;
      }
    }
    return defaultAchievements;
  });
  
  const [gamesPlayed, setGamesPlayed] = useState<number>(() => {
    return parseInt(localStorage.getItem('gamesPlayed') || '0', 10);
  });
  
  const [games3DPlayed, setGames3DPlayed] = useState<number>(() => {
    return parseInt(localStorage.getItem('games3DPlayed') || '0', 10);
  });
  
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>(() => {
    const saved = localStorage.getItem('categoryCounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { normal: 0, '3d': 0, christmas: 0, halloween: 0, spring: 0, autumn: 0 };
      }
    }
    return { normal: 0, '3d': 0, christmas: 0, halloween: 0, spring: 0, autumn: 0 };
  });
  
  const [subscribeClicked, setSubscribeClicked] = useState<boolean>(() => {
    return localStorage.getItem('subscribeClicked') === 'true';
  });
  
  const [ownerGreeting, setOwnerGreeting] = useState<boolean>(() => {
    return localStorage.getItem('ownerGreeting') === 'true';
  });
  
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('gamesPlayed', gamesPlayed.toString());
  }, [gamesPlayed]);
  
  useEffect(() => {
    localStorage.setItem('games3DPlayed', games3DPlayed.toString());
  }, [games3DPlayed]);
  
  useEffect(() => {
    localStorage.setItem('categoryCounts', JSON.stringify(categoryCounts));
  }, [categoryCounts]);
  
  useEffect(() => {
    localStorage.setItem('subscribeClicked', subscribeClicked.toString());
  }, [subscribeClicked]);
  
  useEffect(() => {
    localStorage.setItem('ownerGreeting', ownerGreeting.toString());
  }, [ownerGreeting]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const updated = prev.map(a => 
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
        );
        const unlockedAchievement = updated.find(a => a.id === id);
        if (unlockedAchievement) {
          setNewlyUnlocked(unlockedAchievement);
        }
        return updated;
      }
      return prev;
    });
  }, []);

  const checkGameAchievements = useCallback((totalGames: number, total3DGames: number, counts: CategoryCounts) => {
    // Normal game achievements
    if (totalGames >= 10) unlockAchievement('easy-gamer');
    if (totalGames >= 50) unlockAchievement('medium-gamer');
    if (totalGames >= 100) unlockAchievement('elite-gamer');
    if (totalGames >= 1000) unlockAchievement('master-gamer');
    
    // 3D game achievements
    if (total3DGames >= 10) unlockAchievement('3d-gamer');
    if (total3DGames >= 100) unlockAchievement('3d-elite');
    if (total3DGames >= 1000) unlockAchievement('3d-master');
    
    // All-rounder achievement (●●●)
    if (counts.normal >= 6 && counts['3d'] >= 6 && counts.christmas >= 6 && 
        counts.halloween >= 6 && counts.spring >= 6 && counts.autumn >= 6) {
      unlockAchievement('all-rounder');
    }
  }, [unlockAchievement]);

  const checkHackerAchievement = useCallback(() => {
    setAchievements(prev => {
      const nonHackerAchievements = prev.filter(a => a.id !== 'hacker');
      const allUnlocked = nonHackerAchievements.every(a => a.unlocked);
      if (allUnlocked) {
        const hackerAchievement = prev.find(a => a.id === 'hacker');
        if (hackerAchievement && !hackerAchievement.unlocked) {
          const updated = prev.map(a => 
            a.id === 'hacker' ? { ...a, unlocked: true, unlockedAt: new Date() } : a
          );
          setNewlyUnlocked(updated.find(a => a.id === 'hacker')!);
          return updated;
        }
      }
      return prev;
    });
  }, []);

  const trackGamePlay = useCallback((category: string = 'normal') => {
    const newTotal = gamesPlayed + 1;
    setGamesPlayed(newTotal);
    
    let new3DTotal = games3DPlayed;
    if (category === '3d') {
      new3DTotal = games3DPlayed + 1;
      setGames3DPlayed(new3DTotal);
    }
    
    // Update category counts
    const validCategory = category as keyof CategoryCounts;
    const newCounts = { ...categoryCounts };
    if (validCategory in newCounts) {
      newCounts[validCategory] = (newCounts[validCategory] || 0) + 1;
    }
    setCategoryCounts(newCounts);
    
    checkGameAchievements(newTotal, new3DTotal, newCounts);
    setTimeout(checkHackerAchievement, 100);
  }, [gamesPlayed, games3DPlayed, categoryCounts, checkGameAchievements, checkHackerAchievement]);

  const tryGreyGameAchievement = useCallback(() => {
    if (Math.random() < 0.01) { // 1% chance
      unlockAchievement('grey-one');
      setTimeout(checkHackerAchievement, 100);
      return true;
    }
    return false;
  }, [unlockAchievement, checkHackerAchievement]);

  const trackSubscribeClick = useCallback(() => {
    if (!subscribeClicked) {
      setSubscribeClicked(true);
      unlockAchievement('fan');
    }
  }, [subscribeClicked, unlockAchievement]);

  const unlockOwnerGreeting = useCallback(() => {
    if (!ownerGreeting) {
      setOwnerGreeting(true);
      unlockAchievement('owner-greeting');
      setTimeout(checkHackerAchievement, 100);
    }
  }, [ownerGreeting, unlockAchievement, checkHackerAchievement]);

  // Keyboard listener for "1" key (Enlightenment achievement) and secret unlock code
  useEffect(() => {
    let secretSequence: string[] = [];
    const secretCode = ['O', 'G']; // Hold Shift + O + G
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Enlightenment achievement
      if (e.key === '1') {
        unlockAchievement('enlightenment');
        setTimeout(checkHackerAchievement, 100);
      }
      
      // Secret owner unlock code (Shift + O + G)
      if (e.shiftKey && secretCode.includes(e.key.toUpperCase())) {
        secretSequence.push(e.key.toUpperCase());
        if (secretSequence.length >= 2) {
          const lastTwo = secretSequence.slice(-2);
          if (lastTwo[0] === 'O' && lastTwo[1] === 'G') {
            // Unlock ALL achievements
            setAchievements(prev => prev.map(a => ({
              ...a,
              unlocked: true,
              unlockedAt: a.unlockedAt || new Date()
            })));
            setSubscribeClicked(true);
            setOwnerGreeting(true);
            secretSequence = [];
            console.log('🎮 All achievements unlocked! Welcome, owner!');
          }
        }
      } else if (!e.shiftKey) {
        secretSequence = [];
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [unlockAchievement, checkHackerAchievement]);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  // Check event achievements on mount
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Christmas (December 25)
    if (dateStr === '12-25') unlockAchievement('merry-christmas');
    
    // Halloween (October 31)
    if (dateStr === '10-31') unlockAchievement('trick-or-treat');
    
    // New Year (January 1)
    if (dateStr === '01-01') unlockAchievement('new-year');
    
    // Spring (March 20 - June 20)
    if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20)) {
      unlockAchievement('bloom');
    }
    
    // Autumn (September 22 - December 21)
    if ((month === 9 && day >= 22) || (month > 9 && month < 12) || (month === 12 && day <= 21)) {
      unlockAchievement('melting-time');
    }
  }, [unlockAchievement]);

  // Check existing progress on mount
  useEffect(() => {
    checkGameAchievements(gamesPlayed, games3DPlayed, categoryCounts);
    if (subscribeClicked) unlockAchievement('fan');
    if (ownerGreeting) unlockAchievement('owner-greeting');
    setTimeout(checkHackerAchievement, 100);
  }, []);

  return (
    <AchievementsContext.Provider value={{
      achievements,
      gamesPlayed,
      games3DPlayed,
      categoryCounts,
      subscribeClicked,
      ownerGreeting,
      trackGamePlay,
      trackSubscribeClick,
      unlockOwnerGreeting,
      tryGreyGameAchievement,
      newlyUnlocked,
      clearNewlyUnlocked,
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
