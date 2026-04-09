import { useState } from "react";
import { Search, MapPin, DollarSign, Tag } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const SearchSection = ({onCitySelect, setUserPrefs}) => {

  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [cities, setCities] = useState([]);
  const [days, setDays] = useState("");

  // 🔥 API CALL
  const handleSearch = async () => {
    const userInput = {
      type: type,
      budget: budget,
      season: "summer",   // अभी fix रख
      activities: type,
      region: region || "North"
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
      setCities(data);

      setUserPrefs({
        days:Number(days),
        interest : type,
        budget : budget,
        region : region
      })

    } catch (err) {
      console.error(err);
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

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  placeholder="Region (North, South...)"
                  className="input-glow !pl-10"
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  placeholder="Budget (low, medium, high)"
                  className="input-glow !pl-10"
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div>
                <input
                placeholder="Days (e.g. 3, 4)"
                className="input-glow !pl-10"
                onChange={(e) => setDays(e.target.value)}
              />
              </div>

              <div>
                <input
                 placeholder="Interest (adventure, religious, wildlife...)"
                className="input-glow !pl-10"
                onChange={(e) => setType(e.target.value)}
              />
              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              className="btn-gradient w-full flex items-center justify-center gap-2 text-base"
            >
              <Search className="w-5 h-5" />
              Search with AI
            </button>

            <div>
              {cities.map((city,i) => (
                <div
                key={i}
                  onClick={() => {
                      console.log("clicked city:", city);
                      onCitySelect(city);
                  }}
                  className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-muted z-50 relative"
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