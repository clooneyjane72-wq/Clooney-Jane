import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import { SiteConfiguration, SolarLead } from '../types/solar';
import { StorageService } from '../services/storage';

interface ContactSectionProps {
  config: SiteConfiguration;
  onOpenBooking: () => void;
  onLeadCaptured?: (lead: SolarLead) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  onOpenBooking,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bill, setBill] = useState('14500');
  const [propertyType, setPropertyType] = useState('residential');
  const [roofType, setRoofType] = useState('asphalt_shingle');
  const [timeline, setTimeline] = useState('within_30_days');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      setErrorMessage('Please provide your name, email, and property address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const billNum = Number(bill) || 250;
      const estSizeKW = Math.round((billNum / 0.32 / 1500) * 10) / 10;
      const estGrossCost = Math.round(estSizeKW * 1000 * config.solarCostPerWatt);
      const estNetCost = Math.round(estGrossCost * 0.70);

      const newLead = StorageService.addLead({
        clientName: name,
        email,
        phone,
        address,
        city: address.split(',')[1]?.trim() || 'Service Area',
        state: 'CA',
        zipCode: address.match(/\b\d{5}\b/)?.[0] || '92618',
        propertyType: propertyType as any,
        roofType: roofType as any,
        avgMonthlyElectricBill: billNum,
        estimatedSystemSizeKW: estSizeKW,
        estimatedGrossCost: estGrossCost,
        estimatedNetCost: estNetCost,
        status: 'new',
        preferredTimeline: timeline.replace(/_/g, ' '),
        notes: `Submitted via website contact form. Timeline: ${timeline}. Notes: ${notes || 'None'}`,
        source: 'contact_form',
      });

      // Send automated receipt email
      StorageService.sendAutomatedEmail({
        recipientEmail: email,
        recipientName: name,
        subject: `Thank you for contacting ${config.companyName}`,
        type: 'appointment_confirmation',
        status: 'delivered',
        contentSnippet: `We received your solar inquiry for ${address}. A licensed solar advisor will review your satellite roof layout within 24 hours.`,
        fullBodyHtml: `
          <h2>Thank You For Contacting Tonex Solar Works</h2>
          <p>Dear ${name},</p>
          <p>We received your inquiry regarding solar installation for <strong>${address}</strong>.</p>
          <p>Our engineering team is already running initial satellite solar irradiance assessments on your property.</p>
          <p>If you'd like to book an immediate on-site roof survey or virtual video consultation, feel free to use our live booking calendar.</p>
        `,
      });

      setIsSuccess(true);
      if (onLeadCaptured) {
        onLeadCaptured(newLead);
      }

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
    } catch (err: any) {
      setErrorMessage('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <Clock className="w-3.5 h-3.5" /> Rapid 24-Hour Response
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Connect With Tonex Solar Works
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
                Whether you need a free residential satellite roof analysis, commercial feasibility survey, or battery retrofit, our licensed engineering team is ready to assist.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Toll-Free Solar Advisory</span>
                  <a href={`tel:${config.phone.replace(/\D/g, '')}`} className="text-white font-bold text-base hover:text-emerald-400 transition-colors">
                    {config.phone}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mon–Fri: 7am–6pm PST | Sat: 8am–2pm PST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Project & Quotes Desk</span>
                  <a href={`mailto:${config.email}`} className="text-white font-bold text-base hover:text-emerald-400 transition-colors">
                    {config.email}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Same-day turnaround for proposal requests</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Engineering Headquarters</span>
                  <span className="text-white font-semibold text-sm block">
                    {config.address}
                  </span>
                  <p className="text-[11px] text-amber-400 mt-0.5">{config.licenseNumber}</p>
                </div>
              </div>
            </div>

            {/* Quick appointment shortcut banner */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Prefer Live Scheduling?</span>
              <p className="text-xs text-slate-300 mt-1">
                Skip the contact form and pick an exact appointment time directly on our Google Calendar synced booking calendar.
              </p>
              <button
                onClick={onOpenBooking}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Exact Date & Time Slot
              </button>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/90 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl">
            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you! Your information has been registered in our project queue. A confirmation email has been dispatched, and our engineer will reach out shortly.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={onOpenBooking}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Pick Appointment Slot Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-2 border-b border-slate-700">
                  <h3 className="text-xl font-bold text-white">Request Solar System Proposal</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill out your details to receive an itemized satellite proposal & tax credit calculation.</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/50 border border-red-500 text-red-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jordan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Installation Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Sunny Ridge Rd, Irvine, CA"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Avg Electric Bill (₱/mo)</label>
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      value={bill}
                      onChange={(e) => setBill(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="residential">Single Family Home</option>
                      <option value="commercial">Commercial Facility</option>
                      <option value="industrial">Industrial / Warehouse</option>
                      <option value="agricultural">Agricultural / Farm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Roof Type</label>
                    <select
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="asphalt_shingle">Asphalt Shingle</option>
                      <option value="tile">Concrete / Spanish Tile</option>
                      <option value="metal">Standing Seam Metal</option>
                      <option value="flat">Commercial Flat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Desired Project Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="within_30_days">Immediate (Within 30 Days)</option>
                    <option value="1_to_3_months">Next 1 to 3 Months</option>
                    <option value="planning_budgeting">Budgeting & Exploring Options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes or Inquiries</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Interested in adding whole-home battery backup, main electrical panel upgrade, or EV charger installation."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Registering Inquiry...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Inquiry & Request Proposal
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    🔒 We respect your privacy. No spam. Data transmitted with enterprise encryption.
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
