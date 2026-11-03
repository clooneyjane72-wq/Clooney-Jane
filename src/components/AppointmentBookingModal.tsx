import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Mail, 
  Phone, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Download,
  Sparkles
} from 'lucide-react';
import { ServiceType, SiteConfiguration, Appointment } from '../types/solar';
import { StorageService } from '../services/storage';
import { 
  googleSignIn, 
  getAccessToken, 
  createGoogleCalendarEvent, 
  generateGoogleCalendarLink,
  downloadIcsFile,
  initAuth 
} from '../services/firebaseAuth';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfiguration;
  initialService?: ServiceType;
  initialAddress?: string;
  initialName?: string;
  initialEmail?: string;
  onAppointmentBooked?: (apt: Appointment) => void;
}

const SERVICES = [
  {
    id: 'roof_survey' as ServiceType,
    title: 'On-Site Roof & Solar Survey',
    duration: '60 min',
    desc: 'High-res drone LiDAR mapping, roof condition check, and main service panel audit.',
    badge: 'Most Popular',
  },
  {
    id: 'virtual_consult' as ServiceType,
    title: 'Virtual Solar Savings Consultation',
    duration: '30 min',
    desc: 'Satellite roof analysis, custom 3D solar layout, and exact financial ROI breakdown.',
    badge: 'Instant & Fast',
  },
  {
    id: 'battery_storage' as ServiceType,
    title: 'Battery Storage & Backup Assessment',
    duration: '45 min',
    desc: 'Whole-home backup critical load evaluation for Tesla Powerwall or Enphase batteries.',
    badge: 'NEM 3.0 Essential',
  },
  {
    id: 'maintenance_check' as ServiceType,
    title: 'Solar Health & Inverter Inspection',
    duration: '45 min',
    desc: 'Performance diagnostic, thermal imaging for hot-spots, and firmware updates.',
    badge: 'System Care',
  },
];

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '01:00 PM - 02:00 PM',
  '02:30 PM - 03:30 PM',
  '04:00 PM - 05:00 PM',
];

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  config,
  initialService = 'roof_survey',
  initialAddress = '',
  initialName = '',
  initialEmail = '',
  onAppointmentBooked,
}) => {
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);
  
  // Client details
  const [clientName, setClientName] = useState(initialName);
  const [clientEmail, setClientEmail] = useState(initialEmail);
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Calendar Auth State
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [isSyncingGcal, setIsSyncingGcal] = useState(false);
  const [gcalSuccess, setGcalSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Generate tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    // Check if Google user is already logged in
    initAuth(
      () => setHasGoogleAuth(true),
      () => setHasGoogleAuth(false)
    );
  }, []);

  if (!isOpen) return null;

  const handleGoogleConnect = async () => {
    try {
      setErrorMessage(null);
      const res = await googleSignIn();
      if (res?.accessToken) {
        setHasGoogleAuth(true);
      }
    } catch (err: any) {
      setErrorMessage('Google Sign-in was cancelled or encountered an error.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !address) {
      setErrorMessage('Please fill in your name, email, and installation address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedServiceObj = SERVICES.find((s) => s.id === serviceType);
      const staffList = StorageService.getStaff();
      const assignedStaff = staffList.find((s) => s.role === 'sales_manager' || s.role === 'solar_engineer')?.name || 'Elena Rostova';

      let syncedToGoogle = false;
      let gcalEventId: string | undefined = undefined;

      // Check if user has Google Auth token to directly insert to Google Calendar
      const token = await getAccessToken();
      if (token) {
        try {
          setIsSyncingGcal(true);
          const startDateTime = new Date(`${selectedDate}T${selectedTimeSlot.split(' ')[0]}:00`).toISOString();
          const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

          const gcalRes = await createGoogleCalendarEvent({
            summary: `☀️ ${config.companyName}: ${selectedServiceObj?.title || 'Solar Consultation'}`,
            description: `Scheduled solar session with Tonex Solar Works.\nClient: ${clientName} (${clientPhone || 'No phone'})\nAddress: ${address}\nNotes: ${notes || 'None'}\nAssigned Specialist: ${assignedStaff}\nSupport: ${config.phone}`,
            location: address,
            startTime: startDateTime,
            endTime: endDateTime,
            attendeeEmail: clientEmail,
          });
          syncedToGoogle = true;
          gcalEventId = gcalRes.id;
          setGcalSuccess('Appointment was automatically synchronized directly to your Google Calendar!');
        } catch (gcalErr) {
          console.warn('Google Calendar auto-sync optional error:', gcalErr);
        } finally {
          setIsSyncingGcal(false);
        }
      }

      // Add appointment to persistent storage
      const newAppointment = StorageService.addAppointment({
        serviceType,
        clientName,
        clientEmail,
        clientPhone,
        address,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'confirmed',
        assignedStaff,
        notes,
        googleCalendarEventId: gcalEventId,
        syncedToGoogleCalendar: syncedToGoogle,
      });

      // Also ensure lead exists in CRM
      const existingLeads = StorageService.getLeads();
      const leadExists = existingLeads.some((l) => l.email.toLowerCase() === clientEmail.toLowerCase());
      if (!leadExists) {
        StorageService.addLead({
          clientName,
          email: clientEmail,
          phone: clientPhone,
          address,
          city: address.split(',')[1]?.trim() || 'Quezon City',
          state: 'Metro Manila',
          zipCode: address.match(/\b\d{4}\b/)?.[0] || '1100',
          propertyType: 'residential',
          roofType: 'asphalt_shingle',
          avgMonthlyElectricBill: 14500,
          estimatedSystemSizeKW: 7.5,
          estimatedGrossCost: 375000,
          estimatedNetCost: 340000,
          status: 'survey_scheduled',
          notes: `Booked ${selectedServiceObj?.title} for ${selectedDate} at ${selectedTimeSlot}. Notes: ${notes}`,
          source: 'booking_calendar',
        });
      }

      setConfirmedApt(newAppointment);
      if (onAppointmentBooked) {
        onAppointmentBooked(newAppointment);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete appointment booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!confirmedApt) return;
    const startDate = new Date(`${confirmedApt.date}T10:00:00`);
    const endDate = new Date(`${confirmedApt.date}T11:00:00`);
    downloadIcsFile(
      `Tonex_Solar_Appointment_${confirmedApt.date}`,
      `Tonex Solar Works - ${confirmedApt.serviceType}`,
      `Consultation with Tonex Solar Works at ${confirmedApt.address}.\nContact: ${config.phone}`,
      confirmedApt.address,
      startDate,
      endDate
    );
  };

  const googleCalendarDeepLink = confirmedApt ? generateGoogleCalendarLink(
    `☀️ Tonex Solar Works: Consultation`,
    `Confirmed appointment for ${confirmedApt.clientName}.\nAddress: ${confirmedApt.address}\nAssigned: ${confirmedApt.assignedStaff}\nSupport: ${config.phone}`,
    confirmedApt.address,
    `${confirmedApt.date}T10:00:00Z`,
    `${confirmedApt.date}T11:00:00Z`
  ) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free & No Obligation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Google Calendar Ready
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Book Your Solar Assessment</h2>
          <p className="text-emerald-100/90 text-sm mt-1">
            Choose your preferred consultation format and slot. We sync automatically with Google Calendar and dispatch an instant confirmation.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {confirmedApt ? (
            /* Confirmation View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Appointment Confirmed #{confirmedApt.id.slice(-6)}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">You're All Set, {confirmedApt.clientName}!</h3>
                <p className="text-slate-600 text-sm mt-1">
                  We've reserved your slot and sent an automated confirmation email to <span className="font-semibold text-slate-800">{confirmedApt.clientEmail}</span>.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-sm space-y-3">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {SERVICES.find(s => s.id === confirmedApt.serviceType)?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Date & Time</span>
                  <span className="font-semibold text-slate-900">
                    {confirmedApt.date} ({confirmedApt.timeSlot})
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-semibold text-slate-900">{confirmedApt.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assigned Solar Specialist</span>
                  <span className="font-semibold text-emerald-700">{confirmedApt.assignedStaff}</span>
                </div>
              </div>

              {/* Calendar Actions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Add To Your Personal Calendar</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={googleCalendarDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm hover:shadow"
                  >
                    <ExternalLink className="w-4 h-4" /> Add to Google Calendar
                  </a>

                  <button
                    onClick={handleDownloadIcs}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-all"
                  >
                    <Download className="w-4 h-4" /> Download .iCal File
                  </button>
                </div>

                {gcalSuccess && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-200">
                    ✓ {gcalSuccess}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Service Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  1. Select Consultation Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES.map((s) => {
                    const isSelected = serviceType === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setServiceType(s.id)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {s.duration}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {s.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-2">{s.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Date & Time Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  2. Select Date & Time Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Appointment Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Available Window</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Sync Option */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-950">Google Calendar Direct Sync</p>
                    <p className="text-[11px] text-blue-700">
                      {hasGoogleAuth 
                        ? 'Connected! We will automatically inject the appointment into your Google Calendar.'
                        : 'Connect Google account to synchronize booking directly with your calendar.'}
                    </p>
                  </div>
                </div>
                {!hasGoogleAuth && (
                  <button
                    type="button"
                    onClick={handleGoogleConnect}
                    className="px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-300 transition-colors shadow-xs"
                  >
                    Connect Google
                  </button>
                )}
              </div>

              {/* 3. Client Contact Info */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  3. Contact & Property Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Property Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="123 Sunny Ridge Rd, Irvine, CA"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1">Specific questions, roof notes, or electric bill (₱/mo)</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Tile roof, currently paying ₱15,000/mo, interested in battery backup during power outages."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isSyncingGcal}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting || isSyncingGcal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Slot...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" /> Confirm Appointment
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
