import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const demoMessages: Msg[] = [
  { from: "bot", text: "Hi! I'm your AI travel assistant. Where would you like to go?" },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user" as const, text: input }]);
    const q = input;
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot" as const, text: `Great choice! I can help you plan a trip around "${q}". Let me find the best options for you.` },
      ]);
    }, 800);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full btn-gradient flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group"
        style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card flex flex-col" style={{ height: "28rem", animation: "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground text-sm">VoyageAI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "user" ? "justify-end" : ""}`}>
                {m.from === "bot" && <Bot className="w-5 h-5 text-primary shrink-0 mt-1" />}
                <div className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${m.from === "user" ? "bg-primary/10 text-foreground" : "bg-muted text-foreground/80"}`}>
                  {m.text}
                </div>
                {m.from === "user" && <User className="w-5 h-5 text-secondary shrink-0 mt-1" />}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything about travel..."
              className="input-glow text-sm flex-1 !py-2"
            />
            <button onClick={send} className="btn-gradient !px-3 !py-2 !rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
