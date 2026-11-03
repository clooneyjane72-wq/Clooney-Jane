import React, { useState } from 'react';
import { SiteConfiguration, Role, ServiceType } from './types/solar';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SolarSolutions } from './components/SolarSolutions';
import { CustomerInstallationTracker } from './components/CustomerInstallationTracker';
import { HowItWorks } from './components/HowItWorks';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AdminSecurityGate } from './components/AdminPortal/AdminSecurityGate';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfiguration>(() => 
    StorageService.getSiteConfig()
  );

  // Admin & Security state
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showSecurityGate, setShowSecurityGate] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');
  
  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Booking prefills
  const [bookingService, setBookingService] = useState<ServiceType>('roof_survey');
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingAddress, setBookingAddress] = useState<string>('');

  const handleOpenBooking = (service: ServiceType = 'roof_survey', name = '', email = '', address = '') => {
    setBookingService(service);
    setBookingName(name);
    setBookingEmail(email);
    setBookingAddress(address);
    setIsBookingModalOpen(true);
  };


  // Secure Admin Access Trigger
  const handleRequestAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminView(true);
    } else {
      setShowSecurityGate(true);
    }
  };

  const handleSecuritySuccess = () => {
    setIsAdminAuthenticated(true);
    setShowSecurityGate(false);
    setIsAdminView(true);
  };

  const handleLockAdminSession = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* If Admin View is active and authenticated, render Admin Portal */}
      {isAdminView && isAdminAuthenticated ? (
        <AdminDashboard
          config={siteConfig}
          onCloseAdmin={() => setIsAdminView(false)}
          onConfigUpdated={(newConfig) => setSiteConfig(newConfig)}
          currentRole={currentRole}
          onChangeRole={(role) => setCurrentRole(role)}
          onOpenBooking={() => handleOpenBooking('roof_survey')}
          onLockSession={handleLockAdminSession}
        />
      ) : (
        /* Otherwise render the Public Facing Website */
        <div className="flex flex-col min-h-screen">
          <Navbar
            config={siteConfig}
            onOpenBooking={() => handleOpenBooking('roof_survey')}
            onToggleAdmin={handleRequestAdmin}
            isAdminView={isAdminView}
            onOpenQuickCustomizer={handleRequestAdmin}
            currentRole={currentRole}
          />

          <main className="flex-1">
            <Hero
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
            />

            <SolarSolutions
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
            />

            {/* Customer Portal: Done installations & upcoming project reservations */}
            <CustomerInstallationTracker
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
            />

            <HowItWorks
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
            />

            <ProjectShowcase
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
            />

            <ContactSection
              config={siteConfig}
              onOpenBooking={() => handleOpenBooking('roof_survey')}
              onLeadCaptured={(lead) => {
                setBookingName(lead.clientName);
                setBookingEmail(lead.email);
                setBookingAddress(lead.address);
              }}
            />
          </main>

          <Footer
            config={siteConfig}
            onOpenBooking={() => handleOpenBooking('roof_survey')}
            onToggleAdmin={handleRequestAdmin}
          />
        </div>
      )}

      {/* Admin Security Passcode Gate Modal */}
      {showSecurityGate && (
        <AdminSecurityGate
          onAuthenticated={handleSecuritySuccess}
          onCancel={() => setShowSecurityGate(false)}
        />
      )}

      {/* Appointment Booking Modal (Google Calendar Synced) */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        config={siteConfig}
        initialService={bookingService}
        initialName={bookingName}
        initialEmail={bookingEmail}
        initialAddress={bookingAddress}
      />

    </div>
  );
}
