import { Mountain, Palette, Music, Camera, Waves, TreePine, Bike, Coffee } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const activities = [
  { icon: Mountain, title: "Hiking & Trekking", desc: "Conquer mountain trails and scenic routes worldwide", color: "from-orange-500/20 to-red-500/20" },
  { icon: Palette, title: "Art & Museums", desc: "Immerse in world-class galleries and exhibitions", color: "from-pink-500/20 to-purple-500/20" },
  { icon: Music, title: "Live Music & Nightlife", desc: "Dance the night away at top clubs and concerts", color: "from-purple-500/20 to-blue-500/20" },
  { icon: Camera, title: "Photography Tours", desc: "Capture breathtaking moments at iconic locations", color: "from-teal-500/20 to-cyan-500/20" },
  { icon: Waves, title: "Water Adventures", desc: "Surf, dive, and sail across crystal-clear waters", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: TreePine, title: "Wildlife Safaris", desc: "Encounter exotic animals in their natural habitat", color: "from-green-500/20 to-emerald-500/20" },
  { icon: Bike, title: "Cycling Tours", desc: "Explore cities and countryside on two wheels", color: "from-yellow-500/20 to-orange-500/20" },
  { icon: Coffee, title: "Food & Wine Tours", desc: "Taste local delicacies and premium wines", color: "from-amber-500/20 to-red-500/20" },
];

const ThingsToDoPage = () => (
  <div className="pt-24 pb-16">
    <div className="container mx-auto px-4">
      <ScrollReveal className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
          Things to <span className="gradient-text">Do</span>
        </h1>
        <p className="text-muted-foreground mt-3">Curated experiences for every type of traveler.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {activities.map((a, i) => (
          <ScrollReveal key={a.title} delay={i * 60}>
            <div className="glass-card-hover p-6 group cursor-pointer h-full">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4`}>
                <a.icon className="w-7 h-7 text-foreground/80" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </div>
);

export default ThingsToDoPage;
