import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  booking_type: string;
  amount: number;
  status: string | null;
  scheduled_at: string | null;
  created_at: string;
  meet_link: string | null;
  listeners: {
    name: string;
    tagline: string | null;
    avatar_color: string | null;
    initials: string;
    currency: string;
  };
}

export default function Bookings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        listeners (name, tagline, avatar_color, initials, currency)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    setBookings(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'confirmed': return 'bg-success/20 text-success';
      case 'completed': return 'bg-primary/20 text-primary';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      default: return 'bg-warning/20 text-warning';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundEffects />
      <Navbar />
      
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
            <a href="/find-listener" className="text-primary hover:underline">
              Find a listener →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-background shrink-0"
                    style={{ backgroundColor: booking.listeners.avatar_color || '#38bdf8' }}
                  >
                    {booking.listeners.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.listeners.name}</h3>
                    <p className="text-sm text-muted-foreground">{booking.listeners.tagline}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {booking.booking_type === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                        {booking.booking_type} call
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">
                      {booking.listeners.currency === 'INR' ? '₹' : '$'}{booking.amount}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                {/* Google Meet Section - Always visible */}
                <div className="mt-4 pt-4 border-t border-border">
                  {booking.meet_link ? (
                    <a 
                      href={booking.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Join Google Meet
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Video className="w-4 h-4" />
                      <span>Meeting link will be provided soon by the listener</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
