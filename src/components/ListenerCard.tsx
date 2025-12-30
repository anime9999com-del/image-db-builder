import { Star, Phone, Video } from 'lucide-react';
import { Button } from './ui/button';

interface Listener {
  id: string;
  initials: string;
  name: string;
  tagline: string | null;
  rating: number | null;
  review_count: number | null;
  categories: string[] | null;
  bio: string | null;
  voice_price: number;
  video_price: number;
  avatar_color: string | null;
}

interface ListenerCardProps {
  listener: Listener;
  onBook: (listener: Listener, type: 'voice' | 'video') => void;
}

export function ListenerCard({ listener, onBook }: ListenerCardProps) {
  return (
    <div className="glass-card p-6 space-y-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-background shrink-0"
          style={{ backgroundColor: listener.avatar_color || '#38bdf8' }}
        >
          {listener.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{listener.name}</h3>
          <p className="text-sm text-primary">{listener.tagline}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm text-warning">
              {listener.rating} ({listener.review_count})
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {listener.categories?.map((category) => (
          <span 
            key={category}
            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground italic">"{listener.bio}"</p>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onBook(listener, 'voice')}
        >
          <Phone className="w-4 h-4" />
          Voice ${listener.voice_price}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onBook(listener, 'video')}
        >
          <Video className="w-4 h-4" />
          Video ${listener.video_price}
        </Button>
      </div>
    </div>
  );
}
