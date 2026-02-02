import { useAchievements, Achievement } from '@/contexts/AchievementsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, CheckCircle } from 'lucide-react';

const categoryLabels: Record<string, { label: string; color: string }> = {
  normal: { label: 'Normal', color: 'bg-blue-500' },
  '3d': { label: '3D', color: 'bg-purple-500' },
  fan: { label: 'Fan', color: 'bg-red-500' },
  premium: { label: 'Premium', color: 'bg-yellow-500' },
  event: { label: 'Event', color: 'bg-green-500' },
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const isUnlocked = achievement.unlocked;
  
  return (
    <div className={`relative p-4 rounded-lg border transition-all duration-300 ${
      isUnlocked 
        ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50' 
        : 'bg-muted/50 border-border opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
          {isUnlocked ? achievement.emoji : <Lock className="w-8 h-8 text-muted-foreground" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {achievement.name}
            </h4>
            {isUnlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          <Badge variant="outline" className={`mt-2 text-xs ${categoryLabels[achievement.category].color} text-white border-0`}>
            {categoryLabels[achievement.category].label}
          </Badge>
        </div>
      </div>
      {achievement.category === 'premium' && !isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
            ✨ Premium
          </span>
        </div>
      )}
    </div>
  );
};

const AchievementsIndex = () => {
  const { achievements, gamesPlayed, games3DPlayed, unlockOwnerGreeting, ownerGreeting } = useAchievements();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) acc[achievement.category] = [];
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-primary/50 hover:bg-primary/20"
        >
          <Trophy className="w-4 h-4" />
          Achievements
          <Badge variant="secondary" className="ml-1">
            {unlockedCount}/{totalCount}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Achievements
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{unlockedCount} / {totalCount}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">{gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">Total Games Played</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-secondary">{games3DPlayed}</p>
            <p className="text-xs text-muted-foreground">3D Games Played</p>
          </div>
        </div>

        {/* Owner Greeting Unlock Button */}
        {!ownerGreeting && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-500 flex items-center gap-2">
                  ✨ Premium Achievement
                </h4>
                <p className="text-sm text-muted-foreground">Click to unlock the Owner Greeting!</p>
              </div>
              <Button 
                onClick={unlockOwnerGreeting}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
              >
                Unlock Greeting
              </Button>
            </div>
          </div>
        )}

        {/* Achievement categories */}
        <div className="space-y-6">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${categoryLabels[category].color}`} />
                {categoryLabels[category].label} Achievements
              </h3>
              <div className="grid gap-3">
                {categoryAchievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsIndex;
