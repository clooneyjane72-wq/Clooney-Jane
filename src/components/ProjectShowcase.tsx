import React, { useState } from 'react';
import { 
  CheckCircle, 
  Star, 
  MapPin, 
  Zap, 
  Battery, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';

interface ProjectShowcaseProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
}

const SHOWCASE_PROJECTS = [
  {
    id: 'proj-showcase-1',
    title: 'The Sterling Estate Coastal Installation',
    category: 'Residential Rooftop & Battery Storage',
    location: 'Newport Beach, California',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    sizeKW: 9.6,
    annualKWh: '14,800 kWh/yr',
    panels: '24x REC Alpha Pure-R 430W',
    inverter: 'Enphase IQ8+ Microinverters',
    battery: 'Tesla Powerwall 3 (13.5 kWh)',
    savings: '₱215,000 / Year Saved',
    quote: "Tonex Solar Works transformed our energy costs. With our electric vehicles and pool heating, our bills were over ₱25,000/month. Last month our utility bill was ₱650. The black-on-black panels look stunning on our roof.",
    client: 'Alexander & Claire Sterling',
    verified: 'Verified Homeowner',
  },
  {
    id: 'proj-showcase-2',
    title: 'Apex Precision Logistics Commercial Hub',
    category: 'Commercial Flat Roof Ballast Array',
    location: 'Tempe, Arizona',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80',
    sizeKW: 68.0,
    annualKWh: '112,000 kWh/yr',
    panels: '160x Bifacial Commercial 425W',
    inverter: 'SolarEdge 3-Phase Commercial 66.6K',
    battery: 'Grid-Tied Commercial Peak Shaving',
    savings: '₱1,380,000 / Year Saved',
    quote: "As an industrial facility with refrigeration and forklift charging, peak demand charges were punishing. The Tonex engineering team managed all APS utility approvals and passed city inspections on the first round.",
    client: 'Marcus Vance, VP of Operations',
    verified: 'Verified Enterprise Client',
  },
  {
    id: 'proj-showcase-3',
    title: 'Pacific Modern Residence & Dual Backup',
    category: 'Whole-Home Microgrid',
    location: 'La Jolla, California',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    sizeKW: 12.8,
    annualKWh: '19,400 kWh/yr',
    panels: '30x High-Efficiency Mono Black',
    inverter: 'Enphase IQ8M Microinverters',
    battery: 'Dual Enphase IQ Battery 5P (10 kWh)',
    savings: '₱275,000 / Year Saved',
    quote: "When utility outages hit our canyon last winter, our house didn't even flicker. The app lets us track exactly when we are charging our cars from pure sunlight. Professional from day one.",
    client: 'Dr. Evelyn Martinez',
    verified: 'Verified Homeowner',
  },
];

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  config,
  onOpenBooking,
}) => {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const currentProject = SHOWCASE_PROJECTS[activeProjectIdx];

  return (
    <section id="projects" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Proven Track Record & Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Solar Installations by Tonex Solar Works
            </h2>
            <p className="text-slate-400 text-base mt-2">
              Explore real-world residential rooftops, commercial solar canopies, and resilient microgrids producing clean power every day.
            </p>
          </div>

          <div className="flex gap-2">
            {SHOWCASE_PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeProjectIdx === idx
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Project 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Project Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
          
          {/* Project Image & Live Badge (6 cols) */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl group h-80 sm:h-96">
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Live & Producing
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {currentProject.location}
                </span>
                <span className="font-bold text-emerald-400 font-mono">{currentProject.savings}</span>
              </div>
            </div>
          </div>

          {/* Project Specs & Review (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {currentProject.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {currentProject.title}
              </h3>
            </div>

            {/* 4 Specs Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">System Capacity</span>
                <span className="text-lg font-black text-white mt-0.5 block">{currentProject.sizeKW} kW DC</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Annual Clean Output</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">{currentProject.annualKWh}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 col-span-2">
                <span className="text-[11px] text-slate-400 block">Installed Hardware</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                  {currentProject.panels} • {currentProject.inverter}
                </span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 relative">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                "{currentProject.quote}"
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{currentProject.client}</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {currentProject.verified}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Request Similar Solar Blueprint</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
