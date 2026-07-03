import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import UserBadge from './UserBadge';
import { Hash, Send, Trash2, Globe2, Users, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  region: string | null;
  created_at: string;
  profiles?: {
    display_name: string;
    avatar_url: string | null;
    badge: 'bronze' | 'silver' | 'gold' | 'diamond' | 'admin';
  } | null;
}

// Detect region from browser timezone
const detectRegion = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const continent = tz.split('/')[0];
    const map: Record<string, string> = {
      America: '🌎 Americas',
      Europe: '🌍 Europe',
      Africa: '🌍 Africa',
      Asia: '🌏 Asia',
      Australia: '🌏 Oceania',
      Pacific: '🌏 Pacific',
      Atlantic: '🌊 Atlantic',
      Indian: '🌊 Indian Ocean',
      Antarctica: '❄️ Antarctica',
    };
    return map[continent] || '🌐 Global';
  } catch {
    return '🌐 Global';
  }
};

const ChatSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, ChatMessage['profiles']>>({});
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const region = useMemo(() => detectRegion(), []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  };

  const ensureProfiles = async (userIds: string[]) => {
    const missing = userIds.filter((id) => id && !profileMap[id]);
    if (missing.length === 0) return;
    const { data } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, badge')
      .in('user_id', missing);
    if (data) {
      setProfileMap((prev) => {
        const next = { ...prev };
        data.forEach((p: any) => {
          next[p.user_id] = { display_name: p.display_name, avatar_url: p.avatar_url, badge: p.badge };
        });
        return next;
      });
    }
  };

  const fetchInitial = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) {
      const ordered = [...data].reverse() as ChatMessage[];
      setMessages(ordered);
      await ensureProfiles(ordered.map((m) => m.user_id));
      scrollToBottom();
    }
  };

  useEffect(() => {
    fetchInitial();
    const channel = supabase
      .channel('chat_messages_stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const msg = payload.new as ChatMessage;
          await ensureProfiles([msg.user_id]);
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const oldMsg = payload.old as ChatMessage;
          setMessages((prev) => prev.filter((m) => m.id !== oldMsg.id));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!user || !newMessage.trim() || sending) return;
    if (newMessage.length > 500) {
      toast({ title: 'Too long', description: 'Max 500 characters', variant: 'destructive' });
      return;
    }
    setSending(true);
    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: newMessage.trim(),
      region,
    });
    if (error) {
      toast({ title: 'Send failed', description: error.message, variant: 'destructive' });
    } else {
      setNewMessage('');
    }
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('chat_messages').delete().eq('id', id);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group consecutive messages by same user within 5 min
  const grouped = useMemo(() => {
    const groups: { user_id: string; region: string | null; profile: ChatMessage['profiles']; items: ChatMessage[] }[] = [];
    messages.forEach((m) => {
      const last = groups[groups.length - 1];
      const prof = profileMap[m.user_id] || null;
      const lastTime = last ? new Date(last.items[last.items.length - 1].created_at).getTime() : 0;
      const curTime = new Date(m.created_at).getTime();
      if (last && last.user_id === m.user_id && curTime - lastTime < 5 * 60 * 1000) {
        last.items.push(m);
      } else {
        groups.push({ user_id: m.user_id, region: m.region, profile: prof, items: [m] });
      }
    });
    return groups;
  }, [messages, profileMap]);

  // Unique active regions
  const activeRegions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => m.region && set.add(m.region));
    set.add(region);
    return Array.from(set);
  }, [messages, region]);

  const onlineCount = useMemo(() => {
    const set = new Set(messages.map((m) => m.user_id));
    return set.size;
  }, [messages]);

  return (
    <section id="chat" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-display text-center mb-2 text-foreground flex items-center justify-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          Global Lounge
        </h2>
        <p className="text-center text-muted-foreground mb-8">A live chatroom for gamers from every region 🌍</p>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0 rounded-2xl overflow-hidden border border-border bg-[hsl(230_15%_10%)] shadow-2xl shadow-primary/10">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col bg-[hsl(230_15%_8%)] border-r border-border/60 p-3">
            <div className="flex items-center gap-2 px-2 py-3 border-b border-border/40">
              <Hash className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">global-lounge</span>
            </div>
            <div className="mt-4 px-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Globe2 className="h-3 w-3" /> Regions Online
              </p>
              <ul className="space-y-1">
                {activeRegions.map((r) => (
                  <li key={r} className="text-xs px-2 py-1 rounded hover:bg-white/5 text-foreground/80 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]" />
                    {r}
                    {r === region && <span className="ml-auto text-[10px] text-primary">you</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 px-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Users className="h-3 w-3" /> Speakers · {onlineCount}
              </p>
            </div>
          </aside>

          {/* Main channel */}
          <div className="flex flex-col h-[600px]">
            {/* Channel header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-[hsl(230_15%_9%)]">
              <Hash className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">global-lounge</span>
              <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">Chat with gamers worldwide · {region}</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {grouped.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <p className="text-lg mb-1">Welcome to #global-lounge!</p>
                  <p className="text-sm">Be the first to say hi from {region} 👋</p>
                </div>
              )}
              {grouped.map((g, gi) => (
                <div key={gi} className="flex gap-3 group">
                  <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                    <AvatarImage src={g.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {g.profile?.display_name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground hover:underline cursor-pointer">
                        {g.profile?.display_name || 'Player'}
                      </span>
                      <UserBadge badge={g.profile?.badge || 'bronze'} />
                      {g.region && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                          {g.region}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {formatTime(g.items[0].created_at)}
                      </span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {g.items.map((m) => (
                        <div key={m.id} className="group/msg flex items-start gap-2">
                          <p className="text-sm text-foreground/90 break-words whitespace-pre-wrap flex-1">
                            {m.content}
                          </p>
                          {user?.id === m.user_id && (
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="opacity-0 group-hover/msg:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                              aria-label="Delete message"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-border/50 bg-[hsl(230_15%_9%)] p-3">
              {user ? (
                <div className="flex items-end gap-2 bg-[hsl(230_15%_14%)] rounded-lg px-3 py-2 border border-border/40 focus-within:border-primary/60 transition-colors">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Message #global-lounge as ${profile?.display_name || 'you'}`}
                    rows={1}
                    maxLength={500}
                    className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground max-h-32"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={sending || !newMessage.trim()}
                    className="h-8 w-8 shrink-0"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-muted-foreground mb-2">Sign in to join the conversation.</p>
                  <Button size="sm" onClick={() => navigate('/auth')}>Sign in</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;