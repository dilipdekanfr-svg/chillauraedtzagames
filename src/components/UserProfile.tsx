import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserBadge from './UserBadge';
import { toast } from '@/hooks/use-toast';
import { User, Settings, LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || !profile) return null;

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await updateProfile({ display_name: newName.trim() });
    toast({ title: 'Updated!', description: 'Display name changed.' });
    setEditOpen(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Too large', description: 'Max 2MB', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const url = await uploadAvatar(file);
    setUploading(false);
    if (url) toast({ title: 'Avatar updated!' });
    else toast({ title: 'Upload failed', variant: 'destructive' });
  };

  return (
    <div className="flex items-center gap-3">
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (open) setNewName(profile.display_name); }}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-full hover:border-primary/50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {profile.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{profile.display_name}</span>
            <UserBadge badge={profile.badge} />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground flex items-center gap-2">
              <Settings className="h-5 w-5" /> Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {profile.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>
            <div>
              <Label>Display Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={30} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Badge:</span>
              <UserBadge badge={profile.badge} size="md" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveName} className="flex-1">Save</Button>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
