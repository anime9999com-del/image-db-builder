import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  UserCog,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

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
  is_active: boolean | null;
}

interface SiteContent {
  id: string;
  key: string;
  content: any;
}

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  isAdmin: boolean;
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListener, setEditingListener] = useState<Listener | null>(null);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch listeners (admin can see all)
    const { data: listenersData } = await supabase
      .from('listeners')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch site content
    const { data: contentData } = await supabase
      .from('site_content')
      .select('*');

    // Fetch all users with their roles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, email');
    
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role');

    // Combine profiles with role info
    const usersWithRoles: UserWithRole[] = (profilesData || []).map(profile => ({
      ...profile,
      isAdmin: rolesData?.some(r => r.user_id === profile.user_id && r.role === 'admin') || false
    }));

    setListeners(listenersData || []);
    setSiteContent(contentData || []);
    setUsers(usersWithRoles);
    setLoading(false);
  };

  const toggleAdminRole = async (userProfile: UserWithRole) => {
    if (userProfile.isAdmin) {
      // Remove admin role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userProfile.user_id)
        .eq('role', 'admin');
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Admin role removed', description: `${userProfile.full_name || userProfile.email} is no longer an admin` });
        fetchData();
      }
    } else {
      // Add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userProfile.user_id, role: 'admin' });
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Admin role granted', description: `${userProfile.full_name || userProfile.email} is now an admin` });
        fetchData();
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const saveListener = async (listener: Partial<Listener> & { initials: string; name: string }) => {
    if (listener.id) {
      const { error } = await supabase
        .from('listeners')
        .update(listener)
        .eq('id', listener.id);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Listener updated' });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from('listeners')
        .insert([listener]);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Listener added' });
        fetchData();
      }
    }
    setEditingListener(null);
  };

  const deleteListener = async (id: string) => {
    const { error } = await supabase
      .from('listeners')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Listener deleted' });
      fetchData();
    }
  };

  const saveContent = async (content: SiteContent) => {
    const { error } = await supabase
      .from('site_content')
      .update({ content: content.content, updated_by: user?.id })
      .eq('id', content.id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Content updated' });
      fetchData();
    }
    setEditingContent(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <div className="mb-8">
          <Logo />
        </div>
        
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('listeners')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'listeners' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Users className="w-5 h-5" />
            Listeners
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'content' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <FileText className="w-5 h-5" />
            Site Content
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'users' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <UserCog className="w-5 h-5" />
            User Roles
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-muted-foreground text-sm">Total Listeners</h3>
                <p className="text-3xl font-bold mt-2">{listeners.length}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-muted-foreground text-sm">Active Listeners</h3>
                <p className="text-3xl font-bold mt-2">
                  {listeners.filter(l => l.is_active).length}
                </p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-muted-foreground text-sm">Content Sections</h3>
                <p className="text-3xl font-bold mt-2">{siteContent.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listeners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Manage Listeners</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingListener({} as Listener)}>
                    <Plus className="w-4 h-4" />
                    Add Listener
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Listener</DialogTitle>
                  </DialogHeader>
                  <ListenerForm 
                    listener={editingListener}
                    onSave={saveListener}
                    onCancel={() => setEditingListener(null)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {listeners.map((listener) => (
                <div key={listener.id} className="glass-card p-4 flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-background shrink-0"
                    style={{ backgroundColor: listener.avatar_color || '#38bdf8' }}
                  >
                    {listener.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{listener.name}</h3>
                    <p className="text-sm text-muted-foreground">{listener.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      listener.is_active 
                        ? 'bg-success/20 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {listener.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setEditingListener(listener)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Listener</DialogTitle>
                        </DialogHeader>
                        <ListenerForm 
                          listener={listener}
                          onSave={saveListener}
                          onCancel={() => setEditingListener(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive"
                      onClick={() => deleteListener(listener.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Site Content</h1>
            <div className="space-y-4">
              {siteContent.map((content) => (
                <div key={content.id} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold capitalize">{content.key} Section</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent(content)}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Edit {content.key} Section</DialogTitle>
                        </DialogHeader>
                        <ContentForm 
                          content={content}
                          onSave={saveContent}
                          onCancel={() => setEditingContent(null)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <pre className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(content.content, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">User Roles Management</h1>
              <p className="text-sm text-muted-foreground">
                {users.filter(u => u.isAdmin).length} admins / {users.length} total users
              </p>
            </div>

            <div className="space-y-3">
              {users.map((userProfile) => (
                <div key={userProfile.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    {(userProfile.full_name || userProfile.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{userProfile.full_name || 'No name'}</h3>
                    <p className="text-sm text-muted-foreground truncate">{userProfile.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      userProfile.isAdmin 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {userProfile.isAdmin ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Admin
                        </>
                      ) : (
                        'User'
                      )}
                    </span>
                    {userProfile.user_id !== user?.id && (
                      <Button 
                        size="sm"
                        variant={userProfile.isAdmin ? "destructive" : "default"}
                        onClick={() => toggleAdminRole(userProfile)}
                      >
                        {userProfile.isAdmin ? (
                          <>
                            <ShieldX className="w-4 h-4 mr-1" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-1" />
                            Grant Admin
                          </>
                        )}
                      </Button>
                    )}
                    {userProfile.user_id === user?.id && (
                      <span className="text-xs text-muted-foreground italic">You</span>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No registered users found
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-semibold">Payment Integration</h3>
              <p className="text-sm text-muted-foreground">
                Razorpay integration is ready. Add your API keys in the backend settings.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Razorpay Key ID</Label>
                  <Input placeholder="rzp_live_..." disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Configure via backend secrets</p>
                </div>
                <div className="space-y-2">
                  <Label>Razorpay Secret Key</Label>
                  <Input type="password" placeholder="••••••••" disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Configure via backend secrets</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ListenerForm({ 
  listener, 
  onSave, 
  onCancel 
}: { 
  listener: Listener | null;
  onSave: (listener: Partial<Listener>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    initials: listener?.initials || '',
    name: listener?.name || '',
    tagline: listener?.tagline || '',
    bio: listener?.bio || '',
    voice_price: listener?.voice_price || 15,
    video_price: listener?.video_price || 20,
    avatar_color: listener?.avatar_color || '#38bdf8',
    categories: listener?.categories?.join(', ') || '',
    is_active: listener?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(listener?.id ? { id: listener.id } : {}),
      ...form,
      categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Initials</Label>
          <Input 
            value={form.initials} 
            onChange={(e) => setForm({ ...form, initials: e.target.value })}
            placeholder="SJ"
            maxLength={3}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Avatar Color</Label>
          <Input 
            type="color"
            value={form.avatar_color} 
            onChange={(e) => setForm({ ...form, avatar_color: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Sarah J."
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input 
          value={form.tagline} 
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="The Optimist"
        />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea 
          value={form.bio} 
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="I love helping people..."
        />
      </div>
      <div className="space-y-2">
        <Label>Categories (comma separated)</Label>
        <Input 
          value={form.categories} 
          onChange={(e) => setForm({ ...form, categories: e.target.value })}
          placeholder="Career, Relationships"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Voice Price ($)</Label>
          <Input 
            type="number"
            value={form.voice_price} 
            onChange={(e) => setForm({ ...form, voice_price: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Video Price ($)</Label>
          <Input 
            type="number"
            value={form.video_price} 
            onChange={(e) => setForm({ ...form, video_price: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={form.is_active}
          onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
        />
        <Label>Active</Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ContentForm({ 
  content, 
  onSave, 
  onCancel 
}: { 
  content: SiteContent;
  onSave: (content: SiteContent) => void;
  onCancel: () => void;
}) {
  const [jsonContent, setJsonContent] = useState(JSON.stringify(content.content, null, 2));
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonContent);
      setError('');
      onSave({ ...content, content: parsed });
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Content (JSON)</Label>
        <Textarea 
          value={jsonContent} 
          onChange={(e) => setJsonContent(e.target.value)}
          className="font-mono text-sm min-h-[200px]"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
