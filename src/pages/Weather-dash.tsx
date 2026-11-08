import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import CurrentWeather from "@/components/ui/CurrentWeather";
import FavoriteCities from "@/components/ui/Favcityes";
import Hourlytemprature from "@/components/ui/Hourly-temprature";
import WeatherSkeleton from "@/components/ui/Loading";
import Weatherdetails from "@/components/ui/Weather-details";
import Weatherforecast from "@/components/ui/Weather-forecast";
import { useGeolocation } from "@/hooks/Use";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/Use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { useTheme } from "@/context/theme-provider";

function Weatherdash() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { coordinates, isLoading: locationLoading, error: locationError, getLocation } =
    useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) return <WeatherSkeleton />;

  if (locationError)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (!coordinates)
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button onClick={handleRefresh} variant="outline" className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (!weatherQuery.data || !forecastQuery.data) return <WeatherSkeleton />;

  return (
    <div className="relative min-h-screen px-4 sm:px-8 py-8 space-y-6 font-sans">

      {/* محتوى الصفحة */}
      <div className="space-y-6">

        {/* المدن المفضلة */}
        <div className="animate-fade-down">
          <FavoriteCities />
        </div>

        {/* العنوان + زر التحديث */}
        <div className="flex items-center justify-between animate-fade-up">
          <h1 className={`text-3xl font-bold tracking-tight drop-shadow-lg ${
            isDark ? "text-white" : "text-black"
          }`}>
            My Location
          </h1>

          <Button
            variant={isDark ? "outline" : "default"}
            size="icon"
            onClick={handleRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
            className={`border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 ${
              !isDark ? "bg-gray-200 hover:bg-gray-300" : ""
            }`}
          >
            <RefreshCw
              className={`h-5 w-5 ${
                weatherQuery.isFetching || forecastQuery.isFetching ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>

        {/* محتوى الطقس */}
        <div className="grid gap-6">

          {/* CurrentWeather + HourlyTemperature */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full animate-fade-right">
              <CurrentWeather data={weatherQuery.data} locationName={locationName} />
            </div>
            <div className="w-full animate-fade-left">
              <Hourlytemprature data={forecastQuery.data} />
            </div>
          </div>

          {/* WeatherDetails + WeatherForecast */}
          <div className="grid gap-6 md:grid-cols-2 items-start">
            <div className="animate-fade-up">
              <Weatherdetails data={weatherQuery.data} />
            </div>
            <div className="animate-fade-up delay-150">
              <Weatherforecast data={forecastQuery.data} />
            </div>
          </div>

        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulseSlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        .animate-fade-up { animation: fadeInUp 0.7s ease forwards; }
        .animate-fade-down { animation: fadeInDown 0.7s ease forwards; }
        .animate-fade-left { animation: fadeInLeft 0.7s ease forwards; }
        .animate-fade-right { animation: fadeInRight 0.7s ease forwards; }
        .animate-pulse { animation: pulseSlow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default Weatherdash;
