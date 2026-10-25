import axios from 'axios';
import { ALL_ASIAN_FLEET_DATABASE } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Fetch AISStream Live Status
export const fetchAisStreamStatus = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/fleet/status`, { timeout: 4000 });
    return res.data;
  } catch (err) {
    return {
      is_running: false,
      connected: false,
      packets_received: 0,
      live_vessels_count: 0,
      last_packet_time: null
    };
  }
};

// Fetch Asian Live AIS Vessels
export const fetchAsianLiveVessels = async (region = 'All', motion = 'All', mode = 'live') => {
  try {
    const res = await axios.get(`${API_BASE_URL}/fleet/asia-live-vessels`, {
      params: { region, motion, mode },
      timeout: 6000
    });
    const vessels = res.data?.vessels || ALL_ASIAN_FLEET_DATABASE;
    if (res.data?.telemetry_status) {
      vessels.telemetryStatus = res.data.telemetry_status;
    }
    return vessels;
  } catch (err) {
    console.warn("Using local Asian fleet database fallback", err);
    return ALL_ASIAN_FLEET_DATABASE;
  }
};

// Fetch Live Weather & Reroute Intelligence for Selected Vessel
export const fetchVesselRerouteIntelligence = async ({
  mmsi = null,
  lat = 18.922,
  lon = 72.834,
  destLat = null,
  destLon = null,
  safetyMargin = 15.0,
  seaHaltThreshold = 2.5,
  simulateHazard = false
}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/fleet/vessel-reroute-intelligence`, {
      params: {
        mmsi,
        lat,
        lon,
        dest_lat: destLat,
        dest_lon: destLon,
        safety_margin: safetyMargin,
        sea_halt_threshold: seaHaltThreshold,
        simulate_hazard: simulateHazard
      },
      timeout: 8000
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching vessel reroute intelligence", err);
    return null;
  }
};

// Dispatch Targeted Maritime Hazard Alert for Vessel X to Bridge, Origin, and Destination Ports
export const dispatchVesselHazardAlert = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/fleet/dispatch-vessel-alert`, payload, {
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    console.error("Error dispatching vessel hazard alert", err);
    return {
      success: false,
      error: err.response?.data?.detail || err.message || "Dispatch delivery failed"
    };
  }
};

// Dispatch Coastal Hazard & Fisherman Alert (Email + MRCC Broadcast)
export const dispatchCoastalHazardAlert = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/command/dispatch-coastal-alert`, payload, {
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    console.error("Error dispatching coastal hazard alert", err);
    return {
      success: false,
      error: err.response?.data?.detail || err.message || "Dispatch delivery failed"
    };
  }
};

// Fetch Stations
export const fetchCoastalStations = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/stations`, { timeout: 5000 });
    return res.data?.stations || [];
  } catch (err) {
    console.error("Failed to fetch stations", err);
    return [];
  }
};

// Fetch Marine Safety Report for Coastal Command
export const fetchLocationSafetyReport = async (location = 'mumbai', langs = 'Hindi,Marathi') => {
  try {
    const res = await axios.get(`${API_BASE_URL}/marine-safety`, {
      params: { location, langs },
      timeout: 8000
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch location safety report", err);
    return null;
  }
};

// Fetch Global Oil Slicks (SkyTruth Cerulean)
export const fetchGlobalSpills = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/spills/global`, { timeout: 8000 });
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch global spills", err);
    return [];
  }
};

