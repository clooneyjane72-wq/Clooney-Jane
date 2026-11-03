import React from 'react';
import { 
  Compass, 
  FileCheck2, 
  Wrench, 
  Power, 
  ArrowRight, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';

interface HowItWorksProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Drone LiDAR Audit & 3D Design',
    timeline: 'Days 1 - 3',
    icon: Compass,
    desc: 'We map your roof with precision millimeter LiDAR drone imaging, analyze azimuth and shading patterns, and design a custom photovoltaic blueprint to maximize production.',
    highlights: ['Structural roof check', '200A main service panel check', '3D visual mockup'],
  },
  {
    step: '02',
    title: 'City Permitting & HOA Approvals',
    timeline: 'Days 4 - 14',
    icon: FileCheck2,
    desc: 'Our in-house licensed Professional Engineers (P.E.) generate stamped electrical schematics, submit all municipal permits, and handle utility interconnection paperwork for you.',
    highlights: ['Full city permit handling', 'Utility interconnect filing', 'Zero paperwork for you'],
  },
  {
    step: '03',
    title: 'Rapid 1-Day Master Installation',
    timeline: 'Day 15',
    icon: Wrench,
    desc: 'Our certified master installers mount your Tier-1 solar modules, configure Enphase microinverters or Tesla Powerwall, and seal all roof penetrations with watertight flashing.',
    highlights: ['Certified master electricians', 'Watertight roof flashing', 'Tesla & Enphase certified'],
  },
  {
    step: '04',
    title: 'City Inspection & Power To Operate (PTO)',
    timeline: 'Days 16 - 21',
    icon: Power,
    desc: 'We coordinate the final municipal electrical inspection, obtain your official Permission to Operate (PTO) from the electric utility, and switch on your clean solar power generator!',
    highlights: ['Passed inspection guarantee', 'Utility net meter activated', 'Live app monitoring setup'],
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({
  config,
  onOpenBooking,
}) => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Clock className="w-3.5 h-3.5" /> Turnkey {config.turnaroundWeeks} Installation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How Tonex Solar Works: From Sunlight to Grid-Tied Power
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3">
            We handle everything from precision engineering and permitting to rapid installation and utility net metering activation. Zero stress, full transparency.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Step pill & timeline */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {item.step}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600">
                      {item.timeline}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-700/60">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action bar */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-800 to-slate-900 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-xl font-bold text-white">Ready to begin Phase 1?</h4>
            <p className="text-sm text-slate-300 mt-1">
              Schedule your free on-site roof LiDAR scan and custom 3D system blueprint.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Book Free Roof Survey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
