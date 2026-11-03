import React from 'react';
import { 
  Zap, 
  Calendar, 
  ShieldCheck, 
  Sun, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';

interface HeroProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onOpenBooking,
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Background Image with customizable overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${config.heroBackgroundUrl})` }}
      />
      
      {/* Dynamic Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950"
        style={{ opacity: config.heroOverlayOpacity }}
      />

      {/* Subtle radial solar flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        
        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] text-white">
          {config.heroHeadline}
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto font-normal leading-relaxed">
          {config.heroSubheadline}
        </p>

        {/* Technical Specs Pill (Editable live in CMS) */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-2 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {config.solarPanelBrand}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {config.panelEfficiency}% Panel Efficiency
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {config.warrantyYearsProduct}-Year Triple Warranty
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Turnaround: {config.turnaroundWeeks}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>Book Free On-Site Roof Survey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#tracker"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 hover:border-slate-500 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Track Project & Reservation</span>
          </a>
        </div>

        {/* 4 Live Stats Cards */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Total Installed</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">15.2+ MW</span>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">High-yield solar capacity</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Clean Energy Clients</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">2,450+</span>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">Homes & Commercial systems</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Incentive Support</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">30% ITC</span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">Federal tax credit active</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Performance Guarantee</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">25 Years</span>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">Full hardware & labor backing</span>
          </div>
        </div>

      </div>
    </section>
  );
};
