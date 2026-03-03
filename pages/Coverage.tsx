import React from 'react';
import MapBackground from '../components/MapBackground';
import { Shield, Radio } from 'lucide-react';

const Coverage: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-screen bg-sky-950 pt-20">
       <MapBackground 
          interactive={true} 
          showFlights={false} 
          showAirports={true} // Reusing airports as receiver locations for demo
          className="absolute inset-0 z-0 opacity-50"
       />
       
       <div className="relative z-10 px-6 md:px-12 py-8 max-w-4xl">
         <div className="glass-panel p-8 rounded-2xl max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-500/20 p-3 rounded-full text-green-400 border border-green-500/30">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Coverage Transparency</h1>
                <p className="text-gray-400">We verify every data point. No estimates without warning.</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="font-mono text-sm">Good Coverage (ADS-B)</span>
                <span className="text-xs text-gray-500 ml-auto">Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                <span className="font-mono text-sm">MLAT (Estimated)</span>
                <span className="text-xs text-gray-500 ml-auto">±2km Accuracy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <span className="font-mono text-sm">Blind Spot</span>
                <span className="text-xs text-gray-500 ml-auto">No Signal</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Radio size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Live in a blind spot?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Host a receiver and get a free Business account for life.
              </p>
              <button className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors">
                Host a Receiver
              </button>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Coverage;
