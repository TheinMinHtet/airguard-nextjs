"use client"

import React, { useEffect, useState } from 'react';
import { MapPin, Bell, RefreshCw, AlertCircle, BellOff } from 'lucide-react';
import { fetchAirQuality } from '../services/aqiService';
import { AirQualityResponse, AQIData } from '../types';
import AQIGauge from '../components/AQIGauge';
import PollutantChart from '../components/PollutantChart';
import AIAdvisor from '../components/AIAdvisor';
import Chatbot from '../components/Chatbot';
import EcoKnowledgeCard from '../components/EcoKnowledgeCard';

// Default fallback location (London)
const DEFAULT_LOCATION = { latitude: 51.5074, longitude: -0.1278 };

export default function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<AirQualityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationName, setLocationName] = useState("London, UK"); 
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Track if we have already alerted for the current high pollution event to avoid spam
  const [hasSentAlert, setHasSentAlert] = useState(false);

  const loadData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setHasSentAlert(false);
    try {
      const data = await fetchAirQuality({ latitude: lat, longitude: lon });
      setWeatherData(data);
      setLastUpdated(new Date()); // Track last updated time
    } catch (err) {
      setError("Failed to load air quality data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Try to get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationName("Current Location");
          loadData(latitude, longitude);
        },
        (err) => {
          console.warn("Geolocation denied/failed, using default.", err);
          loadData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
        }
      );
    } else {
      loadData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
    }
  }, []);

  // Monitor Air Quality for Notifications
  useEffect(() => {
    if (notificationsEnabled && weatherData && !hasSentAlert) {
      const currentAQI = weatherData.current.us_aqi;
      if (currentAQI > 100) {
        if (Notification.permission === "granted") {
          new Notification("Air Quality Warning ⚠️", {
            body: `High pollution detected! AQI is ${currentAQI}. Consider wearing a mask if outside.`,
            icon: 'https://cdn-icons-png.flaticon.com/512/5664/5664979.png',
            requireInteraction: true
          });
          setHasSentAlert(true);
        }
      }
    }
  }, [weatherData, notificationsEnabled, hasSentAlert]);

  const handleRefresh = () => {
    loadData(location.latitude, location.longitude);
  };

  const toggleNotifications = () => {
    if (!('Notification' in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }

    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification("AirGuard AI", {
        body: "Notifications active. We will warn you if air quality becomes unhealthy."
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification("AirGuard AI", {
            body: "Notifications enabled! We'll alert you when air quality drops."
          });
        }
      });
    } else {
      alert("Notifications are blocked. Please enable them in your browser settings.");
    }
  };

  // Compute time ago in minutes
  const getTimeAgo = () => {
    if (!lastUpdated) return "Updated just now";
    const diffMs = new Date().getTime() - lastUpdated.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes === 0) return "Updated just now";
    if (diffMinutes === 1) return "Updated 1 minute ago";
    return `Updated ${diffMinutes} minutes ago`;
  };

  // Force re-render every minute to update "time ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => prev ? new Date(prev.getTime()) : null);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Transform API response to internal props
  const currentAQI: AQIData = weatherData ? {
    aqi: weatherData.current.us_aqi,
    pm25: weatherData.current.pm2_5,
    pm10: weatherData.current.pm10,
    no2: weatherData.current.nitrogen_dioxide,
    o3: weatherData.current.ozone,
    so2: weatherData.current.sulphur_dioxide,
    temperature: 0 
  } : { aqi: 0, pm25: 0, pm10: 0, no2: 0, o3: 0, so2: 0, temperature: 0 };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
               <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">AirGuard AI</h1>
              <p className="text-xs text-slate-500 font-medium">{locationName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleNotifications}
              className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
            >
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Hero Section: AQI Gauge & AI Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800">Live Overview</h2>
               <span className="text-sm text-slate-400">{getTimeAgo()}</span>
            </div>
            {loading && !weatherData ? (
              <div className="h-64 bg-slate-200 rounded-3xl animate-pulse mb-8"></div>
            ) : (
              <AQIGauge data={currentAQI} />
            )}
            
            {weatherData && <PollutantChart hourly={weatherData.hourly} />}
          </div>

          <div className="lg:col-span-2">
             <h2 className="text-xl font-bold text-slate-800 mb-4">AI Health Advisor</h2>
             <AIAdvisor aqiData={currentAQI} />
             
             {/* Mini Eco Tip Card */}
             <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <h4 className="font-semibold text-emerald-900 mb-2">Did you know?</h4>
                <p className="text-sm text-emerald-700">
                  Indoor plants like Snake Plants and Spider Plants can naturally filter indoor air pollutants like benzene and formaldehyde.
                </p>
             </div>
          </div>
        </div>

        {/* Knowledge Section (New) */}
        <div className="mt-8">
          <EcoKnowledgeCard />
        </div>
      </main>
      
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; 2025 AirGuard AI. Powered by Open-Meteo & Google Gemini.</p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot aqiData={currentAQI} location={location} locationName={locationName} />
    </div>
  );
}
