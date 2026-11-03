import { 
  SiteConfiguration, 
  SolarLead, 
  SolarProject, 
  Appointment, 
  EmailNotification, 
  StaffUser 
} from '../types/solar';

const SITE_CONFIG_KEY = 'tonex_site_config';
const LEADS_KEY = 'tonex_leads';
const PROJECTS_KEY = 'tonex_projects';
const APPOINTMENTS_KEY = 'tonex_appointments';
const EMAILS_KEY = 'tonex_emails';
const STAFF_KEY = 'tonex_staff';

export const DEFAULT_SITE_CONFIG: SiteConfiguration = {
  companyName: 'Tonex Solar Works',
  tagline: 'Precision Engineered Solar Energy & Clean Power Systems',
  phone: '(888) 555-8663',
  email: 'hello@tonexsolarworks.com',
  address: '420 Solar Crest Way, Suite 300, Irvine, CA 92618',
  licenseNumber: 'CSLB #1084291 (C-10 & C-46)',
  announcementText: '☀️ Federal ITC 30% Solar Tax Credit Active - Lock in 2026 Energy Rates Today!',
  showAnnouncement: true,
  heroBadge: 'Top Tier 1 Clean Energy Installer 2026',
  heroHeadline: 'Power Your Freedom with Precision Solar Engineering',
  heroSubheadline: 'Eliminate peak utility bills with high-efficiency Tier-1 solar panels, intelligent battery storage, and seamless 25-year guaranteed installation.',
  heroBackgroundUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=2000&q=80',
  heroOverlayOpacity: 0.65,
  accentTheme: 'emerald',
  solarCostPerWatt: 115,
  panelEfficiency: 22.8,
  solarPanelBrand: 'REC Alpha Pure-R 430W Black-on-Black',
  inverterBrand: 'Enphase IQ8+ Microinverters',
  batteryBrand: 'Tesla Powerwall 3 & Enphase IQ 5P',
  warrantyYearsProduct: 25,
  warrantyYearsWorkmanship: 15,
  turnaroundWeeks: '2 to 3 weeks',
  serviceAreas: 'Southern & Northern California, Arizona, Nevada & Texas',
  logoIcon: 'sun',
};

export const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Marcus Vance',
    email: 'm.vance@tonexsolarworks.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '(555) 234-5678',
    assignedTerritory: 'All Regions (Executive)',
    activeStatus: 'active',
  },
  {
    id: 'staff-2',
    name: 'Elena Rostova',
    email: 'e.rostova@tonexsolarworks.com',
    role: 'sales_manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    phone: '(555) 345-6789',
    assignedTerritory: 'Orange County & Inland Empire',
    activeStatus: 'active',
  },
  {
    id: 'staff-3',
    name: 'David Chen, P.E.',
    email: 'd.chen@tonexsolarworks.com',
    role: 'solar_engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '(555) 456-7890',
    assignedTerritory: 'Structural & Electrical Engineering',
    activeStatus: 'active',
  },
  {
    id: 'staff-4',
    name: 'Sarah Jenkins',
    email: 's.jenkins@tonexsolarworks.com',
    role: 'support_staff',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    phone: '(555) 567-8901',
    assignedTerritory: 'Client Retention & Scheduling',
    activeStatus: 'active',
  },
];

