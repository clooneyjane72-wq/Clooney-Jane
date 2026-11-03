import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Calendar, 
  Mail, 
  Sliders, 
  ShieldCheck, 
  Download, 
  ArrowLeft, 
  Plus, 
  FileDown, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Sun,
  Zap,
  Building,
  Check,
  ChevronRight,
  Send,
  Sparkles,
  Lock,
  KeyRound,
  CheckCircle2,
  CalendarCheck2,
  Award,
  HardHat,
  RotateCcw,
  Save,
  Image,
  Flame,
  Shield,
  Leaf
} from 'lucide-react';
import { 
  SiteConfiguration, 
  SolarLead, 
  SolarProject, 
  Appointment, 
  EmailNotification, 
  StaffUser, 
  Role,
  ProjectPhase,
  LeadStatus
} from '../../types/solar';
import { StorageService, DEFAULT_SITE_CONFIG } from '../../services/storage';
import { 
  exportLeadsCsv, 
  exportProjectsCsv, 
  exportAppointmentsCsv, 
  exportToJson 
} from '../../utils/exportData';
import { downloadSolarQuotePdf } from '../../services/pdfGenerator';
import { calculateSolarSystem } from '../../utils/solarCalculator';

interface AdminDashboardProps {
  config: SiteConfiguration;
  onCloseAdmin: () => void;
  onConfigUpdated: (newConfig: SiteConfiguration) => void;
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  onOpenBooking: () => void;
  onLockSession: () => void;
}

const ROLE_PERMISSIONS: Record<Role, {
  label: string;
  badgeColor: string;
  canEditSite: boolean;
  canManageTeam: boolean;
  canDeleteRecords: boolean;
  canExportData: boolean;
  canSignContracts: boolean;
  canApproveEngineering: boolean;
  canReserveInstallation: boolean;
  canMarkInstallationDone: boolean;
}> = {
  super_admin: {
    label: 'Super Admin (Full Access)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    canEditSite: true,
    canManageTeam: true,
    canDeleteRecords: true,
    canExportData: true,
    canSignContracts: true,
    canApproveEngineering: true,
    canReserveInstallation: true,
    canMarkInstallationDone: true,
  },
  sales_manager: {
    label: 'Sales Manager (Pipeline & Quotes)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    canEditSite: false,
    canManageTeam: false,
    canDeleteRecords: false,
    canExportData: true,
    canSignContracts: true,
    canApproveEngineering: false,
    canReserveInstallation: true,
    canMarkInstallationDone: false,
  },
  solar_engineer: {
    label: 'Solar Engineer / Site Surveyor',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    canEditSite: false,
    canManageTeam: false,
    canDeleteRecords: false,
    canExportData: false,
    canSignContracts: false,
    canApproveEngineering: true,
    canReserveInstallation: true,
    canMarkInstallationDone: true,
  },
  support_staff: {
    label: 'Customer Support & Retention',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    canEditSite: false,
    canManageTeam: false,
    canDeleteRecords: false,
    canExportData: false,
    canSignContracts: false,
    canApproveEngineering: false,
    canReserveInstallation: false,
    canMarkInstallationDone: false,
  },
};

