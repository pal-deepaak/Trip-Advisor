import { useState } from "react";
import { X, Clock, MapPin, Info, Utensils, Sun, Moon, Coffee, Star, IndianRupee } from "lucide-react";

interface Activity {
  time: string;
  place: string;
  activity: string;
  description: string;
  duration: string;
  tips: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  day_summary: string;
}

interface ItineraryData {
  city: string;
  duration_days: number;
  theme: string;
  overview: string;
  days: DayPlan[];
  travel_tips: string[];
  estimated_budget: {
    budget_category: string;
    daily_estimate: string;
    includes: string[];
  };
  error?: string;
}

interface ItineraryViewerProps {
  data: ItineraryData;
  onClose: () => void;
}

const getTimeIcon = (time: string) => {
  const lowerTime = time.toLowerCase();
  if (lowerTime.includes("morning") || lowerTime.includes("8:00") || lowerTime.includes("9:00") || lowerTime.includes("10:00") || lowerTime.includes("11:00")) {
    return <Coffee className="w-4 h-4 text-amber-500" />;
  }
  if (lowerTime.includes("afternoon") || lowerTime.includes("12:00") || lowerTime.includes("1:00") || lowerTime.includes("2:00") || lowerTime.includes("3:00") || lowerTime.includes("4:00")) {
    return <Sun className="w-4 h-4 text-orange-500" />;
  }
  if (lowerTime.includes("evening") || lowerTime.includes("5:00") || lowerTime.includes("6:00") || lowerTime.includes("7:00") || lowerTime.includes("8:00")) {
    return <Moon className="w-4 h-4 text-indigo-500" />;
  }
  if (lowerTime.includes("lunch") || lowerTime.includes("food") || lowerTime.includes("meal") || lowerTime.includes("restaurant")) {
    return <Utensils className="w-4 h-4 text-green-500" />;
  }
  return <Clock className="w-4 h-4 text-gray-500" />;
};

const ItineraryViewer = ({ data, onClose }: ItineraryViewerProps) => {
  const [activeDay, setActiveDay] = useState(0);
  console.log("Itinerary data received:", data);

  if (data.error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600">Itinerary Error</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600">{data.error}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering ItineraryViewer with data:", data);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5" />
                <h2 className="text-2xl font-bold">{data.city || "Your Itinerary"}</h2>
              </div>
              <p className="text-blue-100 text-sm">{data.theme || `${data.duration_days}-Day Experience`}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {data.overview && (
            <p className="mt-3 text-blue-50 text-sm leading-relaxed">{data.overview}</p>
          )}
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 p-4 border-b bg-gray-50 overflow-x-auto shrink-0">
          {data.days?.map((day: DayPlan, index: number) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeDay === index
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              Day {day.day || index + 1}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {data.days?.[activeDay] && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.days[activeDay].title}
              </h3>

              <div className="space-y-4">
                {data.days[activeDay].activities.map((act: Activity, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-1">
                        {getTimeIcon(act.time)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {act.time}
                          </span>
                          {act.duration && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {act.duration}
                            </span>
                          )}
                        </div>

                        <h4 className="font-semibold text-gray-800 mt-2">
                          <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
                          {act.place}
                        </h4>

                        <p className="text-sm text-gray-600 mt-1">
                          <Info className="w-3 h-3 inline mr-1 text-gray-400" />
                          {act.activity}
                        </p>

                        {act.description && (
                          <p className="text-sm text-gray-500 mt-2 pl-4 border-l-2 border-gray-200">
                            {act.description}
                          </p>
                        )}

                        {act.tips && (
                          <p className="text-xs text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded mt-2">
                            💡 {act.tips}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data.days[activeDay].day_summary && (
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    <Star className="w-4 h-4 inline mr-1" />
                    {data.days[activeDay].day_summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Travel Tips & Budget */}
        {(data.travel_tips || data.estimated_budget) && (
          <div className="border-t bg-gray-50 p-4 shrink-0">
            <div className="grid md:grid-cols-2 gap-4">
              {data.travel_tips && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Travel Tips
                  </h4>
                  <ul className="space-y-1">
                    {data.travel_tips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.estimated_budget && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Estimated Budget
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-800">
                      {data.estimated_budget.daily_estimate}
                    </p>
                    <p className="text-xs text-gray-500">
                      Category: <span className="capitalize">{data.estimated_budget.budget_category}</span>
                    </p>
                    {data.estimated_budget.includes && (
                      <p className="text-xs text-gray-500">
                        Includes: {data.estimated_budget.includes.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryViewer;