import React, { useState } from 'react';
import { Leaf, Bike, Zap, Sprout, Factory, Bus, Users, ChevronRight, Recycle } from 'lucide-react';

const EcoKnowledgeCard = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'community'>('individual');

  const individualTips = [
    {
      icon: <Bike className="text-emerald-500" size={20} />,
      title: "Green Commute",
      desc: "Choose walking, cycling, or public transport over driving. One bus can replace 40 cars on the road."
    },
    {
      icon: <Zap className="text-yellow-500" size={20} />,
      title: "Energy Efficiency",
      desc: "Switch to LED bulbs and unplug electronics. Less power demand means fewer emissions from power plants."
    },
    {
      icon: <Recycle className="text-blue-500" size={20} />,
      title: "Reduce & Reuse",
      desc: "Minimize waste. Burning trash is a major source of toxic pollutants. Recycle whenever possible."
    }
  ];

  const communityTips = [
    {
      icon: <Sprout className="text-green-600" size={20} />,
      title: "Urban Greening",
      desc: "Support local tree-planting. Trees act as natural filters, absorbing CO2 and trapping dust."
    },
    {
      icon: <Factory className="text-slate-500" size={20} />,
      title: "Report Pollution",
      desc: "Use local apps to report illegal waste burning or excessive factory smoke to authorities."
    },
    {
      icon: <Users className="text-indigo-500" size={20} />,
      title: "Community Gardens",
      desc: "Start a garden. It reduces heat islands and improves local micro-climates."
    }
  ];

  const currentTips = activeTab === 'individual' ? individualTips : communityTips;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row mb-8">
      {/* Visual Side */}
      <div className="md:w-1/3 bg-linear-to-br from-emerald-600 to-teal-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Leaf size={150} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Education</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Be the Change</h3>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Improving air quality starts with small daily choices. See how your actions ripple out to create a cleaner future.
          </p>
        </div>

        <div className="relative z-10 mt-8">
           <div className="flex gap-2 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
             <button 
               onClick={() => setActiveTab('individual')}
               className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'individual' ? 'bg-white text-emerald-900 shadow-lg' : 'text-emerald-100 hover:bg-white/10'}`}
             >
               My Actions
             </button>
             <button 
               onClick={() => setActiveTab('community')}
               className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'community' ? 'bg-white text-emerald-900 shadow-lg' : 'text-emerald-100 hover:bg-white/10'}`}
             >
               Community
             </button>
           </div>
        </div>
      </div>

      {/* Content Side */}
      <div className="md:w-2/3 p-6 md:p-8 bg-white">
        <div className="grid gap-6">
          {currentTips.map((tip, idx) => (
            <div key={idx} className="flex gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors border border-slate-100 group-hover:border-emerald-100">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-slate-800 font-semibold mb-1 flex items-center gap-2">
                  {tip.title}
                  <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoKnowledgeCard;