import React from 'react';
import { HourlyData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PollutantChartProps {
  hourly: HourlyData;
}

const PollutantChart: React.FC<PollutantChartProps> = ({ hourly }) => {
  // Process data for Recharts (take last 12 hours for clarity)
  const chartData = hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).getHours() + ':00',
    pm25: hourly.pm2_5[index],
    pm10: hourly.pm10[index]
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">24h Pollutant Trends</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-500">PM 2.5</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-slate-500">PM 10</span>
          </div>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              tick={{fontSize: 12, fill: '#94a3b8'}} 
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis 
              tick={{fontSize: 12, fill: '#94a3b8'}} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="pm25" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPm25)" 
            />
            <Area 
              type="monotone" 
              dataKey="pm10" 
              stroke="#6366f1" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPm10)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PollutantChart;
