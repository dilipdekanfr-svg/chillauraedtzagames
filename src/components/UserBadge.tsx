interface UserBadgeProps {
  badge: 'bronze' | 'silver' | 'gold' | 'diamond' | 'admin';
  size?: 'sm' | 'md';
}

const badgeConfig = {
  bronze: { label: '🥉 Bronze', color: 'bg-amber-700 text-amber-100' },
  silver: { label: '🥈 Silver', color: 'bg-gray-400 text-gray-900' },
  gold: { label: '🥇 Gold', color: 'bg-yellow-500 text-yellow-900' },
  diamond: { label: '💎 Diamond', color: 'bg-cyan-400 text-cyan-900' },
  admin: { label: '👑 Admin', color: 'bg-red-600 text-white' },
};

const UserBadge = ({ badge, size = 'sm' }: UserBadgeProps) => {
  const config = badgeConfig[badge];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <span className={`inline-flex items-center rounded-full font-bold ${config.color} ${sizeClass}`}>
      {config.label}
    </span>
  );
};

export default UserBadge;
