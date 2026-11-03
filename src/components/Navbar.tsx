import React from 'react';
import { 
  Sun, 
  Zap, 
  Shield, 
  Flame, 
  Leaf, 
  Phone, 
  Calendar, 
  LayoutDashboard, 
  Edit3,
  Menu,
  X
} from 'lucide-react';
import { SiteConfiguration, Role } from '../types/solar';

interface NavbarProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
  onToggleAdmin: () => void;
  isAdminView: boolean;
  onOpenQuickCustomizer: () => void;
  currentRole: Role;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenBooking,
  onToggleAdmin,
  isAdminView,
  onOpenQuickCustomizer,
  currentRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const renderLogoIcon = () => {
    const iconClass = "w-6 h-6 text-amber-500";
    switch (config.logoIcon) {
      case 'zap': return <Zap className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'flame': return <Flame className={iconClass} />;
      case 'leaf': return <Leaf className={iconClass} />;
      case 'sun':
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Optional Announcement Banner */}
      {config.showAnnouncement && config.announcementText && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <span>{config.announcementText}</span>
          <button
            onClick={onOpenBooking}
            className="underline font-bold hover:text-emerald-100 ml-1 cursor-pointer"
          >
            Claim Offer &rarr;
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner group-hover:border-amber-500/50 transition-colors">
              {renderLogoIcon()}
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block group-hover:text-amber-400 transition-colors">
                {config.companyName}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[280px]">
                {config.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#tracker" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-400 font-semibold">
              <Zap className="w-3.5 h-3.5" /> Track Project & Reservation
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#projects" className="hover:text-white transition-colors">Done Installations</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Admin Switcher */}
            <button
              onClick={onToggleAdmin}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isAdminView
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {isAdminView ? 'Exit Admin' : 'Staff CRM & Portal'}
            </button>

            {/* Book Survey CTA */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Roof Survey</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-amber-400 border border-slate-700"
            >
              {isAdminView ? 'Public' : 'CRM'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white text-sm"
          >
            Solar Solutions
          </a>
          <a
            href="#tracker"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-400 font-semibold text-sm"
          >
            Track Project & Reservation
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white text-sm"
          >
            How It Works
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white text-sm"
          >
            Completed Solar Projects
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white text-sm"
          >
            Contact & Inquiry
          </a>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Free Solar Survey
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
