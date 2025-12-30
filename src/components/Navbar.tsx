import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/find-listener" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Find a Listener
          </Link>
          {user && (
            <Link to="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              My Bookings
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
