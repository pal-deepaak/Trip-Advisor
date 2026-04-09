
import { Star, MapPin } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const hotels = [
  { name: "The Azure Marina", location: "Santorini, Greece", price: "$287", rating: 4.9, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop" },
  { name: "Sakura Grand", location: "Kyoto, Japan", price: "$195", rating: 4.8, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop" },
  { name: "Riad Lumière", location: "Marrakech, Morocco", price: "$142", rating: 4.7, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
  { name: "Nordic Fjord Lodge", location: "Bergen, Norway", price: "$312", rating: 4.9, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop" },
];

const HotelsSection = () => (
  <section className="section-padding" id="hotels">
    <div className="container mx-auto">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Top-Rated <span className="gradient-text">Hotels</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {hotels.map((h, i) => (
          <ScrollReveal key={h.name} delay={i * 80}>
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
  </section>
);

export default HotelsSection;
