import React, { useState, useEffect, useRef } from 'react';
import { useMarineContext } from '../context/MarineContext';
import { 
  Compass, 
  Wind, 
  Waves, 
  Thermometer, 
  Navigation, 
  Radio, 
  ShieldCheck, 
  Globe, 
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  Ship,
  Calendar,
  Volume2,
  PhoneCall,
  Download,
  FileText,
  Clock,
  Sun,
  Sunset,
  Eye,
  Mail,
  Send,
  CheckCircle2,
  AlertOctagon,
  Loader2
} from 'lucide-react';
import { fetchLocationSafetyReport, dispatchCoastalHazardAlert } from '../services/api';
import { COASTAL_ZONES } from '../services/mockData';

const STATE_REGIONAL_LANGUAGES = {
  "Gujarat": ["Hindi", "Gujarati"],
  "Maharashtra": ["Hindi", "Marathi"],
  "Goa": ["Hindi", "Marathi"],
  "Karnataka": ["Hindi", "Kannada"],
  "Kerala": ["Hindi", "Malayalam"],
  "Tamil Nadu": ["Hindi", "Tamil"],
  "Andhra Pradesh": ["Hindi", "Telugu"],
  "Odisha": ["Hindi", "Odia"],
  "West Bengal": ["Hindi", "Bengali"],
  "Andaman & Nicobar": ["Hindi", "Bengali", "Tamil"],
  "Lakshadweep": ["Hindi", "Malayalam"],
  "Puducherry": ["Hindi", "Tamil"]
};

