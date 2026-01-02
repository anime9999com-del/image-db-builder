import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth';
import { Shield } from 'lucide-react';

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      <nav className="container flex h-18 items-center justify-between">
        <Link to="/" className="flex items-center group">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-secondary/40 rounded-full px-2 py-1.5 backdrop-blur-sm border border-border/30">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all px-4 py-2 rounded-full">
            Home
          </Link>
          <Link to="/find-listener" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all px-4 py-2 rounded-full">
            Find a Listener
          </Link>
          {user && (
            <Link to="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all px-4 py-2 rounded-full">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all px-4 py-2 rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Logout
              </button>
              <Button asChild>
                <Link to="/find-listener">Book Now</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
