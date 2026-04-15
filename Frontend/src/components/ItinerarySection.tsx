import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const ItinerarySection = ({ itinerary }) => {
  const [expanded, setExpanded] = useState(0);

  // Handle null/undefined itinerary gracefully
  if (!itinerary) {
    return null;
  }

  // Handle error response from API
  if (itinerary.error) {
    console.log('Itinerary error:', itinerary.error);
    return null; // Or show an error message
  }

  console.log('Itinerary received:', itinerary);

  // Handle both old format (object with day keys) and new format (structured itinerary)
  let days = [];
  if (itinerary) {
    // Check if it's the new structured format from /itinerary endpoint
    if (itinerary.days && Array.isArray(itinerary.days)) {
      // New format: convert days array to entries format expected by this component
      days = itinerary.days.map((dayPlan, index) => [
        `Day ${dayPlan.day || index + 1}`,
        (dayPlan.activities || []).map(activity => ({
          place: activity.place || "-",
          activity: activity.activity || "-",
          transport: "Local Transport", // Default since not in AI response
          time: activity.time || "-"
        }))
      ]);
    } else {
      // Old format: direct object with day keys - ensure items are arrays
      days = Object.entries(itinerary).map(([day, items]) => [
        day,
        Array.isArray(items) ? items : []
      ]);
    }
  }

  if (!itinerary || days.length === 0) {
    return null; // अगर data नहीं है तो कुछ मत दिखा
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-2xl">

        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Smart <span className="gradient-text">Itinerary</span>
          </h2>
          <p className="text-muted-foreground mt-3">
            AI-generated travel plan
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {days.map(([day, items], i) => (
            <ScrollReveal key={day} delay={i * 100}>
              <div className="glass-card overflow-hidden">

                {/* HEADER */}
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                      {i + 1}
                    </div>

                    <span className="font-semibold text-foreground">
                      {day}
                    </span>
                  </div>

                  {expanded === i ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* BODY */}
                {expanded === i && (
                  <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">

                    {items.map((item, j) => (
                      <div key={j} className="p-3 rounded-lg bg-muted/40">

                        <h4 className="font-semibold text-foreground">
                          {item.place}
                        </h4>

                        <p className="text-sm text-foreground/80 mt-1">
                          {item.activity}
                        </p>

                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>🚗 {item.transport}</span>
                          <span>⏰ {item.time}</span>
                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;