export default function CoastalCommandPage() {
  const context = useMarineContext();
  
  const coastalZones = context.coastalZones || COASTAL_ZONES;
  const selectedPortKey = context.selectedPortKey || 'mumbai';
  const setSelectedPortKey = context.setSelectedPortKey || (() => {});
  const activePort = context.activePort || coastalZones[selectedPortKey] || { name: 'Mumbai Port Trust', state: 'Maharashtra', lat: 18.9220, lon: 72.8347, region: 'West Coast' };
  const selectedLangLabels = context.selectedLangLabels || ['Hindi (हिन्दी)', 'Marathi (मराठी)'];
  const radarOverlayParam = context.radarOverlayParam || 'waves';

  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry', 'forecast', 'audio', 'emergency'
  const [safetyReport, setSafetyReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isDispatchingSos, setIsDispatchingSos] = useState(false);
  const [sosDispatchStatus, setSosDispatchStatus] = useState(null);
  const [autoAlertStatus, setAutoAlertStatus] = useState(null);
  const autoDispatchedRef = useRef(new Set());

  // Load Safety Report from Live FastAPI Backend with Port-Specific Multilingual Dialects
  useEffect(() => {
    async function loadReport() {
      setLoadingReport(true);
      try {
        const regionalLangs = STATE_REGIONAL_LANGUAGES[activePort.state] || ["Hindi", "Marathi"];
        const userLangs = (selectedLangLabels || []).map(l => l.split(' ')[0]);
        const combinedLangs = Array.from(new Set([...regionalLangs, ...userLangs])).join(',');
        
        const report = await fetchLocationSafetyReport(selectedPortKey, combinedLangs);
        if (report) {
          setSafetyReport(report);
        }
      } catch (err) {
        console.error("Safety report load error", err);
      } finally {
        setLoadingReport(false);
      }
    }
    loadReport();
  }, [selectedPortKey, activePort.state, selectedLangLabels]);

  const metrics = safetyReport?.weather_metrics;
  const safety = safetyReport?.safety_intelligence;

  const lat = activePort?.lat || 18.9220;
  const lon = activePort?.lon || 72.8347;

  const waveH = metrics?.wave_height_m ?? 0.9;
  const waveP = metrics?.wave_period_s ?? 6.5;
  const swellH = metrics?.swell_wave_height_m ?? 0.5;
  const currV = metrics?.ocean_current_velocity_kmh ?? 1.2;
  const currKts = metrics?.ocean_current_velocity_knots ?? (currV * 0.539957).toFixed(1);
  const windKmh = metrics?.wind_speed_kmh ?? 15.0;
  const windKts = (windKmh * 0.539957).toFixed(1);
  const windGusts = metrics?.wind_gusts_kmh ?? 20.0;
  const windDir = metrics?.wind_direction_deg ?? 240;
  const windCompass = metrics?.wind_compass ?? 'WSW';
  const tempC = metrics?.temperature_c ?? 28.0;
  const precip = metrics?.precipitation_mmh ?? 0.0;
  const cloudPct = metrics?.cloud_cover_percent ?? 30;
  const sunrise = metrics?.sunrise || '06:12';
  const sunset = metrics?.sunset || '18:48';

  const beaufort = metrics?.beaufort || { force: 2, desc: 'Light Breeze', sea_state: 'Small wavelets' };
  const douglas = metrics?.douglas || { code: 2, degree: 'Smooth', height: '0.1 - 0.5 m' };

  const threatLevel = safety?.status_code || 'SAFE';
  const alertLevel = safety?.alert_level || 1;
  const englishAdvisory = safety?.english_advisory || `SAFE: Calm sea conditions with ${waveH.toFixed(2)}m waves, light winds (${windKmh} km/h), and favorable atmospheric clarity. Normal fishing and navigation permitted.`;
  const multilingualAdvisories = safety?.multilingual_advisories || {};

  const fleetAllowances = safety?.fleet_allowances || {
    small: { status: 'ALLOWED', desc: 'Safe for beach landings, traditional crafts & near-shore fishing' },
    medium: { status: 'ALLOWED', desc: 'Safe for operational deep-sea fishing & bottom trawling' },
    large: { status: 'ALLOWED', desc: 'Normal commercial navigation permitted' }
  };

  const forecast3h = safetyReport?.forecast_3h || [
    { hour_label: "+1h", temp: (tempC + 0.3).toFixed(1), wind: (windKmh + 1.2).toFixed(1), desc: "Mainly Clear", cloud: 20, precip: 0.0 },
    { hour_label: "+2h", temp: (tempC + 0.6).toFixed(1), wind: (windKmh + 2.0).toFixed(1), desc: "Partly Cloudy", cloud: 35, precip: 0.0 },
    { hour_label: "+3h", temp: (tempC + 0.2).toFixed(1), wind: (windKmh + 1.5).toFixed(1), desc: "Partly Cloudy", cloud: 40, precip: 0.0 }
  ];

  const adjacentHubs = safetyReport?.adjacent_hubs || [];

  // Wave Reference Image Calculation matching Streamlit app
  const exactImageNames = ["0.0", "0.25", "0.50", "1.0", "1.25", "1.5", "1.75", "2.0", "2.25", "2.5", "2.75", "3.0", "3.25", "3.5", "3.75", "4.0"];
  const closestStr = waveH >= 4.0 ? "5.0" : exactImageNames.reduce((prev, curr) => 
    Math.abs(parseFloat(curr) - waveH) < Math.abs(parseFloat(prev) - waveH) ? curr : prev
  );
  const waveImgUrl = `/wave_images/wave_${closestStr}.jpg`;

  // Windy live iframe embed URL matching Streamlit app line 1092
  const windyOverlay = radarOverlayParam === 'wind' ? 'wind' : radarOverlayParam === 'currents' ? 'currents' : 'waves';
  const windyEmbedUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=7&overlay=${windyOverlay}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;

  // Download Report Handlers
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(safetyReport || {}, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MarineGuardian_Advisory_${selectedPortKey}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadTxt = () => {
    const txtContent = `=====================================================
MARINEGUARDIAN | COASTAL EARLY WARNING ADVISORY
=====================================================
Sector: ${activePort.name}, ${activePort.state}
Coordinates: ${lat.toFixed(4)}N, ${lon.toFixed(4)}E
Threat Level: LEVEL ${alertLevel} (${threatLevel})

PHYSICS:
- Wave Height: ${waveH.toFixed(2)}m (Douglas State: ${douglas.degree})
- Ocean Current: ${currV.toFixed(1)} km/h (${currKts} kts)
- Wind Speed: ${windKmh.toFixed(1)} km/h (Beaufort Force: ${beaufort.force} - ${beaufort.desc})
- Wind Gusts: ${windGusts.toFixed(1)} km/h

ENGLISH ADVISORY:
${englishAdvisory}
`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Marine_Bulletin_${selectedPortKey}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Automatic Early Warning Email Dispatch when Sector reaches Alert Level >= 2
  useEffect(() => {
    if (!safetyReport || alertLevel < 2) return;

    const dispatchKey = `${selectedPortKey}_lvl${alertLevel}`;
    if (autoDispatchedRef.current.has(dispatchKey)) return;
    autoDispatchedRef.current.add(dispatchKey);

    const payload = {
      port_key: selectedPortKey,
      port_name: activePort.name,
      state: activePort.state,
      region: activePort.region || 'Coastal Zone',
      lat: lat,
      lon: lon,
      alert_level: alertLevel,
      threat_level: threatLevel,
      english_advisory: englishAdvisory,
      multilingual_advisories: multilingualAdvisories,
      weather_metrics: {
        wave_height_m: waveH,
        wind_speed_kmh: windKmh,
        ocean_current_velocity_kmh: currV,
        temperature_c: tempC,
        swell_wave_height_m: swellH,
        wind_gusts_kmh: windGusts,
        wind_direction_deg: windDir,
        wind_compass: windCompass,
        beaufort: beaufort,
        douglas: douglas
      },
      fleet_allowances: fleetAllowances,
      is_forced: false,
      recipient_email: "zameershaikh17112006@gmail.com"
    };

    dispatchCoastalHazardAlert(payload).then(res => {
      console.log(`[COASTAL ALERT] Automated Alert Level ${alertLevel} email dispatched for ${activePort.name}:`, res);
      if (res?.success) {
        setAutoAlertStatus({
          dispatched: true,
          dispatchId: res.dispatch_id,
          deliveryMode: res.delivery_mode,
          timestamp: res.timestamp,
          portName: activePort.name,
          alertLevel: alertLevel
        });
      }
    }).catch(err => {
      console.error("[COASTAL ALERT] Automated dispatch failed:", err);
    });
  }, [selectedPortKey, alertLevel, safetyReport, activePort, lat, lon, threatLevel, englishAdvisory, multilingualAdvisories, waveH, windKmh, currV, tempC, swellH, windGusts, windDir, windCompass, beaufort, douglas, fleetAllowances]);

  // Manual High-Priority Emergency SOS Broadcast Dispatch
  const handleForceEmergencySos = async () => {
    setIsDispatchingSos(true);
    setSosDispatchStatus(null);
    try {
      const payload = {
        port_key: selectedPortKey,
        port_name: activePort.name,
        state: activePort.state,
        region: activePort.region || 'Coastal Zone',
        lat: lat,
        lon: lon,
        alert_level: Math.max(alertLevel, 3), // Escalated distress alert
        threat_level: threatLevel === 'SAFE' ? 'DANGER (FORCE SOS)' : threatLevel,
        english_advisory: englishAdvisory,
        multilingual_advisories: multilingualAdvisories,
        weather_metrics: {
          wave_height_m: waveH,
          wind_speed_kmh: windKmh,
          ocean_current_velocity_kmh: currV,
          temperature_c: tempC,
          swell_wave_height_m: swellH,
          wind_gusts_kmh: windGusts,
          wind_direction_deg: windDir,
          wind_compass: windCompass,
          beaufort: beaufort,
          douglas: douglas
        },
        fleet_allowances: fleetAllowances,
        is_forced: true,
        recipient_email: "zameershaikh17112006@gmail.com"
      };

      const res = await dispatchCoastalHazardAlert(payload);
      setSosDispatchStatus(res);
    } catch (err) {
      console.error("Manual SOS dispatch error", err);
      setSosDispatchStatus({
        success: false,
        error: err.message || "Failed to transmit emergency SOS dispatch"
      });
    } finally {
      setIsDispatchingSos(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Threat Level Banner (SAFE, CAUTION, DANGER) */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
        threatLevel === 'DANGER' 
          ? 'bg-red-950/40 border-red-800/80 text-red-200'
          : threatLevel === 'CAUTION'
          ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
          : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-xl ${
            threatLevel === 'DANGER' ? 'bg-red-600 text-white' : threatLevel === 'CAUTION' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {threatLevel === 'DANGER' ? <ShieldAlert className="w-6 h-6" /> : threatLevel === 'CAUTION' ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-[#0D1730] border border-[#1E293B] text-slate-100 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold">
                ALERT LEVEL {alertLevel}
              </span>
              <span className="font-extrabold text-base tracking-wide uppercase text-slate-100">
                {threatLevel} CONDITIONS
              </span>
              <span className="text-xs font-medium text-slate-400">
                | Sector: {activePort.name}, {activePort.state} ({activePort.region})
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-slate-200">
              {englishAdvisory}
            </p>
            {autoAlertStatus && (
              <div className="mt-2 text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/60 inline-flex">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automated Alert Level {autoAlertStatus.alertLevel} Email Dispatched &bull; ID: {autoAlertStatus.dispatchId} &bull; Target: zameershaikh17112006@gmail.com</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold text-slate-300">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">COORDINATES</div>
            <div className="text-sky-400 font-extrabold">{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</div>
          </div>
        </div>
      </div>

      {/* 4 Workspace Tabs matching Streamlit */}
      <div className="flex items-center bg-[#111D3A] border border-[#1E293B] p-1.5 rounded-xl gap-2 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border whitespace-nowrap ${
            activeTab === 'telemetry'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730]'
          }`}
        >
          <Waves className="w-4 h-4" />
          🌊 Real-Time Telemetry & Radar
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border whitespace-nowrap ${
            activeTab === 'forecast'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          📅 3-Hour Forecast & Sea States
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border whitespace-nowrap ${
            activeTab === 'audio'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          🗣️ Multi-Dialect Broadcast Studio
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border whitespace-nowrap ${
            activeTab === 'emergency'
              ? 'bg-red-600 text-white border-red-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730]'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          🚨 Emergency SOS & Coast Guard MRCC
        </button>
      </div>

      {/* Tab 1: Real-Time Telemetry & Windy Radar */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Top Section: 6 Metrics + 3-Hour Predictive Weather Cards directly on Tab 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: 6 Hydrodynamic Metric Cards */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-400" /> 🌊 Hydrodynamic & Atmospheric Metrics
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {/* 1. Wave Height */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Wave Height</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{waveH.toFixed(2)} m</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold">
                    ↑ {douglas.degree}
                  </span>
                </div>

                {/* 2. Ocean Current */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Ocean Current</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{currV.toFixed(1)} km/h</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold">
                    ↑ {currKts} kts
                  </span>
                </div>

                {/* 3. Surface Wind */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Surface Wind</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{windKmh.toFixed(1)} km/h</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold truncate">
                    ↑ Force {beaufort.force}
                  </span>
                </div>

                {/* 4. Air Temp */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Air Temp</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{tempC.toFixed(1)} °C</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold">
                    ↑ Clear
                  </span>
                </div>

                {/* 5. Wind Bearing */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Wind Bearing</div>
                  <div className="text-lg font-extrabold text-slate-100 font-mono">{windCompass} ({windDir}°)</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold">
                    ↑ Gusts: {windGusts.toFixed(1)}
                  </span>
                </div>

                {/* 6. Precipitation */}
                <div className="bg-[#111D3A] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Precipitation</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{precip.toFixed(1)} mm/h</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold">
                    ↑ Cloud: {cloudPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: 3-Hour Predictive Weather Cards (+1h, +2h, +3h) */}
            <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" /> ⏱️ 3-Hour Predictive Atmospheric & Wind Vector
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {forecast3h.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#0D1730] border border-[#1E293B] rounded-xl text-center space-y-1">
                    <div className="text-xs font-mono font-extrabold text-sky-400">{item.hour_label || `+${idx+1}h`}</div>
                    <div className="text-lg font-black text-slate-100 font-mono">{item.temp} °C</div>
                    <div className="text-xs font-semibold text-slate-300">💨 {item.wind} km/h</div>
                    <div className="text-[11px] text-slate-400">☁️ {item.cloud}% cloud</div>
                    <div className="text-[11px] font-bold text-sky-300 pt-1.5 border-t border-[#1E293B] mt-1 capitalize">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Fleet Suitability + Live Windy Embed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet Class Suitability & Clearance Matrix */}
            <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 border-b border-[#1E293B] pb-3">
                <Ship className="w-4 h-4 text-sky-400" />
                Fleet Class Suitability & Operating Clearance ({activePort.name})
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#0D1730] border border-[#1E293B] rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛶</span>
                    <div>
                      <div className="font-bold text-xs text-slate-100">Small Crafts (&lt; 12m)</div>
                      <div className="text-[11px] text-slate-400">{fleetAllowances.small?.desc}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                    fleetAllowances.small?.status === 'PROHIBITED' ? 'bg-red-950/60 text-red-400 border-red-800' :
                    fleetAllowances.small?.status === 'CAUTION' ? 'bg-amber-950/60 text-amber-400 border-amber-800' :
                    'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  }`}>
                    {fleetAllowances.small?.status}
                  </span>
                </div>

                <div className="p-3.5 bg-[#0D1730] border border-[#1E293B] rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚤</span>
                    <div>
                      <div className="font-bold text-xs text-slate-100">Mechanized Trawlers (12–24m)</div>
                      <div className="text-[11px] text-slate-400">{fleetAllowances.medium?.desc}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                    fleetAllowances.medium?.status === 'RESTRICTED' ? 'bg-amber-950/60 text-amber-400 border-amber-800' :
                    'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  }`}>
                    {fleetAllowances.medium?.status}
                  </span>
                </div>

                <div className="p-3.5 bg-[#0D1730] border border-[#1E293B] rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚢</span>
                    <div>
                      <div className="font-bold text-xs text-slate-100">Deep-Sea Commercial Vessels (&gt; 24m)</div>
                      <div className="text-[11px] text-slate-400">{fleetAllowances.large?.desc}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg font-mono text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                    {fleetAllowances.large?.status}
                  </span>
                </div>
              </div>

              {/* Astro & Tidal Bar */}
              <div className="p-3.5 bg-[#0D1730] border border-[#1E293B] rounded-xl flex flex-wrap items-center justify-between text-xs font-mono text-slate-200 gap-2">
                <div className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> SUNRISE: <b>{sunrise}</b></div>
                <div className="flex items-center gap-1.5"><Sunset className="w-4 h-4 text-orange-400" /> SUNSET: <b>{sunset}</b></div>
                <div className="flex items-center gap-1.5"><Waves className="w-4 h-4 text-sky-400" /> SWELL (H<sub>sw</sub>): <b>{swellH.toFixed(2)}m</b></div>
                <div className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-emerald-400" /> GUSTS: <b>{windGusts.toFixed(1)} km/h</b></div>
              </div>
            </div>

            {/* Live Windy Interactive Embed Map */}
            <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  Live Windy Interactive Radar Feed: {windyOverlay.toUpperCase()}
                </h4>
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-[#0D1730] px-2.5 py-1 rounded border border-[#1E293B]">
                  Lat: {lat.toFixed(2)}°, Lon: {lon.toFixed(2)}°
                </span>
              </div>

              {/* Windy Embed Iframe matching Streamlit line 1094 */}
              <div className="w-full h-[380px] rounded-xl overflow-hidden border border-[#1E293B]">
                <iframe
                  title="Windy Live Interactive Radar Map"
                  src={windyEmbedUrl}
                  className="w-full h-full border-none"
                  scrolling="no"
                ></iframe>
              </div>

              {/* Adjacent Ports */}
              {adjacentHubs.length > 0 && (
                <div className="p-3 bg-[#0D1730] border border-[#1E293B] rounded-xl text-xs font-mono text-slate-300">
                  <strong className="text-sky-400">📍 ADJACENT MONITORED HUBS ({activePort.state}):</strong><br />
                  {adjacentHubs.join(" • ")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 3-Hour Forecast & Sea State Reference Images */}
      {activeTab === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: 3-Hour Forecast Cards & Beaufort/Douglas Rating */}
          <div className="space-y-6">
            <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" /> 3-Hour Predictive Atmospheric & Wind Vector
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {forecast3h.map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl text-center space-y-1">
                    <div className="text-xs font-mono font-bold text-sky-400">{item.hour_label}</div>
                    <div className="text-xl font-extrabold text-slate-100 font-mono">{item.temp} °C</div>
                    <div className="text-xs text-slate-300">💨 {item.wind} km/h</div>
                    <div className="text-xs text-slate-400">☁️ {item.cloud}% cloud</div>
                    <div className="text-[11px] font-bold text-slate-300 pt-2 border-t border-[#1E293B] mt-2 capitalize">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beaufort & Douglas Rating Cards */}
            <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-400" /> Beaufort Wind Scale Classification
              </h4>
              <div className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex justify-between items-center font-bold text-xs text-slate-100">
                  <span>Beaufort Force {beaufort.force}: {beaufort.desc}</span>
                  <span className="font-mono text-sky-400">{windKmh} km/h ({windKts} kts)</span>
                </div>
                <div className="text-xs text-slate-400">{beaufort.sea_state}</div>
              </div>

              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2 pt-2">
                <Waves className="w-4 h-4 text-sky-400" /> Douglas Sea State Rating
              </h4>
              <div className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-1">
                <div className="flex justify-between items-center font-bold text-xs text-slate-100">
                  <span>Sea State Degree {douglas.code}: {douglas.degree}</span>
                  <span className="font-mono text-sky-400">Hs {waveH.toFixed(2)}m ({douglas.height})</span>
                </div>
                <div className="text-xs text-slate-400">Surface swell assessment for naval operations and coastal fishing safety.</div>
              </div>
            </div>
          </div>

          {/* Right Column: In-Situ Sea State Optical Profile Reference Image */}
          <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" /> In-Situ Sea State Optical Profile
            </h4>

            {/* Display Real Optical Wave Reference Image matching Streamlit line 1181 */}
            <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-slate-950 aspect-video flex items-center justify-center relative">
              <img 
                src={waveImgUrl} 
                alt={`Wave Reference ~${closestStr}m`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-[#1E293B] px-3 py-1 rounded text-xs font-mono text-sky-300 font-bold">
                Optical Reference Profile: ~{closestStr}m Wave Height ({douglas.degree})
              </div>
            </div>

            <div className="p-4 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-400">ACTIVE SEA CLASSIFICATION:</span>
                <span className="text-sky-400 font-extrabold">DOUGLAS STATE {douglas.code} ({douglas.degree?.toUpperCase()})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B] text-slate-300">
                <div>Observed Wave (H<sub>s</sub>): <b>{waveH.toFixed(2)} m</b></div>
                <div>Secondary Swell: <b>{swellH.toFixed(2)} m</b></div>
                <div>Surface Wind: <b>{windKmh.toFixed(1)} km/h</b></div>
                <div>Beaufort Rating: <b>Force {beaufort.force}</b></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Dialect Broadcast Studio */}
      {activeTab === 'audio' && (
        <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#1E293B] pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-400" /> Multilingual Advisory Dissemination
            </h4>
          </div>

          {/* Primary English Advisory */}
          <div className="p-4 bg-[#0D1730] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-sky-400 uppercase">ORIGIN ADVISORY (ENGLISH)</span>
              <span className="px-2 py-0.5 bg-[#111D3A] text-slate-300 rounded border border-[#1E293B]">ORIGIN SOURCE</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">{englishAdvisory}</p>
          </div>

          {/* Multilingual Broadcast Feeds */}
          <div className="space-y-3">
            {Object.entries(multilingualAdvisories).map(([lang, text]) => (
              <div key={lang} className="p-4 bg-[#0D1730] border border-[#1E293B] border-l-4 border-l-sky-500 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-sky-400 uppercase">{lang.toUpperCase()} BROADCAST FEED</span>
                  <span className="px-2 py-0.5 bg-sky-950/60 text-sky-300 rounded border border-sky-800">GRADE-3 LOCALIZED</span>
                </div>
                <p className="text-sm font-semibold text-slate-200 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1E293B]">
            <button 
              onClick={handleDownloadJson}
              className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Maritime Advisory Report (JSON)
            </button>

            <button 
              onClick={handleDownloadTxt}
              className="px-4 py-3 rounded-xl bg-[#0D1730] hover:bg-[#1A284B] border border-[#1E293B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Export Printable Bulletin (TXT)
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Emergency SOS & Coast Guard MRCC */}
      {activeTab === 'emergency' && (
        <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-6 space-y-6">
          {/* Emergency SOS Email Dispatch Card */}
          <div className="p-6 bg-gradient-to-r from-red-950/70 via-[#111D3A] to-slate-900 border-2 border-red-600/80 rounded-2xl space-y-5 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] tracking-wider uppercase font-mono animate-pulse">
                    EMERGENCY DISTRESS DISPATCH
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Master Prototype Routing: <strong className="text-sky-300">zameershaikh17112006@gmail.com</strong>
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  Instant Coastal &amp; Fisherman SOS Broadcast Uplink
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Transmits urgent life-safety storm distress telemetry, localized multilingual broadcasts ({activePort.state}: English + Hindi + {(STATE_REGIONAL_LANGUAGES[activePort.state] || []).filter(l => l !== 'Hindi').join(', ') || 'Regional'}), and operational fleet grounding directives directly via Resend Cloud API.
                </p>
              </div>

              <button
                onClick={handleForceEmergencySos}
                disabled={isDispatchingSos}
                className="px-6 py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-red-600/40 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 border border-red-500 active:scale-95"
              >
                {isDispatchingSos ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Transmitting SOS Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    🚨 Force Emergency SOS Email Dispatch
                  </>
                )}
              </button>
            </div>

            {/* Live Dispatch Transmission Status Banner */}
            {sosDispatchStatus && (
              <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                sosDispatchStatus.success
                  ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                  : 'bg-red-950/60 border-red-600/80 text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {sosDispatchStatus.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Distress SOS Dispatched Successfully!</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon className="w-4 h-4 text-red-400" />
                      <span>SOS Transmission Failure</span>
                    </>
                  )}
                </div>
                {sosDispatchStatus.success ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
                    <div><b>Dispatch ID:</b> <span className="text-sky-300 font-bold">{sosDispatchStatus.dispatch_id}</span></div>
                    <div><b>Delivered To:</b> <span className="text-emerald-300 font-bold">{sosDispatchStatus.recipient}</span></div>
                    <div><b>Delivery Mode:</b> <span className="text-amber-300">{sosDispatchStatus.delivery_mode}</span></div>
                    <div><b>Transmission Timestamp:</b> <span className="text-slate-300">{sosDispatchStatus.timestamp}</span></div>
                  </div>
                ) : (
                  <div className="text-red-300">{sosDispatchStatus.error}</div>
                )}
              </div>
            )}
          </div>

          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <PhoneCall className="w-4 h-4" /> Indian Coast Guard & Maritime Rescue Co-ordination Centres (MRCC)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-red-950/40 border border-red-800/80 border-t-4 border-t-red-600 rounded-xl space-y-2">
              <div className="font-bold text-xs text-red-400 uppercase font-mono">🚨 National SAR Hotline</div>
              <div className="text-3xl font-black font-mono text-slate-100">1554</div>
              <p className="text-xs text-slate-400 font-medium">Toll-free 24x7 Indian Coast Guard Search and Rescue assistance.</p>
            </div>

            <div className="p-5 bg-[#0D1730] border border-[#1E293B] border-t-4 border-t-sky-500 rounded-xl space-y-2">
              <div className="font-bold text-xs text-sky-400 uppercase font-mono">⚓ MRCC Mumbai (West Coast)</div>
              <div className="text-xl font-extrabold font-mono text-slate-100">+91 22 2437 6133</div>
              <p className="text-xs text-slate-400 font-medium">Jurisdiction: Gujarat, Maharashtra, Goa, Karnataka, Kerala, Lakshadweep.</p>
            </div>

            <div className="p-5 bg-[#0D1730] border border-[#1E293B] border-t-4 border-t-sky-500 rounded-xl space-y-2">
              <div className="font-bold text-xs text-sky-400 uppercase font-mono">⚓ MRCC Chennai (East Coast)</div>
              <div className="text-xl font-extrabold font-mono text-slate-100">+91 44 2539 5018</div>
              <p className="text-xs text-slate-400 font-medium">Jurisdiction: Tamil Nadu, Andhra Pradesh, Odisha, West Bengal, Puducherry.</p>
            </div>
          </div>

          <div className="p-5 bg-[#0D1730] border border-[#1E293B] rounded-xl space-y-3">
            <h5 className="font-bold text-xs text-slate-200 font-mono flex items-center gap-2">
              📡 Marine VHF Distress Frequencies & SOP:
            </h5>
            <ul className="text-xs text-slate-400 space-y-1.5 font-medium list-disc list-inside">
              <li><strong>International Distress Channel:</strong> VHF Channel 16 (156.800 MHz)</li>
              <li><strong>Digital Selective Calling (DSC):</strong> VHF Channel 70 (156.525 MHz)</li>
              <li><strong>NAVTEX Broadcast:</strong> 518 kHz (English) and 490 kHz (National Language)</li>
              <li><strong>Emergency Position Indicating Radio Beacon (EPIRB):</strong> 406 MHz Satellite Uplink</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
