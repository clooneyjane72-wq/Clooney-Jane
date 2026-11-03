import React from 'react';
import { 
  Sun, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp,
  LayoutDashboard 
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';

interface FooterProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenBooking,
  onToggleAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sun className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {config.companyName}
              </span>
            </div>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              {config.tagline}. High-efficiency photovoltaic design, battery energy storage systems, and turnkey solar installations.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Licensed Electrical Contractor: <strong className="text-slate-200">{config.licenseNumber}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Service Territories: {config.serviceAreas}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Solar Solutions */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Clean Energy Systems
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Residential Solar Rooftops</a></li>
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Commercial Solar Carports</a></li>
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Tesla Powerwall 3 Storage</a></li>
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Enphase IQ Microinverters</a></li>
              <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Level-2 EV Charging Systems</a></li>
            </ul>
          </div>

          {/* Col 4: Tools & Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Interactive Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#tracker" className="hover:text-emerald-400 transition-colors">Track Project & Reservation</a></li>
              <li><a href="#projects" className="hover:text-emerald-400 transition-colors">Done Installation Showcase</a></li>
              <li><button onClick={onOpenBooking} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Google Calendar Scheduling</button></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">4-Phase Installation Journey</a></li>
              <li><a href="#projects" className="hover:text-emerald-400 transition-colors">Real-World Case Studies</a></li>
            </ul>
          </div>

          {/* Col 5: Support & Portal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Staff & Operations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onToggleAdmin}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Staff Management Portal
                </button>
              </li>
              <li><a href={`tel:${config.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{config.phone}</a></li>
              <li><a href={`mailto:${config.email}`} className="hover:text-white transition-colors">{config.email}</a></li>
              <li className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  {config.warrantyYearsProduct}-Yr Triple Guarantee Active
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {config.companyName}. All rights reserved. Solar equipment trademarks belong to respective manufacturers.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
