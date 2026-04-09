import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const weather = [
  { day: "Mon", temp: 28, icon: Sun, condition: "Sunny" },
  { day: "Tue", temp: 26, icon: Cloud, condition: "Cloudy" },
  { day: "Wed", temp: 24, icon: CloudRain, condition: "Rain" },
  { day: "Thu", temp: 27, icon: Sun, condition: "Sunny" },
  { day: "Fri", temp: 25, icon: Wind, condition: "Windy" },
  { day: "Sat", temp: 22, icon: CloudSnow, condition: "Snow" },
  { day: "Sun", temp: 29, icon: Sun, condition: "Sunny" },
];

const WeatherSection = () => (
  <section className="section-padding">
    <div className="container mx-auto max-w-3xl">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Weather <span className="gradient-text">Forecast</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {weather.map((w, i) => (
            <div key={i} className="glass-card-hover p-4 text-center min-w-[100px] flex-1">
              <p className="text-xs text-muted-foreground mb-2">{w.day}</p>
              <w.icon className="w-7 h-7 mx-auto text-primary mb-2" />
              <p className="font-display font-bold text-xl text-foreground">{w.temp}°</p>
              <p className="text-[10px] text-muted-foreground mt-1">{w.condition}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default WeatherSection;
