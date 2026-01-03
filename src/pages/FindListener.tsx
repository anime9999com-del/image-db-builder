import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { ListenerCard } from '@/components/ListenerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useNavigate } from 'react-router-dom';

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

const categories = ['All', 'Relationship', 'Career', 'Anxiety', 'Stress', 'Family', 'Motivation'];

export default function FindListener() {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { initiatePayment, loading: paymentLoading } = useRazorpay();

  useEffect(() => {
    fetchListeners();
  }, []);

  const fetchListeners = async () => {
    const { data, error } = await supabase
      .from('listeners')
      .select('*')
      .eq('is_active', true);

    if (error) {
      toast({
        title: 'Error loading listeners',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setListeners(data || []);
    }
    setLoading(false);
  };

  const filteredListeners = listeners.filter((listener) => {
    const matchesSearch = 
      listener.name.toLowerCase().includes(search.toLowerCase()) ||
      listener.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      listener.categories?.some(c => c.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      listener.categories?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleBook = (listener: Listener, type: 'voice' | 'video') => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to book a session.',
      });
      navigate('/auth');
      return;
    }

    const amount = type === 'voice' ? listener.voice_price : listener.video_price;

    initiatePayment({
      listenerId: listener.id,
      listenerName: listener.name,
      bookingType: type,
      amount,
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || user.email || '',
      onSuccess: (bookingId) => {
        toast({
          title: 'Booking confirmed!',
          description: `Your ${type} session with ${listener.name} has been booked successfully.`,
        });
        navigate('/bookings');
      },
      onError: (error) => {
        toast({
          title: 'Payment failed',
          description: error,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundEffects />
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-card to-background py-16">
          <div className="container text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Find Your Perfect Listener
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our community of empathetic listeners available for Voice and Video calls.
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <Input
                placeholder="Search by name, topic, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-12 h-14 text-base"
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/50">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Listeners Grid */}
        <section className="container py-12">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading listeners...</div>
          ) : filteredListeners.length === 0 ? (
            <div className="text-center text-muted-foreground">No listeners found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListeners.map((listener) => (
                <ListenerCard 
                  key={listener.id} 
                  listener={listener} 
                  onBook={handleBook}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
