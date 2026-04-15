import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { Brain, Route, Hotel, UtensilsCrossed, Compass, PiggyBank, CloudSun, Bookmark, MapIcon } from "lucide-react";

const features = [
  { icon: Route, title: "Smart Itinerary Generator", desc: "Auto-generate day-by-day plans optimized for time and budget.", path: (city) => `/itinerary?city=${encodeURIComponent(city)}` },
  { icon: Hotel, title: "Hotels", desc: "Browse curated hotels with AI-matched ratings and pricing.", type: 'city' },
  { icon: UtensilsCrossed, title: "Restaurants", desc: "Discover local cuisines and top-rated dining experiences.", type: 'city' },
  { icon: Compass, title: "Things to Do", desc: "Adventure, culture, nightlife — find activities that match your vibe.", path: '/activities' },
  { icon: CloudSun, title: "Weather Forecast", desc: "Check real-time weather conditions for any destination.", type: 'city' },
  { icon: Bookmark, title: "Saved Trips", desc: "Save and revisit your favorite itineraries anytime.", path: '/saved-trips' },
];

const FeaturesGrid = () => {
  const navigate = useNavigate();
  const [showInputForm, setShowInputForm] = useState(false);
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");

  // City mapping for routes
  const cityRoutes = {
    'chandigarh': '/travel/recommendations/chandigarh',
    'manali': '/travel/recommendations/manali',
    'panchkula': '/travel/recommendations/panchkula',
    'shimla': '/travel/recommendations/shimla'
  };

  const handleItineraryClick = () => {
    setShowInputForm(true);
  };

  const handleCityClick = (cityName, featureType) => {
    const cityLower = cityName.toLowerCase();
    if (featureType === 'city') {
      // Navigate to recommendations for the city
      const route = cityRoutes[cityLower];
      if (route) {
        navigate(route);
      }
    }
  };

  const handleFeatureClick = (feature) => {
    if (feature.type === 'city') {
      handleCityClick(city, feature.type);
    } else if (feature.path) {
      const path = typeof feature.path === 'function'
        ? feature.path(city)
        : feature.path;
      navigate(path);
    }
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

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
            Everything You Need to <span className="gradient-text">Travel Smart</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">AI-powered tools designed to make every trip effortless.</p>
        </ScrollReveal>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 70}>
              <div
                className="glass-card-hover p-6 h-full group cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handleFeatureClick(f)}
              >
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
};

export default FeaturesGrid;