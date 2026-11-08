import type { Coordinates } from "@/api/type";
import { Amrapi } from "@/api/Weather";
import {useQuery } from "@tanstack/react-query";
export const WEATHER_KEYS = {
weather: (coords: Coordinates) => ["weather", coords] as const,
forecast: (coords: Coordinates) => ["forecast", coords] as const,
locationn: (coords: Coordinates) => ["locationn", coords] as const,
search: (query: string) => ["location-search", query] as const,

} as const;
export function useWeatherQuery(coordinates: Coordinates | null) {
return useQuery({
queryKey: WEATHER_KEYS.weather (coordinates ?? { lat: 0, lon: 0 }),
queryFn: () =>
coordinates?Amrapi.getCurrentWeather (coordinates): null,
enabled: !!coordinates,
});
}

export function useForecastQuery(coordinates: Coordinates | null) {
return useQuery({
queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
queryFn: () =>
coordinates? Amrapi.getForecast (coordinates): null,
enabled: !!coordinates,
});
}

export function useReverseGeocodeQuery (coordinates: Coordinates | null) {
return useQuery({
queryKey: WEATHER_KEYS.locationn(coordinates ?? { lat: 0, lon: 0 }),
queryFn: () => (coordinates?Amrapi.reverseGeocode (coordinates): null),
enabled: !!coordinates,
});
}
export function useSearchLocations (query:string) {
return useQuery({
queryKey: WEATHER_KEYS.search(query),
queryFn: () => Amrapi.searchLocations(query),
enabled:query.length >=3,
});
}