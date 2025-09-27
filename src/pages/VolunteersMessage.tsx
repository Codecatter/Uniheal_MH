import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
}

interface Message {
  id: number;
  userId: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  self: boolean;
}

export default function Volunteermessage() {
  const users: User[] = [
    {
      id: 1,
      name: "Community Support Group",
      avatar: "CS",
      lastMessage: "Anita: I feel very anxious lately...",
      time: "9:05 PM",
    },
    {
      id: 2,
      name: "Rahul",
      avatar: "R",
      lastMessage: "Thank you for listening 🙏",
      time: "8:45 PM",
    },
    {
      id: 3,
      name: "Anita",
      avatar: "A",
      lastMessage: "I feel very anxious lately...",
      time: "9:05 PM",
    },
    {
      id: 4,
      name: "Me (volunteer)",
      avatar: "M",
      lastMessage: "I'm here if you want to talk privately.",
      time: "7:30 PM",
    },
  ];

  // ✅ Default chat: first group in the list (forum)
  const [selectedUser, setSelectedUser] = useState<User | null>(
    users[0] || null
  );

  const [newMsg, setNewMsg] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    // Group Chat (id:1)
    {
      id: 1,
      userId: 1,
      user: "Anita",
      avatar: "A",
      time: "9:05 PM",
      text: "I feel very anxious lately, don’t know how to deal with it.",
      self: false,
    },
    {
      id: 2,
      userId: 1,
      user: "Rahul",
      avatar: "R",
      time: "9:10 PM",
      text: "I also feel stressed during exams. You’re not alone.",
      self: false,
    },
    {
      id: 3,
      userId: 1,
      user: "Me (volunteer)",
      avatar: "M",
      time: "9:15 PM",
      text: "Thanks for sharing. Remember, it’s okay to feel this way. We’re here to support you.",
      self: true,
    },

    // Personal Chat (id:2 → Rahul)
    {
      id: 4,
      userId: 2,
      user: "Rahul",
      avatar: "R",
      time: "8:40 PM",
      text: "Sometimes I can’t focus on my studies.",
      self: false,
    },
    {
      id: 5,
      userId: 2,
      user: "Me (volunteer)",
      avatar: "M",
      time: "8:45 PM",
      text: "That’s understandable. Do you want me to share some focus techniques?",
      self: true,
    },

    // Personal Chat (id:3 → Anita)
    {
      id: 6,
      userId: 3,
      user: "Anita",
      avatar: "A",
      time: "9:00 PM",
      text: "I have trouble sleeping at night.",
      self: false,
    },
    {
      id: 7,
      userId: 3,
      user: "Me (volunteer)",
      avatar: "M",
      time: "9:02 PM",
      text: "Sleep issues are common with anxiety. Would you like some relaxation exercises?",
      self: true,
    },
  ]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedUser) return;
    const newMessage: Message = {
      id: messages.length + 1,
      userId: selectedUser.id,
      user: "Me",
      avatar: "M",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newMsg,
      self: true,
    };
    setMessages([...messages, newMessage]);
    setNewMsg("");
  };

  return (
    <div className="flex h-screen border rounded-lg overflow-hidden bg-background">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-2 border-b">
          <Input placeholder="Search or start a new chat" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent ${
                selectedUser?.id === user.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="text-[10px] opacity-60">{user.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT PANEL */}
      <div className="flex-1 flex flex-col">
        <Card className="flex flex-col h-full rounded-none">
          {/* Chat Header */}
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="text-base font-semibold">
              {selectedUser?.name}
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages
              .filter((msg) => msg.userId === selectedUser?.id)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 max-w-[75%] ${
                    msg.self ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm shadow-md ${
                      msg.self
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] opacity-70 ml-2">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>

          {/* Input */}
          <div className="flex items-center gap-2 border-t p-3">
            <Input
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
