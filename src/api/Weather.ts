import { Api } from "./config";
import type { Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./type";

class Amr {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: Api.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${Api.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: Api.DEFAULT_PARAMS.units,
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${Api.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: Api.DEFAULT_PARAMS.units,
    });
    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${Api.API_KEY}`;
    return this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocations (query: string): Promise<GeocodingResponse[]> {
const url = this.createUrl("https://api.openweathermap.org/geo/1.0/direct", {
q: query,
limit: "5",
});
return this.fetchData <GeocodingResponse[]>(url);
}
}

export const Amrapi = new Amr();
