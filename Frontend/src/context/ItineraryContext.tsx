import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, tripAPI, checkAuth, getAuthToken } from "@/services/api";
import ItineraryPlan from "@/pages/ItineraryPlan";
import { useNavigate } from "react-router-dom";

const ItineraryContext = createContext(null);

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState({});
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        // Verify token validity if needed
        setAuthLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setItinerary(null);
    navigate('/');
  };

  const generateItinerary = async (city, prefs = {}) => {
    if (!city) return;

    setLoading(true);
    setUserPrefs(prefs);

    try {
      const token = getAuthToken();
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:5000/api/itinerary", {
        method: "POST",
        headers: headers,
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
    user,
    authLoading,
    generateItinerary,
    login,
    signup,
    logout,
    checkAuthentication
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