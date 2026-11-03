import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  BatteryCharging, 
  Car, 
  Wrench, 
  Check, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';

interface SolarSolutionsProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
}

const SOLUTIONS = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential Solar Power Systems',
    subtitle: 'Engineered for maximum aesthetic integration & NEM 3.0 peak rate elimination.',
    badge: 'Popular for Homeowners',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Tier-1 430W all-black sleek monocrystalline panels',
      'Independent module microinverters (zero shade bottleneck)',
      'Real-time smartphone app energy monitoring',
      '25-year comprehensive roof leak & workmanship warranty',
      'Average 70% to 95% electricity bill reduction',
    ],
    stats: { output: '6 - 16 kW', savings: 'Up to ₱180,000/yr', warranty: '25 Years' },
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Commercial & Industrial Solar',
    subtitle: 'Transform idle rooftops and parking areas into cash-generating clean energy assets.',
    badge: 'High ROI & Accelerated Depreciation',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Flat roof non-penetrating ballasted racking systems',
      'Dual bifacial commercial modules for ground arrays',
      'Commercial solar carports with integrated EV charging',
      'Federal MACRS accelerated tax depreciation + 30% ITC',
      'Dedicated utility interconnection & engineering project manager',
    ],
    stats: { output: '25 - 500+ kW', savings: '40% - 65% OPEX Cut', warranty: '25 Years' },
  },
  {
    id: 'battery',
    icon: BatteryCharging,
    title: 'Intelligent Battery Energy Storage',
    subtitle: 'Store excess midday solar energy and power your entire home through utility grid outages.',
    badge: 'Blackout Proof',
    image: 'https://images.unsplash.com/photo-1548611716-300486b72615?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Certified Tesla Powerwall 3 & Enphase IQ Battery certified installer',
      'Sub-second automatic power transfer during grid blackouts',
      'Smart TOU arbitrage: charge during cheap hours, discharge at peak prices',
      'Full home critical load panel backup (refrigerators, medical, AC)',
      '10-year manufacturer warranty with 70% retained capacity guarantee',
    ],
    stats: { output: '13.5 - 40.5 kWh', savings: 'Peak Shaving', warranty: '10-15 Years' },
  },
  {
    id: 'ev_carport',
    icon: Car,
    title: 'Solar EV Charging Integration',
    subtitle: 'Charge your electric vehicle 100% on pure sunshine and skip the volatile gas pump.',
    badge: 'Zero Emission Mobility',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Level-2 fast charging stations (up to 48A / 11.5kW charging speeds)',
      'Solar-priority charge scheduling via mobile app',
      'Residential and multi-tenant commercial fleet configurations',
      'Complies with latest National Electrical Code (NEC) standards',
    ],
    stats: { output: 'Up to 44 mi/hr', savings: 'Save ₱95,000/yr fuel', warranty: '5-10 Years' },
  },
];

export const SolarSolutions: React.FC<SolarSolutionsProps> = ({
  config,
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);

  const activeSolution = SOLUTIONS.find((s) => s.id === activeTab) || SOLUTIONS[0];

  return (
    <section id="solutions" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" /> Engineered Clean Energy Systems
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tailored Solar Energy Solutions for Homes & Enterprises
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3">
            From precision residential rooftops to high-capacity commercial solar carports and battery microgrids, Tonex Solar Works engineers systems built to outproduce for 25+ years.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-slate-800">
          {SOLUTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.title.split(' ')[0]} {item.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Solution Feature Box */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          
          {/* Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeSolution.badge}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeSolution.title}
            </h3>

            <p className="text-slate-300 text-base leading-relaxed">
              {activeSolution.subtitle}
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {activeSolution.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Typical Capacity</span>
                <span className="text-base font-bold text-white mt-0.5 block">{activeSolution.stats.output}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Economic Value</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">{activeSolution.stats.savings}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Warranty</span>
                <span className="text-base font-bold text-amber-400 mt-0.5 block">{activeSolution.stats.warranty}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Request Free Technical Evaluation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Solution Image (5 cols) */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-slate-700 shadow-2xl h-80 lg:h-96">
            <img
              src={activeSolution.image}
              alt={activeSolution.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Tier-1 Equipment Standard</span>
              <span className="text-emerald-400 font-mono font-bold">25-Yr Backed</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
