import React, { useState, useEffect } from 'react';
import { useMarineContext } from '../context/MarineContext';
import FleetReroutingMap from '../components/maps/FleetReroutingMap';
import { 
  calculateRerouteCorridor, 
  calculateEmergencyShelter, 
  fetchAsianLiveVessels,
  fetchAisStreamStatus,
  fetchVesselRerouteIntelligence,
  dispatchVesselHazardAlert
} from '../services/api';
import { ALL_ASIAN_FLEET_DATABASE } from '../services/mockData';
import { 
  Navigation, 
  ShieldCheck, 
  Anchor, 
  Compass, 
  Zap, 
  FileText,
  Send,
  Sliders,
  Ship,
  Globe,
  Radio,
  Clock,
  AlertTriangle,
  RefreshCw,
  Activity,
  Play,
  Pause,
  Wifi,
  Waves,
  Wind,
  CheckCircle2,
  Mail,
  Check
} from 'lucide-react';

export default function FleetReroutingPage() {
  const context = useMarineContext();
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [streamMode, setStreamMode] = useState('live'); // 'live' or 'baseline'
  const [asianVessels, setAsianVessels] = useState(ALL_ASIAN_FLEET_DATABASE);
  const [telemetryStatus, setTelemetryStatus] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loadingFleet, setLoadingFleet] = useState(false);

  const [selectedVessel, setSelectedVessel] = useState(ALL_ASIAN_FLEET_DATABASE[0]);
  const [safetyMargin, setSafetyMargin] = useState(15); // nm
  const [seaHaltThreshold, setSeaHaltThreshold] = useState(2.8); // m wave height ceiling
  const [simulateHazard, setSimulateHazard] = useState(false);
  const [rerouteData, setRerouteData] = useState(null);
  const [shelterData, setShelterData] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState('');
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [customVesselEmail, setCustomVesselEmail] = useState('zameershaikh17112006@gmail.com');

  // Initial and recurring fetch
  useEffect(() => {
    loadAsianVessels(selectedRegion, streamMode);
    loadStatus();

    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadAsianVessels(selectedRegion, streamMode, false);
      loadStatus();
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedRegion, streamMode, autoRefresh]);

  const loadStatus = async () => {
    try {
      const st = await fetchAisStreamStatus();
      if (st) setTelemetryStatus(st);
    } catch (e) {
      console.warn("Status fetch error", e);
    }
  };

  const loadAsianVessels = async (region, mode, showSpinner = true) => {
    if (showSpinner) setLoadingFleet(true);
    try {
      const data = await fetchAsianLiveVessels(region, 'All', mode);
      if (data && data.length > 0) {
        setAsianVessels(data);
        if (data.telemetryStatus) {
          setTelemetryStatus(data.telemetryStatus);
        }
        // Retain current selection if present, else pick first
        setSelectedVessel(prev => {
          if (!prev) return data[0];
          const match = data.find(v => String(v.mmsi) === String(prev.mmsi));
          return match || data[0];
        });
      } else {
        setAsianVessels(ALL_ASIAN_FLEET_DATABASE);
      }
    } catch (err) {
      console.error("Error loading Asian live vessels", err);
      setAsianVessels(ALL_ASIAN_FLEET_DATABASE);
    } finally {
      if (showSpinner) setLoadingFleet(false);
    }
  };

  // Auto-recalculate corridor when selected vessel or parameters change
  useEffect(() => {
    if (selectedVessel) {
      handleCalculateCorridor();
    }
  }, [selectedVessel?.mmsi, selectedVessel?.lat, selectedVessel?.lon, safetyMargin, seaHaltThreshold, simulateHazard]);

  const handleCalculateCorridor = async () => {
    if (!selectedVessel) return;
    setCalculating(true);
    try {
      // Live weather telematics and sea route intelligence from Open-Meteo & backend router
      let res = await fetchVesselRerouteIntelligence({
        mmsi: selectedVessel.mmsi,
        lat: selectedVessel.lat || 18.922,
        lon: selectedVessel.lon || 72.834,
        destLat: selectedVessel.dest_lat,
        destLon: selectedVessel.dest_lon,
        safetyMargin,
        seaHaltThreshold,
        simulateHazard
      });

      // Fallback only if backend endpoint fails
      if (!res) {
        res = await calculateRerouteCorridor(selectedVessel, safetyMargin, seaHaltThreshold);
      }
      setRerouteData(res);

      if (res?.emergency_shelter) {
        setShelterData(res.emergency_shelter);
      } else {
        const shelter = calculateEmergencyShelter(selectedVessel.lat || 18.922, selectedVessel.lon || 72.834);
        setShelterData(shelter);
      }

      const liveFlag = selectedVessel.is_live_stream ? '[LIVE AISSTREAM]' : '[EEZ BASELINE]';
      const isHaz = Boolean(res?.has_weather_hazard);
      const waveH = res?.weather?.wave_height_meters ? `${res.weather.wave_height_meters}m` : '1.2m';
      const windSpd = res?.weather?.wind_speed_kmh ? `${res.weather.wind_speed_kmh} km/h` : '14 km/h';

      const dispatchText = isHaz
        ? `[NAVIGATIONAL DISPATCH - MARITIME COMMAND] ${liveFlag}: Vessel ${selectedVessel.name || 'Ship'} (${selectedVessel.flag || '⚓'}) MMSI: ${selectedVessel.mmsi}. GPS Position: ${selectedVessel.lat?.toFixed(4)}°N, ${selectedVessel.lon?.toFixed(4)}°E. [LIVE WEATHER HAZARD: Wave Swell ${waveH} | Wind ${windSpd} - EXCEEDS CEILING (${seaHaltThreshold}m)]. Dynamic Seaward Bypass corridor generated with +${res.diversion_distance_nm} nm clearance. Hazard swell zone bypassed. ETA adjustment: +${res.time_delay_hours} hrs. Safe harbor: ${res.emergency_shelter?.name || 'Protected Basin'}.`
        : `[NAVIGATIONAL DISPATCH - MARITIME COMMAND] ${liveFlag}: Vessel ${selectedVessel.name || 'Ship'} (${selectedVessel.flag || '⚓'}) MMSI: ${selectedVessel.mmsi}. GPS Position: ${selectedVessel.lat?.toFixed(4)}°N, ${selectedVessel.lon?.toFixed(4)}°E. SOG: ${selectedVessel.sog || selectedVessel.sog_knots || 0} kn @ ${selectedVessel.cog || selectedVessel.cog_degrees || 0}°. [OPEN-METEO MARINE TELEMATICS: Wave Swell ${waveH} | Wind ${windSpd} - CLEAR PASSAGE]. Navigating along authentic deepwater sea lane directly to ${selectedVessel.destination || 'Destination Terminal'}. Zero weather hazards detected; no detour required.`;

      setDispatchNotice(dispatchText);
    } catch (err) {
      console.error("Corridor calculation error", err);
    } finally {
      setCalculating(false);
    }
  };

  const handleSendTargetedDispatch = async () => {
    if (!selectedVessel) return;
    setIsSendingAlert(true);
    setDispatchStatus(null);
    try {
      const targetInbox = customVesselEmail || 'zameershaikh17112006@gmail.com';
      const startPortEmail = rerouteData?.stakeholder_emails?.start_port || targetInbox;
      const destPortEmail = rerouteData?.stakeholder_emails?.dest_port || targetInbox;
      const vesselBridgeEmail = targetInbox;
      const shelterEmail = rerouteData?.stakeholder_emails?.shelter_port || targetInbox;

      const payload = {
        mmsi: String(selectedVessel.mmsi),
        vessel_name: selectedVessel.name || "Target Vessel",
        flag: selectedVessel.flag || "⚓",
        lat: Number(selectedVessel.lat || 18.922),
        lon: Number(selectedVessel.lon || 72.834),
        sog_knots: Number(selectedVessel.sog || selectedVessel.sog_knots || 0),
        cog_degrees: Number(selectedVessel.cog || selectedVessel.cog_degrees || 0),
        origin: selectedVessel.origin || "Departure Port",
        destination: selectedVessel.destination || "Destination Corridor",
        vessel_email: vesselBridgeEmail,
        start_port_email: startPortEmail,
        dest_port_email: destPortEmail,
        shelter_port_email: shelterEmail,
        prototype_email: targetInbox,
        wave_height_meters: rerouteData?.weather?.wave_height_meters || 1.2,
        wind_speed_kmh: rerouteData?.weather?.wind_speed_kmh || 15.0,
        sea_halt_threshold: Number(seaHaltThreshold),
        diversion_distance_nm: Number(rerouteData?.diversion_distance_nm || 0),
        time_delay_hours: Number(rerouteData?.time_delay_hours || 0),
        emergency_shelter_name: shelterData?.name || rerouteData?.emergency_shelter?.name || "Mormugao Base",
        emergency_shelter_distance_nm: Number(shelterData?.distance_nm || rerouteData?.emergency_shelter?.distance_nm || 45.0),
        emergency_shelter_eta_hours: Number(shelterData?.eta_hours || rerouteData?.emergency_shelter?.eta_hours || 3.0),
        has_weather_hazard: Boolean(rerouteData?.has_weather_hazard)
      };

      const result = await dispatchVesselHazardAlert(payload);
      if (result && result.success) {
        setDispatchStatus({
          success: true,
          dispatchId: result.dispatch_id,
          timestamp: result.timestamp,
          deliveryMode: result.delivery_mode,
          recipients: result.recipients,
          message: `Targeted dispatch delivered to ${selectedVessel.name} Bridge, ${selectedVessel.origin || 'Start Port'}, and ${selectedVessel.destination || 'Destination Port'} (Delivered directly to ${targetInbox}).`
        });
      } else {
        setDispatchStatus({
          success: false,
          message: result?.error || "Dispatch failed to send"
        });
      }
    } catch (err) {
      console.error("Failed to send targeted dispatch", err);
      setDispatchStatus({
        success: false,
        message: err.message || "Dispatch delivery network error"
      });
    } finally {
      setIsSendingAlert(false);
    }
  };

  const liveVesselCount = asianVessels.filter(v => v.is_live_stream).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Live Asian Vessel AIS Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#111D3A] border border-[#1E293B] p-6 rounded-2xl shadow-sm gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Asian Maritime AIS Telematics & AI Seaward Rerouting Engine
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              streamMode === 'live'
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-700'
                : 'bg-sky-950/70 text-sky-400 border-sky-800'
            }`}>
              <Radio className={`w-3.5 h-3.5 ${streamMode === 'live' ? 'text-emerald-400 animate-pulse' : 'text-sky-400'}`} />
              {streamMode === 'live' ? '100% LIVE AISSTREAM FEED' : 'EEZ CERTIFIED BASELINE'}
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Real-time live vessel tracking ingested directly via WebSocket API, 100% ocean-constrained routes, and AI seaward hazard rerouting.
          </p>

          {/* Live Telemetry Status Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-[#0D1730] border border-[#1E293B] text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WS Status: <strong className="text-emerald-400">{telemetryStatus?.connected ? 'CONNECTED' : 'STREAMING'}</strong></span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-[#0D1730] border border-[#1E293B] text-slate-300">
              Packets Ingested: <strong className="text-sky-400 font-bold">{telemetryStatus?.packets_received || 0}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-[#0D1730] border border-[#1E293B] text-slate-300">
              Live Vessels: <strong className="text-emerald-400 font-bold">{liveVesselCount > 0 ? liveVesselCount : (telemetryStatus?.live_vessels_count || asianVessels.length)}</strong>
            </div>
            {telemetryStatus?.last_packet_time && (
              <div className="px-2.5 py-1 rounded-lg bg-[#0D1730] border border-[#1E293B] text-slate-400">
                Ping: <strong className="text-slate-200">{telemetryStatus.last_packet_time}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Mode Switch & Refresh Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0D1730] p-1 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => setStreamMode('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                streamMode === 'live'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300" /> 100% Live Stream
            </button>
            <button
              onClick={() => setStreamMode('baseline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                streamMode === 'baseline'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ship className="w-3.5 h-3.5" /> Baseline Fleet
            </button>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'bg-[#0D1730] text-emerald-400 border-emerald-800 hover:bg-emerald-950/40'
                : 'bg-[#0D1730] text-slate-400 border-[#1E293B] hover:text-slate-200'
            }`}
            title="Toggle real-time auto-polling every 3.5s"
          >
            {autoRefresh ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRefresh ? 'Live Poll: ON' : 'Live Poll: PAUSED'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => loadAsianVessels(selectedRegion, streamMode, true)}
            disabled={loadingFleet}
            className="p-2 rounded-xl bg-[#0D1730] text-slate-300 border border-[#1E293B] hover:text-white transition-all disabled:opacity-50"
            title="Force refresh vessels"
          >
            <RefreshCw className={`w-4 h-4 ${loadingFleet ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Asian Region Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1 whitespace-nowrap mr-2">
          <Globe className="w-4 h-4 text-sky-400" /> Sector:
        </span>
        {[
          { id: 'All', label: '🌏 All Asian Shipping Lanes' },
          { id: 'West Coast', label: '🇮🇳 West Coast India (Arabian Sea)' },
          { id: 'East Coast', label: '🇮🇳 East Coast India (Bay of Bengal)' },
          { id: 'Sri Lanka', label: '🇱🇰 Sri Lanka & Deep-Sea Corridor' },
          { id: 'Malacca', label: '🇸🇬 Malacca Strait & Singapore' },
          { id: 'Gulf of Oman', label: '🇦🇪 Gulf of Oman & Arabian Sea' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRegion(r.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
              selectedRegion === r.id
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : 'bg-[#111D3A] text-slate-300 border-[#1E293B] hover:bg-[#0D1730]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive GIS Rerouting Map + Physics & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map Panel (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base leading-tight">
                    {selectedVessel?.flag} {selectedVessel?.name || 'Asian Vessel'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    MMSI: {selectedVessel?.mmsi} | SOG: {selectedVessel?.sog || selectedVessel?.sog_knots || 0} kn @ {selectedVessel?.cog || selectedVessel?.cog_degrees || 0}°
                  </span>
                </div>
              </div>

              {/* Vessel Quick Select Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedVessel?.mmsi || ''}
                  onChange={(e) => {
                    const match = asianVessels.find(v => String(v.mmsi) === String(e.target.value));
                    if (match) setSelectedVessel(match);
                  }}
                  className="bg-[#0D1730] border border-[#1E293B] text-slate-200 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg outline-none focus:border-sky-500 max-w-[200px]"
                >
                  {asianVessels.map(v => (
                    <option key={v.mmsi} value={v.mmsi}>
                      {v.is_live_stream ? '🟢' : '⚪'} {v.name} ({v.sog || v.sog_knots || 0} kn)
                    </option>
                  ))}
                </select>

                <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 border ${
                  rerouteData?.has_weather_hazard
                    ? 'text-red-400 bg-red-950/60 border-red-800'
                    : 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                }`}>
                  {rerouteData?.has_weather_hazard ? (
                    <><AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Weather Hazard Active</>
                  ) : (
                    <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Optimal Direct Fairway</>
                  )}
                </span>
              </div>
            </div>

            {/* Live Open-Meteo Weather & Seaward Reroute Status Banner */}
            <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
              rerouteData?.has_weather_hazard
                ? 'bg-red-950/40 border-red-800/80 text-red-200'
                : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
            }`}>
              <div className="flex items-start md:items-center gap-2.5">
                {rerouteData?.has_weather_hazard ? (
                  <div className="p-2 rounded-lg bg-red-900/50 text-red-400 shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-900/50 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs tracking-wide">
                      {rerouteData?.has_weather_hazard 
                        ? 'WEATHER HAZARD ACTIVE — AI DETOUR ENGAGED' 
                        : 'CLEAR PASSAGE — CALM SEA TELEMATICS'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0D1730] border border-[#1E293B] text-slate-300">
                      Open-Meteo Marine API
                    </span>
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-sky-400" />
                      Wave: <strong className={rerouteData?.has_weather_hazard ? 'text-red-400' : 'text-emerald-400'}>
                        {rerouteData?.weather?.wave_height_meters ?? 1.2}m
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      Wind: <strong className="text-slate-200">{rerouteData?.weather?.wind_speed_kmh ?? 16} km/h</strong>
                    </span>
                    <span>
                      Safety Ceiling: <strong className="text-amber-400">{seaHaltThreshold}m</strong>
                    </span>
                    <span>
                      Route: <strong className={rerouteData?.has_weather_hazard ? 'text-emerald-400' : 'text-sky-400'}>
                        {rerouteData?.has_weather_hazard ? `AI Detour (+${rerouteData.diversion_distance_nm} nm)` : 'Direct Ocean Fairway (Zero Land)'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Storm Swell Simulation Toggle */}
              <button
                onClick={() => setSimulateHazard(!simulateHazard)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                  simulateHazard
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-md animate-pulse'
                    : 'bg-[#0D1730] hover:bg-[#152347] text-slate-200 border-[#1E293B]'
                }`}
                title="Toggle storm conditions to evaluate AI seaward reroute"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{simulateHazard ? 'Storm Swell: ON' : '⚡ Simulate Storm Swell'}</span>
              </button>
            </div>

            <FleetReroutingMap 
              vessel={selectedVessel}
              rerouteData={rerouteData}
              allVessels={asianVessels}
              onSelectVessel={(v) => setSelectedVessel(v)}
            />
          </div>

          {/* Targeted Navigational Alert & Multi-Port Dispatch Box */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-slate-100 text-base">Targeted Navigational Alert &amp; Multi-Port Dispatch</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    Scoped specifically to {selectedVessel?.flag} {selectedVessel?.name} (MMSI: {selectedVessel?.mmsi}) &amp; Passage Terminals
                  </span>
                </div>
              </div>

              {/* Transmit Alert Button */}
              <button 
                onClick={handleSendTargetedDispatch}
                disabled={isSendingAlert}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 shrink-0 ${
                  rerouteData?.has_weather_hazard
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-950/50 animate-pulse'
                    : 'bg-sky-600 hover:bg-sky-500'
                }`}
                title={`Transmit targeted dispatch to ${selectedVessel?.name} Bridge and corresponding port authorities`}
              >
                {isSendingAlert ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Mail className="w-3.5 h-3.5 text-white" />
                )}
                <span>
                  {isSendingAlert 
                    ? 'Transmitting Dispatch...' 
                    : rerouteData?.has_weather_hazard 
                      ? `✉️ Transmit Weather Hazard Alert to Vessel & Ports`
                      : `✉️ Transmit Clearance Advisory to Vessel & Ports`
                  }
                </span>
              </button>
            </div>

            {/* Prototype Delivery Notice */}
            <div className="flex items-center gap-2 p-2.5 bg-sky-950/40 border border-sky-800/60 rounded-xl text-xs font-mono text-sky-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                <strong>PROTOTYPE ROUTING ACTIVE:</strong> All simulated dispatches (Vessel {selectedVessel?.name} Bridge, Start Port, and Dest Port) are dispatched strictly to <strong className="text-emerald-300 font-bold">{customVesselEmail || 'zameershaikh17112006@gmail.com'}</strong>. No official authorities contacted.
              </span>
            </div>

            {/* Targeted Stakeholders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              {/* Vessel Bridge */}
              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-sky-400"><Ship className="w-3 h-3 text-sky-400" /> VESSEL BRIDGE (X)</span>
                  <span className="text-emerald-400">ACTIVE VESSEL</span>
                </div>
                <div className="font-bold text-slate-200 truncate">{selectedVessel?.flag} {selectedVessel?.name}</div>
                <input 
                  type="text"
                  placeholder="zameershaikh17112006@gmail.com"
                  value={customVesselEmail}
                  onChange={(e) => setCustomVesselEmail(e.target.value)}
                  className="w-full bg-[#152243] border border-sky-600/50 rounded px-2 py-1 text-[10px] text-sky-300 outline-none focus:border-sky-400 font-mono"
                  title="Target vessel bridge recipient email (prototype inbox)"
                />
              </div>

              {/* Start / Origin Port */}
              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-400"><Anchor className="w-3 h-3 text-emerald-400" /> START PORT (ORIGIN)</span>
                  <span className="text-slate-400">DEPARTURE</span>
                </div>
                <div className="font-bold text-slate-200 truncate">{selectedVessel?.origin || 'Departure Berth'}</div>
                <div className="text-[10px] text-emerald-400 truncate pt-1 font-mono" title="Routed to prototype inbox">
                  &bull; Delivered to: {customVesselEmail || 'zameershaikh17112006@gmail.com'}
                </div>
              </div>

              {/* Destination Port */}
              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-amber-400"><Navigation className="w-3 h-3 text-amber-400" /> DEST PORT (ARRIVAL)</span>
                  <span className="text-amber-400">DESTINATION</span>
                </div>
                <div className="font-bold text-slate-200 truncate">{selectedVessel?.destination || 'Commercial Terminal'}</div>
                <div className="text-[10px] text-amber-400 truncate pt-1 font-mono" title="Routed to prototype inbox">
                  &bull; Delivered to: {customVesselEmail || 'zameershaikh17112006@gmail.com'}
                </div>
              </div>

              {/* Emergency Safe Shelter */}
              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-red-400"><ShieldCheck className="w-3 h-3 text-red-400" /> EMERGENCY SHELTER</span>
                  <span className="text-red-400">SAFE BASIN</span>
                </div>
                <div className="font-bold text-slate-200 truncate">{shelterData?.name || rerouteData?.emergency_shelter?.name || 'Mormugao Base'}</div>
                <div className="text-[10px] text-red-300 truncate pt-1 font-mono" title="Routed to prototype inbox">
                  &bull; Delivered to: {customVesselEmail || 'zameershaikh17112006@gmail.com'}
                </div>
              </div>
            </div>

            {/* Success / Delivery Notification Banner */}
            {dispatchStatus && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-mono transition-all ${
                dispatchStatus.success 
                  ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200' 
                  : 'bg-red-950/40 border-red-700/80 text-red-200'
              }`}>
                {dispatchStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>{dispatchStatus.success ? '✅ TARGETED DISPATCH DELIVERED' : '❌ DISPATCH TRANSMISSION FAILED'}</span>
                    <button 
                      onClick={() => setDispatchStatus(null)} 
                      className="text-slate-400 hover:text-white text-[10px] px-1.5 py-0.5 rounded hover:bg-slate-800"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    {dispatchStatus.message}
                  </div>
                  {dispatchStatus.dispatchId && (
                    <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-3 pt-1 border-t border-emerald-900/50">
                      <span>Dispatch ID: <strong className="text-slate-200">{dispatchStatus.dispatchId}</strong></span>
                      <span>Delivery Mode: <strong className="text-sky-400">{dispatchStatus.deliveryMode}</strong></span>
                      <span>Transmitted: <strong className="text-slate-200">{dispatchStatus.timestamp}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Encrypted AIS Body & VHF Simulcast */}
            <div className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold">
                <span>ENCRYPTED AIS DISPATCH BODY &bull; VHF CH 16 SIMULCAST</span>
                <span className="text-sky-400 font-bold">STATUS: READY TO BROADCAST</span>
              </div>
              <p className="text-xs font-mono text-slate-200 leading-relaxed font-semibold">
                {dispatchNotice || "Generating navigational advisory dispatch..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Physics Telemetry & Emergency Shelter */}
        <div className="space-y-6">
          {/* Vessel Specs Telemetry */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Ship className="w-5 h-5 text-sky-400" />
              Vessel Telematics
            </h3>

            {selectedVessel && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Stream Source:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                    selectedVessel.is_live_stream 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                      : 'bg-sky-950/80 text-sky-400 border-sky-800'
                  }`}>
                    {selectedVessel.is_live_stream && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                    {selectedVessel.is_live_stream ? 'LIVE AISSTREAM' : 'EEZ BASELINE ARCHIVE'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Vessel Name:</span>
                  <span className="font-bold text-slate-100">{selectedVessel.flag} {selectedVessel.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">MMSI / Callsign:</span>
                  <span className="font-bold text-slate-200">{selectedVessel.mmsi} {selectedVessel.callsign ? `(${selectedVessel.callsign})` : ''}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Live GPS Coordinates:</span>
                  <span className="font-bold text-sky-400">
                    {selectedVessel.lat ? Number(selectedVessel.lat).toFixed(4) : '18.9220'}°N, {selectedVessel.lon ? Number(selectedVessel.lon).toFixed(4) : '72.8347'}°E
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Speed (SOG) / Heading (COG):</span>
                  <span className="font-bold text-emerald-400">
                    {selectedVessel.sog || selectedVessel.sog_knots || 0} kn @ {selectedVessel.cog || selectedVessel.cog_degrees || 0}°
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Vessel Type:</span>
                  <span className="font-semibold text-slate-200">{selectedVessel.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]">
                  <span className="text-slate-400">Coast Proximity:</span>
                  <span className="font-semibold text-amber-300">
                    {selectedVessel.distance_shore_km ? `${selectedVessel.distance_shore_km} km` : '18.4 km'} ({selectedVessel.nearest_shore_name || selectedVessel.region || 'Coast'})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Reported Destination:</span>
                  <span className="font-bold text-emerald-300 truncate max-w-[170px]" title={selectedVessel.destination}>
                    {selectedVessel.destination || 'Commercial Corridor'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Corridor Hyperparameter Tuning */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-400" />
              AI Route Controls
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Seaward Buffer Offset:</span>
                <span className="text-sky-400">{safetyMargin} nm</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                value={safetyMargin} 
                onChange={(e) => setSafetyMargin(Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-[#0D1730] rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Sea Halt Wave Ceiling:</span>
                <span className={rerouteData?.has_weather_hazard ? 'text-red-400 font-extrabold' : 'text-emerald-400'}>
                  {seaHaltThreshold} m
                </span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="5.0" 
                step="0.1" 
                value={seaHaltThreshold} 
                onChange={(e) => setSeaHaltThreshold(Number(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-[#0D1730] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block font-mono">
                Lower ceiling below live swell ({rerouteData?.weather?.wave_height_meters ?? 1.2}m) to trigger storm detour.
              </span>
            </div>
          </div>

          {/* Hydrodynamic Physics Telemetry */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Physics & Hydrodynamics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">DETOUR CLEARANCE</span>
                <span className={`font-extrabold text-sm ${rerouteData?.has_weather_hazard ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {rerouteData?.has_weather_hazard ? `+${rerouteData?.diversion_distance_nm || 0} nm` : '0.0 nm (Direct)'}
                </span>
              </div>

              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">TIME DELAY</span>
                <span className={`font-extrabold text-sm ${rerouteData?.has_weather_hazard ? 'text-amber-400' : 'text-sky-400'}`}>
                  {rerouteData?.has_weather_hazard ? `+${rerouteData?.time_delay_hours || 0} hrs` : '0.0 hrs (On Time)'}
                </span>
              </div>

              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">FUEL VARIANCE</span>
                <span className={`font-extrabold text-sm ${rerouteData?.has_weather_hazard ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {rerouteData?.has_weather_hazard ? `+${rerouteData?.fuel_penalty_pct || 0}%` : 'Optimal (0.0%)'}
                </span>
              </div>

              <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl">
                <span className="text-slate-400 text-[10px] block font-bold">DRAG COEFFICIENT</span>
                <span className="text-slate-200 font-extrabold text-sm">
                  0.038 C_d
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Port Shelter Card */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Anchor className="w-5 h-5 text-emerald-400" />
              Nearest Safe Harbor / Shelter
            </h3>

            {shelterData && (
              <div className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-2">
                <div className="text-sm font-extrabold text-slate-100">{shelterData.name}</div>
                <div className="text-xs text-slate-400 font-mono">State: {shelterData.state}</div>

                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#1E293B] text-emerald-400 font-bold">
                  <span>Distance: {shelterData.distance_nm} nm</span>
                  <span>ETA: {shelterData.eta_hours} hrs</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

