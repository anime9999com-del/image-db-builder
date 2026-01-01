import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VideoSessionCard } from '@/components/VideoSessionCard';
import { BackgroundEffects } from '@/components/BackgroundEffects';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffects />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 backdrop-blur-sm">
                <Heart className="w-4 h-4 fill-destructive" />
                <span className="text-sm font-medium">You are not alone</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                Sometimes, you just need{' '}
                <span className="text-gradient">someone to listen.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Feeling down, lonely, or just want to share some good news? Connect with empathetic listeners via Voice or Video call.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="xl" className="glow-primary">
                  <Link to="/find-listener">
                    Find a Listener
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline" className="border-border/50 backdrop-blur-sm">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center text-xs font-bold text-warning-foreground border-2 border-background shadow-lg">A</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center text-xs font-bold text-success-foreground border-2 border-background shadow-lg">B</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background shadow-lg">C</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by <span className="text-foreground font-semibold">10,000+</span> people
                </p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-150">
              <VideoSessionCard />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container py-20 border-t border-border/30">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Empathetic Listeners</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our trained listeners are here to provide a safe, non-judgmental space for you to share.
              </p>
            </div>
            
            <div className="glass-card p-6 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">100% Confidential</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your conversations are private and secure. We prioritize your privacy above all.
              </p>
            </div>
            
            <div className="glass-card p-6 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Available 24/7</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect anytime, anywhere. Our listeners are available around the clock.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
