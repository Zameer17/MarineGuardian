import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Anchor, Satellite, Compass, Zap } from 'lucide-react';
import { useMarineContext } from '../../context/MarineContext';

export const Sidebar = () => {
  const { 
    coastalZones, 
    selectedPortKey, 
    setSelectedPortKey, 
    radarOverlayParam, 
    setRadarOverlayParam,
    selectedLangLabels,
    setSelectedLangLabels
  } = useMarineContext();

  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: '/gis',
      label: '🛰️ Satellite SAR & Oil Spill GIS Intelligence',
      icon: Satellite,
      subtitle: 'Sentinel-1 SAR & Oil Slick ML'
    },
    {
      path: '/command',
      label: '🛡️ Fishermen Safety & Coastal Operations Command',
      icon: Anchor,
      subtitle: 'Hydrodynamic Risk & Multi-Lingual Advisory'
    },
    {
      path: '/fleet',
      label: '🚢 Proactive Fleet Tracking, AI Rerouting & Emergency Shelter',
      icon: Compass,
      subtitle: '33 Vessels AIS & Sea Halt Physics'
    },
  ];

  const quickPorts = [
    { key: 'mumbai', label: '⚓ Mumbai' },
    { key: 'kochi', label: '⚓ Kochi' },
    { key: 'visakhapatnam', label: '⚓ Vizag' },
    { key: 'veraval', label: '⚓ Veraval' },
    { key: 'chennai', label: '⚓ Chennai' },
    { key: 'port blair', label: '⚓ Port Blair' },
  ];

  const availableLangs = [
    'Hindi (हिन्दी)', 'Marathi (मराठी)', 'Gujarati (ગુજરાતી)', 
    'Tamil (தமிழ்)', 'Malayalam (മലയാളം)', 'Bengali (বাংলা)', 
    'Telugu (తెలుగు)', 'Kannada (ಕನ್ನಡ)', 'Odia (ଓଡ଼ིଆ)'
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // AUTO LANGUAGE DETECTION: maps state → primary regional language label
  // English + Hindi are always shown; this adds the state-specific tongue.
  // ──────────────────────────────────────────────────────────────────────────
  const STATE_LANGUAGE_MAP = {
    'Gujarat':           'Gujarati (ગુજરાતી)',
    'Maharashtra':       'Marathi (मराठी)',
    'Goa':               'Marathi (मराठी)',
    'Karnataka':         'Kannada (ಕನ್ನಡ)',
    'Kerala':            'Malayalam (മലയാളം)',
    'Tamil Nadu':        'Tamil (தமிழ்)',
    'Andhra Pradesh':    'Telugu (తెలుగు)',
    'Odisha':            'Odia (ଓଡ଼ིଆ)',
    'West Bengal':       'Bengali (বাংলা)',
    'Andaman & Nicobar': 'Bengali (বাংলা)',
    'Lakshadweep':       'Malayalam (മലയാളം)',
  };

  /**
   * handlePortChange – called whenever the user picks a port from the
   * dropdown OR the quick-port buttons.
   *
   * Behaviour:
   *  1. Update the selected port key in context.
   *  2. Auto-compute: [Hindi, <state regional lang>]
   *     (English is always shown in advisory panels, not in the chips array)
   */
  const handlePortChange = (portKey) => {
    setSelectedPortKey(portKey);
    const zone = coastalZones[portKey];
    if (!zone) return;

    const regionalLang = STATE_LANGUAGE_MAP[zone.state];
    const autoLangs = ['Hindi (हिन्दी)'];
    if (regionalLang && !autoLangs.includes(regionalLang)) {
      autoLangs.push(regionalLang);
    }
    setSelectedLangLabels(autoLangs);
  };

  const toggleLang = (lang) => {
    if (selectedLangLabels.includes(lang)) {
      if (selectedLangLabels.length > 1) {
        setSelectedLangLabels(selectedLangLabels.filter(l => l !== lang));
      }
    } else {
      setSelectedLangLabels([...selectedLangLabels, lang]);
    }
  };

  const currentZone = coastalZones[selectedPortKey];
  const detectedRegionalLang = currentZone ? STATE_LANGUAGE_MAP[currentZone.state] : null;

  return (
    <aside className="w-88 bg-[#0D1730] text-slate-100 border-r border-[#1E293B] flex flex-col h-screen sticky top-0 z-30 shrink-0 select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B] bg-[#0D1730] flex flex-col items-center justify-center gap-3">
        <div className="w-full flex items-center justify-center bg-[#111D3A] p-3.5 rounded-2xl border border-[#1E293B] shadow-sm transition-all hover:border-sky-700">
          <img 
            src="/logo.png" 
            alt="MarineGuardian Logo" 
            className="w-full h-36 object-contain rounded-xl drop-shadow-md transition-transform hover:scale-105"
          />
        </div>
        <div className="text-center">
          <div className="font-black text-slate-100 text-xl tracking-tight">MarineGuardian</div>
          <p className="text-[11px] font-extrabold font-mono text-sky-400 uppercase tracking-widest mt-0.5">
            NATIONAL MARITIME DEFENSE HUB
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-1.5">
          <div className="px-2 text-[11px] font-bold font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Mission Command Mode
          </div>

          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`block px-3.5 py-3 rounded-xl transition-all duration-200 border ${
                  isActive
                    ? 'bg-sky-950/60 border-sky-500 text-sky-300 font-bold shadow-sm'
                    : 'bg-[#111D3A]/50 border-[#1E293B] text-slate-300 hover:bg-[#111D3A] hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">{item.subtitle}</div>
              </NavLink>
            );
          })}
        </div>

        {/* ── Fishermen Safety Page Controls ── */}
        {currentPath === '/command' && (
          <div className="pt-3 border-t border-[#1E293B] space-y-4">

            {/* Target Sector Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold font-mono uppercase text-sky-400 block">
                🎯 Target Sector Selection
              </label>
              <select
                value={selectedPortKey}
                onChange={(e) => handlePortChange(e.target.value)}
                className="w-full bg-[#111D3A] border border-[#1E293B] text-xs font-semibold text-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {Object.entries(coastalZones).map(([key, zone]) => (
                  <option key={key} value={key} className="bg-[#111D3A] text-slate-100">
                    {zone.name} ({zone.state})
                  </option>
                ))}
              </select>

              {/* Auto-detected language pill row */}
              {currentZone && (
                <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-2 bg-sky-950/40 border border-sky-800/60 rounded-lg">
                  <span className="text-[9px] font-mono text-sky-400 font-bold uppercase shrink-0">
                    🌐 Auto-detected:
                  </span>
                  {/* English — always first */}
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-800/50 text-emerald-300 border border-emerald-700">
                    English
                  </span>
                  {/* Hindi — always second */}
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-800/50 text-sky-300 border border-sky-700">
                    Hindi
                  </span>
                  {/* State regional language */}
                  {detectedRegionalLang && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-800/50 text-amber-300 border border-amber-700">
                      {detectedRegionalLang.split(' ')[0]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Port Selectors */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                ⚡ Quick Port Selectors
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPorts.map((port) => (
                  <button
                    key={port.key}
                    onClick={() => handlePortChange(port.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border text-left truncate ${
                      selectedPortKey === port.key
                        ? 'bg-sky-600 text-white border-sky-500 font-bold'
                        : 'bg-[#111D3A] text-slate-300 border-[#1E293B] hover:bg-[#1A284B] hover:text-white'
                    }`}
                  >
                    {port.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Overlay Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                🗺️ Live Radar Layer
              </label>
              <div className="space-y-1">
                {[
                  { key: 'waves', label: 'Wave & Swell Height' },
                  { key: 'wind', label: 'Wind Velocity Field' },
                  { key: 'currents', label: 'Sea Surface Currents' },
                ].map((layer) => (
                  <button
                    key={layer.key}
                    onClick={() => setRadarOverlayParam(layer.key)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      radarOverlayParam === layer.key
                        ? 'bg-sky-900/50 text-sky-300 border-sky-500 font-bold'
                        : 'bg-[#111D3A] text-slate-300 border-[#1E293B] hover:bg-[#1A284B]'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Regional Dialects Chip Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                🌐 Regional Dialect Feeds
              </label>
              <p className="text-[10px] text-slate-500 font-medium leading-snug">
                English &amp; Hindi always active. Regional language auto-selected by state.
              </p>
              <div className="flex flex-wrap gap-1">
                {availableLangs.map((lang) => {
                  const isSelected = selectedLangLabels.includes(lang);
                  const isAutoDetected = lang === detectedRegionalLang;
                  return (
                    <button
                      key={lang}
                      onClick={() => toggleLang(lang)}
                      title={isAutoDetected ? `Auto-detected for ${currentZone?.state}` : undefined}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-500 font-bold'
                          : 'bg-[#111D3A] text-slate-300 border-[#1E293B] hover:bg-[#1A284B]'
                      }`}
                    >
                      {lang}
                      {isAutoDetected && (
                        <span className="ml-1 text-[8px] text-amber-300 font-black">●</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-slate-600 font-mono">● = auto-detected by state</p>
            </div>

          </div>
        )}

        {/* Constellation Widget — GIS Page */}
        {currentPath === '/gis' && (
          <div className="pt-3 border-t border-[#1E293B] space-y-2">
            <div className="text-[11px] font-bold font-mono uppercase text-sky-400 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-sky-400" /> Active Satellite Constellation
            </div>
            <div className="p-3 bg-[#111D3A] border border-[#1E293B] rounded-xl text-xs space-y-1.5 text-slate-300">
              <div><strong className="text-slate-100">Primary SAR:</strong> Sentinel-1 C-Band</div>
              <div><strong className="text-slate-100">Optical Sensor:</strong> Sentinel-2 MSI</div>
              <div><strong className="text-slate-100">AI Core:</strong> ResNet34 U-Net</div>
              <div className="text-emerald-400 font-bold pt-1 border-t border-[#1E293B] flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Enterprise GPU Cluster Online
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1E293B] text-center bg-[#0B132B]">
        <div className="text-[10px] font-mono text-slate-400 font-semibold">
          NATIONAL MARITIME DEFENSE HUB
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
