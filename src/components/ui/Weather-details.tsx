import type { WeatherData } from "@/api/type";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useTheme } from "@/context/theme-provider";

interface DetailsProps {
  data: WeatherData;
}

const WeatherDetails = ({ data }: DetailsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { wind, main, sys } = data;

  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: format(new Date(sys.sunrise * 1000), "HH:mm"),
      icon: Sunrise,
      color: isDark ? "text-orange-400" : "text-orange-500",
      animation: "icon-spin-slow"
    },
    {
      title: "Sunset",
      value: format(new Date(sys.sunset * 1000), "HH:mm"),
      icon: Sunset,
      color: isDark ? "text-blue-400" : "text-blue-500",
      animation: "icon-spin-slow"
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: isDark ? "text-green-400" : "text-green-600",
      animation: "icon-compass"
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: isDark ? "text-purple-400" : "text-purple-700",
      animation: "icon-pulse-smooth"
    },
  ];

  return (
    <Card
      className={`backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl 
        ${isDark ? "bg-white/5 border-white/10" : "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-gray-300"}`}
    >
      <CardHeader className="pb-2">
        <CardTitle
          className={`text-lg font-semibold tracking-wide drop-shadow-sm ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Weather Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {details.map((detail, i) => (
            <div
              key={detail.title}
              className={`group flex items-center gap-3 rounded-xl border p-4 backdrop-blur-md
                transition-all duration-500 hover:scale-[1.03] hover:shadow-lg ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/50 border-gray-200 hover:bg-white/60"
                }`}
              style={{
                animation: `fadeIn 0.5s ease forwards`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <detail.icon
                className={`h-6 w-6 ${detail.color} transition-all duration-500 ${detail.animation} group-hover:scale-110 group-hover:drop-shadow-lg`}
              />
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {detail.title}
                </span>
                <span className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
                  {detail.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-spin-slow { animation: iconSpin 6s linear infinite; }
        @keyframes iconSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .icon-compass { animation: compassShake 3s ease-in-out infinite; }
        @keyframes compassShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
          75% { transform: rotate(3deg); }
        }

        .icon-pulse-smooth { animation: pulseSmooth 2.5s ease-in-out infinite; }
        @keyframes pulseSmooth {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.12); opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default WeatherDetails;
