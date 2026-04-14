import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Info, AlertCircle } from "lucide-react";
import ItineraryViewer from "./ItineraryViewer";

type Msg = { from: "bot" | "user"; text: string; type?: "text" | "recommend" | "itinerary" | "error" };

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "👋 Hi! I'm VoyageAI, your personal travel assistant. Ask me about destinations, trip planning, itineraries, or any travel questions!", type: "text" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    const stored = localStorage.getItem("voyage_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const newId = generateSessionId();
      localStorage.setItem("voyage_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages((m) => [...m, { from: "user", text: userMessage, type: "text" }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, session_id: sessionId || "default" }),
      });

      const data = await res.json();

      if (data.type === "chat") {
        setMessages((m) => [...m, { from: "bot", text: data.data, type: "text" }]);
      } else if (data.type == "recommend") {
        const aiMsg = data.data.ai_message || data.data.message || "";
        let recommendationsHtml = "";

        if (data.data.recommendations && Array.isArray(data.data.recommendations)) {
          const topRecommendations = data.data.recommendations.slice(0, 5);
          recommendationsHtml = topRecommendations.map((rec: any, index: number) => {
            const matchScore = rec.relevance_score ? Math.round(rec.relevance_score) : 0;
            const scoreColor = matchScore >= 80 ? "text-green-500" : matchScore >= 50 ? "text-yellow-500" : "text-orange-500";
            return `
              <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div class="flex-shrink-0 w-2 h-2 rounded-full ${scoreColor} animate-pulse"></div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">${rec.destination}, <span class="text-gray-500 font-normal">${rec.city}</span></p>
                  ${matchScore > 0 ? `<p class="text-sm ${scoreColor}">Match score: ${matchScore}%</p>` : ''}
                </div>
              </div>
            `;
          }).join("");
        } else if (data.data.cities && Array.isArray(data.data.cities)) {
          recommendationsHtml = `<div class="px-3 py-2 text-sm text-gray-500 font-medium">${data.data.cities.map((c: string) => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-2 mb-2">${c}</span>`).join("")}</div>`;
        }

        const botText = aiMsg ? `${aiMsg}<div class="mt-3">${recommendationsHtml}</div>` : recommendationsHtml;
        setMessages((m) => [...m, { from: "bot", text: botText, type: "recommend" }]);
      } else if (data.type === "itinerary") {
        if (data.data.error) {
          setMessages((m) => [...m, { from: "bot", text: data.data.error, type: "error" }]);
        } else {
          setItineraryData(data.data);
          setMessages((m) => [...m, { from: "bot", text: `🗺️ Your ${data.data.duration_days || "custom"}-day itinerary for ${data.data.city || "your destination"} is ready!`, type: "itinerary" }]);
        }
      }

      if (data.followup) {
        setTimeout(() => {
          setMessages((m) => [...m, { from: "bot", text: data.followup, type: "text" }]);
        }, 500);
      }
    } catch (error) {
      setMessages((m) => [...m, { from: "bot", text: "⚠️ Server error. Please check if the backend is running.", type: "error" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatItinerary = (data: any) => {
    let text = "";
    if (data.days) {
      if (data.overview) text += `🗺️ ${data.overview}\n\n`;
      data.days.forEach((day: any) => {
        text += `\n━━━━━━━━━━━━━━━━━━\n`;
        text += `📅 ${day.title || `Day ${day.day}`}\n`;
        text += `━━━━━━━━━━━━━━━━━━\n`;
        day.activities.forEach((act: any, idx: number) => {
          text += `\n${act.time || `Activity ${idx + 1}`}\n`;
          text += `📍 ${act.place}\n`;
          text += `→ ${act.activity}\n`;
          if (act.description) text += `   ${act.description}\n`;
          if (act.tips) text += `   💡 ${act.tips}\n`;
        });
        if (day.day_summary) text += `\n✨ ${day.day_summary}\n`;
      });
      if (data.travel_tips) {
        text += `\n\n━━━━━━━━━━━━━━━━━━\n`;
        text += `💡 TRAVEL TIPS:\n`;
        data.travel_tips.forEach((tip: string, idx: number) => {
          text += `   ${idx + 1}. ${tip}\n`;
        });
      }
      if (data.estimated_budget) {
        text += `\n💰 Budget: ${data.estimated_budget.daily_estimate || data.estimated_budget.budget_category}\n`;
      }
      return text;
    }
    for (const day in data) {
      text += `\n📅 ${day}:\n`;
      data[day].forEach((place: any, idx: number) => {
        text += `   ${idx + 1}. ${place.place}\n`;
        if (place.activity) text += `      → ${place.activity}\n`;
        if (place.description) text += `      ${place.description}\n`;
      });
      text += "\n";
    }
    return text;
  };

  return (
    <>
      {/* FAB - TripAdvisor-style gradient with indicator */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300"
      >
        {open ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <Bot className="w-8 h-8 text-white drop-shadow-lg" />
        )}
      </button>

      {/* Enhanced glassmorphism panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-full sm:w-96 flex flex-col h-[400px] sm:h-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-xl border border-white/20">
          {/* Header with brand styling */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center gap-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-white drop-shadow-lg" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <span className="font-bold text-white text-sm">VoyageAI Assistant</span>
              <p className="text-xs text-blue-100/80">Your travel planning partner</p>
            </div>
          </div>

          {/* Messages area with smooth scrolling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/5 backdrop-blur-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] ${m.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : m.from === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-lg"
                      : "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  {m.type === "recommend" ? (
                    <div className="space-y-2">
                      {m.text}
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>

                {m.from === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area with enhanced styling */}
          <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about destinations, activities, or itineraries..."
                disabled={isLoading}
                className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 bg-white/80"
              />
              <button
                onClick={send}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 rounded-xl disabled:opacity-50 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-indigo-500/40 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            {isLoading && (
              <p className="text-xs text-blue-600/70 mt-2 animate-pulse">Thinking...</p>
            )}
          </div>
        </div>
      )}

      {/* Itinerary modal */}
      {itineraryData && (
        <ItineraryViewer
          data={itineraryData}
          onClose={() => setItineraryData(null)}
        />
      )}
    </>
  );
};

export default ChatBot;