export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  temperature: number;
}

export interface HourlyData {
  time: string[];
  pm10: number[];
  pm2_5: number[];
}

export interface AirQualityResponse {
  current: {
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    ozone: number;
    sulphur_dioxide: number;
  };
  hourly: HourlyData;
  latitude: number;
  longitude: number;
}

export interface HealthTip {
  title: string;
  description: string;
  icon: 'mask' | 'window' | 'exercise' | 'generic';
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
