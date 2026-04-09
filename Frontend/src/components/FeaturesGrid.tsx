import { Brain, Route, Hotel, UtensilsCrossed, Compass, Map, PiggyBank, CloudSun, Bookmark } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  { icon: Brain, title: "AI Destination Analyzer", desc: "Get smart recommendations based on your preferences and travel history." },
  { icon: Route, title: "Smart Itinerary Generator", desc: "Auto-generate day-by-day plans optimized for time and budget." },
  { icon: Hotel, title: "Hotels", desc: "Browse curated hotels with AI-matched ratings and pricing." },
  { icon: UtensilsCrossed, title: "Restaurants", desc: "Discover local cuisines and top-rated dining experiences." },
  { icon: Compass, title: "Things to Do", desc: "Adventure, culture, nightlife — find activities that match your vibe." },
  { icon: Map, title: "Travel Routes", desc: "Visualize connected routes between destinations and stops." },
  { icon: PiggyBank, title: "Budget Planner", desc: "Track expenses with smart breakdowns and savings suggestions." },
  { icon: CloudSun, title: "Weather Forecast", desc: "Check real-time weather conditions for any destination." },
  { icon: Bookmark, title: "Saved Trips", desc: "Save and revisit your favorite itineraries anytime." },
];

const FeaturesGrid = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Everything You Need to <span className="gradient-text">Travel Smart</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">AI-powered tools designed to make every trip effortless.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 70}>
            <div className="glass-card-hover p-6 h-full group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-primary/20">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
