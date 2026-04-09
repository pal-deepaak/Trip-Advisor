import { Star, MapPin, Search, SlidersHorizontal } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const allHotels = [
  { name: "The Azure Marina", location: "Santorini, Greece", price: "$287", rating: 4.9, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop" },
  { name: "Sakura Grand", location: "Kyoto, Japan", price: "$195", rating: 4.8, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop" },
  { name: "Riad Lumière", location: "Marrakech, Morocco", price: "$142", rating: 4.7, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
  { name: "Nordic Fjord Lodge", location: "Bergen, Norway", price: "$312", rating: 4.9, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop" },
  { name: "Palazzo Riviera", location: "Amalfi, Italy", price: "$256", rating: 4.8, img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop" },
  { name: "The Banyan Retreat", location: "Bali, Indonesia", price: "$178", rating: 4.7, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop" },
  { name: "Highland Castle Inn", location: "Edinburgh, Scotland", price: "$203", rating: 4.6, img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=300&fit=crop" },
  { name: "Desert Mirage Resort", location: "Dubai, UAE", price: "$345", rating: 4.9, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop" },
];

const HotelsPage = () => (
  <div className="pt-24 pb-16">
    <div className="container mx-auto px-4">
      <ScrollReveal className="text-center mb-8">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
          Explore <span className="gradient-text">Hotels</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">AI-curated stays for every budget and style.</p>
      </ScrollReveal>

      <ScrollReveal delay={100} className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
            <input placeholder="Search hotels..." className="input-glow !pl-10" />
          </div>
          <button className="btn-outline-glow flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Filters</button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {allHotels.map((h, i) => (
          <ScrollReveal key={h.name} delay={i * 60}>
            <div className="glass-card-hover overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={h.img} alt={h.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-white">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {h.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground">{h.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {h.location}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-display font-bold text-primary">{h.price}<span className="text-xs text-muted-foreground font-normal">/night</span></span>
                  <button className="btn-gradient !text-xs !px-4 !py-1.5">Book Now</button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </div>
);

export default HotelsPage;
