import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup, useMap } from 'react-leaflet';
import { GLOBAL_OIL_SLICKS } from '../../services/mockData';

const MapRecenter = ({ center }) => {
  const map = useMap();
  if (center && center[0] && center[1]) {
    map.setView(center, 5);
  }
  return null;
};

export const GlobalOilSpillMap = ({ coastalZones = {}, oilSpills = [], selectedPortKey = 'mumbai', onSelectPort }) => {
  const selectedZone = coastalZones[selectedPortKey] || coastalZones['mumbai'] || { lat: 18.9220, lon: 72.8347 };
  const centerPos = [selectedZone.lat, selectedZone.lon];

  const slicksList = oilSpills && oilSpills.length > 0 ? oilSpills : GLOBAL_OIL_SLICKS;

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <MapContainer
        center={centerPos}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={centerPos} />

        {/* Coastal Ports Markers */}
        {Object.entries(coastalZones).map(([key, zone]) => (
          <CircleMarker
            key={key}
            center={[zone.lat, zone.lon]}
            radius={key === selectedPortKey ? 8 : 5}
            pathOptions={{
              color: key === selectedPortKey ? '#0284c7' : '#0369a1',
              fillColor: key === selectedPortKey ? '#38bdf8' : '#0284c7',
              fillOpacity: 0.85,
              weight: key === selectedPortKey ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onSelectPort && onSelectPort(key),
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-100">
                <div className="font-bold text-sky-400">{zone.name}</div>
                <div className="text-slate-400 font-mono text-[11px]">{zone.state} ({zone.region})</div>
                <div className="text-[10px] text-slate-300 font-semibold mt-1">Lat: {zone.lat.toFixed(4)}°, Lon: {zone.lon.toFixed(4)}°</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Global Oil Slicks Polygons */}
        {slicksList.map((slick, idx) => {
          // Convert GeoJSON [lon, lat] coordinates to Leaflet [lat, lon]
          let polygonCoords = [];
          if (slick.polygon && Array.isArray(slick.polygon) && slick.polygon.length > 0) {
            polygonCoords = slick.polygon;
          } else if (slick.coordinates && Array.isArray(slick.coordinates) && slick.coordinates.length > 0) {
            polygonCoords = slick.coordinates.map(([lon, lat]) => [lat, lon]);
          } else if (slick.lat && slick.lon) {
            polygonCoords = [
              [slick.lat - 0.05, slick.lon - 0.05],
              [slick.lat + 0.05, slick.lon - 0.05],
              [slick.lat + 0.05, slick.lon + 0.05],
              [slick.lat - 0.05, slick.lon + 0.05],
            ];
          }

          if (!polygonCoords || polygonCoords.length < 3) return null;

          return (
            <Polygon
              key={slick.id || slick.name || `slick-${idx}`}
              positions={polygonCoords}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.4,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs space-y-1 text-slate-100">
                  <div className="font-bold text-red-400">{slick.name}</div>
                  <div className="text-slate-300 text-[11px]">Area: <strong className="font-mono">{slick.area_km2 || slick.area_sqkm || 37.8} km²</strong></div>
                  <div className="text-slate-300 text-[11px]">Source: <strong className="font-mono">{slick.vessel_name || slick.possible_source || 'Unknown Tanker'}</strong></div>
                  <div className="text-slate-400 text-[10px] font-mono">Verified: {slick.time || slick.detection_date || 'Live S1 SAR'}</div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Map Footer Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-4 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-400 border border-white"></span>
          <span>Indian Seaports</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/50 border border-red-500"></span>
          <span>SkyTruth SAR Slick</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalOilSpillMap;