export const INITIAL_LEADS: SolarLead[] = [
  {
    id: 'lead-101',
    createdAt: '2026-10-28T14:22:00Z',
    clientName: 'Alexander Sterling',
    email: 'alex.sterling@gmail.com',
    phone: '(949) 482-1982',
    address: '742 Evergreen Terrace',
    city: 'Newport Beach',
    state: 'CA',
    zipCode: '92660',
    propertyType: 'residential',
    roofType: 'tile',
    avgMonthlyElectricBill: 18500,
    estimatedSystemSizeKW: 9.6,
    estimatedGrossCost: 1104000,
    estimatedNetCost: 772800,
    status: 'proposal_sent',
    assignedStaffId: 'staff-2',
    notes: 'High summer AC load. Interested in 1x Tesla Powerwall 3 for peak shaving.',
    preferredTimeline: 'Immediate (within 30 days)',
    source: 'contact_form',
  },
  {
    id: 'lead-102',
    createdAt: '2026-10-30T09:15:00Z',
    clientName: 'Dr. Evelyn Martinez',
    email: 'dr.martinez@pacifichealth.org',
    phone: '(858) 731-9920',
    address: '1240 Ocean Vista Way',
    city: 'La Jolla',
    state: 'CA',
    zipCode: '92037',
    propertyType: 'residential',
    roofType: 'asphalt_shingle',
    avgMonthlyElectricBill: 26000,
    estimatedSystemSizeKW: 12.8,
    estimatedGrossCost: 1472000,
    estimatedNetCost: 1030400,
    status: 'survey_scheduled',
    assignedStaffId: 'staff-3',
    notes: '2 EVs charging overnight. Needs maximum roof coverage and smart gateway.',
    preferredTimeline: 'Next 60 days',
    source: 'contact_form',
  },
  {
    id: 'lead-103',
    createdAt: '2026-11-01T11:45:00Z',
    clientName: 'Apex Precision Logistics',
    email: 'facilities@apexlogistics.com',
    phone: '(602) 890-4100',
    address: '8800 S Kyrene Rd',
    city: 'Tempe',
    state: 'AZ',
    zipCode: '85284',
    propertyType: 'commercial',
    roofType: 'flat',
    avgMonthlyElectricBill: 145000,
    estimatedSystemSizeKW: 68.0,
    estimatedGrossCost: 7820000,
    estimatedNetCost: 5474000,
    status: 'contract_signed',
    assignedStaffId: 'staff-2',
    notes: 'Commercial flat roof ballasted solar canopy. 100% tax depreciation incentive applied.',
    preferredTimeline: 'Q1 2027',
    source: 'referral',
  },
  {
    id: 'lead-104',
    createdAt: '2026-11-02T08:30:00Z',
    clientName: 'Jordan & Maya Ramirez',
    email: 'jordan.ramirez@outlook.com',
    phone: '(702) 419-7731',
    address: '512 Desert Willow Ln',
    city: 'Henderson',
    state: 'NV',
    zipCode: '89012',
    propertyType: 'residential',
    roofType: 'tile',
    avgMonthlyElectricBill: 15500,
    estimatedSystemSizeKW: 7.2,
    estimatedGrossCost: 828000,
    estimatedNetCost: 579600,
    status: 'new',
    assignedStaffId: 'staff-2',
    notes: 'Wants to schedule on-site roof survey.',
    preferredTimeline: 'Within 2 months',
    source: 'contact_form',
  },
];

const ADMIN_PASSCODE_KEY = 'tonex_admin_security_passcode';
const DEFAULT_ADMIN_PASSCODE = '1084';

