import { Video, MicOff, PhoneOff, VideoOff } from 'lucide-react';

export function VideoSessionCard() {
  return (
    <div className="glass-card p-6 w-full max-w-md animate-fade-in animation-delay-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
          <Video className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Video Session</h3>
          <p className="text-sm text-success">Live • 12:04</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground italic">
            "I've just been feeling really overwhelmed lately with work..."
          </p>
        </div>
        <div className="bg-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            "I hear you. It sounds like you're carrying a lot right now."
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <MicOff className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/80 transition-colors">
          <PhoneOff className="w-5 h-5 text-destructive-foreground" />
        </button>
        <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <VideoOff className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
