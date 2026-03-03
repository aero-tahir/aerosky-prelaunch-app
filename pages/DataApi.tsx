import React from 'react';
import { Terminal, Database, Shield } from 'lucide-react';

const DataApi: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-950 pt-20 px-6 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-4 font-mono text-sm">
            <Terminal size={14} /> DEVELOPER PORTAL
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Build with AeroSky API</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Direct access to the raw data stream. Websockets, REST, and Historical archives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Docs Column */}
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-yellow-400">
              <h3 className="text-xl font-bold mb-2 font-mono">GET /flights/:id</h3>
              <p className="text-gray-400 mb-4">Returns real-time telemetry, aircraft details, and route prediction for a specific flight.</p>
              <div className="flex gap-2 text-xs font-mono text-gray-500">
                <span className="bg-white/5 px-2 py-1 rounded">Rate Limit: 60/min</span>
                <span className="bg-white/5 px-2 py-1 rounded">Auth: Bearer</span>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-green-400">
              <h3 className="text-xl font-bold mb-2 font-mono">WSS /stream/area</h3>
              <p className="text-gray-400 mb-4">Subscribe to a bounding box for ultra-low latency updates (200ms).</p>
            </div>
          </div>

          {/* Code Column */}
          <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6 overflow-hidden font-mono text-sm relative group">
             <div className="absolute top-4 right-4 flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             <pre className="text-gray-300 overflow-x-auto">
{`// Example: Fetch Flight Data
const response = await fetch(
  'https://api.aerosky.in/v1/flights/6E554', 
  {
    headers: {
      'Authorization': 'Bearer sk_live_...'
    }
  }
);

const flight = await response.json();
console.log(flight.altitude); // 32000`}
             </pre>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard 
            title="Hobby" 
            price="$0" 
            features={['Personal Use', 'Delayed Data (5m)', '100 req/day']} 
          />
          <PricingCard 
            title="Startup" 
            price="$49" 
            active 
            features={['Commercial Use', 'Real-time Data', '10k req/day', 'Email Support']} 
          />
          <PricingCard 
            title="Enterprise" 
            price="Custom" 
            features={['SLA Guarantee', 'Historical Access', 'Unlimited req', 'Dedicated Account Manager']} 
          />
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ title, price, features, active }: { title: string, price: string, features: string[], active?: boolean }) => (
  <div className={`p-8 rounded-2xl border ${active ? 'bg-white text-black border-white' : 'glass-panel text-white border-white/10'} flex flex-col`}>
    <h3 className="text-lg font-bold uppercase tracking-widest mb-2 opacity-70">{title}</h3>
    <div className="text-4xl font-bold mb-6 font-mono">{price}<span className="text-base font-sans font-normal opacity-50">/mo</span></div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm font-medium">
          {active ? <Shield size={16} className="text-black"/> : <Shield size={16} className="text-gray-500"/>}
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 rounded-lg font-bold text-sm ${active ? 'bg-black text-white hover:bg-gray-800' : 'bg-white/10 hover:bg-white/20'}`}>
      Choose {title}
    </button>
  </div>
);

export default DataApi;
