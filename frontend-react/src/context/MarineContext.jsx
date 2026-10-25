import React, { createContext, useContext, useState } from 'react';
import { 
  COASTAL_ZONES, 
  ALL_INDIA_FLEET_DATABASE, 
  GLOBAL_OIL_SLICKS, 
  getCachedHsiScene, 
  getCachedDebrisVideoFrame 
} from '../services/mockData';

const MarineContext = createContext();

export const MarineProvider = ({ children }) => {
  const [activeHubKey, setActiveHubKey] = useState('mumbai');
  const [selectedLangLabels, setSelectedLangLabels] = useState(['Hindi (हिन्दी)', 'Marathi (मराठी)']);
  const [selectedOilSlickName, setSelectedOilSlickName] = useState(GLOBAL_OIL_SLICKS[0].name);
  const [selectedMmsi, setSelectedMmsi] = useState(ALL_INDIA_FLEET_DATABASE[0].mmsi);
  const [radarOverlayParam, setRadarOverlayParam] = useState('waves');
  const [regionFilter, setRegionFilter] = useState('All Indian EEZ & Coasts');
  const [motionFilter, setMotionFilter] = useState('All Ships');

  // Cached state for satellite GIS components to prevent tab-switch flickering
  const [cachedHsiData, setCachedHsiData] = useState(() => getCachedHsiScene('Mangrove Intertidal', 0));
  const [cachedDebrisData, setCachedDebrisData] = useState(() => getCachedDebrisVideoFrame(0));

  const activeHub = COASTAL_ZONES[activeHubKey] || COASTAL_ZONES.mumbai;
  
  // Format fleet database with sog and cog shorthand properties
  const liveVessels = ALL_INDIA_FLEET_DATABASE.map(v => ({
    ...v,
    sog: v.sog_knots ?? v.sog ?? 14.2,
    cog: v.cog_degrees ?? v.cog ?? 180,
    mmsi: Number(v.mmsi)
  }));

  const activeVessel = liveVessels.find(v => Number(v.mmsi) === Number(selectedMmsi)) || liveVessels[0];
  const activeSlick = GLOBAL_OIL_SLICKS.find(s => s.name === selectedOilSlickName) || GLOBAL_OIL_SLICKS[0];

  const satelliteConstellation = [
    { name: 'Sentinel-1A SAR Radar', status: 'ONLINE', pass_time: '14 mins ago' },
    { name: 'Sentinel-2B MSI Optical', status: 'ONLINE', pass_time: '1 hr ago' },
    { name: 'SkyTruth Slick Pipeline', status: 'ACTIVE', pass_time: 'Realtime' }
  ];

  const setSelectedVessel = (vessel) => {
    if (!vessel) return;
    const mmsiVal = typeof vessel === 'object' ? vessel.mmsi : vessel;
    setSelectedMmsi(mmsiVal);
  };

  return (
    <MarineContext.Provider value={{
      // Core state
      activeHubKey, 
      setActiveHubKey,
      activeHub,
      selectedLangLabels, 
      setSelectedLangLabels,
      selectedOilSlickName, 
      setSelectedOilSlickName,
      activeSlick,
      selectedMmsi, 
      setSelectedMmsi,
      activeVessel,
      radarOverlayParam, 
      setRadarOverlayParam,
      regionFilter, 
      setRegionFilter,
      motionFilter, 
      setMotionFilter,

      // Caching to prevent tab flicker
      cachedHsiData,
      setCachedHsiData,
      cachedDebrisData,
      setCachedDebrisData,

      // Convenient Aliases for Page Components
      coastalZones: COASTAL_ZONES,
      selectedPortKey: activeHubKey,
      setSelectedPortKey: setActiveHubKey,
      activePort: activeHub,
      oilSpills: GLOBAL_OIL_SLICKS,
      liveVessels: liveVessels,
      selectedVessel: activeVessel,
      setSelectedVessel: setSelectedVessel,
      satelliteConstellation: satelliteConstellation
    }}>
      {children}
    </MarineContext.Provider>
  );
};

export const useMarineContext = () => {
  const context = useContext(MarineContext);
  if (!context) {
    throw new Error('useMarineContext must be used within a MarineProvider');
  }
  return context;
};

export default MarineContext;