// Fetch Real SAR HSI Test Scene (ResNet34 U-Net inference from backend)
export const fetchHsiScene = async (ecoCategory = 'Mangrove Intertidal', sceneIndex = 0, imageIndex = null) => {
  try {
    const params = { eco_category: ecoCategory, scene_index: sceneIndex };
    if (imageIndex !== null && imageIndex !== undefined) {
      params.image_index = imageIndex;
    }
    const res = await axios.get(`${API_BASE_URL}/spills/hsi-scene`, {
      params,
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch HSI scene", err);
    return null;
  }
};

// Fetch Debris Video Frame (YOLOv8 inference from real MP4 video)
export const fetchDebrisVideoFrame = async (frameIdx = 0) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/vision/debris-video-frame`, {
      params: { frame_idx: frameIdx },
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch debris video frame", err);
    return null;
  }
};

// Run custom image inference for oil spill segmentation
export const runOilSpillInference = async (file = null, threshold = 0.55) => {
  try {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('threshold', threshold);

    const res = await axios.post(`${API_BASE_URL}/vision/inference-oil-spill`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000
    });
    return res.data;
  } catch (err) {
    console.error("Failed to run oil spill inference", err);
    return null;
  }
};

// Run custom image inference for marine debris detection
export const runDebrisInference = async (file = null, confThreshold = 0.25) => {
  try {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('conf_threshold', confThreshold);

    const res = await axios.post(`${API_BASE_URL}/vision/inference-debris`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000
    });
    return res.data;
  } catch (err) {
    console.error("Failed to run debris inference", err);
    return null;
  }
};

// Helper: Great-Circle nautical distance in NM
function getDistanceNm(lat1, lon1, lat2, lon2) {
  const rKm = 6371.0;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (rKm * c) * 0.539957;
}

// Certified Safe Shelters along Indian Coastline
const SHELTER_PORTS = [
  { name: "Mormugao Deepwater Base", state: "Goa", lat: 15.4055, lon: 73.7931, depth_m: 14.5 },
  { name: "Jaigad Deepwater Bay", state: "Maharashtra", lat: 17.3000, lon: 73.2100, depth_m: 12.0 },
  { name: "Mumbai Port Trust", state: "Maharashtra", lat: 18.9220, lon: 72.8347, depth_m: 11.5 },
  { name: "New Mangalore Port", state: "Karnataka", lat: 12.8797, lon: 74.8426, depth_m: 13.0 },
  { name: "Cochin Seaport", state: "Kerala", lat: 9.9312, lon: 76.2673, depth_m: 12.5 },
  { name: "Tuticorin Protected Basin", state: "Tamil Nadu", lat: 8.7642, lon: 78.1348, depth_m: 13.8 },
  { name: "Chennai Harbor Basin", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, depth_m: 14.0 },
  { name: "Visakhapatnam Inner Harbor", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, depth_m: 16.5 },
  { name: "Paradip Protected Lagoon", state: "Odisha", lat: 20.3168, lon: 86.6111, depth_m: 14.2 },
  { name: "Port Blair Haddo Basin", state: "Andaman & Nicobar", lat: 11.6234, lon: 92.7265, depth_m: 12.0 }
];

// Rerouting Corridor Calculation using Authentic Vessel Waypoints
export const calculateRerouteCorridor = async (vessel, safetyMargin = 15, seaHaltThreshold = 4.5) => {
  const startLat = vessel?.lat || 18.922;
  const startLon = vessel?.lon || 72.834;
  const destLat = vessel?.dest_lat || (startLat + 1.5);
  const destLon = vessel?.dest_lon || (startLon + 1.5);

  // 1. Actual waterway track from vessel's authentic route_waypoints
  const actualTrack = (vessel?.route_waypoints && vessel.route_waypoints.length >= 2)
    ? vessel.route_waypoints
    : [
        [startLat, startLon],
        [Number(((startLat + destLat) / 2).toFixed(4)), Number(((startLon + destLon) / 2).toFixed(4))],
        [destLat, destLon]
      ];

  // Total direct distance along actual track
  let directDistNm = 0;
  for (let i = 0; i < actualTrack.length - 1; i++) {
    directDistNm += getDistanceNm(actualTrack[i][0], actualTrack[i][1], actualTrack[i+1][0], actualTrack[i+1][1]);
  }
  if (directDistNm < 0.1) directDistNm = 45.0;

  // 2. Determine midpoint along actual track for hazard placement
  const midIdx = Math.floor(actualTrack.length / 2);
  const midPoint = actualTrack[midIdx] || [(startLat + destLat) / 2, (startLon + destLon) / 2];
  const hLat = midPoint[0];
  const hLon = midPoint[1];

  // Seaward buffer offset based on safetyMargin (nm) converted to degrees (~1 nm = 0.0166 deg)
  const offsetDeg = Math.min(0.35, Math.max(0.12, (safetyMargin / 60) * 0.8));
  const coast = vessel?.coast || vessel?.region || '';
  const isEastCoast = coast.includes('East') || (startLon > 80.0 && destLon > 80.0);

  // Build AI Detour Track as a smooth seaward parallel bypass that reconnects at origin/destination
  const aiDetourTrack = actualTrack.map((pt, idx) => {
    // Keep start and end exact at port berth
    if (idx === 0 || idx === actualTrack.length - 1) {
      return pt;
    }

    // Compute segment direction vector
    const prevPt = actualTrack[idx - 1];
    const nextPt = actualTrack[idx + 1] || pt;
    const dLat = nextPt[0] - prevPt[0];
    const dLon = nextPt[1] - prevPt[1];
    const len = Math.hypot(dLat, dLon) || 1.0;

    // Perpendicular normal vector
    let nLat = -dLon / len;
    let nLon = dLat / len;

    // Orient normal vector seaward into open water
    if (isEastCoast) {
      if (nLon < 0) { nLat = -nLat; nLon = -nLon; } // Point East towards Bay of Bengal
    } else {
      if (nLon > 0) { nLat = -nLat; nLon = -nLon; } // Point West towards Arabian Sea
    }

    // Scale offset slightly higher around the hazard midpoint
    const weight = (idx === midIdx) ? 1.4 : 0.8;
    const detourLat = Number((pt[0] + nLat * offsetDeg * weight).toFixed(4));
    const detourLon = Number((pt[1] + nLon * offsetDeg * weight).toFixed(4));

    return [detourLat, detourLon];
  });

  // Calculate detour distance
  let detourDistNm = 0;
  for (let i = 0; i < aiDetourTrack.length - 1; i++) {
    detourDistNm += getDistanceNm(aiDetourTrack[i][0], aiDetourTrack[i][1], aiDetourTrack[i+1][0], aiDetourTrack[i+1][1]);
  }

  const extraDistanceNm = Math.max(5.2, Number((detourDistNm - directDistNm + (safetyMargin * 0.3)).toFixed(1)));
  const sog = vessel?.sog || vessel?.sog_knots || 14.0;
  const timeDelayHours = Number((extraDistanceNm / sog).toFixed(1));
  const fuelPenaltyPct = Number(((extraDistanceNm / directDistNm) * 100 + 1.2).toFixed(1));

  // 3. Dynamic Hazard Polygon centered offshore around midpoint
  const polyRadius = 0.20;
  const hazardPolygon = [
    [hLat + polyRadius, hLon - polyRadius * 1.2],
    [hLat + polyRadius * 0.8, hLon + polyRadius * 1.3],
    [hLat - polyRadius * 0.9, hLon + polyRadius * 0.8],
    [hLat - polyRadius * 0.7, hLon - polyRadius * 1.1],
    [hLat + polyRadius, hLon - polyRadius * 1.2]
  ];

  // 4. Sea Halt Checkpoint
  const waveHeightSim = 3.6 + (Math.sin(startLat + startLon) * 1.2);
  const isHaltTriggered = waveHeightSim >= seaHaltThreshold;
  
  // Halt point placed ~15km prior to hazard midpoint along track
  const prevPoint = actualTrack[Math.max(0, midIdx - 1)] || actualTrack[0];
  const haltLat = Number((hLat - (hLat - prevPoint[0]) * 0.4).toFixed(4));
  const haltLon = Number((hLon - (hLon - prevPoint[1]) * 0.4).toFixed(4));
  const seaHaltPoint = [haltLat, haltLon];

  return {
    vessel_mmsi: vessel?.mmsi,
    diversion_distance_nm: extraDistanceNm,
    time_delay_hours: timeDelayHours,
    fuel_penalty_pct: fuelPenaltyPct,
    actual_track: actualTrack,
    ai_detour_track: aiDetourTrack,
    hazard_polygon: hazardPolygon,
    sea_halt_point: seaHaltPoint,
    has_weather_hazard: isHaltTriggered,
    is_halt_triggered: isHaltTriggered,
    wave_height_sim: Number(waveHeightSim.toFixed(1))
  };
};

export const calculateEmergencyShelter = (lat, lon) => {
  let closest = SHELTER_PORTS[0];
  let minDist = Infinity;

  for (const port of SHELTER_PORTS) {
    const dist = getDistanceNm(lat, lon, port.lat, port.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = port;
    }
  }

  const etaHours = Number((minDist / 10.0).toFixed(1)); // 10 knots heavy weather speed
  return {
    name: closest.name,
    state: closest.state,
    lat: closest.lat,
    lon: closest.lon,
    distance_nm: Number(minDist.toFixed(1)),
    eta_hours: etaHours
  };
};

export const fetchMarineWeatherData = async (lat, lon) => {
  return {
    wind_speed: 18.4,
    wind_direction: 240,
    wave_height: 2.4,
    wave_period: 6.2,
    sst: 28.5,
  };
};

