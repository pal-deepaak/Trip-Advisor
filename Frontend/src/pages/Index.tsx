import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import HotelsSection from "@/components/HotelsSection";
import RestaurantsSection from "@/components/RestaurantsSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import ItinerarySection from "@/components/ItinerarySection";
import BudgetSection from "@/components/BudgetSection";
import WeatherSection from "@/components/WeatherSection";
import SavedTrips from "@/components/SavedTrips";
import FeedbackSection from "@/components/FeedbackSection";
import { useState } from "react";

const Index = () => {

  type userPrefs = {
    days?: number;
    interest?: string;
    budget?: string;
    region?: string;
  };
  
  const [itinerary, setItinerary] = useState(null);
  const [userPrefs, setUserPrefs] = useState<userPrefs>({});


  const fetchItinerary = async (city) => {

    console.log(userPrefs.budget)
    console.log("button clicked : ", city)

    try {
      const res = await fetch("http://localhost:8000/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          days: userPrefs.days || 3,
          interest: userPrefs.interest || "general"
        })
      });

      const data = await res.json();
      setItinerary(data);

    } catch (error) {
      console.error(error);
    }
  };

  return (   // ✅ ye missing tha
    <>
      <Hero />
      <SearchSection 
        onCitySelect={fetchItinerary}
        setUserPrefs={setUserPrefs}
      />
      <FeaturesGrid />
      <HotelsSection />
      <ItinerarySection itinerary={itinerary}/>
      <RestaurantsSection />
      <ActivitiesSection />
      <BudgetSection />
      <WeatherSection />
      <SavedTrips />
      <FeedbackSection />
    </>
  );
};

export default Index;
