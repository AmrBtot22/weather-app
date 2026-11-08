import type { GeocodingResponse, WeatherData } from "@/api/type";
import { ArrowDown, ArrowUp, Droplets, Wind, MapPin } from "lucide-react";
import { Card, CardContent } from "./card";
import { useState } from "react";
import { useTheme } from "@/context/theme-provider";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const [activeIcon, setActiveIcon] = useState<string>("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = (iconName: string) => {
    setActiveIcon(iconName);
    setTimeout(() => setActiveIcon(""), 1500);
  };

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  const displayName = locationName?.name || "MY Location";
  const displayState = locationName?.state || "";
  const displayCountry = locationName?.country || "";

  return (
    <Card
      className={`backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden
        ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"}`}
    >
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* معلومات الموقع والحرارة */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <MapPin
                  className={`h-5 w-5 ${
                    isDark ? "text-white/80" : "text-gray-900"
                  }`}
                />
                <h2
                  className={`text-2xl font-bold tracking-tighter drop-shadow-sm ${
                    !locationName && !isDark
                      ? "text-black"
                      : isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {displayName}
                </h2>
                {displayState && (
                  <span className={`${isDark ? "text-white/70" : "text-gray-700"}`}>
                    , {displayState}
                  </span>
                )}
              </div>
              {displayCountry && (
                <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-sm`}>
                  {displayCountry}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <p className={`text-7xl font-bold tracking-tighter drop-shadow-md ${isDark ? "text-white" : "text-gray-900"}`}>
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className={`${isDark ? "text-white/80" : "text-gray-700"} text-sm font-medium`}>
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span
                    className={`flex items-center gap-1 cursor-pointer transition-all duration-300 ${
                      isDark ? "text-blue-400" : "text-blue-500"
                    }`}
                    onClick={() => handleClick("minTemp")}
                  >
                    <ArrowDown
                      className={`h-3 w-3 icon-animation-min ${
                        activeIcon === "minTemp" ? "drop-shadow-xl scale-125" : ""
                      }`}
                    />
                    {formatTemp(temp_min)}
                  </span>
                  <span
                    className={`flex items-center gap-1 cursor-pointer transition-all duration-300 ${
                      isDark ? "text-red-400" : "text-red-500"
                    }`}
                    onClick={() => handleClick("maxTemp")}
                  >
                    <ArrowUp
                      className={`h-3 w-3 icon-animation-max ${
                        activeIcon === "maxTemp" ? "drop-shadow-xl scale-125" : ""
                      }`}
                    />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl backdrop-blur-md hover:scale-[1.02] transition-all duration-500 cursor-pointer ${
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleClick("humidity")}
              >
                <Droplets
                  className={`h-4 w-4 transition-all duration-500 droplet-animate ${
                    isDark ? "text-blue-400" : "text-blue-500"
                  } ${activeIcon === "humidity" ? "drop-shadow-xl scale-125" : ""}`}
                />
                <div className="flex flex-col">
                  <p className={`${isDark ? "text-white/90" : "text-gray-800"} text-sm font-medium`}>Humidity</p>
                  <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-sm`}>{humidity}%</p>
                </div>
              </div>
              {/* Wind Speed */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl backdrop-blur-md hover:scale-[1.02] transition-all duration-500 cursor-pointer ${
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleClick("wind")}
              >
                <Wind
                  className={`h-4 w-4 transition-all duration-500 wind-animate ${
                    isDark ? "text-green-400" : "text-green-600"
                  } ${activeIcon === "wind" ? "drop-shadow-xl scale-125" : ""}`}
                />
                <div className="flex flex-col">
                  <p className={`${isDark ? "text-white/90" : "text-gray-800"} text-sm font-medium`}>Wind Speed</p>
                  <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-sm`}>{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          {/* أيقونة الطقس */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 text-center">
                <p className={`${isDark ? "text-white/80" : "text-gray-700"} text-sm font-medium capitalize`}>
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Animations */}
      <style>{`
        .icon-animation-min { animation: bounceMin 2s infinite ease-in-out; }
        @keyframes bounceMin { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(2px); } }

        .icon-animation-max { animation: bounceMax 2s infinite ease-in-out; }
        @keyframes bounceMax { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-2px); } }

        .droplet-animate { animation: dropletFloat 2.5s ease-in-out infinite; }
        @keyframes dropletFloat { 0%,100%{ transform: translateY(0); opacity:0.9; } 50%{ transform: translateY(-2px); opacity:1; } }

        .wind-animate { animation: windWave 3s ease-in-out infinite; }
        @keyframes windWave { 0%,100%{ transform: rotate(0deg); } 25%{ transform: rotate(5deg); } 50%{ transform: rotate(-5deg); } 75%{ transform: rotate(3deg); } }
      `}</style>
    </Card>
  );
}

export default CurrentWeather;
