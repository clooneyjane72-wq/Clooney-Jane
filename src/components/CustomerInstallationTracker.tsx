import React, { useState } from 'react';
import { 
  Search, 
  CalendarCheck2, 
  CheckCircle2, 
  HardHat, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Award, 
  AlertCircle,
  FileText,
  MapPin,
  Sparkles,
  Phone
} from 'lucide-react';
import { SolarProject, SiteConfiguration } from '../types/solar';
import { StorageService } from '../services/storage';

interface CustomerInstallationTrackerProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
}

export const CustomerInstallationTracker: React.FC<CustomerInstallationTrackerProps> = ({
  config,
  onOpenBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('TNX-2026-088');
  const [selectedProject, setSelectedProject] = useState<SolarProject | null>(() => {
    const projs = StorageService.getProjects();
    return projs[0] || null;
  });
  const [searched, setSearched] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allProjects = StorageService.getProjects();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSearched(true);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setErrorMessage('Please enter your Tonex Project Number (e.g. TNX-2026-088) or client name.');
      return;
    }

    const match = allProjects.find(
      (p) =>
        p.projectNumber.toLowerCase().includes(query) ||
        p.clientName.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
    );

    if (match) {
      setSelectedProject(match);
      setErrorMessage(null);
    } else {
      setSelectedProject(null);
      setErrorMessage(`No project record found matching "${searchQuery}". Please check your project number or call ${config.phone}.`);
    }
  };

  const handleSelectSample = (proj: SolarProject) => {
    setSelectedProject(proj);
    setSearchQuery(proj.projectNumber);
    setErrorMessage(null);
    setSearched(true);
  };

  const isDone = selectedProject?.currentPhase === 'completed' || selectedProject?.commissioningStatus === 'live';
  const isReserved = !!selectedProject?.reservationDate && !isDone;

  return (
    <section id="tracker" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <CalendarCheck2 className="w-3.5 h-3.5" /> Customer Project & Installation Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Track Upcoming Reservations & Certified Installations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Look up your property's scheduled installation date, assigned electrical crew, and certified Permission to Operate (PTO) milestone.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="max-w-2xl mx-auto bg-slate-800/90 rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-xl mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Project Number (e.g. TNX-2026-088) or Client Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" /> Look Up Status
            </button>
          </form>

          {/* Quick Demo Project Selection Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
            {allProjects.map((p) => {
              const isComp = p.currentPhase === 'completed' || p.commissioningStatus === 'live';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectSample(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    selectedProject?.id === p.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {isComp ? '✓ Done: ' : '📅 Reserved: '} {p.projectNumber}
                </button>
              );
            })}
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-950/60 border border-red-500 text-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Selected Project Details Card */}
        {selectedProject && (
          <div className="max-w-4xl mx-auto bg-slate-800/80 rounded-3xl border border-slate-700 p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700">
                    {selectedProject.projectNumber}
                  </span>

                  {isDone ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Done Installation • PTO Certified
                    </span>
                  ) : isReserved ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      <CalendarCheck2 className="w-4 h-4 text-amber-400" /> Installation Reserved: {selectedProject.reservationDate}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      Phase: {selectedProject.currentPhase.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white mt-2">{selectedProject.clientName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {selectedProject.address}
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 text-right">
                <span className="text-[11px] text-slate-400 block font-semibold">Clean System Sizing</span>
                <span className="text-2xl font-black text-white font-mono">{selectedProject.systemSizeKW} kW</span>
                <span className="text-[11px] text-emerald-400 block">{selectedProject.panelCount} Tier-1 Modules</span>
              </div>
            </div>

            {/* CASE 1: DONE INSTALLATION DETAILS */}
            {isDone ? (
              <div className="space-y-6">
                <div className="p-5 bg-emerald-950/40 rounded-2xl border border-emerald-500/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>Official Tonex Solar Works Commissioning Certificate</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This solar power system has passed all municipal building & electrical safety inspections and received official Permission to Operate (PTO) from {selectedProject.utilityCompany}.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Completion Date</span>
                      <strong className="text-white">{selectedProject.completedDate || 'Certified'}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">PTO Approved</span>
                      <strong className="text-emerald-400">{selectedProject.ptoApprovalDate || 'Active'}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">City Permit ID</span>
                      <strong className="text-slate-200">{selectedProject.permitNumber || 'Passed'}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Active Warranty</span>
                      <strong className="text-amber-400">{config.warrantyYearsProduct} Years</strong>
                    </div>
                  </div>
                </div>

                {/* System Specs Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 block mb-1">Solar PV Array</span>
                    <span className="font-bold text-white block">{selectedProject.panelModel}</span>
                    <span className="text-[11px] text-slate-400">{selectedProject.panelCount} Monocrystalline Panels</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 block mb-1">Inverter Architecture</span>
                    <span className="font-bold text-white block">{selectedProject.inverterModel}</span>
                    <span className="text-[11px] text-slate-400">Microinverter Rapid Shutdown</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 block mb-1">Energy Storage</span>
                    <span className="font-bold text-white block">{selectedProject.batteryStorage}</span>
                    <span className="text-[11px] text-slate-400">Automatic Outage Backup</span>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE 2: UPCOMING RESERVATION DETAILS */
              <div className="space-y-6">
                <div className="p-5 bg-amber-950/30 rounded-2xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarCheck2 className="w-4 h-4" /> Physical Installation Reserved
                    </span>
                    <span className="text-xs text-amber-300 font-mono font-bold">
                      Date: {selectedProject.reservationDate || selectedProject.targetCompletionDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your installation slot is locked in our master operations schedule. Our certified master electrician crew will arrive between 7:30 AM and 8:30 AM.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Assigned Installation Crew</span>
                      <strong className="text-amber-400">{selectedProject.crewAssigned || 'Tonex Master Electrician Crew #1'}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Permit Status</span>
                      <strong className="text-slate-200">{selectedProject.permitNumber ? `Approved (${selectedProject.permitNumber})` : 'In Municipal Review'}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Lead Project Engineer</span>
                      <strong className="text-slate-200">{selectedProject.assignedEngineer}</strong>
                    </div>
                  </div>
                </div>

                {/* Progress Milestone Bar */}
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Project Milestone Progress</span>
                    <span className="text-emerald-400 font-mono">{selectedProject.phaseProgressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${selectedProject.phaseProgressPercent}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 text-[10px] text-slate-400 text-center pt-1">
                    <span className="text-emerald-400 font-bold">✓ 3D Design</span>
                    <span className="text-emerald-400 font-bold">✓ Permits</span>
                    <span className="text-amber-400 font-bold">⏳ Crew Staging</span>
                    <span className="text-slate-500">Inspection & PTO</span>
                  </div>
                </div>

                {/* Homeowner Preparation Checklist */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/80 text-xs space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" /> Homeowner Preparation Checklist:
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Please ensure the driveway is clear for the solar equipment van.</li>
                    <li>Ensure clear access to the main electrical breaker panel and utility meter.</li>
                    <li>Keep pets indoors during rooftop ladder staging.</li>
                    <li>Power will be temporarily disconnected for ~60 minutes during final inverter tie-in.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Need to reschedule or ask questions */}
            <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-slate-400">
                Need to reschedule or update access notes? Contact your project coordinator.
              </span>
              <a
                href={`tel:${config.phone.replace(/\D/g, '')}`}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Call Support: {config.phone}
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
