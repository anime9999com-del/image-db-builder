import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid credentials.',
          variant: 'destructive',
        });
      } else {
        // Auth context will check admin status and redirect
        toast({
          title: 'Checking admin access...',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 p-4">
        <Link to="/">
          <Logo />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in with your admin credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@baatcheet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
