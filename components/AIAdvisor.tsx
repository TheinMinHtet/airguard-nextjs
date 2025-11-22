import React, { useEffect, useState } from 'react';
import { AQIData, HealthTip } from '../types';
import { getHealthAdvice } from '../services/geminiService';
import { ShieldCheck, Wind, User, Home, Sparkles } from 'lucide-react';

interface AIAdvisorProps {
  aqiData: AQIData;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ aqiData }) => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        // Add a small delay to simulate "Thinking" nicely, and avoid flicker if fast
        const data = await getHealthAdvice(aqiData);
        setTips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (aqiData.aqi > 0) {
      fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aqiData.aqi]); // Only re-run if AQI changes significantly (or initial load)

  const getIcon = (type: string) => {
    switch (type) {
      case 'mask': return <ShieldCheck className="text-emerald-500" size={24} />;
      case 'window': return <Home className="text-blue-500" size={24} />;
      case 'exercise': return <Wind className="text-orange-500" size={24} />;
      default: return <User className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 flex items-center gap-3 mb-6">
        <Sparkles className="text-yellow-400" />
        <h3 className="text-xl font-bold">Gemini AI Health Insight</h3>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-16 bg-white/10 rounded-xl w-full"></div>
          <div className="h-16 bg-white/10 rounded-xl w-full"></div>
          <div className="h-16 bg-white/10 rounded-xl w-full"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-start gap-4 hover:bg-white/15 transition-colors">
              <div className="p-2 bg-white/10 rounded-lg shrink-0">
                {getIcon(tip.icon)}
              </div>
              <div>
                <h4 className="font-semibold text-indigo-100 mb-1">{tip.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
