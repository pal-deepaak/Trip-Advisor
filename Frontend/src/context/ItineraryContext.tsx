import { createContext, useContext, useState, useEffect } from "react";
import ItineraryPlan from "@/pages/ItineraryPlan";
import { useNavigate } from "react-router-dom";

const ItineraryContext = createContext(null);

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState({});
  const navigate = useNavigate();

  const generateItinerary = async (city, prefs = {}) => {
    if (!city) return;

    setLoading(true);
    setUserPrefs(prefs);

    try {
      const res = await fetch("http://localhost:8000/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          days: prefs.days || 3,
          interest: prefs.interest || "general",
          budget: prefs.budget || "mid_range",
          traveler_type: prefs.traveler_type || "family"
        })
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setItinerary(null);
      } else {
        setItinerary(data);
        navigate(`/itinerary`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    itinerary,
    loading,
    userPrefs,
    generateItinerary
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within ItineraryProvider");
  }
  return context;
};