import { useState, useEffect } from "react";
import ItineraryViewer from "@/components/ItineraryViewer";
import { useNavigate, useLocation } from "react-router-dom";
import { tripAPI, checkAuth, getAuthToken } from "@/services/api";

const ItineraryPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [itineraryData, setItineraryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInputForm, setShowInputForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(e.target);
    const city = formData.get('city');
    const days = formData.get('days');
    // Navigate with state to show the form on the itinerary page
    navigate('/itinerary', {
      state: { showInputForm: true, city, days }
    });
  };

  useEffect(() => {
    // Get data from route state or search params
    const state = location.state;
    const city = state?.city || "";
    const days = state?.days || "";
    // Show input form if specified in route state
    if (state?.showInputForm) {
      setShowInputForm(true);
    }

    const fetchItinerary = async (c: string, d: string) => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        const headers: any = { "Content-Type": "application/json" };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch("http://localhost:8000/itinerary", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            city: c,
            days: d,
            interest: "general",
            budget: "mid_range",
            traveler_type: "family"
          }),
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setItineraryData(null);
        } else if (!data.recommendations || data.recommendations.length === 0) {
          setError("No recommendations found for the given criteria.");
          setItineraryData(null);
        } else {
          setItineraryData(data);
        }
      } catch (err: any) {
        console.error("Itinerary fetch error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError("Failed to generate itinerary. Please try again.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (city && days) {
      fetchItinerary(city, days);
    } else {
      setLoading(false);
      setError("No city or days provided");
    }
  }, [location.state]);

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
            className="btn-gradient px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">No itinerary data available</h2>
          <button
            onClick={() => navigate("/")}
            className="btn-gradient px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {showInputForm && (
            <div className="glass-card p-6 sm:p-8 mb-8">
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">Plan Your Itinerary</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
                  <input
                    type="text"
                    placeholder="Enter city name"
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
          <ItineraryViewer data={itineraryData} onClose={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlan;