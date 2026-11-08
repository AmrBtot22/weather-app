import type { ForecastData } from "@/api/type";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/theme-provider";

interface forecastProp {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const Weatherforecast = ({ data }: forecastProp) => {
  const [activeIcon, setActiveIcon] = useState<string>("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const dailyForcasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForcasts).slice(0, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  const handleClick = (iconName: string) => {
    setActiveIcon(iconName);
    setTimeout(() => setActiveIcon(""), 1500);
  };

  return (
    <Card
      className={`backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl 
        ${isDark ? "bg-white/5 border-white/10" : "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-gray-300"}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-semibold tracking-wide drop-shadow-sm ${isDark ? "text-white" : "text-gray-900"}`}>
          5-Day Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          {nextDays.map((day, i) => (
            <div
              key={day.date}
              className={`group p-4 rounded-xl border backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-lg
                ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/50 border-gray-200 hover:bg-white/60"}`}
              style={{
                animation: `fadeIn 0.5s ease forwards`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div>
                <p className={`${isDark ? "text-white/90" : "text-gray-800"} font-medium`}>
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-sm capitalize`}>
                  {day.weather.description}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-2">
                <span
                  className={`flex items-center cursor-pointer ${isDark ? "text-blue-400" : "text-blue-500"}`}
                  onClick={() => handleClick(`minTemp-${i}`)}
                >
                  <ArrowDown
                    className={`mr-1 h-4 w-4 transition-all duration-500 ${
                      activeIcon === `minTemp-${i}` ? "drop-shadow-xl scale-125" : ""
                    } animate-bounce-slow`}
                  />
                  {formatTemp(day.temp_min)}
                </span>
                <span
                  className={`flex items-center cursor-pointer ${isDark ? "text-red-400" : "text-red-500"}`}
                  onClick={() => handleClick(`maxTemp-${i}`)}
                >
                  <ArrowUp
                    className={`mr-1 h-4 w-4 transition-all duration-500 ${
                      activeIcon === `maxTemp-${i}` ? "drop-shadow-xl scale-125" : ""
                    } animate-bounce-slow`}
                  />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <span
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleClick(`humidity-${i}`)}
                >
                  <Droplets
                    className={`h-4 w-4 transition-all duration-500 ${
                      isDark ? "text-blue-400" : "text-blue-500"
                    } ${activeIcon === `humidity-${i}` ? "drop-shadow-xl scale-125" : ""} animate-float`}
                  />
                  <span className={`${isDark ? "text-white/70" : "text-gray-700"} text-sm`}>{day.humidity}%</span>
                </span>
                <span
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleClick(`wind-${i}`)}
                >
                  <Wind
                    className={`h-4 w-4 transition-all duration-500 ${
                      isDark ? "text-green-400" : "text-green-600"
                    } ${activeIcon === `wind-${i}` ? "drop-shadow-xl scale-125" : ""} animate-wind`}
                  />
                  <span className={`${isDark ? "text-white/70" : "text-gray-700"} text-sm`}>{day.wind} m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-bounce-slow { animation: bounce 2s infinite ease-in-out; }
        @keyframes bounce { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-2px); } }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
        @keyframes float { 0%,100%{ transform: translateY(0); opacity: 0.9; } 50%{ transform: translateY(-2px); opacity: 1; } }
        .animate-wind { animation: windWave 3s ease-in-out infinite; }
        @keyframes windWave { 0%,100%{ transform: rotate(0deg); } 25%{ transform: rotate(5deg); } 50%{ transform: rotate(-5deg); } 75%{ transform: rotate(3deg); } }
      `}</style>
    </Card>
  );
};

export default Weatherforecast;
