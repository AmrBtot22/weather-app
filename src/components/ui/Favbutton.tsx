// src/components/weather/favorite-button.tsx
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { WeatherData } from "@/api/type";
import { useFavorites } from "@/hooks/Use-Fav";
import { useTheme } from "@/context/theme-provider";

interface FavoriteButtonProps {
  data: WeatherData;
}

export function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from Favorites`);
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to Favorites`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      className={`
        transition-all duration-300
        ${isCurrentlyFavorite 
          ? `bg-yellow-500 hover:bg-yellow-600 ${isDark ? "text-black" : "text-white"}`
          : `${isDark ? "border-white/30 text-white/80 hover:bg-white/10" : "border-gray-300 text-gray-800 hover:bg-gray-100"}`
        }
      `}
    >
      <Star
        className={`h-4 w-4 transition-colors duration-300 
          ${isCurrentlyFavorite ? "fill-current text-white" : ""}`}
      />
    </Button>
  );
}
