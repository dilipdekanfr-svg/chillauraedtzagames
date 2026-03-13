import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import UserBadge from './UserBadge';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    badge: 'bronze' | 'silver' | 'gold' | 'diamond' | 'admin';
  };
}

const QASection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles!comments_user_id_fkey(display_name, avatar_url, badge)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setComments(data as unknown as Comment[]);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    if (newComment.trim().length > 500) {
      toast({ title: 'Too long', description: 'Max 500 characters', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      user_id: user.id,
      content: newComment.trim(),
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewComment('');
      await fetchComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId);
    await fetchComments();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-display text-center mb-2 text-foreground flex items-center justify-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Q&A
        </h2>
        <p className="text-center text-muted-foreground mb-8">Ask questions and chat with the community!</p>

        {/* Comment input */}
        {user ? (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {profile?.display_name?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment or question..."
                  className="mb-2 min-h-[60px]"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{newComment.length}/500</span>
                  <Button size="sm" onClick={handleSubmit} disabled={submitting || !newComment.trim()}>
                    <Send className="h-4 w-4 mr-1" /> Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 mb-6 text-center">
            <p className="text-muted-foreground mb-3">Sign in to join the conversation!</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-3">
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {comment.profiles?.display_name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{comment.profiles?.display_name}</span>
                    <UserBadge badge={comment.profiles?.badge || 'bronze'} />
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-1 break-words">{comment.content}</p>
                </div>
                {user?.id === comment.user_id && (
                  <button onClick={() => handleDelete(comment.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
