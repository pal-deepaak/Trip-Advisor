import { Plane, MapPin, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-travel.jpg";
import { useState } from "react";




const Hero = () => {

  const navigate = useNavigate();
  const [showInputForm, setShowInputForm] = useState(false);
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");

  const handleItineraryClick = () => {
    console.log("button clicked")
    navigate('/search', {
      state: { showInputForm: true }
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city && days) {
      navigate('/itinerary', {
        state: {
          city: city,
          days: days
        }
      });
    }
  };

  return(
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>

    {showInputForm && (
          <div className="glass-card p-6 sm:p-8 mb-8">
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">Plan Your Itinerary</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter number of days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-gradient w-full"
              >
                Generate Itinerary
              </button>
            </form>
          </div>
        )}

    {/* Animated globe */}
    <div className="absolute right-[10%] top-1/2 -translate-y-1/2 hidden lg:block">
      <div className="w-72 h-72 rounded-full border border-primary/20 relative" style={{ animation: "globe-rotate 30s linear infinite" }}>
        <div className="absolute inset-4 rounded-full border border-secondary/15" />
        <div className="absolute inset-8 rounded-full border border-primary/10" />
      </div>
      {/* Orbiting elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ animation: "orbit 8s linear infinite" }}>
          <Plane className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ animation: "orbit 12s linear infinite reverse" }}>
          <MapPin className="w-4 h-4 text-secondary" />
        </div>
      </div>
    </div>

    {/* Floating elements */}
    <div className="absolute top-32 left-[15%] floating-element opacity-20">
      <Plane className="w-8 h-8 text-primary" />
    </div>
    <div className="absolute bottom-32 left-[25%] floating-element-delayed opacity-15">
      <MapPin className="w-6 h-6 text-secondary" />
    </div>

    {/* Content */}
    <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm text-primary font-medium">Powered by Advanced AI</span>
      </div>

      <h1
        className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] text-balance mb-6"
        style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 100ms forwards", opacity: 0 }}
      >
        Plan Your Smart Trip{" "}
        <span className="gradient-text">with AI</span>
      </h1>

      <p
        className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 200ms forwards", opacity: 0 }}
      >
        Let our AI analyze thousands of destinations, build personalized itineraries, and find the best deals — all in seconds.
      </p>

      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 350ms forwards", opacity: 0 }}
      >
  
        <button className="btn-gradient text-base"
        onClick={handleItineraryClick}>
          Start Planning
        </button>
        <Link to="/things-to-do" className="btn-outline-glow text-base">
          Explore Destinations
        </Link>
      </div>
    </div>
  </section>
  )

}

export default Hero;
