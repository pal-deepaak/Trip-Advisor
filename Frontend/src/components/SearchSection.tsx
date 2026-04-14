import { useState } from "react";
import { Search, MapPin, DollarSign, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const SearchSection = ({ onCitySelect, setUserPrefs }) => {
  const navigate = useNavigate();

  const [budget, setBudget] = useState("");
  const [region, setRegion] = useState("");
  const [cities, setCities] = useState([]);
  const [days, setDays] = useState("");
  const [activities, setActivities] = useState("");
  const [msg, setMsg] = useState("");

  const handleSearch = async () => {
    const userInput = {
      budget: budget,
      season: "summer",
      activities: activities,
      region: region || "north"
    };

    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
      });

      const data = await res.json();

      // Message handling
      if (data.message) {
        setMsg(data.message);
      } else {
        setMsg("");
      }

      // Cities handling - show only top 5 unique cities
      let cityList = [];
      if (Array.isArray(data)) {
        cityList = data;
      } else if (data.recommendations && Array.isArray(data.recommendations)) {
        cityList = data.recommendations.map(rec => rec.city);
      } else if (data.cities && Array.isArray(data.cities)) {
        cityList = data.cities;
      }

      // Get unique cities and limit to top 5
      const uniqueCities = [...new Set(cityList)];
      setCities(uniqueCities.slice(0, 5));

      // Save user preferences
      setUserPrefs({
        days: Number(days),
        activities: activities,
        budget: budget,
        region: region
      });

    } catch (err) {
      console.error(err);
      setMsg("Error fetching recommendations. Please try again.");
    }
  };


  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Find Your Perfect <span className="gradient-text">Destination</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card p-6 sm:p-8">
            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700"
              >
                <option value="">Select Region</option>
                <option value="North">North</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="South">South</option>
              </select>

              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700"
              >
                <option value="">Select Budget</option>
                <option value="low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <input
                placeholder="Days (e.g. 3, 4)"
                className="input-glow"
                onChange={(e) => setDays(e.target.value)}
              />

              {/* DROPDOWN FIX */}
              <select
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700"
              >
                <option value="">Select Activity</option>
                <option value="adventure">Adventure</option>
                <option value="trekking">Trekking</option>
                <option value="beach">Beach</option>
                <option value="wildlife">Wildlife</option>
                <option value="photography">Photography</option>
                <option value="religious">Religious</option>
                <option value="heritage">Heritage</option>
                <option value="shopping">Shopping</option>
                <option value="exploration">Exploration</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              className="btn-gradient w-full flex items-center justify-center gap-2 text-base"
            >
              <Search className="w-5 h-5" />
              Search with AI
            </button>

            {/* MESSAGE UI */}
            {msg && (
              <div className="mt-3 text-sm text-yellow-700 bg-yellow-100 p-2 rounded-lg">
                {msg}
              </div>
            )}

            {/* RESULTS */}
            <div className="mt-3">
              {cities.map((city, i) => (
                <div
                  key={i}
                  onClick={() => onCitySelect(city)}
                  className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-muted"
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SearchSection;