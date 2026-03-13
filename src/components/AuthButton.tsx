import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfile from './UserProfile';
import { User } from 'lucide-react';

const AuthButton = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (user) return <UserProfile />;

  return (
    <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="gap-2">
      <User className="h-4 w-4" /> Sign In
    </Button>
  );
};

export default AuthButton;