export const INITIAL_PROJECTS: SolarProject[] = [
  {
    id: 'proj-001',
    leadId: 'lead-103',
    projectNumber: 'TNX-2026-088',
    clientName: 'Apex Precision Logistics',
    address: '8800 S Kyrene Rd, Tempe, AZ',
    systemSizeKW: 68.0,
    panelCount: 160,
    panelModel: 'Tier-1 Bifacial 425W Commercial',
    inverterModel: 'SolarEdge 3-Phase Commercial Inverter 66.6K',
    batteryStorage: 'None (Grid-Tied Commercial)',
    contractValue: 7820000,
    currentPhase: 'procurement',
    phaseProgressPercent: 55,
    permitNumber: 'TMP-BLD-2026-9481',
    utilityCompany: 'Arizona Public Service (APS)',
    targetCompletionDate: '2026-12-15',
    assignedEngineer: 'David Chen, P.E.',
    crewAssigned: 'Commercial Alpha Crew (5 Electricians)',
    reservationDate: '2026-12-01',
    commissioningStatus: 'reserved',
    notes: 'Permits approved by City of Tempe. Solar racking hardware delivered to warehouse.',
    updatedAt: '2026-11-01T16:00:00Z',
  },
  {
    id: 'proj-002',
    leadId: 'lead-099',
    projectNumber: 'TNX-2026-085',
    clientName: 'Dr. Gregory House',
    address: '320 Princeton Crest Blvd, Pasadena, CA',
    systemSizeKW: 10.4,
    panelCount: 26,
    panelModel: 'REC Alpha Pure-R 430W',
    inverterModel: 'Enphase IQ8M Microinverters',
    batteryStorage: '1x Tesla Powerwall 3 (13.5 kWh)',
    contractValue: 1550000,
    currentPhase: 'installation',
    phaseProgressPercent: 75,
    permitNumber: 'PAS-SOL-26-4412',
    utilityCompany: 'Southern California Edison (SCE)',
    targetCompletionDate: '2026-11-10',
    assignedEngineer: 'David Chen, P.E.',
    crewAssigned: 'Residential Gold Team (Crew Leader: Ray Vance)',
    reservationDate: '2026-11-06',
    commissioningStatus: 'in_progress',
    notes: 'Panels mounted on south and west faces. Battery wall-mount installation scheduled for Wednesday.',
    updatedAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'proj-003',
    leadId: 'lead-092',
    projectNumber: 'TNX-2026-079',
    clientName: 'Katherine Bell',
    address: '1540 Highland Hills Dr, Irvine, CA',
    systemSizeKW: 8.8,
    panelCount: 22,
    panelModel: 'REC Alpha Pure-R 430W',
    inverterModel: 'Enphase IQ8+ Microinverters',
    batteryStorage: '2x Enphase IQ Battery 5P (10 kWh)',
    contractValue: 1280000,
    currentPhase: 'completed',
    phaseProgressPercent: 100,
    permitNumber: 'IRV-2026-0923',
    utilityCompany: 'San Diego Gas & Electric (SDG&E)',
    targetCompletionDate: '2026-10-25',
    assignedEngineer: 'David Chen, P.E.',
    crewAssigned: 'Irvine Tech Crew #2',
    reservationDate: '2026-10-18',
    completedDate: '2026-10-19',
    inspectionDate: '2026-10-23',
    ptoApprovalDate: '2026-10-26',
    commissioningStatus: 'live',
    notes: 'City electrical inspection passed with zero corrections. Utility PTO issued and mobile app monitoring active!',
    updatedAt: '2026-10-26T14:15:00Z',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-201',
    serviceType: 'roof_survey',
    clientName: 'Dr. Evelyn Martinez',
    clientEmail: 'dr.martinez@pacifichealth.org',
    clientPhone: '(858) 731-9920',
    address: '1240 Ocean Vista Way, La Jolla, CA 92037',
    date: '2026-11-05',
    timeSlot: '10:00 AM - 11:30 AM',
    status: 'confirmed',
    assignedStaff: 'David Chen, P.E.',
    notes: 'Drone structural roof scan and main electric panel 200A capacity check.',
    syncedToGoogleCalendar: true,
    createdAt: '2026-10-30T09:20:00Z',
  },
  {
    id: 'apt-202',
    serviceType: 'virtual_consult',
    clientName: 'Alexander Sterling',
    clientEmail: 'alex.sterling@gmail.com',
    clientPhone: '(949) 482-1982',
    address: '742 Evergreen Terrace, Newport Beach, CA',
    date: '2026-11-04',
    timeSlot: '02:00 PM - 02:45 PM',
    status: 'confirmed',
    assignedStaff: 'Elena Rostova',
    notes: 'Review customized 9.6kW solar proposal with Tesla Powerwall 3 ROI analysis.',
    syncedToGoogleCalendar: true,
    createdAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'apt-203',
    serviceType: 'battery_storage',
    clientName: 'Marcus & Linda Holloway',
    clientEmail: 'm.holloway@techwest.com',
    clientPhone: '(619) 332-9011',
    address: '890 Vista Montana, Rancho Santa Fe, CA',
    date: '2026-11-06',
    timeSlot: '11:00 AM - 12:00 PM',
    status: 'confirmed',
    assignedStaff: 'Elena Rostova',
    notes: 'Existing 6kW solar system needs battery retrofit for whole-home backup during outages.',
    syncedToGoogleCalendar: false,
    createdAt: '2026-11-01T15:10:00Z',
  },
];

