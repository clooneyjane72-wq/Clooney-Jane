import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sun, 
  Zap, 
  Shield, 
  Flame, 
  Leaf, 
  Image, 
  Sliders, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SiteConfiguration } from '../types/solar';
import { StorageService, DEFAULT_SITE_CONFIG } from '../services/storage';

interface EditSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfiguration;
  onConfigUpdated: (newConfig: SiteConfiguration) => void;
}

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

export const EditSiteModal: React.FC<EditSiteModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  const [formData, setFormData] = useState<SiteConfiguration>(config);
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'installation'>('branding');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSiteConfig(formData);
    onConfigUpdated(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Reset site branding and installation details to default values?')) {
      const def = StorageService.resetSiteConfig();
      setFormData(def);
      onConfigUpdated(def);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Tonex Site & Installation Customizer</h2>
              <p className="text-xs text-slate-400">Edit branding, logo, header announcement, hero background, and installation specs live.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Brand, Logo & Header
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'hero'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Hero & Background
          </button>
          <button
            onClick={() => setActiveTab('installation')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'installation'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Solar Installation Details
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {savedNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Site customization saved successfully! Updating live preview...</span>
            </div>
          )}

          {/* TAB 1: Brand, Logo & Header */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
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
                    const isSelected = formData.logoIcon === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setFormData({ ...formData, logoIcon: item.id })}
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
                  <label className="text-xs font-bold text-slate-200">Header Top Announcement Banner</label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAnnouncement}
                      onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                      className="rounded-sm accent-amber-500"
                    />
                    <span>Show Banner</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. ☀️ Federal ITC 30% Solar Tax Credit Active - Lock in 2026 Energy Rates Today!"
                  value={formData.announcementText}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hero & Background */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Badge Text</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subheadline</label>
                <textarea
                  rows={3}
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Background presets & custom URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Hero Background Image Preset or Custom URL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                  {PRESET_BACKGROUNDS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, heroBackgroundUrl: preset.url })}
                      className={`cursor-pointer rounded-xl overflow-hidden border relative h-20 transition-all ${
                        formData.heroBackgroundUrl === preset.url
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
                  placeholder="https://..."
                  value={formData.heroBackgroundUrl}
                  onChange={(e) => setFormData({ ...formData, heroBackgroundUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Overlay darkness */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Background Dark Overlay Opacity
                  </label>
                  <span className="text-xs font-mono text-amber-400">
                    {Math.round(formData.heroOverlayOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.05"
                  value={formData.heroOverlayOpacity}
                  onChange={(e) => setFormData({ ...formData, heroOverlayOpacity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Solar Installation Details */}
          {activeTab === 'installation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Turnkey Solar Cost Per Watt ($/W)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.50"
                    max="5.00"
                    value={formData.solarCostPerWatt}
                    onChange={(e) => setFormData({ ...formData, solarCostPerWatt: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">Used for system baseline pricing & project proposals</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Panel Efficiency Rating (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="18.0"
                    max="25.0"
                    value={formData.panelEfficiency}
                    onChange={(e) => setFormData({ ...formData, panelEfficiency: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Featured Solar Panel Brand & Model
                  </label>
                  <input
                    type="text"
                    value={formData.solarPanelBrand}
                    onChange={(e) => setFormData({ ...formData, solarPanelBrand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Featured Inverter Brand & Architecture
                  </label>
                  <input
                    type="text"
                    value={formData.inverterBrand}
                    onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Featured Battery Energy Storage
                  </label>
                  <input
                    type="text"
                    value={formData.batteryBrand}
                    onChange={(e) => setFormData({ ...formData, batteryBrand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={formData.turnaroundWeeks}
                    onChange={(e) => setFormData({ ...formData, turnaroundWeeks: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product & Power Warranty (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyYearsProduct}
                    onChange={(e) => setFormData({ ...formData, warrantyYearsProduct: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Workmanship & Leak Warranty (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyYearsWorkmanship}
                    onChange={(e) => setFormData({ ...formData, warrantyYearsWorkmanship: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Active Service Areas & States
                </label>
                <input
                  type="text"
                  value={formData.serviceAreas}
                  onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl border border-rose-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Live Changes
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
