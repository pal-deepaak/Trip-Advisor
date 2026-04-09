import { Mountain, Palette, Music, Camera, Waves, TreePine } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const activities = [
  { icon: Mountain, title: "Adventure", desc: "Hiking, zip-lining, and extreme sports", color: "from-orange-500/20 to-red-500/20" },
  { icon: Palette, title: "Culture & Art", desc: "Museums, galleries, and local traditions", color: "from-pink-500/20 to-purple-500/20" },
  { icon: Music, title: "Nightlife", desc: "Clubs, rooftop bars, and live music", color: "from-purple-500/20 to-blue-500/20" },
  { icon: Camera, title: "Photography", desc: "Scenic viewpoints and hidden gems", color: "from-teal-500/20 to-cyan-500/20" },
  { icon: Waves, title: "Water Sports", desc: "Surfing, diving, and beach activities", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: TreePine, title: "Nature & Wildlife", desc: "Safaris, national parks, and eco-tours", color: "from-green-500/20 to-emerald-500/20" },
];

const ActivitiesSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Things to <span className="gradient-text">Do</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map((a, i) => (
          <ScrollReveal key={a.title} delay={i * 70}>
            <div className="glass-card-hover p-6 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4`}>
                <a.icon className="w-6 h-6 text-foreground/80" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ActivitiesSection;