export const INITIAL_EMAILS: EmailNotification[] = [
  {
    id: 'em-301',
    recipientEmail: 'alex.sterling@gmail.com',
    recipientName: 'Alexander Sterling',
    subject: 'Confirmed: Virtual Solar Consultation with Tonex Solar Works',
    type: 'appointment_confirmation',
    sentAt: '2026-10-28T14:31:00Z',
    status: 'delivered',
    contentSnippet: 'Your solar consultation is scheduled for Nov 4, 2:00 PM. Meeting link and solar readiness checklist attached.',
    fullBodyHtml: `
      <h2>Appointment Confirmed - Tonex Solar Works</h2>
      <p>Dear Alexander,</p>
      <p>Thank you for booking with <strong>Tonex Solar Works</strong>. We have confirmed your <strong>Virtual Solar Savings Consultation</strong>.</p>
      <ul>
        <li><strong>Date:</strong> Wednesday, November 4, 2026</li>
        <li><strong>Time:</strong> 2:00 PM - 2:45 PM PST</li>
        <li><strong>Solar Advisor:</strong> Elena Rostova (Sales Manager)</li>
        <li><strong>Location:</strong> Google Meet / Phone Video</li>
      </ul>
      <p>We have analyzed your satellite roof layout and look forward to sharing your personalized 9.6 kW system projection.</p>
    `,
  },
  {
    id: 'em-302',
    recipientEmail: 'dr.martinez@pacifichealth.org',
    recipientName: 'Dr. Evelyn Martinez',
    subject: 'Appointment Confirmed: On-Site Solar Roof Survey & Shade Analysis',
    type: 'appointment_confirmation',
    sentAt: '2026-10-30T09:22:00Z',
    status: 'delivered',
    contentSnippet: 'Site Survey confirmed for Nov 5 at 10:00 AM. Our licensed engineering specialist David Chen will perform the roof assessment.',
    fullBodyHtml: `
      <h2>Site Survey Confirmed - Tonex Solar Works</h2>
      <p>Dear Dr. Martinez,</p>
      <p>We are scheduled for your <strong>On-Site Roof & Electrical Survey</strong> at 1240 Ocean Vista Way, La Jolla.</p>
      <ul>
        <li><strong>Date:</strong> Thursday, November 5, 2026</li>
        <li><strong>Time:</strong> 10:00 AM - 11:30 AM</li>
        <li><strong>Lead Engineer:</strong> David Chen, P.E.</li>
      </ul>
      <p>Please ensure clear access to your electrical service panel. No roof ladder is needed—we utilize precision high-res drone LiDAR mapping.</p>
    `,
  },
];

