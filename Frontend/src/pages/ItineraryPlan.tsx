import { useState, useEffect } from "react";
import ItineraryViewer from "@/components/ItineraryViewer";
import { useNavigate, useSearchParams } from "react-router-dom";

const ItineraryPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city");
  const daysFromUrl = searchParams.get("days");

  const [city, setCity] = useState(cityFromUrl || "");
  const [days, setDays] = useState(daysFromUrl || "3");
  const [itineraryData, setItineraryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInputCity, setUserInputCity] = useState(cityFromUrl || "");
  const [userInputDays, setUserInputDays] = useState(daysFromUrl || "3");

  useEffect(() => {
    const fetchItinerary = async (c: string, d: string) => {
      try {
        // Get user preferences from localStorage or context
        const userPrefsStr = localStorage.getItem("userPrefs");
        const userPrefs = userPrefsStr ? JSON.parse(userPrefsStr) : {};

        const res = await fetch("http://localhost:8000/itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: c,
            days: d,
            interest: userPrefs.interest || "general",
            budget: userPrefs.budget || "mid_range",
            traveler_type: userPrefs.traveler_type || "family"
          }),
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setItineraryData(data);
        }
      } catch (err) {
        setError("Failed to generate itinerary. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (city && days) {
      fetchItinerary(city, days);
    }
  }, [city, days]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-pulse inline-flex h-12 w-12 items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Generating your itinerary...
          </h2>
          <p className="text-gray-600">
            Please wait while we create your personalized day-wise travel plan
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="btn-gradient px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Search
            </button>
          </div>

          {/* Input form for city and days */}
          <div className="glass-card p-8 mb-8">
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">Generate Your Itinerary</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={userInputCity}
                  onChange={(e) => setUserInputCity(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter number of days"
                  value={userInputDays}
                  onChange={(e) => setUserInputDays(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {userInputCity && userInputDays && (
                <button
                  onClick={generateItinerary}
                  className="btn-gradient w-full"
                >
                  Generate Itinerary
                </button>
              )}
            </div>
          </div>

          {itineraryData && (
            <ItineraryViewer data={itineraryData} onClose={() => navigate("/")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlan;