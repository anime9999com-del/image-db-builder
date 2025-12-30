import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Making the world a little less lonely, one conversation at a time. We are here for you.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-listener" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Find a Friend
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Admin</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/admin/login" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BaatCheet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
