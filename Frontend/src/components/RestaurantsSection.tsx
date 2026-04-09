import { Star, MapPin } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const restaurants = [
  { name: "Ember & Oak", cuisine: "Mediterranean", location: "Barcelona", rating: 4.8, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", tags: ["Fine Dining", "Seafood"] },
  { name: "Nori House", cuisine: "Japanese", location: "Tokyo", rating: 4.9, img: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop", tags: ["Sushi", "Omakase"] },
  { name: "La Terrazza", cuisine: "Italian", location: "Rome", rating: 4.7, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop", tags: ["Pasta", "Rooftop"] },
  { name: "Spice Route", cuisine: "Indian", location: "Mumbai", rating: 4.6, img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop", tags: ["Street Food", "Curry"] },
];

const RestaurantsSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Discover Amazing <span className="gradient-text">Restaurants</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {restaurants.map((r, i) => (
          <ScrollReveal key={r.name} delay={i * 80}>
            <div className="glass-card-hover overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">{r.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" />{r.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{r.location} · {r.cuisine}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-primary/20 text-primary/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default RestaurantsSection;
