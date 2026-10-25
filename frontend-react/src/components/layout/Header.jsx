import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Radio, Zap, Anchor, Ship, AlertTriangle, X, Compass, ExternalLink } from 'lucide-react';
import { useMarineContext } from '../../context/MarineContext';
import { COASTAL_ZONES, ALL_ASIAN_FLEET_DATABASE, GLOBAL_OIL_SLICKS } from '../../services/mockData';

export const Header = () => {
  const navigate = useNavigate();
  const { setActiveHubKey, setSelectedMmsi, setSelectedOilSlickName } = useMarineContext();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Live time ticker
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const istTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
  const utcTime = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }) + ' UTC';

  // Keyboard shortcut (Ctrl+K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search matches across Seaports, Vessels, and Oil Slicks
  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { ports: [], vessels: [], slicks: [] };

    // 1. Ports match
    const ports = Object.entries(COASTAL_ZONES)
      .filter(([key, port]) => 
        port.name.toLowerCase().includes(q) || 
        port.state.toLowerCase().includes(q) ||
        port.region.toLowerCase().includes(q) ||
        key.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(([key, port]) => ({ key, ...port }));

    // 2. Vessels match
    const vessels = ALL_ASIAN_FLEET_DATABASE.filter(v => 
      v.name.toLowerCase().includes(q) ||
      v.mmsi.includes(q) ||
      v.imo.includes(q) ||
      v.type.toLowerCase().includes(q) ||
      v.cargo.toLowerCase().includes(q)
    ).slice(0, 5);

    // 3. Oil slicks match
    const slicks = GLOBAL_OIL_SLICKS.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.eez.toLowerCase().includes(q) ||
      s.vessel_name.toLowerCase().includes(q) ||
      s.s1_scene_id.toLowerCase().includes(q)
    ).slice(0, 5);

    return { ports, vessels, slicks };
  }, [query]);

  const totalResults = searchResults.ports.length + searchResults.vessels.length + searchResults.slicks.length;

  const handleSelectPort = (portKey) => {
    setActiveHubKey(portKey);
    navigate('/command');
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectVessel = (mmsi) => {
    setSelectedMmsi(mmsi);
    navigate('/fleet');
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectSlick = (slickName) => {
    setSelectedOilSlickName(slickName);
    navigate('/gis');
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="h-16 bg-[#0D1730] border-b border-[#1E293B] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-md flex-nowrap min-w-0">
      
      {/* Quick Search Bar with Interactive Autocomplete */}
      <div className="relative w-64 md:w-80 lg:w-96 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search port, vessel MMSI, slick ID..."
            className="w-full bg-[#111D3A] border border-[#1E293B] rounded-xl pl-10 pr-16 py-2 text-xs font-semibold text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all shadow-inner"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9.5px] font-mono font-semibold text-slate-400 bg-[#0D1730] border border-[#1E293B] rounded pointer-events-none">
              Ctrl + K
            </kbd>
          )}
        </div>

        {/* Interactive Search Results Dropdown Overlay */}
        {isOpen && query.trim() !== '' && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 w-[480px] bg-[#0D1730] border border-[#1E293B] shadow-2xl rounded-2xl p-4 z-50 space-y-3 font-sans text-slate-100 max-h-[500px] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs font-mono">
              <span className="text-slate-400">Search Results for "{query}"</span>
              <span className="text-sky-400 font-bold">{totalResults} Matches</span>
            </div>

            {totalResults === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-mono">
                No matching ports, vessels, or satellite slicks found.
              </div>
            ) : (
              <div className="space-y-3">
                {/* 1. Indian Seaports */}
                {searchResults.ports.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" /> Seaports & Marine Hubs ({searchResults.ports.length})
                    </div>
                    {searchResults.ports.map((port) => (
                      <button
                        key={port.key}
                        onClick={() => handleSelectPort(port.key)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#111D3A] hover:bg-[#1A284B] border border-[#1E293B] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-slate-100 group-hover:text-sky-300">
                            {port.name}
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono">
                            {port.state} • {port.region} ({port.lat.toFixed(2)}°, {port.lon.toFixed(2)}°)
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-sky-950/60 text-sky-400 border border-sky-800 text-[9.5px] font-mono font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors">
                          Go to Port ↗
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Vessels & AIS MMSI */}
                {searchResults.vessels.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5" /> Live Fleet & AIS MMSI ({searchResults.vessels.length})
                    </div>
                    {searchResults.vessels.map((v) => (
                      <button
                        key={v.mmsi}
                        onClick={() => handleSelectVessel(v.mmsi)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#111D3A] hover:bg-[#1A284B] border border-[#1E293B] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-slate-100 group-hover:text-emerald-300 flex items-center gap-1.5">
                            <span>{v.flag}</span>
                            <span>{v.name}</span>
                            <span className="text-slate-400 font-normal text-[10.5px]">({v.type})</span>
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                            MMSI: <span className="text-slate-200">{v.mmsi}</span> | IMO: {v.imo} | {v.cargo}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[9.5px] font-mono font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          Track Ship ↗
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Satellite Oil Slicks */}
                {searchResults.slicks.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Satellite Oil Slicks ({searchResults.slicks.length})
                    </div>
                    {searchResults.slicks.map((s) => (
                      <button
                        key={s.id || s.name}
                        onClick={() => handleSelectSlick(s.name)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#111D3A] hover:bg-[#1A284B] border border-[#1E293B] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-slate-100 group-hover:text-amber-300">
                            🚨 {s.name}
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                            Area: {s.area_km2} km² | EEZ: {s.eez} | Vessel: {s.vessel_name}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800 text-[9.5px] font-mono font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          Inspect Slick ↗
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Badges & User Telemetry - Single-Line Layout */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0 font-mono text-xs flex-nowrap">
        {/* Network Badges */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111D3A] border border-emerald-900/80 text-emerald-400 text-xs font-bold whitespace-nowrap shadow-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Sentinel Orbit Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111D3A] border border-sky-900/80 text-sky-400 text-xs font-bold whitespace-nowrap shadow-xs">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            Enterprise Tensor Cluster
          </span>
        </div>

        {/* Live System Time */}
        <div className="hidden sm:block text-right shrink-0">
          <div className="text-sky-400 font-bold text-[11px] flex items-center justify-end gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            SYSTEM ONLINE
          </div>
          <div className="text-slate-400 font-semibold text-[10px] whitespace-nowrap mt-0.5">{istTime} | {utcTime}</div>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1E293B] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sky-700 border border-sky-500 text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
            MG
          </div>
          <div className="hidden xl:block text-left shrink-0">
            <div className="text-xs font-bold text-slate-100 whitespace-nowrap">Coast Command HQ</div>
            <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">Indian EEZ Command</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