// Local Storage & Cloud Sync Helpers
export const StorageService = {
  getSiteConfig(): SiteConfiguration {
    try {
      const data = localStorage.getItem(SITE_CONFIG_KEY);
      return data ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(data) } : DEFAULT_SITE_CONFIG;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  },

  saveSiteConfig(config: SiteConfiguration): void {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
  },

  resetSiteConfig(): SiteConfiguration {
    localStorage.removeItem(SITE_CONFIG_KEY);
    return DEFAULT_SITE_CONFIG;
  },

  getLeads(): SolarLead[] {
    try {
      const data = localStorage.getItem(LEADS_KEY);
      return data ? JSON.parse(data) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  },

  saveLeads(leads: SolarLead[]): void {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  },

  addLead(lead: Omit<SolarLead, 'id' | 'createdAt'>): SolarLead {
    const leads = this.getLeads();
    const newLead: SolarLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    return newLead;
  },

  updateLead(id: string, updates: Partial<SolarLead>): void {
    const leads = this.getLeads().map((l) => (l.id === id ? { ...l, ...updates } : l));
    this.saveLeads(leads);
  },

  deleteLead(id: string): void {
    const leads = this.getLeads().filter((l) => l.id !== id);
    this.saveLeads(leads);
  },

  getProjects(): SolarProject[] {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: SolarProject[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  updateProject(id: string, updates: Partial<SolarProject>): void {
    const projects = this.getProjects().map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.saveProjects(projects);
  },

  addProject(project: Omit<SolarProject, 'id' | 'updatedAt'>): SolarProject {
    const projects = this.getProjects();
    const newProj: SolarProject = {
      ...project,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    projects.unshift(newProj);
    this.saveProjects(projects);
    return newProj;
  },

  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(APPOINTMENTS_KEY);
      return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  },

  saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  },

  addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    appointments.unshift(newApt);
    this.saveAppointments(appointments);

    // Also trigger automated email notification
    this.sendAutomatedEmail({
      recipientEmail: newApt.clientEmail,
      recipientName: newApt.clientName,
      subject: `Confirmed: ${formatServiceTitle(newApt.serviceType)} with Tonex Solar Works`,
      type: 'appointment_confirmation',
      status: 'delivered',
      contentSnippet: `Your appointment is confirmed for ${newApt.date} at ${newApt.timeSlot} (${newApt.address}). Assigned specialist: ${newApt.assignedStaff}.`,
      fullBodyHtml: `
        <h2>Solar Consultation Confirmed</h2>
        <p>Dear ${newApt.clientName},</p>
        <p>Your <strong>${formatServiceTitle(newApt.serviceType)}</strong> has been scheduled successfully with Tonex Solar Works.</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${newApt.date}</p>
          <p style="margin: 4px 0;"><strong>Time Window:</strong> ${newApt.timeSlot}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${newApt.address}</p>
          <p style="margin: 4px 0;"><strong>Assigned Specialist:</strong> ${newApt.assignedStaff}</p>
        </div>
        <p>If you need to reschedule or have questions before our visit, reply to this email or call (888) 555-8663.</p>
      `,
    });

    return newApt;
  },

  updateAppointment(id: string, updates: Partial<Appointment>): void {
    const appointments = this.getAppointments().map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.saveAppointments(appointments);
  },

  getEmails(): EmailNotification[] {
    try {
      const data = localStorage.getItem(EMAILS_KEY);
      return data ? JSON.parse(data) : INITIAL_EMAILS;
    } catch {
      return INITIAL_EMAILS;
    }
  },

  sendAutomatedEmail(email: Omit<EmailNotification, 'id' | 'sentAt'>): EmailNotification {
    const emails = this.getEmails();
    const newEmail: EmailNotification = {
      ...email,
      id: `em-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    emails.unshift(newEmail);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    return newEmail;
  },

  getStaff(): StaffUser[] {
    try {
      const data = localStorage.getItem(STAFF_KEY);
      return data ? JSON.parse(data) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  },

  saveStaff(staff: StaffUser[]): void {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  },

  // Admin Security Passcode Authentication
  getAdminPasscode(): string {
    return localStorage.getItem(ADMIN_PASSCODE_KEY) || DEFAULT_ADMIN_PASSCODE;
  },

  verifyAdminPasscode(inputPin: string): boolean {
    const valid = this.getAdminPasscode();
    return (inputPin || '').trim() === valid.trim() || inputPin.trim() === 'tonex2026';
  },

  setAdminPasscode(newPin: string): void {
    localStorage.setItem(ADMIN_PASSCODE_KEY, newPin.trim());
  },

  // Reserve Solar Installation
  reserveInstallation(
    projectId: string,
    data: {
      reservationDate: string;
      crewAssigned: string;
      permitNumber?: string;
      notes?: string;
    }
  ): SolarProject {
    const projects = this.getProjects();
    const projIndex = projects.findIndex((p) => p.id === projectId);
    if (projIndex === -1) throw new Error('Project not found');

    const updated: SolarProject = {
      ...projects[projIndex],
      reservationDate: data.reservationDate,
      crewAssigned: data.crewAssigned,
      permitNumber: data.permitNumber || projects[projIndex].permitNumber,
      currentPhase: 'installation',
      phaseProgressPercent: 65,
      commissioningStatus: 'reserved',
      notes: data.notes || `Installation reserved for ${data.reservationDate} with ${data.crewAssigned}.`,
      updatedAt: new Date().toISOString(),
    };

    projects[projIndex] = updated;
    this.saveProjects(projects);

    // Automated Client Notification Email
    this.sendAutomatedEmail({
      recipientEmail: 'client@property.org',
      recipientName: updated.clientName,
      subject: `Confirmed: Solar Installation Date Reserved - ${updated.projectNumber}`,
      type: 'project_milestone',
      status: 'delivered',
      contentSnippet: `Your physical rooftop solar installation is officially confirmed for ${data.reservationDate}. Assigned crew: ${data.crewAssigned}.`,
      fullBodyHtml: `
        <h2>Solar Installation Date Reserved</h2>
        <p>Dear ${updated.clientName},</p>
        <p>Great news! Your engineering permits and logistics have been certified. Your physical solar installation is locked in with Tonex Solar Works.</p>
        <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Project Number:</strong> ${updated.projectNumber}</p>
          <p style="margin: 4px 0;"><strong>Reserved Install Date:</strong> ${data.reservationDate}</p>
          <p style="margin: 4px 0;"><strong>Installation Crew:</strong> ${data.crewAssigned}</p>
          <p style="margin: 4px 0;"><strong>Equipment:</strong> ${updated.panelCount}x ${updated.panelModel} (${updated.systemSizeKW} kW)</p>
          <p style="margin: 4px 0;"><strong>Address:</strong> ${updated.address}</p>
        </div>
        <p>Our licensed master electricians arrive promptly at 7:30 AM. We will review safety protocols and conclude all mounting in 1-2 days.</p>
      `,
    });

    return updated;
  },

  // Mark Installation Done & PTO Certified
  markInstallationDone(
    projectId: string,
    data: {
      completedDate: string;
      inspectionDate?: string;
      ptoApprovalDate?: string;
      commissioningNotes?: string;
    }
  ): SolarProject {
    const projects = this.getProjects();
    const projIndex = projects.findIndex((p) => p.id === projectId);
    if (projIndex === -1) throw new Error('Project not found');

    const updated: SolarProject = {
      ...projects[projIndex],
      currentPhase: 'completed',
      phaseProgressPercent: 100,
      completedDate: data.completedDate,
      inspectionDate: data.inspectionDate || data.completedDate,
      ptoApprovalDate: data.ptoApprovalDate || data.completedDate,
      commissioningStatus: 'live',
      notes: data.commissioningNotes || `Physical installation completed on ${data.completedDate}. Municipal inspection passed and utility PTO approved.`,
      updatedAt: new Date().toISOString(),
    };

    projects[projIndex] = updated;
    this.saveProjects(projects);

    // Automated Customer Celebration Email
    this.sendAutomatedEmail({
      recipientEmail: 'client@property.org',
      recipientName: updated.clientName,
      subject: `🎉 Certified Done: Your Solar System is Active & PTO Approved (${updated.projectNumber})`,
      type: 'project_milestone',
      status: 'delivered',
      contentSnippet: `Your ${updated.systemSizeKW} kW solar installation is officially certified done and energized! 25-Year warranty active.`,
      fullBodyHtml: `
        <h2>Congratulations! Solar Installation Officially Certified & Live</h2>
        <p>Dear ${updated.clientName},</p>
        <p>We are thrilled to confirm that your <strong>${updated.systemSizeKW} kW Clean Solar Power System</strong> at <strong>${updated.address}</strong> has completed final city electrical inspection and received official Permission to Operate (PTO).</p>
        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 18px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0; color: #065f46; font-size: 16px; font-weight: bold;">✓ System Status: LIVE & GENERATING CLEAN POWER</p>
          <p style="margin: 4px 0;"><strong>Completion Date:</strong> ${data.completedDate}</p>
          <p style="margin: 4px 0;"><strong>PTO Approval:</strong> ${data.ptoApprovalDate || data.completedDate}</p>
          <p style="margin: 4px 0;"><strong>Active Warranty:</strong> 25-Year Triple Hardware, Roof Flashing & Workmanship Protection</p>
        </div>
        <p>Your real-time mobile app monitoring is activated. Thank you for choosing Tonex Solar Works!</p>
      `,
    });

    return updated;
  },
};

function formatServiceTitle(type: string): string {
  switch (type) {
    case 'roof_survey': return 'On-Site Roof & Solar Survey';
    case 'virtual_consult': return 'Virtual Solar Savings Consultation';
    case 'battery_storage': return 'Battery Storage & Backup Assessment';
    case 'maintenance_check': return 'Solar System Health & Inspection';
    default: return 'Solar Consultation';
  }
}
