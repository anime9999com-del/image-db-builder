import { Video, MicOff, PhoneOff, VideoOff } from 'lucide-react';

export function VideoSessionCard() {
  return (
    <div className="glass-card-elevated p-6 w-full max-w-md animate-fade-in animation-delay-300 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-success/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Video Session</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <p className="text-sm text-success font-medium">Live • 12:04</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-secondary/60 rounded-xl p-4 backdrop-blur-sm border border-border/30">
            <p className="text-sm text-muted-foreground italic">
              "I've just been feeling really overwhelmed lately with work..."
            </p>
          </div>
          <div className="bg-primary/15 rounded-xl p-4 backdrop-blur-sm border border-primary/20">
            <p className="text-sm text-primary font-medium">
              "I hear you. It sounds like you're carrying a lot right now."
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-all hover:scale-105 border border-border/30">
            <MicOff className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-14 h-14 rounded-xl bg-destructive flex items-center justify-center hover:bg-destructive/90 transition-all hover:scale-105 shadow-lg shadow-destructive/25">
            <PhoneOff className="w-6 h-6 text-destructive-foreground" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-all hover:scale-105 border border-border/30">
            <VideoOff className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
