import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VideoSessionCard } from '@/components/VideoSessionCard';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 text-destructive border border-destructive/30">
                <Heart className="w-4 h-4 fill-destructive" />
                <span className="text-sm font-medium">You are not alone</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Sometimes, you just need{' '}
                <span className="text-primary">someone to listen.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Feeling down, lonely, or just want to share some good news? Connect with empathetic listeners via Voice or Video call.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="xl" variant="hero">
                  <Link to="/find-listener">
                    Find a Listener
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="hero-outline">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-xs font-bold text-warning-foreground border-2 border-background">A</div>
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-xs font-bold text-success-foreground border-2 border-background">B</div>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background">C</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by <span className="text-foreground font-medium">10,000+</span> people
                </p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-150">
              <VideoSessionCard />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
