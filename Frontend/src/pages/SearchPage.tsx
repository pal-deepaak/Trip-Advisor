import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Tag,  } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/search");
  };

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !days.trim()) return;

    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch("http://localhost:8000/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: searchQuery.trim(),
          days: parseInt(days) || 1,
          interest: "general",
          traveler_type: "family",
          budget: "mid_range"
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError("Failed to generate itinerary. Try again.");
        setLoading(false);
        return;
      }

      if (!data.days || !Array.isArray(data.days) || data.days.length === 0) {
        setError("Failed to generate itinerary. Try again.");
        setLoading(false);
        return;
      }

      setItinerary(data);
    } catch (err) {
      setError("Failed to generate itinerary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
            Plan <span className="gradient-text"> Your Trip</span>
          </h1>
          <p className="text-muted-foreground mt-3">Plan Your Trip With AI</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card p-6 sm:p-8">
            <form onSubmit={handleGenerateItinerary}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to?"
                    className="input-glow !pl-10"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Number of days"
                    className="input-glow !pl-10"
                  />
                </div>
              </div>

              <button className="btn-gradient w-full flex items-center justify-center gap-2 text-base" type="submit">
                <Search className="w-5 h-5" />
                Plan with AI
              </button>
            </form>
          </div>
        </ScrollReveal>

        {loading && (
          <div className="glass-card p-8 sm:p-12 text-center">
            <div className="animate-pulse inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
              🤖
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Your itinerary is being generated...</p>
            <p className="text-muted-foreground">Hang tight while we plan your perfect trip</p>
          </div>
        )}

        {error && (
          <div className="glass-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 text-foreground/80">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">✗</span>
              </div>
              <p>{error}</p>
            </div>
            <button onClick={() => { setError(null); setItinerary(null); }} className="mt-4 text-sm text-blue-600 hover:text-blue-700">
              Try again
            </button>
          </div>
        )}

        {itinerary && !loading && !error && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                    {itinerary.city || 'Your Destination'}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {itinerary.duration_days || 3}-Day {itinerary.theme || 'Experience'}
                  </p>
                </div>
              </div>
              {itinerary.overview && (
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {itinerary.overview}
                </p>
              )}
            </div>

            {/* Day-wise Cards */}
            {itinerary.days && Array.isArray(itinerary.days) && itinerary.days.map((day, dayIndex) => (
              <div key={dayIndex} className="glass-card p-6 sm:p-8">
                <h3 className="font-display font-bold text-xl text-foreground mb-6">
                  Day {dayIndex + 1}: {day.title || `Day ${dayIndex + 1}`}
                </h3>

                {Array.isArray(day.activities) && day.activities.length > 0 ? (
                  <div className="space-y-4">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="p-4 rounded-xl bg-muted/40 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          {activity.time && (
                            <span className="text-xs font-medium text-muted-foreground mt-1 flex-shrink-0">
                              {activity.time}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            {activity.place && (
                              <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary/40 flex-shrink-0" />
                                {activity.place}
                              </h4>
                            )}
                            {activity.activity && (
                              <p className="text-foreground/90 mt-1 leading-relaxed">
                                {activity.activity}
                              </p>
                            )}
                            {activity.description && (
                              <p className="text-muted-foreground text-sm mt-2">
                                {activity.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No activities for this day</p>
                )}
              </div>
            ))}
          </div>
        )}

        <ScrollReveal delay={200} className="mt-12 text-center">
          <div className="glass-card p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary/60" />
            </div>
            <p className="text-muted-foreground font-display">Enter your preferences and let AI find the perfect trip for you.</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default SearchPage;