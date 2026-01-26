import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Send, ShoppingBag } from "lucide-react";
import { Streamdown } from "streamdown";
import { nanoid } from "nanoid";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Season = "spring" | "summer" | "fall" | "winter";
type BudgetTier = "100" | "500" | "5000" | "10000";

const BUDGET_LABELS = {
  "100": "$100 - Affordable Chic",
  "500": "$500 - Mid-Tier Designer",
  "5000": "$5,000 - Investment",
  "10000": "$10,000+ - Ultra-Luxury",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [season, setSeason] = useState<Season>("fall");
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("500");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Initialize session and load from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } else {
      const newSessionId = nanoid();
      setSessionId(newSessionId);
      localStorage.setItem("sessionId", newSessionId);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await sendMessageMutation.mutateAsync({
        message: input,
        sessionId,
        season,
        budgetTier,
        conversationHistory: messages.slice(-6),
      });

      const assistantMessage: Message = { role: "assistant", content: String(result.message) };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    localStorage.setItem("sessionId", newSessionId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Y2K Header */}
      <header className="y2k-glass border-b border-primary/30 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="butterfly-float">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold chrome-text">The Aesthetic Edit</h1>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-secondary" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Your AI Bag Stylist</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container py-6 max-w-4xl">
        {/* Filters */}
        <Card className="y2k-glass p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block y2k-metallic">Season</label>
              <Select value={season} onValueChange={(value) => setSeason(value as Season)}>
                <SelectTrigger className="y2k-glass border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">🌸 Spring</SelectItem>
                  <SelectItem value="summer">☀️ Summer</SelectItem>
                  <SelectItem value="fall">🍂 Fall</SelectItem>
                  <SelectItem value="winter">❄️ Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block y2k-metallic">Budget</label>
              <Select value={budgetTier} onValueChange={(value) => setBudgetTier(value as BudgetTier)}>
                <SelectTrigger className="y2k-glass border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">{BUDGET_LABELS["100"]}</SelectItem>
                  <SelectItem value="500">{BUDGET_LABELS["500"]}</SelectItem>
                  <SelectItem value="5000">{BUDGET_LABELS["5000"]}</SelectItem>
                  <SelectItem value="10000">{BUDGET_LABELS["10000"]}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearChat} className="y2k-glass border-destructive/50 text-destructive hover:bg-destructive/10">
              Clear Chat
            </Button>
          </div>
        </Card>

        {/* Messages */}
        <div className="space-y-4 mb-6 min-h-[400px]">
          {messages.length === 0 && (
            <Card className="y2k-glass p-8 text-center">
              <div className="butterfly-float inline-block mb-4">
                <Sparkles className="w-16 h-16 text-primary mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-2 chrome-text">Welcome to The Aesthetic Edit!</h2>
              <p className="text-muted-foreground mb-4">
                Your AI-powered fashion expert for discovering the coolest, most aesthetic bags of 2026.
              </p>
              <div className="text-sm space-y-2">
                <p className="text-primary font-medium">✨ Ask me about trendy bags for any season</p>
                <p className="text-secondary font-medium">💎 Get personalized recommendations based on your budget</p>
                <p className="text-accent font-medium">🚫 No basic bags - only It-Bags and runway favorites</p>
                <p className="text-primary font-medium">🌟 Celebrity styling inspiration included</p>
                <p className="text-secondary font-medium">🔗 Direct shopping links to official sites & resellers</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="y2k-glass p-4 rounded-2xl border-2 border-primary/30">
                  <p className="font-bold y2k-metallic mb-2 text-lg">✨ Trending Now</p>
                  <p className="text-foreground font-medium">Burgundy suede, chain handles, ladylike shapes</p>
                </div>
                <div className="y2k-glass p-4 rounded-2xl border-2 border-secondary/30">
                  <p className="font-bold y2k-metallic mb-2 text-lg">💖 Celebrity Faves</p>
                  <p className="text-foreground font-medium">Bella Hadid, Hailey Bieber, Dakota Fanning</p>
                </div>
              </div>
            </Card>
          )}

          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 ${
                message.role === "user"
                  ? "y2k-glass ml-auto max-w-[80%] border-secondary/50"
                  : "y2k-glass mr-auto max-w-[90%] border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-secondary/20" : "bg-primary/20"
                  }`}
                >
                  {message.role === "user" ? "👤" : "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  {message.role === "assistant" ? (
                    <Streamdown>{message.content}</Streamdown>
                  ) : (
                    <p className="text-foreground">{message.content}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {sendMessageMutation.isPending && (
            <Card className="y2k-glass p-4 mr-auto max-w-[90%] border-primary/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20">
                  ✨
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="y2k-glass p-4 sticky bottom-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about trendy bags... (e.g., 'Show me burgundy bags for fall')"
              className="y2k-glass border-primary/50 flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending}
              className="y2k-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="y2k-glass border-t border-primary/30 py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="y2k-glow">Powered by 2026 Fashion Trends • No Basic Bags Allowed 💅</p>
        </div>
      </footer>
    </div>
  );
}
