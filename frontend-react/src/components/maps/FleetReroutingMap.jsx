import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

// Custom vessel marker generator with rotation according to COG
const createVesselIcon = (cog = 0, isSelected = false, isLive = false) => {
  const color = isSelected ? '#38bdf8' : isLive ? '#10b981' : '#0284c7';
  const glow = isSelected 
    ? 'filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.9));' 
    : isLive 
      ? 'filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.8));' 
      : '';
  const pulseRing = isSelected 
    ? `<div style="position: absolute; width: 40px; height: 40px; border: 2px solid #38bdf8; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.8;"></div>` 
    : isLive 
      ? `<div style="position: absolute; width: 34px; height: 34px; border: 1px dashed #10b981; border-radius: 50%; opacity: 0.6;"></div>` 
      : '';
  const liveBadge = isLive && !isSelected
    ? `<div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background-color: #10b981; border: 1.5px solid white; border-radius: 50%;"></div>`
    : '';

  const svgHtml = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
      ${pulseRing}
      ${liveBadge}
      <div style="transform: rotate(${cog}deg); display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; ${glow}">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-vessel-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Origin Port Icon
const originIcon = L.divIcon({
  html: `
    <div style="background-color: #10b981; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 10px; font-family: monospace; border: 2px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
      <span>⚓</span> START
    </div>
  `,
  className: 'custom-origin-icon',
  iconSize: [64, 24],
  iconAnchor: [32, 12],
});

// Destination Port Icon
const destIcon = L.divIcon({
  html: `
    <div style="background-color: #0284c7; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 10px; font-family: monospace; border: 2px solid white; box-shadow: 0 0 10px rgba(2, 132, 199, 0.6); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
      <span>🏁</span> DEST
    </div>
  `,
  className: 'custom-dest-icon',
  iconSize: [64, 24],
  iconAnchor: [32, 12],
});

// Checkpoint icon
const seaHaltIcon = L.divIcon({
  html: `
    <div style="background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: bold; font-size: 10px; font-family: monospace; border: 2px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
      <span>🛑</span> SEA HALT
    </div>
  `,
  className: 'custom-sea-halt-icon',
  iconSize: [80, 24],
  iconAnchor: [40, 12],
});

// Map Recenter Helper
function RecenterMap({ center, zoom, routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length >= 2) {
      try {
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [60, 60] });
      } catch (e) {
        if (center && center[0] && center[1]) {
          map.setView(center, zoom || 7);
        }
      }
    } else if (center && center[0] && center[1]) {
      map.setView(center, zoom || 7);
    }
  }, [center, zoom, routeCoords, map]);
  return null;
}

