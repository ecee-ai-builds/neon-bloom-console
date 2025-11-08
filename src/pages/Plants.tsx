import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Bot, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Plants = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Selamat datang! I'm your Plant AI assistant specialized in Malaysian agriculture. Ask me about local plants, growing conditions, or let me help you choose the perfect plant for your climate control system. 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlant, setCurrentPlant] = useState<string>("None");
  const scrollRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plant-ai-chat`;

  useEffect(() => {
    // Get current plant from localStorage if available
    const savedPlant = localStorage.getItem("selectedPlantName");
    if (savedPlant) setCurrentPlant(savedPlant);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseUpdateCommand = (content: string) => {
    const updateMatch = content.match(/UPDATE_PLANT:([^:]+):(\d+):(\d+):(\d+):(\d+):(\d+)/);
    if (updateMatch) {
      const [, name, tempMin, tempMax, humidityMin, humidityMax, waterLevel] = updateMatch;
      return {
        name,
        tempMin: parseInt(tempMin),
        tempMax: parseInt(tempMax),
        humidityMin: parseInt(humidityMin),
        humidityMax: parseInt(humidityMax),
        waterLevel: parseInt(waterLevel),
      };
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentPlant,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded", {
            description: "Please try again in a moment.",
          });
          return;
        }
        if (response.status === 402) {
          toast.error("Payment required", {
            description: "Please add credits to your Lovable AI workspace.",
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (!reader) throw new Error("No reader available");

      // Add empty assistant message that will be updated
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Check if response contains plant update command
      const plantUpdate = parseUpdateCommand(assistantContent);
      if (plantUpdate) {
        localStorage.setItem("selectedPlantName", plantUpdate.name);
        localStorage.setItem("selectedPlantData", JSON.stringify(plantUpdate));
        setCurrentPlant(plantUpdate.name);
        
        toast.success("Plant updated!", {
          description: `Command Center now monitoring ${plantUpdate.name}`,
        });

        // Dispatch event to update Command Center
        window.dispatchEvent(new CustomEvent("plantUpdated", { detail: plantUpdate }));
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message", {
        description: "Please check your connection and try again.",
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove empty assistant message
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground uppercase tracking-wider mb-2">
          PLANT AI INTEGRATION
        </h1>
        <p className="text-sm text-muted-foreground uppercase">
          Malaysia Climate Specialist • Current Plant: <span className="text-primary">{currentPlant}</span>
        </p>
      </div>

      {/* Info Banner */}
      <div className="card-tactical rounded p-4 mb-6 flex items-start gap-3 flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-bold text-foreground mb-1">AI-Powered Plant Assistant</p>
          <p>
            Ask about Malaysian plants, growing conditions, or request to change your monitored plant. 
            The AI will update your Command Center automatically.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card-tactical rounded overflow-hidden flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-6 min-h-0" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="rounded-lg p-4 bg-muted">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Malaysian plants, growing tips, or request to change plants..."
              className="flex-1 bg-input border-border font-mono"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plants;
