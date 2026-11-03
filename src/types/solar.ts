export type Role = 'super_admin' | 'sales_manager' | 'solar_engineer' | 'support_staff';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  assignedTerritory: string;
  activeStatus: 'active' | 'busy' | 'offline';
}

export type LeadStatus = 'new' | 'contacted' | 'survey_scheduled' | 'proposal_sent' | 'contract_signed' | 'lost';
export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'agricultural';
export type RoofType = 'asphalt_shingle' | 'tile' | 'metal' | 'flat' | 'other';

export interface SolarLead {
  id: string;
  createdAt: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  roofType: RoofType;
  avgMonthlyElectricBill: number;
  estimatedSystemSizeKW: number;
  estimatedGrossCost: number;
  estimatedNetCost: number;
  status: LeadStatus;
  assignedStaffId?: string;
  notes?: string;
  preferredTimeline?: string;
  source: 'booking_calendar' | 'contact_form' | 'phone_inquiry' | 'referral';
}

export type ProjectPhase = 
  | 'site_survey' 
  | 'engineering_permitting' 
  | 'procurement' 
  | 'installation' 
  | 'inspection_pto' 
  | 'completed';

export interface SolarProject {
  id: string;
  leadId?: string;
  projectNumber: string;
  clientName: string;
  address: string;
  systemSizeKW: number;
  panelCount: number;
  panelModel: string;
  inverterModel: string;
  batteryStorage: string; // e.g. "None", "1x Tesla Powerwall 3 (13.5kWh)", "2x Enphase 5P"
  contractValue: number;
  currentPhase: ProjectPhase;
  phaseProgressPercent: number;
  permitNumber?: string;
  utilityCompany: string;
  targetCompletionDate: string;
  assignedEngineer: string;
  crewAssigned?: string;
  reservationDate?: string; // Scheduled installation date
  completedDate?: string;   // Date physical installation was completed
  inspectionDate?: string;
  ptoApprovalDate?: string; // Date utility granted PTO
  commissioningStatus?: 'reserved' | 'in_progress' | 'installation_done' | 'pto_approved' | 'live';
  notes: string;
  updatedAt: string;
}

export type ServiceType = 
  | 'roof_survey' 
  | 'virtual_consult' 
  | 'battery_storage' 
  | 'maintenance_check';

export interface Appointment {
  id: string;
  serviceType: ServiceType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 11:00 AM"
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  assignedStaff: string;
  notes?: string;
  googleCalendarEventId?: string;
  syncedToGoogleCalendar: boolean;
  createdAt: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'appointment_confirmation' | 'proposal_ready' | 'appointment_reminder' | 'project_milestone';
  sentAt: string;
  status: 'sent' | 'delivered' | 'pending';
  contentSnippet: string;
  fullBodyHtml?: string;
}

export interface SolarQuoteCalculation {
  monthlyBill: number;
  recommendedSizeKW: number;
  panelCount: number;
  annualProductionKWh: number;
  grossCost: number;
  federalTaxCredit30: number;
  localRebates: number;
  netCost: number;
  estimatedYearlySavings: number;
  estimated25YearSavings: number;
  paybackYears: number;
  co2OffsetTonsPerYear: number;
  treesEquivalent: number;
  batterySelected: boolean;
  batteryCost: number;
  batteryModel: string;
}

export interface SiteConfiguration {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  announcementText: string;
  showAnnouncement: boolean;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBackgroundUrl: string;
  heroOverlayOpacity: number; // 0 to 1
  accentTheme: 'emerald' | 'amber' | 'cyan' | 'slate';
  // Installation details
  solarCostPerWatt: number; // default e.g. 2.85
  panelEfficiency: number; // e.g. 22.8%
  solarPanelBrand: string; // e.g. "REC Alpha Pure-R 430W"
  inverterBrand: string; // e.g. "Enphase IQ8+ Microinverters"
  batteryBrand: string; // e.g. "Tesla Powerwall 3 & Enphase IQ"
  warrantyYearsProduct: number; // e.g. 25
  warrantyYearsWorkmanship: number; // e.g. 15
  turnaroundWeeks: string; // e.g. "2 to 4 weeks"
  serviceAreas: string; // e.g. "California, Arizona, Nevada & Texas"
  logoIcon: 'sun' | 'zap' | 'shield' | 'flame' | 'leaf';
}