const PRESET_BACKGROUNDS = [
  {
    name: 'Residential Solar Roof Aerial',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=2000&q=80',
  },
  {
    name: 'Modern Solar Farm Sunset',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=2000&q=80',
  },
  {
    name: 'High-Tech Solar Architecture',
    url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?auto=format&fit=crop&w=2000&q=80',
  },
  {
    name: 'Clean Blue Sky Solar Modules',
    url: 'https://images.unsplash.com/photo-1548611716-300486b72615?auto=format&fit=crop&w=2000&q=80',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onCloseAdmin,
  onConfigUpdated,
  currentRole,
  onChangeRole,
  onOpenBooking,
  onLockSession,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'projects' | 'site_editor' | 'appointments' | 'emails' | 'team' | 'export'
  >('overview');

  // Live state from storage
  const [leads, setLeads] = useState<SolarLead[]>(() => StorageService.getLeads());
  const [projects, setProjects] = useState<SolarProject[]>(() => StorageService.getProjects());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [emails, setEmails] = useState<EmailNotification[]>(() => StorageService.getEmails());
  const [staff, setStaff] = useState<StaffUser[]>(() => StorageService.getStaff());

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [leadsViewMode, setLeadsViewMode] = useState<'table' | 'kanban'>('kanban');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'reserved' | 'in_progress' | 'completed'>('all');

  // Modals & workflows
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [reservingProject, setReservingProject] = useState<SolarProject | null>(null);
  const [completingProject, setCompletingProject] = useState<SolarProject | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  // Reservation Form State
  const [reserveDate, setReserveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [reserveCrew, setReserveCrew] = useState('Crew Alpha - Irvine Master Electricians');
  const [reservePermit, setReservePermit] = useState('');
  const [reserveNotes, setReserveNotes] = useState('');

  // Done Installation Form State
  const [doneDate, setDoneDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [inspectionDate, setInspectionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [ptoDate, setPtoDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [doneNotes, setDoneNotes] = useState('');

  // Passcode Form State
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  // Site Editor State (Embedded within Admin)
  const [editorData, setEditorData] = useState<SiteConfiguration>(config);
  const [editorSubTab, setEditorSubTab] = useState<'brand' | 'hero' | 'solar'>('brand');
  const [editorSavedNotice, setEditorSavedNotice] = useState(false);

  const permissions = ROLE_PERMISSIONS[currentRole];

  // Refresh data
  const refreshAll = () => {
    setLeads(StorageService.getLeads());
    setProjects(StorageService.getProjects());
    setAppointments(StorageService.getAppointments());
    setEmails(StorageService.getEmails());
    setStaff(StorageService.getStaff());
  };

  // Lead actions
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    StorageService.updateLead(leadId, { status: newStatus });
    refreshAll();
  };

  const handleDeleteLead = (leadId: string) => {
    if (!permissions.canDeleteRecords) {
      alert('Your current role does not have permission to delete records. Switch to Super Admin.');
      return;
    }
    if (confirm('Are you sure you want to delete this lead?')) {
      StorageService.deleteLead(leadId);
      refreshAll();
    }
  };

  const handleDownloadLeadQuote = (lead: SolarLead) => {
    const quote = calculateSolarSystem(
      {
        monthlyBill: lead.avgMonthlyElectricBill,
        batteryChoice: 'tesla_powerwall_3',
        roofType: lead.roofType,
      },
      config
    );
    downloadSolarQuotePdf(
      quote,
      {
        name: lead.clientName,
        email: lead.email,
        phone: lead.phone,
        address: `${lead.address}, ${lead.city}, ${lead.state} ${lead.zipCode}`,
        quoteId: `TNX-${lead.id.replace('lead-', '')}`,
      },
      config
    );
  };

  const handleConvertLeadToProject = (lead: SolarLead) => {
    if (!permissions.canSignContracts) {
      alert('Only Sales Managers and Super Admins can advance leads to active signed contracts.');
      return;
    }
    const newProj = StorageService.addProject({
      leadId: lead.id,
      projectNumber: `TNX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: lead.clientName,
      address: `${lead.address}, ${lead.city}, ${lead.state}`,
      systemSizeKW: lead.estimatedSystemSizeKW || 8.6,
      panelCount: Math.ceil(((lead.estimatedSystemSizeKW || 8.6) * 1000) / 430),
      panelModel: config.solarPanelBrand,
      inverterModel: config.inverterBrand,
      batteryStorage: '1x Tesla Powerwall 3 (13.5 kWh)',
      contractValue: lead.estimatedGrossCost || 24500,
      currentPhase: 'site_survey',
      phaseProgressPercent: 15,
      utilityCompany: lead.state === 'AZ' ? 'APS' : 'SCE / SDG&E',
      targetCompletionDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedEngineer: 'David Chen, P.E.',
      notes: `Converted from lead ${lead.id}. Client prefers black-on-black modules.`,
    });
    StorageService.updateLead(lead.id, { status: 'contract_signed' });
    refreshAll();
    alert(`Successfully converted ${lead.clientName} into active Solar Project #${newProj.projectNumber}!`);
  };

  // Submit Reservation Installation
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservingProject) return;

    if (!permissions.canReserveInstallation) {
      alert('Your current role is not authorized to reserve installation schedules.');
      return;
    }

    StorageService.reserveInstallation(reservingProject.id, {
      reservationDate: reserveDate,
      crewAssigned: reserveCrew,
      permitNumber: reservePermit || reservingProject.permitNumber,
      notes: reserveNotes || `Installation reservation confirmed for ${reserveDate} with ${reserveCrew}.`,
    });

    refreshAll();
    setReservingProject(null);
    setReserveNotes('');
    alert(`✓ Installation reserved for ${reservingProject.clientName} on ${reserveDate}. Automated client confirmation email dispatched.`);
  };

  // Submit Done Installation
  const handleConfirmDoneInstallation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingProject) return;

    if (!permissions.canMarkInstallationDone) {
      alert('Only Solar Engineers and Super Admins can sign off on completed installations and PTO certifications.');
      return;
    }

    StorageService.markInstallationDone(completingProject.id, {
      completedDate: doneDate,
      inspectionDate: inspectionDate,
      ptoApprovalDate: ptoDate,
      commissioningNotes: doneNotes || `Installation officially completed on ${doneDate}. Passed electrical inspection and PTO approved.`,
    });

    refreshAll();
    setCompletingProject(null);
    setDoneNotes('');
    alert(`🎉 Installation #${completingProject.projectNumber} for ${completingProject.clientName} is certified DONE! System is live and client celebration email was sent.`);
  };

  // Handle Passcode Update
  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.trim().length < 4) {
      alert('Passcode must be at least 4 characters long.');
      return;
    }
    StorageService.setAdminPasscode(newPasscode.trim());
    setPasscodeSuccess(true);
    setTimeout(() => {
      setPasscodeSuccess(false);
      setShowPasscodeModal(false);
      setNewPasscode('');
    }, 1500);
  };

  // Save Site Editor
  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canEditSite) {
      alert('Only Super Admin role can edit site branding and installation parameters.');
      return;
    }
    StorageService.saveSiteConfig(editorData);
    onConfigUpdated(editorData);
    setEditorSavedNotice(true);
    setTimeout(() => setEditorSavedNotice(false), 2000);
  };

  const handleResetEditor = () => {
    if (confirm('Reset site branding & solar installation specifications to default settings?')) {
      const def = StorageService.resetSiteConfig();
      setEditorData(def);
      onConfigUpdated(def);
    }
  };

  // KPIs
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimatedGrossCost || 0), 0);
  const totalActiveProjectsValue = projects.reduce((sum, p) => sum + p.contractValue, 0);
  const totalKWInPipeline = leads.reduce((sum, l) => sum + (l.estimatedSystemSizeKW || 0), 0) +
    projects.reduce((sum, p) => sum + p.systemSizeKW, 0);
  const closedWonLeads = leads.filter((l) => l.status === 'contract_signed').length;
  const conversionRate = leads.length > 0 ? Math.round((closedWonLeads / leads.length) * 100) : 0;
  const doneProjectsCount = projects.filter(p => p.currentPhase === 'completed' || p.commissioningStatus === 'live').length;
  const reservedProjectsCount = projects.filter(p => p.reservationDate && p.currentPhase !== 'completed').length;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Projects
  const filteredProjects = projects.filter((proj) => {
    if (projectStatusFilter === 'reserved') return proj.reservationDate && proj.currentPhase !== 'completed';
    if (projectStatusFilter === 'in_progress') return proj.currentPhase !== 'completed';
    if (projectStatusFilter === 'completed') return proj.currentPhase === 'completed' || proj.commissioningStatus === 'live';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Top Security Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAdmin}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Site</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Tonex Solar Operations</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Security Locked
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Security & Role Actions */}
          <div className="flex items-center gap-2.5">
            {/* Change Passcode Button */}
            <button
              onClick={() => setShowPasscodeModal(true)}
              title="Change Administrator Security Passcode"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Passcode Settings</span>
            </button>

            {/* Lock Session Button */}
            <button
              onClick={onLockSession}
              title="Lock Admin Session"
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium hidden md:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onChangeRole(e.target.value as Role)}
                className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
              >
                <option value="super_admin" className="bg-slate-900 text-white">Super Admin (All Privileges)</option>
                <option value="sales_manager" className="bg-slate-900 text-white">Sales Manager (CRM & Quotes)</option>
                <option value="solar_engineer" className="bg-slate-900 text-white">Solar Engineer (P.E. & PTO)</option>
                <option value="support_staff" className="bg-slate-900 text-white">Customer Support & Retention</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/60 pt-1">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
            { id: 'leads', label: `Leads CRM (${leads.length})`, icon: Users },
            { id: 'projects', label: `Installation Pipeline (${projects.length})`, icon: FolderKanban },
            { id: 'site_editor', label: 'Site & Brand Customizer', icon: Sliders },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'emails', label: `Automated Emails (${emails.length})`, icon: Mail },
            { id: 'team', label: 'Staff Roles & RBAC', icon: ShieldCheck },
            { id: 'export', label: 'Data Export & Cloud', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Pipeline Value</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ₱{(totalPipelineValue + totalActiveProjectsValue).toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Active proposals + signed contracts
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Reserved Installations</span>
                  <CalendarCheck2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {reservedProjectsCount} Scheduled
                </div>
                <span className="text-[11px] text-amber-400 mt-1 block">
                  Rooftop crew dates locked in
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Done & Certified Live</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {doneProjectsCount} Completed
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Passed inspection + Utility PTO
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Clean Capacity</span>
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {totalKWInPipeline.toFixed(1)} kW
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {conversionRate}% conversion rate
                </span>
              </div>
            </div>

            {/* Quick Installation Action Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-amber-950/40 to-slate-900 rounded-3xl border border-amber-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarCheck2 className="w-4 h-4" /> Installation Scheduling
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                    Admin Protected
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Reserve Physical Installation Date</h3>
                <p className="text-xs text-slate-300">
                  Assign licensed electrician crews, set rooftop installation date, record electrical permit numbers, and dispatch automated confirmation notices to clients.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const firstEligible = projects.find(p => p.currentPhase !== 'completed') || projects[0];
                      if (firstEligible) setReservingProject(firstEligible);
                      setActiveTab('projects');
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <HardHat className="w-4 h-4" /> Reserve Installation Now
                  </button>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-950/40 to-slate-900 rounded-3xl border border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Final Commissioning
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                    P.E. & Admin Sign-Off
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Certify Installation as Done (PTO)</h3>
                <p className="text-xs text-slate-300">
                  Mark solar installation as physically completed, record final city inspection pass & utility Permission to Operate (PTO), and dispatch celebration certificate.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const firstIncomplete = projects.find(p => p.currentPhase !== 'completed') || projects[0];
                      if (firstIncomplete) setCompletingProject(firstIncomplete);
                      setActiveTab('projects');
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" /> Mark Installation Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS CRM */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search client, email, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">All Stages</option>
                  <option value="new">New Inquiries</option>
                  <option value="contacted">Contacted</option>
                  <option value="survey_scheduled">Survey Scheduled</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="contract_signed">Contract Signed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                  <button
                    onClick={() => setLeadsViewMode('kanban')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      leadsViewMode === 'kanban' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setLeadsViewMode('table')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      leadsViewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Table
                  </button>
                </div>

                {permissions.canExportData && (
                  <button
                    onClick={() => exportLeadsCsv(leads)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Leads CSV
                  </button>
                )}
              </div>
            </div>

            {/* Kanban View */}
            {leadsViewMode === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {(
                  [
                    { id: 'new', title: 'New Inquiries', color: 'border-blue-500/50' },
                    { id: 'contacted', title: 'Contacted', color: 'border-indigo-500/50' },
                    { id: 'survey_scheduled', title: 'Survey Booked', color: 'border-amber-500/50' },
                    { id: 'proposal_sent', title: 'Proposal Sent', color: 'border-teal-500/50' },
                    { id: 'contract_signed', title: 'Contract Signed', color: 'border-emerald-500/50' },
                  ] as const
                ).map((col) => {
                  const stageLeads = filteredLeads.filter((l) => l.status === col.id);
                  return (
                    <div
                      key={col.id}
                      className={`bg-slate-900/90 rounded-2xl p-4 border-t-4 ${col.color} border border-slate-800 min-h-[480px] space-y-3 flex flex-col`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="font-bold text-xs text-white">{col.title}</span>
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-slate-800/90 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700 shadow-sm space-y-2 transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-xs text-white">{lead.clientName}</h4>
                              <span className="text-[10px] font-mono font-bold text-emerald-400">
                                ₱{(lead.estimatedGrossCost || 0).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 truncate">{lead.address}, {lead.city}</p>
                            
                            <div className="flex items-center justify-between text-[10px] text-slate-300">
                              <span>Bill: ₱{lead.avgMonthlyElectricBill}/mo</span>
                              <span className="font-bold text-amber-400">{lead.estimatedSystemSizeKW} kW</span>
                            </div>

                            {lead.notes && (
                              <p className="text-[10px] text-slate-400 line-clamp-2 bg-slate-900/60 p-1.5 rounded-md">
                                {lead.notes}
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1">
                              <button
                                onClick={() => handleDownloadLeadQuote(lead)}
                                title="Download Official PDF Proposal"
                                className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                              </button>

                              {lead.status !== 'contract_signed' && (
                                <button
                                  onClick={() => handleConvertLeadToProject(lead)}
                                  title="Advance & Convert to Signed Solar Project"
                                  className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Convert to Build
                                </button>
                              )}

                              {permissions.canDeleteRecords && (
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  title="Delete Lead"
                                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Contact & Location</th>
                      <th className="p-4">Electric Bill</th>
                      <th className="p-4">Sizing (kW)</th>
                      <th className="p-4">Estimated Value</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-white">{lead.clientName}</td>
                        <td className="p-4">
                          <div>{lead.email}</div>
                          <div className="text-slate-400 text-[11px]">{lead.city}, {lead.state}</div>
                        </td>
                        <td className="p-4 font-mono font-medium">₱{lead.avgMonthlyElectricBill}/mo</td>
                        <td className="p-4 font-mono font-bold text-amber-400">{lead.estimatedSystemSizeKW} kW</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">₱{lead.estimatedGrossCost.toLocaleString()}</td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="survey_scheduled">Survey Scheduled</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="contract_signed">Contract Signed</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDownloadLeadQuote(lead)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs font-semibold"
                          >
                            PDF Quote
                          </button>
                          {permissions.canDeleteRecords && (
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SOLAR PROJECTS & INSTALLATION PIPELINE */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Filter Installations:</span>
                <div className="flex gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setProjectStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      projectStatusFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    All ({projects.length})
                  </button>
                  <button
                    onClick={() => setProjectStatusFilter('reserved')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      projectStatusFilter === 'reserved' ? 'bg-amber-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Reserved ({reservedProjectsCount})
                  </button>
                  <button
                    onClick={() => setProjectStatusFilter('completed')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      projectStatusFilter === 'completed' ? 'bg-teal-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Done & PTO ({doneProjectsCount})
                  </button>
                </div>
              </div>

              {permissions.canExportData && (
                <button
                  onClick={() => exportProjectsCsv(projects)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Projects CSV
                </button>
              )}
            </div>

            {/* Project List */}
            <div className="space-y-4">
              {filteredProjects.map((proj) => {
                const isDone = proj.currentPhase === 'completed' || proj.commissioningStatus === 'live';
                const isReserved = !!proj.reservationDate && !isDone;

                return (
                  <div
                    key={proj.id}
                    className={`bg-slate-900 p-6 rounded-3xl border shadow-xl space-y-5 transition-all ${
                      isDone 
                        ? 'border-emerald-500/50 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20'
                        : isReserved
                        ? 'border-amber-500/50 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                            {proj.projectNumber}
                          </span>
                          
                          {/* Installation Status Badges */}
                          {isDone ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Installation Done • PTO Live
                            </span>
                          ) : isReserved ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <CalendarCheck2 className="w-3.5 h-3.5" /> Reserved: {proj.reservationDate}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              Phase: {proj.currentPhase.replace('_', ' ')}
                            </span>
                          )}

                          <span className="text-xs text-slate-400">Utility: {proj.utilityCompany}</span>
                        </div>

                        <h4 className="text-xl font-extrabold text-white mt-1.5">{proj.clientName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{proj.address}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Turnkey Value</span>
                        <span className="text-xl font-black text-white font-mono">
                          ₱{proj.contractValue.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-amber-400 block font-semibold">{proj.systemSizeKW} kW DC System</span>
                      </div>
                    </div>

                    {/* Hardware & Details Chips */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        📦 {proj.panelCount}x {proj.panelModel}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        ⚡ {proj.inverterModel}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        🔋 {proj.batteryStorage}
                      </span>
                      {proj.crewAssigned && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-amber-900/40">
                          👷 Crew: {proj.crewAssigned}
                        </span>
                      )}
                      {proj.permitNumber && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-emerald-900/50">
                          📜 Permit: {proj.permitNumber}
                        </span>
                      )}
                      {proj.ptoApprovalDate && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
                          ✓ PTO Approved: {proj.ptoApprovalDate}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar & Milestone */}
                    <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> 
                          {isDone ? 'Completed & Live on Net Metering' : `Current Phase: ${proj.currentPhase.replace('_', ' ')}`}
                        </span>
                        <span className="text-white font-mono">{proj.phaseProgressPercent}% Complete</span>
                      </div>

                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${proj.phaseProgressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Lead Engineer: <strong className="text-slate-200">{proj.assignedEngineer}</strong></span>
                        <span>
                          {isDone 
                            ? `Commissioned: ${proj.completedDate || 'Active'}`
                            : `Target Live Date: ${proj.targetCompletionDate}`}
                        </span>
                      </div>
                    </div>

                    {/* Admin Action Buttons (Reserve & Done Installation) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                      <p className="text-xs text-slate-400 italic">
                        {proj.notes}
                      </p>

                      <div className="flex items-center gap-2">
                        {/* 1. Reserve Installation Button */}
                        {!isDone && (
                          <button
                            onClick={() => setReservingProject(proj)}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <CalendarCheck2 className="w-4 h-4" />
                            <span>{proj.reservationDate ? 'Reschedule Install' : 'Reserve Installation'}</span>
                          </button>
                        )}

                        {/* 2. Mark Installation Done Button */}
                        {!isDone && permissions.canMarkInstallationDone && (
                          <button
                            onClick={() => setCompletingProject(proj)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Installation Done & PTO</span>
                          </button>
                        )}

                        {isDone && (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> 25-Year Warranty Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: EMBEDDED SITE & SOLAR CMS CUSTOMIZER (ADMIN ONLY) */}
        {activeTab === 'site_editor' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secured Administrator Controls
                  </div>
                  <h3 className="text-xl font-bold text-white">Live Site Branding, Header & Solar Details Editor</h3>
                  <p className="text-xs text-slate-400">
                    Changes made here directly modify the public-facing Tonex Solar Works website in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetEditor}
                    className="px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl border border-rose-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEditor}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Live Changes
                  </button>
                </div>
              </div>

              {editorSavedNotice && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Website branding and installation details updated live across all visitor sessions!</span>
                </div>
              )}

              {/* Sub-tabs */}
              <div className="flex border-b border-slate-800 gap-4">
                <button
                  type="button"
                  onClick={() => setEditorSubTab('brand')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    editorSubTab === 'brand' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  1. Company, Logo & Header
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSubTab('hero')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    editorSubTab === 'hero' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  2. Hero & Visual Background
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSubTab('solar')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    editorSubTab === 'solar' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  3. Solar Installation Details & Pricing
                </button>
              </div>

              {/* SUBTAB 1: Brand & Header */}
              {editorSubTab === 'brand' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={editorData.companyName}
                        onChange={(e) => setEditorData({ ...editorData, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company Tagline</label>
                      <input
                        type="text"
                        value={editorData.tagline}
                        onChange={(e) => setEditorData({ ...editorData, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Logo Icon Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Select Logo Icon</label>
                    <div className="grid grid-cols-5 gap-2.5">
                      {(
                        [
                          { id: 'sun', label: 'Sun', icon: Sun },
                          { id: 'zap', label: 'Zap', icon: Zap },
                          { id: 'shield', label: 'Shield', icon: Shield },
                          { id: 'flame', label: 'Flame', icon: Flame },
                          { id: 'leaf', label: 'Leaf', icon: Leaf },
                        ] as const
                      ).map((item) => {
                        const Icon = item.icon;
                        const isSelected = editorData.logoIcon === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setEditorData({ ...editorData, logoIcon: item.id })}
                            className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-amber-400 ring-1 ring-amber-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[11px] font-medium">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Announcement Banner */}
                  <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">Header Announcement Banner</label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editorData.showAnnouncement}
                          onChange={(e) => setEditorData({ ...editorData, showAnnouncement: e.target.checked })}
                          className="rounded-sm accent-amber-500"
                        />
                        <span>Enable Top Banner</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editorData.announcementText}
                      onChange={(e) => setEditorData({ ...editorData, announcementText: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editorData.phone}
                        onChange={(e) => setEditorData({ ...editorData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editorData.email}
                        onChange={(e) => setEditorData({ ...editorData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Electrical License (CSLB)</label>
                      <input
                        type="text"
                        value={editorData.licenseNumber}
                        onChange={(e) => setEditorData({ ...editorData, licenseNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Address</label>
                      <input
                        type="text"
                        value={editorData.address}
                        onChange={(e) => setEditorData({ ...editorData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: Hero Visuals */}
              {editorSubTab === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={editorData.heroBadge}
                      onChange={(e) => setEditorData({ ...editorData, heroBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Main Headline</label>
                    <input
                      type="text"
                      value={editorData.heroHeadline}
                      onChange={(e) => setEditorData({ ...editorData, heroHeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subheadline</label>
                    <textarea
                      rows={3}
                      value={editorData.heroSubheadline}
                      onChange={(e) => setEditorData({ ...editorData, heroSubheadline: e.target.value })}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  {/* Preset & Custom Background */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Hero Background Image Presets or Custom URL
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                      {PRESET_BACKGROUNDS.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setEditorData({ ...editorData, heroBackgroundUrl: preset.url })}
                          className={`cursor-pointer rounded-xl overflow-hidden border relative h-20 transition-all ${
                            editorData.heroBackgroundUrl === preset.url
                              ? 'border-amber-400 ring-2 ring-amber-400'
                              : 'border-slate-700 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 right-1 text-[9px] bg-slate-950/80 px-1 py-0.5 rounded text-white truncate text-center">
                            {preset.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <input
                      type="url"
                      value={editorData.heroBackgroundUrl}
                      onChange={(e) => setEditorData({ ...editorData, heroBackgroundUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Dark Overlay Opacity
                      </label>
                      <span className="text-xs font-mono text-amber-400">
                        {Math.round(editorData.heroOverlayOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="0.95"
                      step="0.05"
                      value={editorData.heroOverlayOpacity}
                      onChange={(e) => setEditorData({ ...editorData, heroOverlayOpacity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 3: Solar Installation Details & Pricing */}
              {editorSubTab === 'solar' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Turnkey Solar Cost Per Watt (₱/W)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="1.50"
                        max="5.00"
                        value={editorData.solarCostPerWatt}
                        onChange={(e) => setEditorData({ ...editorData, solarCostPerWatt: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-slate-400">Updates live customer quote pricing and PDF exports</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Module Efficiency (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="18.0"
                        max="25.0"
                        value={editorData.panelEfficiency}
                        onChange={(e) => setEditorData({ ...editorData, panelEfficiency: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Featured Solar Panel Model</label>
                      <input
                        type="text"
                        value={editorData.solarPanelBrand}
                        onChange={(e) => setEditorData({ ...editorData, solarPanelBrand: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Inverter Model</label>
                      <input
                        type="text"
                        value={editorData.inverterBrand}
                        onChange={(e) => setEditorData({ ...editorData, inverterBrand: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Battery Energy Storage Brand</label>
                      <input
                        type="text"
                        value={editorData.batteryBrand}
                        onChange={(e) => setEditorData({ ...editorData, batteryBrand: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Average Turnaround Weeks</label>
                      <input
                        type="text"
                        value={editorData.turnaroundWeeks}
                        onChange={(e) => setEditorData({ ...editorData, turnaroundWeeks: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Product Warranty (Years)</label>
                      <input
                        type="number"
                        value={editorData.warrantyYearsProduct}
                        onChange={(e) => setEditorData({ ...editorData, warrantyYearsProduct: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Workmanship & Leak Warranty (Years)</label>
                      <input
                        type="number"
                        value={editorData.warrantyYearsWorkmanship}
                        onChange={(e) => setEditorData({ ...editorData, warrantyYearsWorkmanship: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Active Service Territories</label>
                    <input
                      type="text"
                      value={editorData.serviceAreas}
                      onChange={(e) => setEditorData({ ...editorData, serviceAreas: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEditor}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Live Site Specifications
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: APPOINTMENTS & CALENDAR */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Client Appointment Bookings</h3>
                <p className="text-xs text-slate-400">Integrated with Google Calendar OAuth & automated email dispatch.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Book New Appointment
                </button>

                {permissions.canExportData && (
                  <button
                    onClick={() => exportAppointmentsCsv(appointments)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {apt.serviceType.replace('_', ' ')}
                      </span>
                      {apt.syncedToGoogleCalendar ? (
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          ✓ Google Synced
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Manual</span>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm">{apt.clientName}</h4>
                    <p className="text-xs text-slate-400">{apt.address}</p>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="text-amber-400 font-semibold">{apt.date}</div>
                      <div className="text-slate-300">{apt.timeSlot}</div>
                      <div className="text-slate-400 text-[11px]">Specialist: {apt.assignedStaff}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Email: {apt.clientEmail}</span>
                    <span className="font-semibold text-emerald-400 capitalize">{apt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUTOMATED EMAILS */}
        {activeTab === 'emails' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Automated Customer Notification Logs</h3>
                <p className="text-xs text-slate-400">Delivered notifications for appointment confirmations, proposal attachments, and project milestones.</p>
              </div>

              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                100% Delivery Rate
              </span>
            </div>

            <div className="space-y-3">
              {emails.map((em) => (
                <div
                  key={em.id}
                  onClick={() => setSelectedEmail(em)}
                  className="bg-slate-900 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{em.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                          {em.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        To: <strong className="text-slate-200">{em.recipientName}</strong> ({em.recipientEmail})
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{em.contentSnippet}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-[11px] text-slate-500">{new Date(em.sentAt).toLocaleDateString()}</span>
                    <span className="text-xs text-amber-400 group-hover:underline font-semibold flex items-center gap-1 mt-1">
                      <Eye className="w-3.5 h-3.5" /> Preview HTML
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Preview Modal */}
            {selectedEmail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Recipient:</span>
                      <h4 className="font-bold text-white text-sm">{selectedEmail.recipientName} ({selectedEmail.recipientEmail})</h4>
                    </div>
                    <button onClick={() => setSelectedEmail(null)} className="p-1 text-slate-400 hover:text-white">
                      ✕
                    </button>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Subject Line</span>
                    <div className="p-2.5 bg-slate-800 rounded-xl text-xs font-semibold text-white">
                      {selectedEmail.subject}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Delivered HTML Email Content</span>
                    <div 
                      className="p-5 bg-white text-slate-900 rounded-2xl text-xs leading-relaxed max-h-72 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.fullBodyHtml || selectedEmail.contentSnippet }}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STAFF ROLES & RBAC */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Custom Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-xs text-slate-400">
                Configure roles and individual team permissions. Switch your active staff role at any time in the header dropdown to verify permission gates.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Staff Role</th>
                      <th className="p-3 text-center">Customize Branding</th>
                      <th className="p-3 text-center">Reserve Install</th>
                      <th className="p-3 text-center">Mark Done & PTO</th>
                      <th className="p-3 text-center">Sign Contracts</th>
                      <th className="p-3 text-center">Export CRM Data</th>
                      <th className="p-3 text-center">Delete Records</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(
                      [
                        { role: 'super_admin', label: 'Super Admin', brand: true, res: true, done: true, sign: true, exp: true, del: true },
                        { role: 'sales_manager', label: 'Sales Manager', brand: false, res: true, done: false, sign: true, exp: true, del: false },
                        { role: 'solar_engineer', label: 'Solar Engineer', brand: false, res: true, done: true, sign: false, exp: false, del: false },
                        { role: 'support_staff', label: 'Customer Support', brand: false, res: false, done: false, sign: false, exp: false, del: false },
                      ] as const
                    ).map((r) => (
                      <tr key={r.role} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span>{r.label}</span>
                          {currentRole === r.role && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-sm">Active</span>
                          )}
                        </td>
                        <td className="p-3 text-center">{r.brand ? '✓' : '—'}</td>
                        <td className="p-3 text-center">{r.res ? '✓' : '—'}</td>
                        <td className="p-3 text-center">{r.done ? '✓' : '—'}</td>
                        <td className="p-3 text-center">{r.sign ? '✓' : '—'}</td>
                        <td className="p-3 text-center">{r.exp ? '✓' : '—'}</td>
                        <td className="p-3 text-center">{r.del ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Directory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {staff.map((member) => (
                <div key={member.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{member.name}</h4>
                      <span className="text-[10px] text-amber-400 capitalize">{member.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                    <div>{member.email}</div>
                    <div>{member.phone}</div>
                    <div className="text-slate-500">Territory: {member.assignedTerritory}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: DATA EXPORT & CLOUD BACKUP */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-base">Comprehensive Data Export & Secure Cloud Storage</h3>
              <p className="text-xs text-slate-400">
                Export all customer records, solar project pipelines, and appointment schedules in universal CSV and JSON formats for external accounting, CRM migrations, or executive reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Leads */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Solar Leads & Sizing Data</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Export all {leads.length} customer records including contact info, roof types, electric bills, and estimated quotes.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => exportLeadsCsv(leads)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Leads (CSV)
                  </button>
                  <button
                    onClick={() => exportToJson('Tonex_Leads_Full_Export', leads)}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Export Leads (JSON)
                  </button>
                </div>
              </div>

              {/* Card 2: Projects */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Solar Project Lifecycle Pipeline</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Export all {projects.length} installation projects with engineering stamps, permit IDs, and equipment breakdowns.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => exportProjectsCsv(projects)}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Projects (CSV)
                  </button>
                  <button
                    onClick={() => exportToJson('Tonex_Projects_Full_Export', projects)}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Export Projects (JSON)
                  </button>
                </div>
              </div>

              {/* Card 3: Appointments */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Appointment Schedules</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Export all {appointments.length} scheduled surveys and Google Calendar synchronized meetings.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => exportAppointmentsCsv(appointments)}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Appointments (CSV)
                  </button>
                  <button
                    onClick={() => exportToJson('Tonex_Appointments_Full_Export', appointments)}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Export Appointments (JSON)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: RESERVE INSTALLATION MODAL */}
      {reservingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Reserve Physical Installation Date</h3>
                  <span className="text-xs text-amber-400">Project #{reservingProject.projectNumber} • {reservingProject.clientName}</span>
                </div>
              </div>
              <button onClick={() => setReservingProject(null)} className="p-1 text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Installation Date *</label>
                <input
                  type="date"
                  required
                  value={reserveDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReserveDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Installation Crew *</label>
                <select
                  value={reserveCrew}
                  onChange={(e) => setReserveCrew(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Crew Alpha - Irvine Master Electricians">Crew Alpha - Irvine Master Electricians (Lead: Ray Vance)</option>
                  <option value="Crew Bravo - Inland Commercial & Heavy Solar">Crew Bravo - Inland Commercial (Lead: David Chen, P.E.)</option>
                  <option value="Residential Gold Team - Coastal Roofs">Residential Gold Team - Coastal Roofs (Lead: Carlos Ramos)</option>
                  <option value="Battery Storage Specialized Crew">Battery Storage Specialized Crew (Tesla & Enphase Certified)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City / County Electrical Permit Number</label>
                <input
                  type="text"
                  placeholder="e.g. BLD-2026-9812"
                  value={reservePermit || reservingProject.permitNumber || ''}
                  onChange={(e) => setReservePermit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Logistics / Staging Notes</label>
                <textarea
                  rows={2}
                  placeholder="E.g., Solar racking staged on driveway. 200A main service panel upgrade scheduled for morning."
                  value={reserveNotes}
                  onChange={(e) => setReserveNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/60 text-[11px] text-amber-300">
                📧 Submitting will automatically dispatch an official <strong>Installation Date Reserved</strong> notification email to the client with arrival windows and equipment verification.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReservingProject(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <CalendarCheck2 className="w-4 h-4" /> Confirm Installation Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MARK INSTALLATION DONE & PTO MODAL */}
      {completingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Certify Solar Installation as Done</h3>
                  <span className="text-xs text-emerald-400">Project #{completingProject.projectNumber} • {completingProject.clientName}</span>
                </div>
              </div>
              <button onClick={() => setCompletingProject(null)} className="p-1 text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmDoneInstallation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Physical Completion Date *</label>
                  <input
                    type="date"
                    required
                    value={doneDate}
                    onChange={(e) => setDoneDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City Inspection Date *</label>
                  <input
                    type="date"
                    required
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Utility PTO (Permission to Operate) Date *</label>
                <input
                  type="date"
                  required
                  value={ptoDate}
                  onChange={(e) => setPtoDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Engineering Sign-off & Commissioning Notes</label>
                <textarea
                  rows={2}
                  placeholder="E.g., City of Irvine signed yellow tag. Inverter rapid shutdown verified. Utility bi-directional meter energized."
                  value={doneNotes}
                  onChange={(e) => setDoneNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-[11px] text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What happens when you certify:
                </div>
                <p>• System status advances to 100% Completed & Live</p>
                <p>• 25-Year Triple Warranty is locked in and activated</p>
                <p>• Client celebration email with PTO certificate is dispatched automatically</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingProject(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Certify Installation Done & PTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CHANGE SECURITY PASSCODE MODAL */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" /> Change Admin Passcode
              </h3>
              <button onClick={() => setShowPasscodeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {passcodeSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500 rounded-2xl text-center text-xs text-emerald-300 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold">Admin Passcode Updated Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePasscode} className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Current Active Passcode</span>
                  <div className="font-mono text-xs bg-slate-800 p-2 rounded-lg text-emerald-400">
                    {StorageService.getAdminPasscode()}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Security Passcode (PIN or word) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5588 or solar2026"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Minimum 4 alphanumeric characters</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasscodeModal(false)}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                  >
                    Save Passcode
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
