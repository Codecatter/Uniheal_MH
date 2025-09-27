import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Leaf, Heart, Headphones, Calendar, Clock, CheckCircle, AlertTriangle, LogOut, Star, UserCheck, Mail, Lock } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

const VolunteerPortal = () => {
  // Login state
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dashboard states
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [hours, setHours] = useState(0);
  const [points, setPoints] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (isLogin && email && password) ||
      (!isLogin && name && email && password)
    ) {
      setIsLoggedIn(true);
    }
  };

    // 🔹 LOGIN / SIGNUP SCREEN
  if (!isLoggedIn) {
    return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <Leaf className="h-8 w-8 text-primary" />
              <Headphones className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold text-primary">UniHeal</h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Volunteer Portal</h2>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Welcome back! Please sign in to continue." : "Join our team of mental health professionals."}
          </p>
        </div>

        <Card className="shadow-hover">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Access your volunteer dashboard" 
                : "Register as a licensed volunteer"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="volunteer@university.edu"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 mt-6">
                <Heart className="h-4 w-4" />
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin 
                  ? "Need an account? Register here" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};


  // Mock tasks
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tasks, setTasks] = useState([
    { id: 1, task: "Assist in Wellness Workshop", date: "2024-10-01", time: "11:00 AM", status: "upcoming", priority: "high", location: "Auditorium" },
    { id: 2, task: "Peer Support Session", date: "2024-10-02", time: "3:00 PM", status: "upcoming", priority: "moderate", location: "Library Hall" },
    { id: 3, task: "Help Desk Duty", date: "2024-09-28", time: "9:00 AM", status: "completed", priority: "low", location: "Student Union" },
  ]);

  // Mock peer posts
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [posts, setPosts] = useState([
    { id: 1, text: "I'm really stressed about exams...", flagged: false, reviewed: false },
    { id: 2, text: "I feel very alone lately", flagged: false, reviewed: false },
    { id: 3, text: "Had a great day with friends!", flagged: false, reviewed: false },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);

  // Mock events
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [events] = useState([
    { id: 1, title: "Mental Health Awareness Camp", date: "2024-10-05", location: "Main Ground" },
    { id: 2, title: "Meditation Workshop", date: "2024-10-10", location: "Wellness Center" },
  ]);

  const handlePostClick = (id: number, action: "ok" | "flag") => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reviewed: true, flagged: action === "flag" } : p
      )
    );
    if (action === "flag") {
      const post = posts.find((p) => p.id === id);
      if (post) setFlaggedPosts((prev) => [...prev, { ...post, flagged: true }]);
    }
  };

  const markTaskDone = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
    setHours(hours + 2);
    setPoints(points + 20);
  };


  const upcomingTasks = tasks.filter((t) => t.status === "upcoming");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">UniHeal Volunteer Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Volunteer</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volunteer Hours</p>
                <p className="text-2xl font-bold">{hours} hrs</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.task}</p>
                  <p className="text-xs text-muted-foreground">{t.date} @ {t.time}</p>
                </div>
                <Button size="sm" onClick={() => markTaskDone(t.id)}>Mark Done</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Peer Support */}
        <Card>
          <CardHeader>
            <CardTitle>Peer Support Feed</CardTitle>
            <CardDescription>Left-click ✅ to mark OK, right-click 🚩 to flag high-risk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className={`p-3 border rounded cursor-pointer ${p.reviewed ? (p.flagged ? "bg-red-50" : "bg-green-50") : ""}`}
                onClick={() => handlePostClick(p.id, "ok")}
                onContextMenu={(e) => { e.preventDefault(); handlePostClick(p.id, "flag"); }}
              >
                <p>{p.text}</p>
                {p.reviewed && (
                  <p className="text-xs mt-1">{p.flagged ? "🚩 Flagged for review" : "✅ Marked OK"}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {flaggedPosts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle>Flagged Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {flaggedPosts.map((f, i) => (
                <p key={i} className="text-sm">🚩 {f.text}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-3 border rounded">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.date} - {e.location}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Rewards & Engagement</CardTitle>
            <CardDescription>Your contribution record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p>Total Hours</p>
              <Badge>{hours} hrs</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>Engagement Points</p>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Star className="h-4 w-4 inline mr-1" /> {points}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VolunteerPortal;
