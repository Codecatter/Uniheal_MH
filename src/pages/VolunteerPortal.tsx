/* VolunteerPortal.refactor.tsx
   - Type-safe (Task, Post, Event)
   - localStorage persistence (hours, points, tasks, posts, flaggedPosts)
   - priority-based styling for Mark Done button
   - fixed className/template bug for posts
   - count-up animation for stats
*/

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Volunteermessage from "./VolunteersMessage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Calendar, Clock, CheckCircle, LogOut, Star } from "lucide-react";

// ---------------- Types ----------------
type Priority = "low" | "moderate" | "high";

type Task = {
  id: number;
  task: string;
  date: string; // ISO-ish or user-friendly date
  time: string;
  status: "upcoming" | "completed";
  priority: Priority;
  location: string;
};

type Post = {
  id: number;
  text: string;
  flagged: boolean;
  reviewed: boolean;
};

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
};

type Persisted = {
  hours: number;
  points: number;
  tasks: Task[];
  posts: Post[];
  flaggedPosts: Post[];
};

// ---------------- Helpers ----------------
const STORAGE_KEY = "uniheal.volunteer.v1";

function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState<number>(value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(value);

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startRef.current = null;
    const from = fromRef.current;
    const to = value;
    const diff = to - from;
    if (diff === 0) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad-ish
      const current = Math.round(from + diff * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}

// ---------------- Component ----------------
const VolunteerPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const initial: Persisted = {
    hours: 5,
    points: 120,
    tasks: [
      {
        id: 1,
        task: "Assist in Wellness Workshop",
        date: "2024-10-01",
        time: "11:00 AM",
        status: "upcoming",
        priority: "high",
        location: "Auditorium",
      },
      {
        id: 2,
        task: "Peer Support Session",
        date: "2024-10-02",
        time: "3:00 PM",
        status: "upcoming",
        priority: "moderate",
        location: "Library Hall",
      },
      {
        id: 3,
        task: "Help Desk Duty",
        date: "2024-09-28",
        time: "9:00 AM",
        status: "completed",
        priority: "low",
        location: "Student Union",
      },
    ],
    posts: [
      {
        id: 1,
        text: "I'm really stressed about exams...",
        flagged: false,
        reviewed: false,
      },
      {
        id: 2,
        text: "I feel very alone lately",
        flagged: false,
        reviewed: false,
      },
      {
        id: 3,
        text: "Had a great day with friends!",
        flagged: false,
        reviewed: false,
      },
    ],
    flaggedPosts: [],
  };

  const [hours, setHours] = useState<number>(initial.hours);
  const [points, setPoints] = useState<number>(initial.points);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [posts, setPosts] = useState<Post[]>(initial.posts);
  const [flaggedPosts, setFlaggedPosts] = useState<Post[]>(
    initial.flaggedPosts
  );

  const [events] = useState<EventItem[]>([
    {
      id: 1,
      title: "Mental Health Awareness Camp",
      date: "2024-10-05",
      location: "Main Ground",
    },
    {
      id: 2,
      title: "Meditation Workshop",
      date: "2024-10-10",
      location: "Wellness Center",
    },
  ]);

  // ---------------- Persistence ----------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: Partial<Persisted> = JSON.parse(raw);
      if (parsed.hours != null) setHours(parsed.hours);
      if (parsed.points != null) setPoints(parsed.points);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.posts) setPosts(parsed.posts);
      if (parsed.flaggedPosts) setFlaggedPosts(parsed.flaggedPosts);
    } catch (err) {
      // ignore parse errors
      // console.warn("Failed to load persisted volunteer data", err);
    }
    // only run on mount
  }, []);

  useEffect(() => {
    const payload: Persisted = { hours, points, tasks, posts, flaggedPosts };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hours, points, tasks, posts, flaggedPosts]);

  // ---------------- Derived ----------------
  const upcomingTasks = useMemo(
    () => tasks.filter((t) => t.status === "upcoming"),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "completed"),
    [tasks]
  );

  const upcomingCount = useCountUp(upcomingTasks.length);
  const completedCount = useCountUp(completedTasks.length);
  const hoursCount = useCountUp(hours);

  // ---------------- Handlers ----------------
  const handlePostClick = (id: number, action: "ok" | "flag") => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reviewed: true, flagged: action === "flag" } : p
      )
    );

    if (action === "flag") {
      setPosts((prev) => {
        const post = prev.find((p) => p.id === id);
        if (!post) return prev;
        setFlaggedPosts((fp) => {
          // avoid duplicates
          if (fp.some((x) => x.id === post.id)) return fp;
          return [...fp, { ...post, flagged: true }];
        });
        return prev;
      });
    }
  };

  const markTaskDone = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
    setHours((h) => h + 2);
    setPoints((p) => p + 20);
  };

  // ---------------- Styles ----------------
  const priorityClass: Record<Priority, string> = {
    high: "bg-red-600 text-white hover:bg-red-700",
    moderate: "bg-yellow-500 text-black hover:bg-yellow-600",
    low: "bg-green-600 text-white hover:bg-green-700",
  };

  if (!isLoggedIn)
    return <div className="text-center py-10">Please log in</div>;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">
                UniHeal Volunteer Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Volunteer
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsLoggedIn(false)}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="support">Peer Support</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">{upcomingCount}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-primary" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volunteer Hours
                    </p>
                    <p className="text-2xl font-bold">{hoursCount} hrs</p>
                  </div>
                  <Clock className="h-6 w-6 text-orange-600" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 border rounded flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{t.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.date} @ {t.time} - {t.location}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className={priorityClass[t.priority]}
                      onClick={() => markTaskDone(t.id)}
                    >
                      Mark Done
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peer Support */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Peer Support Feed</CardTitle>
                <CardDescription>
                  Review posts and flag high-risk content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3 border rounded cursor-pointer ${
                      p.reviewed
                        ? p.flagged
                          ? "bg-red-50"
                          : "bg-green-50"
                        : ""
                    }`}
                    onClick={() => handlePostClick(p.id, "ok")}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handlePostClick(p.id, "flag");
                    }}
                  >
                    <p>{p.text}</p>
                    {p.reviewed && (
                      <p className="text-xs mt-1">
                        {p.flagged ? "🚩 Flagged for review" : "✅ Marked OK"}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {flaggedPosts.length > 0 && (
              <Card className="mt-4 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle>Flagged Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {flaggedPosts.map((f) => (
                    <p key={f.id} className="text-sm">
                      🚩 {f.text}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.map((e) => (
                  <div key={e.id} className="p-3 border rounded">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.date} - {e.location}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {/*message */}
          <TabsContent value="messages">
            <Volunteermessage />
          </TabsContent>

          {/* Rewards */}
          <TabsContent value="rewards">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VolunteerPortal;
