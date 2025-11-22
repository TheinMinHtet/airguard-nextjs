import React from 'react';
import { AQIData } from '../types';
import { Wind, Droplets, Thermometer, CloudFog } from 'lucide-react';

interface AQIGaugeProps {
  data: AQIData;
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return 'bg-emerald-500 text-emerald-50 border-emerald-200 shadow-emerald-100';
  if (aqi <= 100) return 'bg-yellow-500 text-yellow-50 border-yellow-200 shadow-yellow-100';
  if (aqi <= 150) return 'bg-orange-500 text-orange-50 border-orange-200 shadow-orange-100';
  if (aqi <= 200) return 'bg-red-500 text-red-50 border-red-200 shadow-red-100';
  if (aqi <= 300) return 'bg-purple-500 text-purple-50 border-purple-200 shadow-purple-100';
  return 'bg-rose-900 text-rose-50 border-rose-900 shadow-rose-200';
};

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const AQIGauge: React.FC<AQIGaugeProps> = ({ data }) => {
  const colorClass = getAQIColor(data.aqi);
  const status = getAQIStatus(data.aqi);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Main AQI Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 shadow-xl border ${colorClass} transition-all duration-500`}>
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Wind size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-medium opacity-90 mb-1">Air Quality Index</h2>
          <div className="flex items-baseline gap-3">
            <span className="text-7xl font-bold tracking-tighter">{data.aqi}</span>
            <span className="text-xl font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              {status}
            </span>
          </div>
          <p className="mt-4 text-sm opacity-80 max-w-xs">
            Based on current particulate matter (PM2.5 & PM10) readings.
          </p>
        </div>
      </div>

      {/* Pollutant Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CloudFog size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">PM 2.5</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{data.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CloudFog size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">PM 10</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{data.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Thermometer size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">NO₂</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{data.no2 || '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Droplets size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Ozone</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{data.o3 || '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
        </div>
      </div>
    </div>
  );
};

export default AQIGauge;
