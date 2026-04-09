import { MapPin, Calendar, Bookmark } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const trips = [
  { title: "Santorini Escape", dest: "Greece", days: 5, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop" },
  { title: "Tokyo Explorer", dest: "Japan", days: 7, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop" },
  { title: "Moroccan Adventure", dest: "Morocco", days: 4, img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&h=250&fit=crop" },
  { title: "Norwegian Fjords", dest: "Norway", days: 6, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" },
];

const SavedTrips = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Saved <span className="gradient-text">Trips</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {trips.map((t, i) => (
          <ScrollReveal key={t.title} delay={i * 80}>
            <div className="glass-card-hover overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-primary/20">
                  <Bookmark className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.dest}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.days} days</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default SavedTrips;
