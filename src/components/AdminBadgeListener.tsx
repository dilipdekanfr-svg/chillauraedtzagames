import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AdminBadgeListener = () => {
  const { user, grantAdminBadge } = useAuth();

  useEffect(() => {
    let sequence: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!user) return;
      
      // Detect Ctrl + X then A
      if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        sequence = ['x'];
        return;
      }
      
      if (sequence.length === 1 && sequence[0] === 'x' && e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        grantAdminBadge();
        toast({ title: '👑 Admin Badge Granted!', description: 'You now have the Admin badge!' });
        sequence = [];
        return;
      }
      
      if (!e.ctrlKey) {
        sequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, grantAdminBadge]);

  return null;
};

export default AdminBadgeListener;
