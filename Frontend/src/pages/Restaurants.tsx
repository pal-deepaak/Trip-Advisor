import { Star, MapPin, Search, SlidersHorizontal } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const allRestaurants = [
  { name: "Ember & Oak", cuisine: "Mediterranean", location: "Barcelona", rating: 4.8, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", tags: ["Fine Dining", "Seafood"] },
  { name: "Nori House", cuisine: "Japanese", location: "Tokyo", rating: 4.9, img: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop", tags: ["Sushi", "Omakase"] },
  { name: "La Terrazza", cuisine: "Italian", location: "Rome", rating: 4.7, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop", tags: ["Pasta", "Rooftop"] },
  { name: "Spice Route", cuisine: "Indian", location: "Mumbai", rating: 4.6, img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop", tags: ["Street Food", "Curry"] },
  { name: "Le Petit Château", cuisine: "French", location: "Paris", rating: 4.9, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", tags: ["Michelin Star", "Wine"] },
  { name: "Smoke & Barrel", cuisine: "American BBQ", location: "Austin", rating: 4.5, img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop", tags: ["BBQ", "Craft Beer"] },
];

const RestaurantsPage = () => (
  <div className="pt-24 pb-16">
    <div className="container mx-auto px-4">
      <ScrollReveal className="text-center mb-8">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
          Discover <span className="gradient-text">Restaurants</span>
        </h1>
        <p className="text-muted-foreground mt-3">Taste the world, one dish at a time.</p>
      </ScrollReveal>

      <ScrollReveal delay={100} className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
            <input placeholder="Search restaurants..." className="input-glow !pl-10" />
          </div>
          <button className="btn-outline-glow flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Filters</button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allRestaurants.map((r, i) => (
          <ScrollReveal key={r.name} delay={i * 70}>
            <div className="glass-card-hover overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
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
  </div>
);

export default RestaurantsPage;