export default function FleetReroutingMap({ 
  vessel, 
  rerouteData, 
  allVessels = [], 
  onSelectVessel 
}) {
  const vesselLat = vessel?.lat || 18.9220;
  const vesselLon = vessel?.lon || 72.8347;

  // Actual Route coordinates (Solid Blue #0284C7)
  const actualRouteCoords = (rerouteData?.actual_track && rerouteData.actual_track.length >= 2) 
    ? rerouteData.actual_track 
    : (vessel?.route_waypoints && vessel.route_waypoints.length >= 2)
      ? vessel.route_waypoints
      : [
          [vesselLat, vesselLon],
          [vessel?.dest_lat || (vesselLat + 1.2), vessel?.dest_lon || (vesselLon + 1.1)]
        ];

  // AI Detour Route coordinates (Solid Green #10B981) - strictly ONLY when live weather hazard exists
  const aiDetourCoords = (rerouteData?.has_weather_hazard && rerouteData?.ai_detour_track && rerouteData.ai_detour_track.length >= 2) 
    ? rerouteData.ai_detour_track 
    : null;

  // Hazard Polygon - strictly ONLY when live weather hazard exists
  const hazardPolygonCoords = (rerouteData?.has_weather_hazard && rerouteData?.hazard_polygon && rerouteData.hazard_polygon.length >= 3)
    ? rerouteData.hazard_polygon
    : null;

  // Sea Halt Checkpoint - strictly ONLY when live weather hazard exists
  const seaHaltCoord = (rerouteData?.has_weather_hazard && rerouteData?.sea_halt_point) 
    ? rerouteData.sea_halt_point 
    : null;

  const originCoord = actualRouteCoords[0];
  const destCoord = actualRouteCoords[actualRouteCoords.length - 1];

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <MapContainer
        center={[vesselLat, vesselLon]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={[vesselLat, vesselLon]} zoom={7} routeCoords={actualRouteCoords} />

        {/* Hazard Zone Overlay Polygon */}
        {hazardPolygonCoords && hazardPolygonCoords.length >= 3 && (
          <Polygon
            positions={hazardPolygonCoords}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.3,
              weight: 2,
              dashArray: '5, 5'
            }}
          >
            <Popup>
              <div className="text-xs p-1 font-sans text-slate-100">
                <div className="font-bold text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Hazard Zone
                </div>
                <p className="text-slate-300 mt-1">Severe wave swells / Oil slick spill corridor detected.</p>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Solid Blue Line: Original / Current Vessel Track */}
        {actualRouteCoords && actualRouteCoords.length >= 2 && (
          <Polyline
            positions={actualRouteCoords}
            pathOptions={{
              color: '#0284c7',
              weight: 4,
              opacity: 0.9,
            }}
          >
            <Popup>
              <div className="text-xs font-sans font-semibold text-sky-400">
                Original Navigation Waypoint Corridor
              </div>
            </Popup>
          </Polyline>
        )}

        {/* Solid Green Line: Optimized AI Bypass Route */}
        {aiDetourCoords && aiDetourCoords.length >= 2 && (
          <Polyline
            positions={aiDetourCoords}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              opacity: 0.95,
              dashArray: '8, 8'
            }}
          >
            <Popup>
              <div className="text-xs font-sans font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Seaward Bypass Corridor (+{rerouteData?.diversion_distance_nm || 18.4} nm offset)
              </div>
            </Popup>
          </Polyline>
        )}

        {/* Origin Port Marker */}
        {originCoord && (
          <Marker position={originCoord} icon={originIcon}>
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-100">
                <div className="font-bold text-emerald-400">⚓ ORIGIN PORT / DEPARTURE</div>
                <div className="text-slate-300 font-semibold">{vessel?.origin || 'Departure Terminal'}</div>
                <div className="text-slate-400 font-mono text-[10px] mt-0.5">
                  GPS: {originCoord[0].toFixed(4)}°N, {originCoord[1].toFixed(4)}°E
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Port Marker */}
        {destCoord && (
          <Marker position={destCoord} icon={destIcon}>
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-100">
                <div className="font-bold text-sky-400">🏁 DESTINATION PORT / ARRIVAL</div>
                <div className="text-slate-300 font-semibold">{vessel?.destination || 'Arrival Terminal'}</div>
                <div className="text-slate-400 font-mono text-[10px] mt-0.5">
                  GPS: {destCoord[0].toFixed(4)}°N, {destCoord[1].toFixed(4)}°E
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Sea Halt Checkpoint Marker */}
        {seaHaltCoord && seaHaltCoord[0] && seaHaltCoord[1] && (
          <Marker position={seaHaltCoord} icon={seaHaltIcon}>
            <Popup>
              <div className="text-xs font-sans text-slate-100">
                <div className="font-bold text-red-400">🛑 Operational Sea Halt Line</div>
                <p className="text-slate-300 mt-1">Wave height exceeds 4.5m safety threshold. Emergency stop required.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Other Fleet Vessels */}
        {allVessels && allVessels.map((v) => {
          if (!v || !v.lat || !v.lon) return null;
          const isSelected = vessel && String(vessel.mmsi) === String(v.mmsi);
          const isLive = Boolean(v.is_live_stream);
          return (
            <Marker
              key={v.mmsi || `${v.lat}-${v.lon}`}
              position={[v.lat, v.lon]}
              icon={createVesselIcon(v.cog || v.cog_degrees || 0, isSelected, isLive)}
              eventHandlers={{
                click: () => onSelectVessel && onSelectVessel(v),
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs text-slate-100 min-w-[190px]">
                  <div className="font-bold text-sky-400 flex items-center justify-between gap-1">
                    <span className="truncate">{v.flag} {v.name}</span>
                    {isLive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        LIVE AIS
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 font-mono text-[10px] mt-0.5">MMSI: {v.mmsi}</div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] text-slate-300 font-mono bg-slate-900/60 p-1.5 rounded">
                    <div>SOG: <span className="font-bold text-emerald-400">{v.sog || v.sog_knots || 0} kn</span></div>
                    <div>COG: <span className="font-bold text-sky-400">{v.cog || v.cog_degrees || 0}°</span></div>
                    <div className="col-span-2 truncate">Type: <span className="text-slate-200">{v.type}</span></div>
                    <div className="col-span-2 truncate text-slate-400">
                      Dest: <span className="text-emerald-300 font-semibold">{v.destination || 'Maritime Corridor'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{v.nearest_shore_name || v.region || 'Asian Waters'}</span>
                    <span className="text-sky-400 font-bold">Click to Plan</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Dynamic Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-2 text-slate-200 font-mono">
        <div className="font-bold text-slate-100 font-sans border-b border-slate-800 pb-1 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-sky-400" />
          Navigational Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>Live AISStream Ingested Vessel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-white"></span>
          <span>Selected Target Ship</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-sky-500 rounded"></span>
          <span>Actual Navigational Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-emerald-500 rounded border border-dashed border-emerald-300"></span>
          <span>AI Seaward Detour (Active on Weather Hazard)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/40 border border-red-500"></span>
          <span>Weather Hazard Swell / Gale Zone</span>
        </div>
      </div>
    </div>
  );
}

