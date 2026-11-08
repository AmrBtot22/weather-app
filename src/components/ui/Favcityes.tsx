import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWeatherQuery } from "@/hooks/Use-weather";
import { useFavorites } from "@/hooks/Use-Fav";
import { useTheme } from "@/context/theme-provider";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-xl border p-4 pr-8 shadow-sm transition-all
                  hover:shadow-lg hover:scale-[1.02] backdrop-blur-md
                  ${isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-gray-200"}`}
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from Favorites`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className={`h-4 w-4 animate-spin ${isDark ? "text-white/70" : "text-gray-800/70"}`} />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}.png`}
              alt={weather.weather[0].description}
              className="h-8 w-8 transition-all duration-500 hover:scale-125 hover:drop-shadow-lg"
            />
            <div>
              <p className={`${isDark ? "text-white/90" : "text-gray-900"} font-medium`}>{name}</p>
              <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-xs`}>{weather.sys.country}</p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className={`${isDark ? "text-white" : "text-gray-900"} text-xl font-bold`}>
              {Math.round(weather.main.temp)}°
            </p>
            <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-xs capitalize`}>
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!favorites.length) return null;

  return (
    <>
      <h1 className={`${isDark ? "text-white drop-shadow-sm" : "text-gray-900"} text-xl font-bold tracking-tight mb-2`}>
        Favorites
      </h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
};

export default FavoriteCities;
