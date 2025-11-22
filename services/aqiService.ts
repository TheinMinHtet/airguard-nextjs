import { AirQualityResponse, LocationCoords } from '../types';

// Using Open-Meteo Air Quality API (Free, no key required for demo)
const BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export const fetchAirQuality = async ({ latitude, longitude }: LocationCoords): Promise<AirQualityResponse> => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: "us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide",
      hourly: "pm10,pm2_5",
      timezone: "auto",
      forecast_days: "1"
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AirQualityResponse;
  } catch (error) {
    console.error("Failed to fetch AQI data:", error);
    throw error;
  }
};

export const getCoordinatesForCity = async (cityName: string): Promise<{lat: number, lng: number, name: string} | null> => {
  try {
    const params = new URLSearchParams({
      name: cityName,
      count: "1",
      language: "en",
      format: "json"
    });

    const response = await fetch(`${GEOCODING_URL}?${params.toString()}`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return {
      lat: data.results[0].latitude,
      lng: data.results[0].longitude,
      name: `${data.results[0].name}, ${data.results[0].country}`
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};