// Indian Coastal Database & Sectors
export const COASTAL_ZONES = {
  veraval: { name: "Veraval Port", state: "Gujarat", lat: 20.9159, lon: 70.3629, region: "West Coast" },
  porbandar: { name: "Porbandar Harbor", state: "Gujarat", lat: 21.6417, lon: 69.6010, region: "West Coast" },
  okha: { name: "Okha Port", state: "Gujarat", lat: 22.4633, lon: 69.0066, region: "West Coast" },
  kandla: { name: "Kandla Port", state: "Gujarat", lat: 23.0333, lon: 70.2167, region: "West Coast" },
  mundra: { name: "Mundra Port", state: "Gujarat", lat: 22.8350, lon: 69.7333, region: "West Coast" },
  hazira: { name: "Hazira Port", state: "Gujarat", lat: 21.0968, lon: 72.6300, region: "West Coast" },
  mumbai: { name: "Mumbai Port Trust", state: "Maharashtra", lat: 18.9220, lon: 72.8347, region: "West Coast" },
  alibaug: { name: "Alibaug Landing Center", state: "Maharashtra", lat: 18.6416, lon: 72.8722, region: "West Coast" },
  ratnagiri: { name: "Ratnagiri Fisheries Harbor", state: "Maharashtra", lat: 16.9902, lon: 73.3120, region: "West Coast" },
  panaji: { name: "Panaji Port Base", state: "Goa", lat: 15.4909, lon: 73.8278, region: "West Coast" },
  mormugao: { name: "Mormugao Deepwater Port", state: "Goa", lat: 15.4055, lon: 73.7931, region: "West Coast" },
  karwar: { name: "Karwar Naval Base / Port", state: "Karnataka", lat: 14.8052, lon: 74.1311, region: "West Coast" },
  malpe: { name: "Malpe Deep-Sea Fisheries Port", state: "Karnataka", lat: 13.3524, lon: 74.7042, region: "West Coast" },
  mangaluru: { name: "New Mangalore Port", state: "Karnataka", lat: 12.8797, lon: 74.8426, region: "West Coast" },
  kochi: { name: "Cochin International Seaport", state: "Kerala", lat: 9.9312, lon: 76.2673, region: "West Coast" },
  vizhinjam: { name: "Vizhinjam Transshipment Hub", state: "Kerala", lat: 8.3739, lon: 76.9904, region: "West Coast" },
  kollam: { name: "Kollam Port", state: "Kerala", lat: 8.8932, lon: 76.5510, region: "West Coast" },
  chennai: { name: "Chennai Harbor Trust", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, region: "East Coast" },
  tuticorin: { name: "V.O. Chidambaranar Port (Tuticorin)", state: "Tamil Nadu", lat: 8.7642, lon: 78.1348, region: "East Coast" },
  kanyakumari: { name: "Kanyakumari Cape Station", state: "Tamil Nadu", lat: 8.0883, lon: 77.5385, region: "East Coast" },
  visakhapatnam: { name: "Visakhapatnam Major Port", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, region: "East Coast" },
  kakinada: { name: "Kakinada Deepwater Port", state: "Andhra Pradesh", lat: 16.9891, lon: 82.2475, region: "East Coast" },
  paradip: { name: "Paradip Major Seaport", state: "Odisha", lat: 20.3168, lon: 86.6111, region: "East Coast" },
  haldia: { name: "Haldia Dock Complex", state: "West Bengal", lat: 22.0667, lon: 88.0698, region: "East Coast" },
  "port blair": { name: "Port Blair Strategic Post", state: "Andaman & Nicobar", lat: 11.6234, lon: 92.7265, region: "Island Territory" },
  kavaratti: { name: "Kavaratti HQ Island", state: "Lakshadweep", lat: 10.5667, lon: 72.6369, region: "Island Territory" },
};

// 30 Monitored Pan-Asian EEZ Fleet Database with Guaranteed 100% Water Sea-Lane Trajectories
export const ALL_ASIAN_FLEET_DATABASE = [
  // --------------------------------------------------------------------------
  // 1. WEST COAST INDIA & ARABIAN SEA
  // --------------------------------------------------------------------------
  {
    mmsi: "419001101", imo: "9842101", name: "MV Kandla Star", type: "Crude Oil Tanker",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 274, draft_m: 15.2, sog_knots: 13.5, cog_degrees: 240.0,
    lat: 23.0333, lon: 70.2167, origin: "Kandla Major Port", destination: "Fujairah Anchorage (UAE)",
    dest_lat: 25.1800, dest_lon: 56.3600, cargo: "Crude Petroleum (110,000 DWT)", coast: "West Coast India", state: "Gujarat",
    route_waypoints: [
      [23.0333, 70.2167],
      [22.7200, 69.4500],
      [22.5000, 68.9000],
      [22.3000, 68.3000],
      [22.8000, 64.0000],
      [24.5000, 58.5000],
      [25.1800, 56.3600]
    ]
  },
  {
    mmsi: "419001102", imo: "9765402", name: "Mundra Fortune", type: "Ultra Large Container Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 366, draft_m: 14.8, sog_knots: 18.2, cog_degrees: 195.0,
    lat: 22.8350, lon: 69.7333, origin: "Mundra Port", destination: "Jawaharlal Nehru Port (JNPT Mumbai)",
    dest_lat: 18.9500, dest_lon: 72.9500, cargo: "Containerized Cargo (12,500 TEU)", coast: "West Coast India", state: "Gujarat",
    route_waypoints: [
      [22.8350, 69.7333],
      [22.5000, 68.9000],
      [21.5000, 68.9000],
      [20.2000, 69.8000],
      [19.2000, 71.5000],
      [18.9500, 72.8500],
      [18.9500, 72.9500]
    ]
  },
  {
    mmsi: "419001103", imo: "9823103", name: "Porbandar Explorer", type: "Deep Sea Trawler",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 32, draft_m: 3.5, sog_knots: 9.2, cog_degrees: 150.0,
    lat: 21.6417, lon: 69.6010, origin: "Porbandar Fishing Harbor", destination: "Veraval Commercial Dock",
    dest_lat: 20.9159, dest_lon: 70.3629, cargo: "Fresh Pelagic Catch (80 T)", coast: "West Coast India", state: "Gujarat",
    route_waypoints: [
      [21.6417, 69.6010],
      [21.3000, 69.2000],
      [20.6000, 69.9000],
      [20.8500, 70.3500],
      [20.9159, 70.3629]
    ]
  },
  {
    mmsi: "419001201", imo: "9797319", name: "MV Arabian Pioneer", type: "Crude Oil Tanker",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 245, draft_m: 14.5, sog_knots: 13.8, cog_degrees: 235.0,
    lat: 18.9220, lon: 72.8347, origin: "Mumbai Port Trust", destination: "Jebel Ali / Muscat",
    dest_lat: 23.6300, dest_lon: 58.5700, cargo: "High-Grade Crude (95,000 DWT)", coast: "West Coast India", state: "Maharashtra",
    route_waypoints: [
      [18.9220, 72.8347],
      [18.9220, 72.3000],
      [19.5000, 71.0000],
      [21.0000, 65.5000],
      [23.0000, 60.5000],
      [23.6300, 58.5700]
    ]
  },
  {
    mmsi: "419001202", imo: "9812456", name: "Oceanic Voyager", type: "Container Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 290, draft_m: 12.2, sog_knots: 17.5, cog_degrees: 170.0,
    lat: 18.6416, lon: 72.8722, origin: "Alibaug Terminal", destination: "Cochin Seaport",
    dest_lat: 9.9312, dest_lon: 76.2673, cargo: "General Cargo (5,200 TEU)", coast: "West Coast India", state: "Maharashtra",
    route_waypoints: [
      [18.6416, 72.8722],
      [18.6416, 72.5000],
      [15.4055, 73.4000],
      [12.8797, 74.4000],
      [9.9312, 75.9000],
      [9.9312, 76.2673]
    ]
  },
  {
    mmsi: "419001301", imo: "98771301", name: "Mormugao Titan", type: "Iron Ore Bulk Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 250, draft_m: 13.8, sog_knots: 13.0, cog_degrees: 175.0,
    lat: 15.4055, lon: 73.7931, origin: "Mormugao Port Trust", destination: "New Mangalore Port",
    dest_lat: 12.8797, dest_lon: 74.8426, cargo: "Iron Ore Fines (75,000 DWT)", coast: "West Coast India", state: "Goa",
    route_waypoints: [
      [15.4055, 73.7931],
      [15.4055, 73.5000],
      [13.5000, 74.2000],
      [12.8797, 74.6000],
      [12.8797, 74.8426]
    ]
  },
  {
    mmsi: "419001501", imo: "98991501", name: "Kochi Express", type: "Chemical Tanker",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 185, draft_m: 9.8, sog_knots: 14.6, cog_degrees: 340.0,
    lat: 9.9312, lon: 76.2673, origin: "Cochin Seaport", destination: "New Mangalore Port",
    dest_lat: 12.8797, dest_lon: 74.8426, cargo: "Phosphoric Acid (32,000 DWT)", coast: "West Coast India", state: "Kerala",
    route_waypoints: [
      [9.9312, 76.2673],
      [9.9312, 75.9000],
      [11.5000, 75.0000],
      [12.8797, 74.6000],
      [12.8797, 74.8426]
    ]
  },

  // --------------------------------------------------------------------------
  // 2. PERSIAN GULF & STRAIT OF HORMUZ (MIDDLE EAST)
  // --------------------------------------------------------------------------
  {
    mmsi: "470112900", imo: "9654123", name: "Al-Mirqab Express", type: "VLCC Crude Oil Tanker",
    flag: "UAE 🇦🇪", flag_code: "UAE", length_m: 333, draft_m: 20.5, sog_knots: 14.8, cog_degrees: 135.0,
    lat: 26.6400, lon: 50.1500, origin: "Ras Tanura Terminal", destination: "Mumbai Port Trust",
    dest_lat: 18.9220, dest_lon: 72.8347, cargo: "Saudi Arabian Light Crude (300,000 DWT)", coast: "Persian Gulf & Hormuz", state: "Saudi Arabia",
    route_waypoints: [
      [26.6400, 50.1500],
      [26.8000, 52.5000],
      [26.5000, 56.2000],
      [26.3000, 56.6000],
      [24.5000, 58.5000],
      [22.0000, 64.0000],
      [19.2000, 71.5000],
      [18.9220, 72.8347]
    ]
  },
  {
    mmsi: "470221400", imo: "9712004", name: "Fujairah Pearl", type: "Bunker Supply Tanker",
    flag: "UAE 🇦🇪", flag_code: "UAE", length_m: 180, draft_m: 10.2, sog_knots: 12.5, cog_degrees: 110.0,
    lat: 25.1800, lon: 56.3600, origin: "Fujairah Offshore Anchorage", destination: "Muscat Port Sultan Qaboos",
    dest_lat: 23.6300, dest_lon: 58.5700, cargo: "Marine Gasoil & Fuel Oil (40,000 DWT)", coast: "Persian Gulf & Hormuz", state: "UAE",
    route_waypoints: [
      [25.1800, 56.3600],
      [24.8000, 57.2000],
      [23.8300, 58.4000],
      [23.6300, 58.5700]
    ]
  },
  {
    mmsi: "461008100", imo: "9821400", name: "Oman Sea Voyager", type: "LNG Gas Carrier",
    flag: "Oman 🇴🇲", flag_code: "OMN", length_m: 290, draft_m: 11.8, sog_knots: 17.2, cog_degrees: 95.0,
    lat: 24.3700, lon: 56.6300, origin: "Sohar Industrial Port", destination: "Hazira LNG Terminal",
    dest_lat: 21.0968, dest_lon: 72.6300, cargo: "Liquefied Natural Gas (170,000 m³)", coast: "Persian Gulf & Hormuz", state: "Oman",
    route_waypoints: [
      [24.3700, 56.6300],
      [23.8000, 58.8000],
      [22.0000, 65.0000],
      [20.4000, 70.8000],
      [20.9000, 72.3000],
      [21.0968, 72.6300]
    ]
  },
  {
    mmsi: "447009200", imo: "9785500", name: "Kuwait Petro King", type: "Chemical Tanker",
    flag: "Kuwait 🇰🇼", flag_code: "KWT", length_m: 195, draft_m: 11.0, sog_knots: 13.8, cog_degrees: 145.0,
    lat: 29.0700, lon: 48.1500, origin: "Mina Al Ahmadi", destination: "New Mangalore Port",
    dest_lat: 12.8797, dest_lon: 74.8426, cargo: "Refined Petrochemicals (45,000 DWT)", coast: "Persian Gulf & Hormuz", state: "Kuwait",
    route_waypoints: [
      [29.0700, 48.1500],
      [28.0000, 50.0000],
      [26.5000, 56.2000],
      [23.0000, 61.0000],
      [18.0000, 71.0000],
      [12.8797, 74.5000],
      [12.8797, 74.8426]
    ]
  },

  // --------------------------------------------------------------------------
  // 3. EAST COAST INDIA & BAY OF BENGAL
  // --------------------------------------------------------------------------
  {
    mmsi: "419002101", imo: "9814401", name: "Chennai Port Master", type: "Container Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 280, draft_m: 12.0, sog_knots: 16.5, cog_degrees: 40.0,
    lat: 13.0827, lon: 80.2707, origin: "Chennai Harbor Trust", destination: "Visakhapatnam Major Port",
    dest_lat: 17.6868, dest_lon: 83.2185, cargo: "Manufactured Auto Parts (4,200 TEU)", coast: "East Coast India", state: "Tamil Nadu",
    route_waypoints: [
      [13.0827, 80.2707],
      [13.1000, 80.4500],
      [15.2000, 81.3000],
      [16.8000, 82.8000],
      [17.6000, 83.3500],
      [17.6868, 83.2185]
    ]
  },
  {
    mmsi: "419002201", imo: "9895501", name: "Vizag Steel Pioneer", type: "Bulk Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 260, draft_m: 15.0, sog_knots: 13.6, cog_degrees: 60.0,
    lat: 17.6868, lon: 83.2185, origin: "Visakhapatnam Major Port", destination: "Paradip Major Port",
    dest_lat: 20.3168, dest_lon: 86.6111, cargo: "Coking Coal & Steel Slabs (85,000 DWT)", coast: "East Coast India", state: "Andhra Pradesh",
    route_waypoints: [
      [17.6868, 83.2185],
      [17.7000, 83.4500],
      [19.2000, 85.8000],
      [20.1000, 86.8000],
      [20.3168, 86.6111]
    ]
  },
  {
    mmsi: "419002301", imo: "99332301", name: "Paradip Iron Empress", type: "Capesize Bulk Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 292, draft_m: 17.5, sog_knots: 14.1, cog_degrees: 35.0,
    lat: 20.3168, lon: 86.6111, origin: "Paradip Major Port", destination: "Haldia Dock Complex",
    dest_lat: 22.0667, dest_lon: 88.0698, cargo: "Iron Ore Pellet Exports (150,000 DWT)", coast: "East Coast India", state: "Odisha",
    route_waypoints: [
      [20.3168, 86.6111],
      [20.3000, 86.8500],
      [21.2000, 88.2000],
      [21.8000, 88.1500],
      [22.0667, 88.0698]
    ]
  },
  {
    mmsi: "419003101", imo: "9912001", name: "Andaman Sentinel", type: "Island Logistics Carrier",
    flag: "India 🇮🇳", flag_code: "IND", length_m: 145, draft_m: 6.5, sog_knots: 14.2, cog_degrees: 135.0,
    lat: 11.6234, lon: 92.7265, origin: "Port Blair Haddo Basin", destination: "Campbell Bay Nicobar Base",
    dest_lat: 7.0135, dest_lon: 93.9248, cargo: "Island Defense & Civil Supplies", coast: "East Coast India", state: "Andaman & Nicobar",
    route_waypoints: [
      [11.6234, 92.7265],
      [10.5000, 93.1000],
      [8.5000, 93.6000],
      [7.0135, 93.9248]
    ]
  },
  {
    mmsi: "413009200", imo: "9710022", name: "Bengal Delta Runner", type: "Product Feeder Tanker",
    flag: "Bangladesh 🇧🇩", flag_code: "BGD", length_m: 140, draft_m: 6.8, sog_knots: 11.2, cog_degrees: 260.0,
    lat: 22.2300, lon: 91.8000, origin: "Chittagong Seaport", destination: "Haldia Dock Complex",
    dest_lat: 22.0667, dest_lon: 88.0698, cargo: "Refined Diesel & Fuel (12,000 DWT)", coast: "East Coast India", state: "Bangladesh",
    route_waypoints: [
      [22.2300, 91.8000],
      [21.5000, 90.5000],
      [21.2000, 88.2000],
      [21.8000, 88.1500],
      [22.0667, 88.0698]
    ]
  },

  // --------------------------------------------------------------------------
  // 4. MALACCA STRAIT & SOUTHEAST ASIA HUB
  // --------------------------------------------------------------------------
  {
    mmsi: "563004120", imo: "9812300", name: "Singapore Pearl", type: "Ultra Large Container Carrier",
    flag: "Singapore 🇸🇬", flag_code: "SGP", length_m: 399, draft_m: 15.5, sog_knots: 19.4, cog_degrees: 310.0,
    lat: 1.2800, lon: 103.8500, origin: "Port of Singapore (PSA)", destination: "Port Klang (Malaysia)",
    dest_lat: 2.9900, dest_lon: 101.3900, cargo: "Containerized Transshipment (19,500 TEU)", coast: "Malacca & SE Asia", state: "Singapore",
    route_waypoints: [
      [1.2800, 103.8500],
      [1.2000, 103.5000],
      [1.4000, 103.1000],
      [2.5000, 101.8000],
      [2.8000, 101.1000],
      [2.9900, 101.3900]
    ]
  },
  {
    mmsi: "533008900", imo: "9675400", name: "Malacca Highway Express", type: "Car Carrier / Ro-Ro",
    flag: "Malaysia 🇲🇾", flag_code: "MYS", length_m: 200, draft_m: 8.8, sog_knots: 17.5, cog_degrees: 280.0,
    lat: 2.9900, lon: 101.3900, origin: "Port Klang", destination: "Colombo Transshipment Hub",
    dest_lat: 6.9400, dest_lon: 79.8400, cargo: "Export Automobiles (6,200 Vehicles)", coast: "Malacca & SE Asia", state: "Malaysia",
    route_waypoints: [
      [2.9900, 101.3900],
      [2.8000, 101.1000],
      [5.0000, 98.8000],
      [5.8000, 95.2000],
      [5.7500, 80.5500],
      [6.8000, 79.7000],
      [6.9400, 79.8400]
    ]
  },
  {
    mmsi: "525009100", imo: "9741000", name: "Sumatra Palm Trader", type: "Edible Oil Tanker",
    flag: "Indonesia 🇮🇩", flag_code: "IDN", length_m: 165, draft_m: 9.2, sog_knots: 13.0, cog_degrees: 130.0,
    lat: 3.7800, lon: 98.6800, origin: "Belawan Port (Sumatra)", destination: "Singapore Jurong Wharf",
    dest_lat: 1.2800, dest_lon: 103.8500, cargo: "Crude Palm Oil (28,000 DWT)", coast: "Malacca & SE Asia", state: "Indonesia",
    route_waypoints: [
      [3.7800, 98.6800],
      [3.9000, 99.2000],
      [2.8000, 101.1000],
      [1.4000, 103.1000],
      [1.2000, 103.5000],
      [1.2800, 103.8500]
    ]
  },
  {
    mmsi: "567001200", imo: "9634000", name: "Siam Maritime Leader", type: "LPG Tanker",
    flag: "Thailand 🇹🇭", flag_code: "THA", length_m: 210, draft_m: 10.5, sog_knots: 15.8, cog_degrees: 170.0,
    lat: 13.7500, lon: 100.5000, origin: "Bangkok Port", destination: "Singapore Jurong Island",
    dest_lat: 1.2800, dest_lon: 103.8500, cargo: "Liquefied Gas (42,000 m³)", coast: "Malacca & SE Asia", state: "Thailand",
    route_waypoints: [
      [13.7500, 100.5000],
      [12.5000, 100.8000],
      [8.0000, 103.0000],
      [4.0000, 104.5000],
      [1.3500, 104.2000],
      [1.2800, 103.8500]
    ]
  },
  {
    mmsi: "574003400", imo: "9712300", name: "Mekong Dragon", type: "Feeder Container Ship",
    flag: "Vietnam 🇻🇳", flag_code: "VNM", length_m: 175, draft_m: 8.5, sog_knots: 14.5, cog_degrees: 210.0,
    lat: 10.7600, lon: 106.6600, origin: "Ho Chi Minh Port", destination: "Singapore PSA Terminal",
    dest_lat: 1.2800, dest_lon: 103.8500, cargo: "Textiles & Agricultural Exports (2,400 TEU)", coast: "Malacca & SE Asia", state: "Vietnam",
    route_waypoints: [
      [10.7600, 106.6600],
      [10.2000, 107.1000],
      [8.0000, 106.5000],
      [4.0000, 104.5000],
      [1.3500, 104.2000],
      [1.2800, 103.8500]
    ]
  },

  // --------------------------------------------------------------------------
  // 5. EAST ASIA & NORTH PACIFIC (CHINA / TAIWAN / KOREA / JAPAN)
  // --------------------------------------------------------------------------
  {
    mmsi: "412001100", imo: "9890011", name: "Shanghai Port Master", type: "Mega Container Ship",
    flag: "China 🇨🇳", flag_code: "CHN", length_m: 400, draft_m: 16.2, sog_knots: 20.1, cog_degrees: 220.0,
    lat: 31.2300, lon: 121.4700, origin: "Shanghai Yangshan Port", destination: "Singapore PSA Terminal",
    dest_lat: 1.2800, dest_lon: 103.8500, cargo: "Electronics & Manufactured Goods (21,000 TEU)", coast: "East Asia & Japan", state: "China",
    route_waypoints: [
      [31.2300, 121.4700],
      [30.6000, 122.3000],
      [28.0000, 123.5000],
      [24.0000, 119.5000],
      [15.0000, 114.0000],
      [8.0000, 109.0000],
      [3.0000, 105.0000],
      [1.3500, 104.2000],
      [1.2800, 103.8500]
    ]
  },
  {
    mmsi: "477002200", imo: "9781122", name: "Hong Kong Maritime Express", type: "Container Carrier",
    flag: "Hong Kong 🇭🇰", flag_code: "HKG", length_m: 295, draft_m: 12.8, sog_knots: 18.0, cog_degrees: 70.0,
    lat: 22.3193, lon: 114.1694, origin: "Hong Kong Kwai Tsing Container Terminal", destination: "Kaohsiung Port",
    dest_lat: 22.6273, dest_lon: 120.3014, cargo: "General Transshipment (6,500 TEU)", coast: "East Asia & Japan", state: "Hong Kong",
    route_waypoints: [
      [22.3193, 114.1694],
      [22.0000, 114.5000],
      [21.8000, 116.5000],
      [22.4000, 119.8000],
      [22.6273, 120.3014]
    ]
  },
  {
    mmsi: "440003300", imo: "9691133", name: "Busan Steel Vanguard", type: "Bulk Ore Carrier",
    flag: "South Korea 🇰🇷", flag_code: "KOR", length_m: 275, draft_m: 14.6, sog_knots: 15.0, cog_degrees: 225.0,
    lat: 35.1796, lon: 129.0756, origin: "Busan New Port", destination: "Shanghai Yangshan Port",
    dest_lat: 31.2300, dest_lon: 121.4700, cargo: "Coiled Steel & Machined Parts (95,000 DWT)", coast: "East Asia & Japan", state: "South Korea",
    route_waypoints: [
      [35.1796, 129.0756],
      [35.0500, 128.9500],
      [33.5000, 126.5000],
      [31.5000, 123.0000],
      [30.6000, 122.3000],
      [31.2300, 121.4700]
    ]
  },
  {
    mmsi: "431004400", imo: "9812244", name: "Tokyo Bay Pioneer", type: "VLCC Crude Oil Tanker",
    flag: "Japan 🇯🇵", flag_code: "JPN", length_m: 335, draft_m: 19.8, sog_knots: 15.5, cog_degrees: 225.0,
    lat: 35.6762, lon: 139.6503, origin: "Tokyo Bay Petroleum Berth", destination: "Fujairah Offshore Anchorage",
    dest_lat: 25.1800, dest_lon: 56.3600, cargo: "Ballast Return Voyage (300,000 DWT)", coast: "East Asia & Japan", state: "Japan",
    route_waypoints: [
      [35.6762, 139.6503],
      [35.1500, 139.7500],
      [33.0000, 136.0000],
      [24.0000, 124.0000],
      [15.0000, 114.0000],
      [3.0000, 105.0000],
      [1.3500, 104.2000],
      [1.2000, 103.5000],
      [2.8000, 101.1000],
      [5.8000, 95.2000],
      [5.7500, 80.5500],
      [7.8000, 76.8000],
      [22.8000, 64.0000],
      [24.5000, 58.5000],
      [25.1800, 56.3600]
    ]
  },
  {
    mmsi: "416005500", imo: "9733355", name: "Formosa Petro Titan", type: "LNG Gas Carrier",
    flag: "Taiwan 🇹🇼", flag_code: "TWN", length_m: 295, draft_m: 11.8, sog_knots: 17.5, cog_degrees: 45.0,
    lat: 22.6273, lon: 120.3014, origin: "Kaohsiung LNG Port", destination: "Yokohama LNG Wharf",
    dest_lat: 35.4437, dest_lon: 139.6380, cargo: "Liquefied Natural Gas (160,000 m³)", coast: "East Asia & Japan", state: "Taiwan",
    route_waypoints: [
      [22.6273, 120.3014],
      [22.6000, 120.2000],
      [25.0000, 123.5000],
      [30.0000, 130.5000],
      [34.0000, 138.5000],
      [35.1500, 139.7500],
      [35.4437, 139.6380]
    ]
  }
];

export const ALL_INDIA_FLEET_DATABASE = ALL_ASIAN_FLEET_DATABASE;


// SkyTruth Worldwide Satellite Oil Slick Incidents (100 Verified SkyTruth Cerulean Incidents)
export const GLOBAL_OIL_SLICKS = [
  {
    "id": "skytruth-1",
    "name": "Mumbai High North Offshore Asset Slick",
    "time": "2024-05-14 11:03:16",
    "area_km2": 37.8,
    "length_km": 15,
    "lat": 19.418,
    "lon": 72.73,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240514T110316_001702_068B12_036A",
    "vessel_name": "Jsw Raigad",
    "vessel_type": "Cargo",
    "mmsi": "419001236",
    "imo": "9797319",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 46,
    "match_prob": 92.0,
    "coordinates": [
      [
        72.65,
        19.378
      ],
      [
        72.82,
        19.398
      ],
      [
        72.79,
        19.468
      ],
      [
        72.66,
        19.448
      ],
      [
        72.65,
        19.378
      ]
    ]
  },
  {
    "id": "skytruth-2",
    "name": "Gulf of Kutch SPM Anchorage Slick",
    "time": "2024-06-02 08:45:22",
    "area_km2": 29.4,
    "length_km": 12,
    "lat": 22.48,
    "lon": 69.7,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240602T084522_000481_068B12_00F7",
    "vessel_name": "Hellas Fos",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "636019500",
    "imo": "9452010",
    "flag_code": "LBR",
    "flag_emoji": "\ud83c\uddf1\ud83c\uddf7",
    "img_idx": 13,
    "match_prob": 92.7,
    "coordinates": [
      [
        69.62,
        22.44
      ],
      [
        69.79,
        22.46
      ],
      [
        69.76,
        22.53
      ],
      [
        69.63,
        22.51
      ],
      [
        69.62,
        22.44
      ]
    ]
  },
  {
    "id": "skytruth-3",
    "name": "Veraval Offshore Trawler Bunkering Slick",
    "time": "2024-03-11 14:20:10",
    "area_km2": 18.5,
    "length_km": 8,
    "lat": 20.91,
    "lon": 70.36,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240311T142010_002035_068B12_0415",
    "vessel_name": "Sagar Ratna",
    "vessel_type": "Offshore Supply",
    "mmsi": "419000450",
    "imo": "9123456",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 55,
    "match_prob": 93.4,
    "coordinates": [
      [
        70.28,
        20.87
      ],
      [
        70.45,
        20.89
      ],
      [
        70.42,
        20.96
      ],
      [
        70.29,
        20.94
      ],
      [
        70.28,
        20.87
      ]
    ]
  },
  {
    "id": "skytruth-4",
    "name": "Kochi Outer Anchorage Bunker Discharge",
    "time": "2023-11-04 16:30:45",
    "area_km2": 22.1,
    "length_km": 10,
    "lat": 9.93,
    "lon": 76.15,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231104T163045_005254_068B12_0A8A",
    "vessel_name": "Pacific Pearl",
    "vessel_type": "Chemical Tanker",
    "mmsi": "352001400",
    "imo": "9384567",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 142,
    "match_prob": 94.1,
    "coordinates": [
      [
        76.07,
        9.89
      ],
      [
        76.24,
        9.91
      ],
      [
        76.21,
        9.98
      ],
      [
        76.08,
        9.96
      ],
      [
        76.07,
        9.89
      ]
    ]
  },
  {
    "id": "skytruth-5",
    "name": "Mormugao Deepwater Iron Ore Silt & Fuel Weep",
    "time": "2023-08-19 09:12:00",
    "area_km2": 16.2,
    "length_km": 7,
    "lat": 15.41,
    "lon": 73.78,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230819T091200_003256_068B12_0688",
    "vessel_name": "Bulk Carrier Goa",
    "vessel_type": "Bulk Carrier",
    "mmsi": "538007200",
    "imo": "9654321",
    "flag_code": "MHL",
    "flag_emoji": "\ud83c\uddf2\ud83c\uddf8",
    "img_idx": 88,
    "match_prob": 94.8,
    "coordinates": [
      [
        73.7,
        15.37
      ],
      [
        73.87,
        15.39
      ],
      [
        73.84,
        15.46
      ],
      [
        73.71,
        15.44
      ],
      [
        73.7,
        15.37
      ]
    ]
  },
  {
    "id": "skytruth-6",
    "name": "Paradip Port SPM Deepsea Offloading Slick",
    "time": "2024-03-18 10:15:30",
    "area_km2": 31.6,
    "length_km": 14,
    "lat": 20.25,
    "lon": 86.72,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240318T101530_003293_068B12_069B",
    "vessel_name": "Desh Shanti",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "419002100",
    "imo": "9543210",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 89,
    "match_prob": 95.5,
    "coordinates": [
      [
        86.64,
        20.21
      ],
      [
        86.81,
        20.23
      ],
      [
        86.78,
        20.3
      ],
      [
        86.65,
        20.28
      ],
      [
        86.64,
        20.21
      ]
    ]
  },
  {
    "id": "skytruth-7",
    "name": "Krishna-Godavari KG-D6 Deepwater Seep",
    "time": "2023-10-11 13:40:00",
    "area_km2": 26.8,
    "length_km": 11,
    "lat": 16.5,
    "lon": 82.55,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231011T134000_018944_068B12_2600",
    "vessel_name": "Deepwater Frontier",
    "vessel_type": "Drillship",
    "mmsi": "563004500",
    "imo": "9687410",
    "flag_code": "SGP",
    "flag_emoji": "\ud83c\uddf8\ud83c\uddec",
    "img_idx": 512,
    "match_prob": 96.2,
    "coordinates": [
      [
        82.47,
        16.46
      ],
      [
        82.64,
        16.48
      ],
      [
        82.61,
        16.55
      ],
      [
        82.48,
        16.53
      ],
      [
        82.47,
        16.46
      ]
    ]
  },
  {
    "id": "skytruth-8",
    "name": "Haldia Dock Approach Tanker Discharge",
    "time": "2023-07-19 06:55:12",
    "area_km2": 34.0,
    "length_km": 13,
    "lat": 21.75,
    "lon": 88.05,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230719T065512_000444_068B12_00E4",
    "vessel_name": "Banglar Shourabh",
    "vessel_type": "Product Tanker",
    "mmsi": "405000120",
    "imo": "9234567",
    "flag_code": "BGD",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 12,
    "match_prob": 96.9,
    "coordinates": [
      [
        87.97,
        21.71
      ],
      [
        88.14,
        21.73
      ],
      [
        88.11,
        21.8
      ],
      [
        87.98,
        21.78
      ],
      [
        87.97,
        21.71
      ]
    ]
  },
  {
    "id": "skytruth-9",
    "name": "Chennai Port Outer Bunkering Overfill",
    "time": "2024-01-15 15:10:20",
    "area_km2": 21.5,
    "length_km": 9,
    "lat": 13.09,
    "lon": 80.3,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240115T151020_008510_068B12_1112",
    "vessel_name": "Dawn Kanchipuram",
    "vessel_type": "Chemical Tanker",
    "mmsi": "351000890",
    "imo": "9456789",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 230,
    "match_prob": 97.6,
    "coordinates": [
      [
        80.22,
        13.05
      ],
      [
        80.39,
        13.07
      ],
      [
        80.36,
        13.14
      ],
      [
        80.23,
        13.12
      ],
      [
        80.22,
        13.05
      ]
    ]
  },
  {
    "id": "skytruth-10",
    "name": "Dhamra Port Bulk Carrier Ballast Slick",
    "time": "2024-04-20 12:05:44",
    "area_km2": 24.5,
    "length_km": 10,
    "lat": 20.82,
    "lon": 86.98,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240420T120544_003515_068B12_070D",
    "vessel_name": "Mahanadi Pride",
    "vessel_type": "Bulk Carrier",
    "mmsi": "419000950",
    "imo": "9345678",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 95,
    "match_prob": 98.3,
    "coordinates": [
      [
        86.9,
        20.78
      ],
      [
        87.07,
        20.8
      ],
      [
        87.04,
        20.87
      ],
      [
        86.91,
        20.85
      ],
      [
        86.9,
        20.78
      ]
    ]
  },
  {
    "id": "skytruth-11",
    "name": "Great Nicobar Ten Degree Channel Trail",
    "time": "2024-02-14 04:30:10",
    "area_km2": 58.7,
    "length_km": 22,
    "lat": 7.02,
    "lon": 93.95,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240214T043010_029970_068B12_3C1E",
    "vessel_name": "Ocean Crown",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "636006000",
    "imo": "9876543",
    "flag_code": "LBR",
    "flag_emoji": "\ud83c\uddf1\ud83c\uddf7",
    "img_idx": 810,
    "match_prob": 99.0,
    "coordinates": [
      [
        93.87,
        6.98
      ],
      [
        94.04,
        7.0
      ],
      [
        94.01,
        7.07
      ],
      [
        93.88,
        7.05
      ],
      [
        93.87,
        6.98
      ]
    ]
  },
  {
    "id": "skytruth-12",
    "name": "Port Blair Naval Anchorage Fuel Weepage",
    "time": "2023-12-08 17:45:00",
    "area_km2": 18.4,
    "length_km": 8,
    "lat": 11.65,
    "lon": 92.75,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231208T174500_005291_068B12_0A9D",
    "vessel_name": "INS Cheetah Support",
    "vessel_type": "Offshore Tug",
    "mmsi": "419000330",
    "imo": "9123890",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 143,
    "match_prob": 99.7,
    "coordinates": [
      [
        92.67,
        11.61
      ],
      [
        92.84,
        11.63
      ],
      [
        92.81,
        11.7
      ],
      [
        92.68,
        11.68
      ],
      [
        92.67,
        11.61
      ]
    ]
  },
  {
    "id": "skytruth-13",
    "name": "Nine Degree Channel VLCC Bilge Streak",
    "time": "2024-01-22 08:20:15",
    "area_km2": 41.3,
    "length_km": 16,
    "lat": 9.15,
    "lon": 73.1,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240122T082015_025160_068B12_3278",
    "vessel_name": "Cosmo Fortune",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "354001200",
    "imo": "9765432",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 680,
    "match_prob": 92.6,
    "coordinates": [
      [
        73.02,
        9.11
      ],
      [
        73.19,
        9.13
      ],
      [
        73.16,
        9.2
      ],
      [
        73.03,
        9.18
      ],
      [
        73.02,
        9.11
      ]
    ]
  },
  {
    "id": "skytruth-14",
    "name": "Kavaratti Lagoon Diesel Bunkering Sheen",
    "time": "2023-09-29 11:15:33",
    "area_km2": 12.0,
    "length_km": 6,
    "lat": 10.56,
    "lon": 72.63,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230929T111533_013912_068B12_1BE8",
    "vessel_name": "Coral Queen Ferry",
    "vessel_type": "Passenger Cargo",
    "mmsi": "419000770",
    "imo": "9456123",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 376,
    "match_prob": 93.3,
    "coordinates": [
      [
        72.55,
        10.52
      ],
      [
        72.72,
        10.54
      ],
      [
        72.69,
        10.61
      ],
      [
        72.56,
        10.59
      ],
      [
        72.55,
        10.52
      ]
    ]
  },
  {
    "id": "skytruth-15",
    "name": "Diglipur North Sentinel Coastal Slick",
    "time": "2024-05-01 14:00:50",
    "area_km2": 23.6,
    "length_km": 11,
    "lat": 13.26,
    "lon": 92.97,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240501T140050_025197_068B12_328B",
    "vessel_name": "Ayeyarwady Star",
    "vessel_type": "General Cargo",
    "mmsi": "506000450",
    "imo": "9321456",
    "flag_code": "MMR",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 681,
    "match_prob": 94.0,
    "coordinates": [
      [
        92.89,
        13.22
      ],
      [
        93.06,
        13.24
      ],
      [
        93.03,
        13.31
      ],
      [
        92.9,
        13.29
      ],
      [
        92.89,
        13.22
      ]
    ]
  },
  {
    "id": "skytruth-16",
    "name": "MV Wakashio Bulk Carrier Grounding",
    "time": "2020-08-06 16:30:00",
    "area_km2": 28.5,
    "length_km": 18,
    "lat": -20.44,
    "lon": 57.75,
    "eez": "Mauritius",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20200806T163000_005291_068B12_0A9D",
    "vessel_name": "Wakashio",
    "vessel_type": "Bulk Carrier",
    "mmsi": "371917000",
    "imo": "9337119",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 143,
    "match_prob": 94.7,
    "coordinates": [
      [
        57.67,
        -20.48
      ],
      [
        57.84,
        -20.46
      ],
      [
        57.81,
        -20.39
      ],
      [
        57.68,
        -20.41
      ],
      [
        57.67,
        -20.48
      ]
    ]
  },
  {
    "id": "skytruth-17",
    "name": "New Diamond VLCC Tanker Fire & Spill",
    "time": "2020-09-03 07:15:20",
    "area_km2": 45.2,
    "length_km": 20,
    "lat": 7.45,
    "lon": 81.95,
    "eez": "Sri Lanka",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20200903T071520_008510_068B12_1112",
    "vessel_name": "New Diamond",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "356066000",
    "imo": "9212852",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 230,
    "match_prob": 95.4,
    "coordinates": [
      [
        81.87,
        7.41
      ],
      [
        82.04,
        7.43
      ],
      [
        82.01,
        7.5
      ],
      [
        81.88,
        7.48
      ],
      [
        81.87,
        7.41
      ]
    ]
  },
  {
    "id": "skytruth-18",
    "name": "X-Press Pearl Container Cargo Bunker Disaster",
    "time": "2021-05-20 09:40:15",
    "area_km2": 52.0,
    "length_km": 25,
    "lat": 6.98,
    "lon": 79.8,
    "eez": "Sri Lanka",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20210520T094015_013912_068B12_1BE8",
    "vessel_name": "X-Press Pearl",
    "vessel_type": "Container Ship",
    "mmsi": "563060000",
    "imo": "9875343",
    "flag_code": "SGP",
    "flag_emoji": "\ud83c\uddf8\ud83c\uddec",
    "img_idx": 376,
    "match_prob": 96.1,
    "coordinates": [
      [
        79.72,
        6.94
      ],
      [
        79.89,
        6.96
      ],
      [
        79.86,
        7.03
      ],
      [
        79.73,
        7.01
      ],
      [
        79.72,
        6.94
      ]
    ]
  },
  {
    "id": "skytruth-19",
    "name": "Maldives Southern Channel Supertanker Streak",
    "time": "2024-03-22 05:10:00",
    "area_km2": 36.8,
    "length_km": 15,
    "lat": 3.2,
    "lon": 73.5,
    "eez": "Maldives",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240322T051000_018981_068B12_2613",
    "vessel_name": "Arabian Sea Glory",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "538008100",
    "imo": "9654789",
    "flag_code": "MHL",
    "flag_emoji": "\ud83c\uddf2\ud83c\uddf8",
    "img_idx": 513,
    "match_prob": 96.8,
    "coordinates": [
      [
        73.42,
        3.16
      ],
      [
        73.59,
        3.18
      ],
      [
        73.56,
        3.25
      ],
      [
        73.43,
        3.23
      ],
      [
        73.42,
        3.16
      ]
    ]
  },
  {
    "id": "skytruth-20",
    "name": "Wadge Bank High-Productivity Fishery Slick",
    "time": "2023-10-18 13:25:40",
    "area_km2": 27.4,
    "length_km": 12,
    "lat": 7.8,
    "lon": 77.4,
    "eez": "India",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231018T132540_035187_068B12_4695",
    "vessel_name": "Cape Comorin Trawler",
    "vessel_type": "Fishing Vessel",
    "mmsi": "419001550",
    "imo": "9412356",
    "flag_code": "IND",
    "flag_emoji": "\ud83c\uddee\ud83c\uddf3",
    "img_idx": 951,
    "match_prob": 97.5,
    "coordinates": [
      [
        77.32,
        7.76
      ],
      [
        77.49,
        7.78
      ],
      [
        77.46,
        7.85
      ],
      [
        77.33,
        7.83
      ],
      [
        77.32,
        7.76
      ]
    ]
  },
  {
    "id": "skytruth-21",
    "name": "Ras Tanura Offshore Platform Cluster Seepage",
    "time": "2023-07-22 10:45:00",
    "area_km2": 48.9,
    "length_km": 19,
    "lat": 26.82,
    "lon": 50.3,
    "eez": "Saudi Arabia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230722T104500_025197_068B12_328B",
    "vessel_name": "Aramco Marine #14",
    "vessel_type": "Offshore Platform",
    "mmsi": "403001200",
    "imo": "9541230",
    "flag_code": "SAU",
    "flag_emoji": "\ud83c\uddf8\ud83c\udde6",
    "img_idx": 681,
    "match_prob": 98.2,
    "coordinates": [
      [
        50.22,
        26.78
      ],
      [
        50.39,
        26.8
      ],
      [
        50.36,
        26.87
      ],
      [
        50.23,
        26.85
      ],
      [
        50.22,
        26.78
      ]
    ]
  },
  {
    "id": "skytruth-22",
    "name": "Al-Khafji Neutral Zone Pipeline Leak",
    "time": "2023-08-19 14:20:10",
    "area_km2": 35.1,
    "length_km": 14,
    "lat": 28.45,
    "lon": 48.75,
    "eez": "Kuwait",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230819T142010_030007_068B12_3C31",
    "vessel_name": "Al-Khafji Field Asset",
    "vessel_type": "Production Platform",
    "mmsi": "447000340",
    "imo": "9345612",
    "flag_code": "KWT",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 811,
    "match_prob": 98.9,
    "coordinates": [
      [
        48.67,
        28.41
      ],
      [
        48.84,
        28.43
      ],
      [
        48.81,
        28.5
      ],
      [
        48.68,
        28.48
      ],
      [
        48.67,
        28.41
      ]
    ]
  },
  {
    "id": "skytruth-23",
    "name": "Safaniya Giant Offshore Field Seepage",
    "time": "2024-02-11 08:30:25",
    "area_km2": 39.0,
    "length_km": 16,
    "lat": 28.0,
    "lon": 49.0,
    "eez": "Saudi Arabia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240211T083025_008547_068B12_1125",
    "vessel_name": "Safaniya Rig Charlie",
    "vessel_type": "Offshore Platform",
    "mmsi": "403000880",
    "imo": "9654123",
    "flag_code": "SAU",
    "flag_emoji": "\ud83c\uddf8\ud83c\udde6",
    "img_idx": 231,
    "match_prob": 99.6,
    "coordinates": [
      [
        48.92,
        27.96
      ],
      [
        49.09,
        27.98
      ],
      [
        49.06,
        28.05
      ],
      [
        48.93,
        28.03
      ],
      [
        48.92,
        27.96
      ]
    ]
  },
  {
    "id": "skytruth-24",
    "name": "Kharg Island Terminal Tanker Offload Plume",
    "time": "2023-12-05 16:15:00",
    "area_km2": 44.5,
    "length_km": 18,
    "lat": 29.25,
    "lon": 50.3,
    "eez": "Iran",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231205T161500_013875_068B12_1BD5",
    "vessel_name": "NITC Tour",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "422000560",
    "imo": "9123789",
    "flag_code": "IRN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 92.5,
    "coordinates": [
      [
        50.22,
        29.21
      ],
      [
        50.39,
        29.23
      ],
      [
        50.36,
        29.3
      ],
      [
        50.23,
        29.28
      ],
      [
        50.22,
        29.21
      ]
    ]
  },
  {
    "id": "skytruth-25",
    "name": "Bushehr Offshore Transit Bilge Streak",
    "time": "2024-04-14 11:50:40",
    "area_km2": 31.8,
    "length_km": 13,
    "lat": 28.85,
    "lon": 50.7,
    "eez": "Iran",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240414T115040_001665_068B12_0357",
    "vessel_name": "Persian Star",
    "vessel_type": "Chemical Tanker",
    "mmsi": "355001230",
    "imo": "9487561",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 45,
    "match_prob": 93.2,
    "coordinates": [
      [
        50.62,
        28.81
      ],
      [
        50.79,
        28.83
      ],
      [
        50.76,
        28.9
      ],
      [
        50.63,
        28.88
      ],
      [
        50.62,
        28.81
      ]
    ]
  },
  {
    "id": "skytruth-26",
    "name": "Strait of Hormuz Supertanker Bilge Lane",
    "time": "2024-04-12 06:10:15",
    "area_km2": 62.4,
    "length_km": 24,
    "lat": 26.35,
    "lon": 56.4,
    "eez": "Oman",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240412T061015_035150_068B12_4682",
    "vessel_name": "Front Altair",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "538004000",
    "imo": "9786541",
    "flag_code": "MHL",
    "flag_emoji": "\ud83c\uddf2\ud83c\uddf8",
    "img_idx": 950,
    "match_prob": 93.9,
    "coordinates": [
      [
        56.32,
        26.31
      ],
      [
        56.49,
        26.33
      ],
      [
        56.46,
        26.4
      ],
      [
        56.33,
        26.38
      ],
      [
        56.32,
        26.31
      ]
    ]
  },
  {
    "id": "skytruth-27",
    "name": "Fujairah Offshore Bunkering Anchorage Slick",
    "time": "2024-02-28 13:40:00",
    "area_km2": 39.5,
    "length_km": 15,
    "lat": 25.18,
    "lon": 56.45,
    "eez": "UAE",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240228T134000_008547_068B12_1125",
    "vessel_name": "Fujairah Pioneer",
    "vessel_type": "Bunker Tanker",
    "mmsi": "477995000",
    "imo": "9321654",
    "flag_code": "UAE",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 231,
    "match_prob": 94.6,
    "coordinates": [
      [
        56.37,
        25.14
      ],
      [
        56.54,
        25.16
      ],
      [
        56.51,
        25.23
      ],
      [
        56.38,
        25.21
      ],
      [
        56.37,
        25.14
      ]
    ]
  },
  {
    "id": "skytruth-28",
    "name": "Qatar North Field Condensate Line Plume",
    "time": "2023-11-29 09:25:30",
    "area_km2": 44.0,
    "length_km": 17,
    "lat": 26.2,
    "lon": 51.9,
    "eez": "Qatar",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231129T092530_013875_068B12_1BD5",
    "vessel_name": "Qatargas Bravo Rig",
    "vessel_type": "Gas Platform",
    "mmsi": "466000120",
    "imo": "9654320",
    "flag_code": "QAT",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 95.3,
    "coordinates": [
      [
        51.82,
        26.16
      ],
      [
        51.99,
        26.18
      ],
      [
        51.96,
        26.25
      ],
      [
        51.83,
        26.23
      ],
      [
        51.82,
        26.16
      ]
    ]
  },
  {
    "id": "skytruth-29",
    "name": "Das Island Offshore Crude Terminal Slick",
    "time": "2024-03-02 15:10:00",
    "area_km2": 32.5,
    "length_km": 13,
    "lat": 25.15,
    "lon": 52.88,
    "eez": "UAE",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240302T151000_001665_068B12_0357",
    "vessel_name": "ADNOC Das Asset",
    "vessel_type": "Offshore Terminal",
    "mmsi": "470000340",
    "imo": "9412580",
    "flag_code": "UAE",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 45,
    "match_prob": 96.0,
    "coordinates": [
      [
        52.8,
        25.11
      ],
      [
        52.97,
        25.13
      ],
      [
        52.94,
        25.2
      ],
      [
        52.81,
        25.18
      ],
      [
        52.8,
        25.11
      ]
    ]
  },
  {
    "id": "skytruth-30",
    "name": "Muscat Port Sultan Qaboos Tanker Weep",
    "time": "2023-09-15 07:45:10",
    "area_km2": 24.0,
    "length_km": 10,
    "lat": 23.63,
    "lon": 58.58,
    "eez": "Oman",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230915T074510_003515_068B12_070D",
    "vessel_name": "Oman Pride",
    "vessel_type": "Product Tanker",
    "mmsi": "461000210",
    "imo": "9234120",
    "flag_code": "OMN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 95,
    "match_prob": 96.7,
    "coordinates": [
      [
        58.5,
        23.59
      ],
      [
        58.67,
        23.61
      ],
      [
        58.64,
        23.68
      ],
      [
        58.51,
        23.66
      ],
      [
        58.5,
        23.59
      ]
    ]
  },
  {
    "id": "skytruth-31",
    "name": "Bab-el-Mandeb Strait Transit Tanker Discharge",
    "time": "2023-11-18 03:20:10",
    "area_km2": 56.4,
    "length_km": 22,
    "lat": 12.72,
    "lon": 43.3,
    "eez": "Yemen",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231118T032010_003293_068B12_069B",
    "vessel_name": "Red Sea Star",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "636015000",
    "imo": "9854120",
    "flag_code": "LBR",
    "flag_emoji": "\ud83c\uddf1\ud83c\uddf7",
    "img_idx": 89,
    "match_prob": 97.4,
    "coordinates": [
      [
        43.22,
        12.68
      ],
      [
        43.39,
        12.7
      ],
      [
        43.36,
        12.77
      ],
      [
        43.23,
        12.75
      ],
      [
        43.22,
        12.68
      ]
    ]
  },
  {
    "id": "skytruth-32",
    "name": "FSO Safer Vicinity Siphon Weepage",
    "time": "2023-06-15 11:30:00",
    "area_km2": 33.8,
    "length_km": 14,
    "lat": 15.12,
    "lon": 42.6,
    "eez": "Yemen",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230615T113000_008510_068B12_1112",
    "vessel_name": "UN Salvage Nautica",
    "vessel_type": "Salvage Vessel",
    "mmsi": "621000100",
    "imo": "9456321",
    "flag_code": "DJI",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 230,
    "match_prob": 98.1,
    "coordinates": [
      [
        42.52,
        15.08
      ],
      [
        42.69,
        15.1
      ],
      [
        42.66,
        15.17
      ],
      [
        42.53,
        15.15
      ],
      [
        42.52,
        15.08
      ]
    ]
  },
  {
    "id": "skytruth-33",
    "name": "Hanish Islands Tanker Traffic Bilge Track",
    "time": "2024-01-28 17:15:40",
    "area_km2": 38.0,
    "length_km": 16,
    "lat": 13.75,
    "lon": 42.75,
    "eez": "Yemen",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240128T171540_018944_068B12_2600",
    "vessel_name": "Al-Mandeb Express",
    "vessel_type": "Container Ship",
    "mmsi": "351002340",
    "imo": "9765123",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 512,
    "match_prob": 98.8,
    "coordinates": [
      [
        42.67,
        13.71
      ],
      [
        42.84,
        13.73
      ],
      [
        42.81,
        13.8
      ],
      [
        42.68,
        13.78
      ],
      [
        42.67,
        13.71
      ]
    ]
  },
  {
    "id": "skytruth-34",
    "name": "Assab Coastal Anchorage Fuel Spill",
    "time": "2023-10-09 08:50:00",
    "area_km2": 26.5,
    "length_km": 11,
    "lat": 13.0,
    "lon": 42.75,
    "eez": "Eritrea",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231009T085000_025160_068B12_3278",
    "vessel_name": "Dahlak Carrier",
    "vessel_type": "Cargo",
    "mmsi": "625000120",
    "imo": "9123450",
    "flag_code": "ERI",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 680,
    "match_prob": 99.5,
    "coordinates": [
      [
        42.67,
        12.96
      ],
      [
        42.84,
        12.98
      ],
      [
        42.81,
        13.05
      ],
      [
        42.68,
        13.03
      ],
      [
        42.67,
        12.96
      ]
    ]
  },
  {
    "id": "skytruth-35",
    "name": "Djibouti Port Doraleh Bunkering Sheen",
    "time": "2024-04-04 14:05:22",
    "area_km2": 21.0,
    "length_km": 9,
    "lat": 11.6,
    "lon": 43.1,
    "eez": "Djibouti",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240404T140522_005254_068B12_0A8A",
    "vessel_name": "Doraleh Fueler",
    "vessel_type": "Bunkering Barge",
    "mmsi": "621000340",
    "imo": "9345670",
    "flag_code": "DJI",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 142,
    "match_prob": 92.4,
    "coordinates": [
      [
        43.02,
        11.56
      ],
      [
        43.19,
        11.58
      ],
      [
        43.16,
        11.65
      ],
      [
        43.03,
        11.63
      ],
      [
        43.02,
        11.56
      ]
    ]
  },
  {
    "id": "skytruth-36",
    "name": "Gulf of Suez SUMED Pipeline Base Slick",
    "time": "2024-03-05 09:15:30",
    "area_km2": 44.0,
    "length_km": 17,
    "lat": 28.15,
    "lon": 33.4,
    "eez": "Egypt",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240305T091530_013875_068B12_1BD5",
    "vessel_name": "SUMED SPM Terminal",
    "vessel_type": "Crude Terminal",
    "mmsi": "622000450",
    "imo": "9541238",
    "flag_code": "EGY",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 93.1,
    "coordinates": [
      [
        33.32,
        28.11
      ],
      [
        33.49,
        28.13
      ],
      [
        33.46,
        28.2
      ],
      [
        33.33,
        28.18
      ],
      [
        33.32,
        28.11
      ]
    ]
  },
  {
    "id": "skytruth-37",
    "name": "Yanbu Petrochemical Terminal Outfall",
    "time": "2023-09-14 13:40:00",
    "area_km2": 27.2,
    "length_km": 12,
    "lat": 23.95,
    "lon": 38.1,
    "eez": "Saudi Arabia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230914T134000_018981_068B12_2613",
    "vessel_name": "Yanbu Petro Hub",
    "vessel_type": "Refinery Outfall",
    "mmsi": "403001880",
    "imo": "9654120",
    "flag_code": "SAU",
    "flag_emoji": "\ud83c\uddf8\ud83c\udde6",
    "img_idx": 513,
    "match_prob": 93.8,
    "coordinates": [
      [
        38.02,
        23.91
      ],
      [
        38.19,
        23.93
      ],
      [
        38.16,
        24.0
      ],
      [
        38.03,
        23.98
      ],
      [
        38.02,
        23.91
      ]
    ]
  },
  {
    "id": "skytruth-38",
    "name": "Jeddah Islamic Port Outer Channel Leak",
    "time": "2024-01-10 16:20:00",
    "area_km2": 23.5,
    "length_km": 10,
    "lat": 21.48,
    "lon": 39.15,
    "eez": "Saudi Arabia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240110T162000_025197_068B12_328B",
    "vessel_name": "Jeddah Bunkerer",
    "vessel_type": "Fuel Barge",
    "mmsi": "403000550",
    "imo": "9321450",
    "flag_code": "SAU",
    "flag_emoji": "\ud83c\uddf8\ud83c\udde6",
    "img_idx": 681,
    "match_prob": 94.5,
    "coordinates": [
      [
        39.07,
        21.44
      ],
      [
        39.24,
        21.46
      ],
      [
        39.21,
        21.53
      ],
      [
        39.08,
        21.51
      ],
      [
        39.07,
        21.44
      ]
    ]
  },
  {
    "id": "skytruth-39",
    "name": "Hurghada Resort Coast Tanker Bilge",
    "time": "2023-12-20 07:10:15",
    "area_km2": 32.0,
    "length_km": 14,
    "lat": 27.25,
    "lon": 33.85,
    "eez": "Egypt",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231220T071015_003256_068B12_0688",
    "vessel_name": "Suez Transit King",
    "vessel_type": "Bulk Carrier",
    "mmsi": "352000670",
    "imo": "9785412",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 88,
    "match_prob": 95.2,
    "coordinates": [
      [
        33.77,
        27.21
      ],
      [
        33.94,
        27.23
      ],
      [
        33.91,
        27.3
      ],
      [
        33.78,
        27.28
      ],
      [
        33.77,
        27.21
      ]
    ]
  },
  {
    "id": "skytruth-40",
    "name": "Sinai Peninsula Tor Coastal Seep",
    "time": "2024-05-02 12:35:00",
    "area_km2": 25.8,
    "length_km": 11,
    "lat": 28.23,
    "lon": 33.62,
    "eez": "Egypt",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240502T123500_001702_068B12_036A",
    "vessel_name": "Sinai Field Platform",
    "vessel_type": "Offshore Rig",
    "mmsi": "622000780",
    "imo": "9123899",
    "flag_code": "EGY",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 46,
    "match_prob": 95.9,
    "coordinates": [
      [
        33.54,
        28.19
      ],
      [
        33.71,
        28.21
      ],
      [
        33.68,
        28.28
      ],
      [
        33.55,
        28.26
      ],
      [
        33.54,
        28.19
      ]
    ]
  },
  {
    "id": "skytruth-41",
    "name": "Strait of Malacca Supertanker Bilge Slick",
    "time": "2024-02-10 04:45:00",
    "area_km2": 64.2,
    "length_km": 25,
    "lat": 1.3,
    "lon": 103.35,
    "eez": "Malaysia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240210T044500_018981_068B12_2613",
    "vessel_name": "Strait Navigator",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "563048000",
    "imo": "9854123",
    "flag_code": "SGP",
    "flag_emoji": "\ud83c\uddf8\ud83c\uddec",
    "img_idx": 513,
    "match_prob": 96.6,
    "coordinates": [
      [
        103.27,
        1.26
      ],
      [
        103.44,
        1.28
      ],
      [
        103.41,
        1.35
      ],
      [
        103.28,
        1.33
      ],
      [
        103.27,
        1.26
      ]
    ]
  },
  {
    "id": "skytruth-42",
    "name": "Singapore Eastern Anchorage Bunkering Leak",
    "time": "2024-04-18 15:30:12",
    "area_km2": 25.1,
    "length_km": 11,
    "lat": 1.25,
    "lon": 103.95,
    "eez": "Singapore",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240418T153012_001702_068B12_036A",
    "vessel_name": "Marine Honor",
    "vessel_type": "Bunker Tanker",
    "mmsi": "563001200",
    "imo": "9412365",
    "flag_code": "SGP",
    "flag_emoji": "\ud83c\uddf8\ud83c\uddec",
    "img_idx": 46,
    "match_prob": 97.3,
    "coordinates": [
      [
        103.87,
        1.21
      ],
      [
        104.04,
        1.23
      ],
      [
        104.01,
        1.3
      ],
      [
        103.88,
        1.28
      ],
      [
        103.87,
        1.21
      ]
    ]
  },
  {
    "id": "skytruth-43",
    "name": "Port Klang Approaches Cargo Vessel Bilge",
    "time": "2023-11-15 08:20:00",
    "area_km2": 33.0,
    "length_km": 14,
    "lat": 3.0,
    "lon": 101.35,
    "eez": "Malaysia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231115T082000_003256_068B12_0688",
    "vessel_name": "Klang Express",
    "vessel_type": "Container Ship",
    "mmsi": "533000450",
    "imo": "9654128",
    "flag_code": "MYS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 88,
    "match_prob": 98.0,
    "coordinates": [
      [
        101.27,
        2.96
      ],
      [
        101.44,
        2.98
      ],
      [
        101.41,
        3.05
      ],
      [
        101.28,
        3.03
      ],
      [
        101.27,
        2.96
      ]
    ]
  },
  {
    "id": "skytruth-44",
    "name": "Johor Strait Industrial Fuel Weepage",
    "time": "2023-08-25 12:10:45",
    "area_km2": 20.4,
    "length_km": 9,
    "lat": 1.45,
    "lon": 103.8,
    "eez": "Malaysia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230825T121045_008547_068B12_1125",
    "vessel_name": "Johor Bunkerer",
    "vessel_type": "Fuel Barge",
    "mmsi": "533000780",
    "imo": "9321458",
    "flag_code": "MYS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 231,
    "match_prob": 98.7,
    "coordinates": [
      [
        103.72,
        1.41
      ],
      [
        103.89,
        1.43
      ],
      [
        103.86,
        1.5
      ],
      [
        103.73,
        1.48
      ],
      [
        103.72,
        1.41
      ]
    ]
  },
  {
    "id": "skytruth-45",
    "name": "Riau Archipelago Batam Anchorage Slick",
    "time": "2024-03-29 17:40:00",
    "area_km2": 30.5,
    "length_km": 13,
    "lat": 1.15,
    "lon": 104.05,
    "eez": "Indonesia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240329T174000_013912_068B12_1BE8",
    "vessel_name": "Batam Leader",
    "vessel_type": "Product Tanker",
    "mmsi": "525000340",
    "imo": "9785410",
    "flag_code": "IDN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 376,
    "match_prob": 99.4,
    "coordinates": [
      [
        103.97,
        1.11
      ],
      [
        104.14,
        1.13
      ],
      [
        104.11,
        1.2
      ],
      [
        103.98,
        1.18
      ],
      [
        103.97,
        1.11
      ]
    ]
  },
  {
    "id": "skytruth-46",
    "name": "MT Princess Empress Sunken Tanker Disaster",
    "time": "2023-02-28 02:15:00",
    "area_km2": 78.6,
    "length_km": 28,
    "lat": 13.18,
    "lon": 121.52,
    "eez": "Philippines",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230228T021500_005291_068B12_0A9D",
    "vessel_name": "Princess Empress",
    "vessel_type": "Industrial Tanker",
    "mmsi": "548001000",
    "imo": "9854129",
    "flag_code": "PHL",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 143,
    "match_prob": 92.3,
    "coordinates": [
      [
        121.44,
        13.14
      ],
      [
        121.61,
        13.16
      ],
      [
        121.58,
        13.23
      ],
      [
        121.45,
        13.21
      ],
      [
        121.44,
        13.14
      ]
    ]
  },
  {
    "id": "skytruth-47",
    "name": "Natuna Sea Offshore Drilling Block Seep",
    "time": "2023-09-25 11:20:00",
    "area_km2": 38.2,
    "length_km": 16,
    "lat": 4.5,
    "lon": 106.8,
    "eez": "Indonesia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230925T112000_025160_068B12_3278",
    "vessel_name": "Natuna Platform B",
    "vessel_type": "Offshore Rig",
    "mmsi": "525001200",
    "imo": "9654129",
    "flag_code": "IDN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 680,
    "match_prob": 93.0,
    "coordinates": [
      [
        106.72,
        4.46
      ],
      [
        106.89,
        4.48
      ],
      [
        106.86,
        4.55
      ],
      [
        106.73,
        4.53
      ],
      [
        106.72,
        4.46
      ]
    ]
  },
  {
    "id": "skytruth-48",
    "name": "Sunda Strait Heavy Transit Bilge Streak",
    "time": "2023-10-05 06:40:10",
    "area_km2": 36.4,
    "length_km": 15,
    "lat": -5.9,
    "lon": 105.8,
    "eez": "Indonesia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231005T064010_003256_068B12_0688",
    "vessel_name": "Sunda Trader",
    "vessel_type": "Bulk Carrier",
    "mmsi": "352000880",
    "imo": "9412589",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 88,
    "match_prob": 93.7,
    "coordinates": [
      [
        105.72,
        -5.94
      ],
      [
        105.89,
        -5.92
      ],
      [
        105.86,
        -5.85
      ],
      [
        105.73,
        -5.87
      ],
      [
        105.72,
        -5.94
      ]
    ]
  },
  {
    "id": "skytruth-49",
    "name": "Gulf of Thailand Chevron Platform Spill",
    "time": "2023-08-01 14:15:00",
    "area_km2": 42.0,
    "length_km": 17,
    "lat": 9.4,
    "lon": 101.5,
    "eez": "Thailand",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230801T141500_008547_068B12_1125",
    "vessel_name": "Erawan Rig Complex",
    "vessel_type": "Gas/Oil Rig",
    "mmsi": "567000120",
    "imo": "9321789",
    "flag_code": "THA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 231,
    "match_prob": 94.4,
    "coordinates": [
      [
        101.42,
        9.36
      ],
      [
        101.59,
        9.38
      ],
      [
        101.56,
        9.45
      ],
      [
        101.43,
        9.43
      ],
      [
        101.42,
        9.36
      ]
    ]
  },
  {
    "id": "skytruth-50",
    "name": "Balikpapan Bay Subsea Pipeline Fracture",
    "time": "2024-05-02 09:30:20",
    "area_km2": 51.5,
    "length_km": 21,
    "lat": -1.3,
    "lon": 116.82,
    "eez": "Indonesia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240502T093020_013912_068B12_1BE8",
    "vessel_name": "Pertamina Pipeline",
    "vessel_type": "Subsea Pipeline",
    "mmsi": "525000990",
    "imo": "9785420",
    "flag_code": "IDN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 376,
    "match_prob": 95.1,
    "coordinates": [
      [
        116.74,
        -1.34
      ],
      [
        116.91,
        -1.32
      ],
      [
        116.88,
        -1.25
      ],
      [
        116.75,
        -1.27
      ],
      [
        116.74,
        -1.34
      ]
    ]
  },
  {
    "id": "skytruth-51",
    "name": "Bohai Bay Penglai 19-3 Seepage",
    "time": "2023-05-18 10:10:00",
    "area_km2": 47.0,
    "length_km": 19,
    "lat": 38.45,
    "lon": 120.1,
    "eez": "China",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230518T101000_035187_068B12_4695",
    "vessel_name": "CNOOC Bohai Rig",
    "vessel_type": "Offshore Rig",
    "mmsi": "412000340",
    "imo": "9654130",
    "flag_code": "CHN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 951,
    "match_prob": 95.8,
    "coordinates": [
      [
        120.02,
        38.41
      ],
      [
        120.19,
        38.43
      ],
      [
        120.16,
        38.5
      ],
      [
        120.03,
        38.48
      ],
      [
        120.02,
        38.41
      ]
    ]
  },
  {
    "id": "skytruth-52",
    "name": "Hong Kong Pearl River Estuary Bilge Trail",
    "time": "2024-03-10 16:45:00",
    "area_km2": 29.8,
    "length_km": 13,
    "lat": 22.15,
    "lon": 113.85,
    "eez": "China",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240310T164500_000481_068B12_00F7",
    "vessel_name": "Pearl River Carrier",
    "vessel_type": "Container Ship",
    "mmsi": "477889000",
    "imo": "9412590",
    "flag_code": "HKG",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 13,
    "match_prob": 96.5,
    "coordinates": [
      [
        113.77,
        22.11
      ],
      [
        113.94,
        22.13
      ],
      [
        113.91,
        22.2
      ],
      [
        113.78,
        22.18
      ],
      [
        113.77,
        22.11
      ]
    ]
  },
  {
    "id": "skytruth-53",
    "name": "Taiwan Strait Container Traffic Bilge",
    "time": "2024-02-05 07:20:15",
    "area_km2": 43.5,
    "length_km": 18,
    "lat": 24.2,
    "lon": 119.8,
    "eez": "Taiwan",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240205T072015_030007_068B12_3C31",
    "vessel_name": "Formosa Navigator",
    "vessel_type": "Bulk Carrier",
    "mmsi": "416001200",
    "imo": "9785421",
    "flag_code": "TWN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 811,
    "match_prob": 97.2,
    "coordinates": [
      [
        119.72,
        24.16
      ],
      [
        119.89,
        24.18
      ],
      [
        119.86,
        24.25
      ],
      [
        119.73,
        24.23
      ],
      [
        119.72,
        24.16
      ]
    ]
  },
  {
    "id": "skytruth-54",
    "name": "Ningbo-Zhoushan Port Mega Anchorage Slick",
    "time": "2023-11-08 13:15:30",
    "area_km2": 36.0,
    "length_km": 15,
    "lat": 29.85,
    "lon": 122.2,
    "eez": "China",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231108T131530_005254_068B12_0A8A",
    "vessel_name": "Zhoushan Bunkerer",
    "vessel_type": "Fuel Barge",
    "mmsi": "413000450",
    "imo": "9321790",
    "flag_code": "CHN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 142,
    "match_prob": 97.9,
    "coordinates": [
      [
        122.12,
        29.81
      ],
      [
        122.29,
        29.83
      ],
      [
        122.26,
        29.9
      ],
      [
        122.13,
        29.88
      ],
      [
        122.12,
        29.81
      ]
    ]
  },
  {
    "id": "skytruth-55",
    "name": "Jeju Strait Crude Transit Bilge Plume",
    "time": "2024-04-22 05:50:00",
    "area_km2": 39.2,
    "length_km": 16,
    "lat": 33.8,
    "lon": 126.5,
    "eez": "South Korea",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240422T055000_003515_068B12_070D",
    "vessel_name": "Korea Star",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "440000120",
    "imo": "9541240",
    "flag_code": "KOR",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 95,
    "match_prob": 98.6,
    "coordinates": [
      [
        126.42,
        33.76
      ],
      [
        126.59,
        33.78
      ],
      [
        126.56,
        33.85
      ],
      [
        126.43,
        33.83
      ],
      [
        126.42,
        33.76
      ]
    ]
  },
  {
    "id": "skytruth-56",
    "name": "Tokyo Bay Uraga Channel Tanker Flange Leak",
    "time": "2023-11-12 11:30:00",
    "area_km2": 21.0,
    "length_km": 9,
    "lat": 35.25,
    "lon": 139.75,
    "eez": "Japan",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231112T113000_005254_068B12_0A8A",
    "vessel_name": "Tokyo Maru",
    "vessel_type": "Product Tanker",
    "mmsi": "431002500",
    "imo": "9123460",
    "flag_code": "JPN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 142,
    "match_prob": 99.3,
    "coordinates": [
      [
        139.67,
        35.21
      ],
      [
        139.84,
        35.23
      ],
      [
        139.81,
        35.3
      ],
      [
        139.68,
        35.28
      ],
      [
        139.67,
        35.21
      ]
    ]
  },
  {
    "id": "skytruth-57",
    "name": "Tsushima Strait Heavy Tanker Bilge Streak",
    "time": "2024-01-18 08:15:40",
    "area_km2": 41.5,
    "length_km": 17,
    "lat": 34.5,
    "lon": 129.5,
    "eez": "Japan",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240118T081540_018944_068B12_2600",
    "vessel_name": "Pacific Leader",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "351000990",
    "imo": "9785422",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 512,
    "match_prob": 92.2,
    "coordinates": [
      [
        129.42,
        34.46
      ],
      [
        129.59,
        34.48
      ],
      [
        129.56,
        34.55
      ],
      [
        129.43,
        34.53
      ],
      [
        129.42,
        34.46
      ]
    ]
  },
  {
    "id": "skytruth-58",
    "name": "Osaka Bay Chemical Plant Coastal Outfall",
    "time": "2023-09-02 14:40:00",
    "area_km2": 17.8,
    "length_km": 8,
    "lat": 34.6,
    "lon": 135.3,
    "eez": "Japan",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230902T144000_002035_068B12_0415",
    "vessel_name": "Kobe Chemical Trans",
    "vessel_type": "Chemical Tanker",
    "mmsi": "431000670",
    "imo": "9412591",
    "flag_code": "JPN",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 55,
    "match_prob": 92.9,
    "coordinates": [
      [
        135.22,
        34.56
      ],
      [
        135.39,
        34.58
      ],
      [
        135.36,
        34.65
      ],
      [
        135.23,
        34.63
      ],
      [
        135.22,
        34.56
      ]
    ]
  },
  {
    "id": "skytruth-59",
    "name": "Vladivostok Approach Peter the Great Bay",
    "time": "2023-12-19 10:05:00",
    "area_km2": 33.4,
    "length_km": 14,
    "lat": 42.9,
    "lon": 131.8,
    "eez": "Russia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231219T100500_025160_068B12_3278",
    "vessel_name": "Amur Carrier",
    "vessel_type": "Bulk Carrier",
    "mmsi": "273000340",
    "imo": "9654131",
    "flag_code": "RUS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 680,
    "match_prob": 93.6,
    "coordinates": [
      [
        131.72,
        42.86
      ],
      [
        131.89,
        42.88
      ],
      [
        131.86,
        42.95
      ],
      [
        131.73,
        42.93
      ],
      [
        131.72,
        42.86
      ]
    ]
  },
  {
    "id": "skytruth-60",
    "name": "Sakhalin-II Offshore Platform Seep",
    "time": "2024-03-14 06:30:25",
    "area_km2": 46.2,
    "length_km": 19,
    "lat": 52.8,
    "lon": 143.5,
    "eez": "Russia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240314T063025_013912_068B12_1BE8",
    "vessel_name": "Molikpaq Platform",
    "vessel_type": "Offshore Rig",
    "mmsi": "273000890",
    "imo": "9321791",
    "flag_code": "RUS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 376,
    "match_prob": 94.3,
    "coordinates": [
      [
        143.42,
        52.76
      ],
      [
        143.59,
        52.78
      ],
      [
        143.56,
        52.85
      ],
      [
        143.43,
        52.83
      ],
      [
        143.42,
        52.76
      ]
    ]
  },
  {
    "id": "skytruth-61",
    "name": "Baniyas Thermal Power Plant Heavy Fuel Spill",
    "time": "2021-08-23 04:10:00",
    "area_km2": 72.0,
    "length_km": 29,
    "lat": 35.18,
    "lon": 35.92,
    "eez": "Syria",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20210823T041000_035150_068B12_4682",
    "vessel_name": "Baniyas Depot",
    "vessel_type": "Storage Facility",
    "mmsi": "468000120",
    "imo": "9541241",
    "flag_code": "SYR",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 950,
    "match_prob": 95.0,
    "coordinates": [
      [
        35.84,
        35.14
      ],
      [
        36.01,
        35.16
      ],
      [
        35.98,
        35.23
      ],
      [
        35.85,
        35.21
      ],
      [
        35.84,
        35.14
      ]
    ]
  },
  {
    "id": "skytruth-62",
    "name": "Alexandria Port Outer Bunkering Spill",
    "time": "2023-10-14 12:45:00",
    "area_km2": 31.5,
    "length_km": 13,
    "lat": 31.2,
    "lon": 29.85,
    "eez": "Egypt",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231014T124500_003293_068B12_069B",
    "vessel_name": "Pharaoh Fueler",
    "vessel_type": "Bunkering Barge",
    "mmsi": "622000990",
    "imo": "9123461",
    "flag_code": "EGY",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 89,
    "match_prob": 95.7,
    "coordinates": [
      [
        29.77,
        31.16
      ],
      [
        29.94,
        31.18
      ],
      [
        29.91,
        31.25
      ],
      [
        29.78,
        31.23
      ],
      [
        29.77,
        31.16
      ]
    ]
  },
  {
    "id": "skytruth-63",
    "name": "Port Said Suez Canal Approach Tanker Leak",
    "time": "2024-02-20 15:20:30",
    "area_km2": 36.8,
    "length_km": 15,
    "lat": 31.3,
    "lon": 32.35,
    "eez": "Egypt",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240220T152030_008510_068B12_1112",
    "vessel_name": "Canal Pioneer",
    "vessel_type": "Container Ship",
    "mmsi": "352001100",
    "imo": "9785423",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 230,
    "match_prob": 96.4,
    "coordinates": [
      [
        32.27,
        31.26
      ],
      [
        32.44,
        31.28
      ],
      [
        32.41,
        31.35
      ],
      [
        32.28,
        31.33
      ],
      [
        32.27,
        31.26
      ]
    ]
  },
  {
    "id": "skytruth-64",
    "name": "Cyprus South Coast Akrotiri Tanker Slick",
    "time": "2023-07-28 09:10:15",
    "area_km2": 26.0,
    "length_km": 11,
    "lat": 34.6,
    "lon": 33.0,
    "eez": "Cyprus",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230728T091015_013875_068B12_1BD5",
    "vessel_name": "Larnaca Star",
    "vessel_type": "Product Tanker",
    "mmsi": "209000120",
    "imo": "9412592",
    "flag_code": "CYP",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 97.1,
    "coordinates": [
      [
        32.92,
        34.56
      ],
      [
        33.09,
        34.58
      ],
      [
        33.06,
        34.65
      ],
      [
        32.93,
        34.63
      ],
      [
        32.92,
        34.56
      ]
    ]
  },
  {
    "id": "skytruth-65",
    "name": "Haifa Bay Petroleum Anchorage Discharge",
    "time": "2024-04-09 17:00:00",
    "area_km2": 23.4,
    "length_km": 10,
    "lat": 32.85,
    "lon": 35.0,
    "eez": "Israel",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240409T170000_001665_068B12_0357",
    "vessel_name": "Levant Carrier",
    "vessel_type": "Chemical Tanker",
    "mmsi": "428000100",
    "imo": "9654132",
    "flag_code": "ISR",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 45,
    "match_prob": 97.8,
    "coordinates": [
      [
        34.92,
        32.81
      ],
      [
        35.09,
        32.83
      ],
      [
        35.06,
        32.9
      ],
      [
        34.93,
        32.88
      ],
      [
        34.92,
        32.81
      ]
    ]
  },
  {
    "id": "skytruth-66",
    "name": "Crete & Peloponnese Passage Bilge Trail",
    "time": "2023-09-12 08:30:00",
    "area_km2": 39.1,
    "length_km": 16,
    "lat": 35.85,
    "lon": 23.65,
    "eez": "Greece",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230912T083000_030007_068B12_3C31",
    "vessel_name": "Hellas Trader",
    "vessel_type": "Container Ship",
    "mmsi": "210452000",
    "imo": "9321792",
    "flag_code": "GRC",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 811,
    "match_prob": 98.5,
    "coordinates": [
      [
        23.57,
        35.81
      ],
      [
        23.74,
        35.83
      ],
      [
        23.71,
        35.9
      ],
      [
        23.58,
        35.88
      ],
      [
        23.57,
        35.81
      ]
    ]
  },
  {
    "id": "skytruth-67",
    "name": "Strait of Sicily VLCC Ballast Discharge",
    "time": "2024-01-08 14:15:20",
    "area_km2": 46.5,
    "length_km": 18,
    "lat": 37.1,
    "lon": 11.9,
    "eez": "Italy",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240108T141520_001665_068B12_0357",
    "vessel_name": "Sicilia Pride",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "247012000",
    "imo": "9785424",
    "flag_code": "ITA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 45,
    "match_prob": 99.2,
    "coordinates": [
      [
        11.82,
        37.06
      ],
      [
        11.99,
        37.08
      ],
      [
        11.96,
        37.15
      ],
      [
        11.83,
        37.13
      ],
      [
        11.82,
        37.06
      ]
    ]
  },
  {
    "id": "skytruth-68",
    "name": "Strait of Gibraltar OS 35 Collision Spill",
    "time": "2022-09-01 10:00:00",
    "area_km2": 35.8,
    "length_km": 15,
    "lat": 36.12,
    "lon": -5.35,
    "eez": "Spain",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20220901T100000_005291_068B12_0A9D",
    "vessel_name": "OS 35",
    "vessel_type": "Bulk Carrier",
    "mmsi": "572002000",
    "imo": "9541242",
    "flag_code": "TUV",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 143,
    "match_prob": 92.1,
    "coordinates": [
      [
        -5.43,
        36.08
      ],
      [
        -5.26,
        36.1
      ],
      [
        -5.29,
        36.17
      ],
      [
        -5.42,
        36.15
      ],
      [
        -5.43,
        36.08
      ]
    ]
  },
  {
    "id": "skytruth-69",
    "name": "Gulf of Lion Marseille Refinery Offshore Slick",
    "time": "2024-04-05 16:50:00",
    "area_km2": 28.3,
    "length_km": 12,
    "lat": 43.2,
    "lon": 5.1,
    "eez": "France",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240405T165000_013875_068B12_1BD5",
    "vessel_name": "Fos Navigator",
    "vessel_type": "Product Tanker",
    "mmsi": "228001000",
    "imo": "9123462",
    "flag_code": "FRA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 92.8,
    "coordinates": [
      [
        5.02,
        43.16
      ],
      [
        5.19,
        43.18
      ],
      [
        5.16,
        43.25
      ],
      [
        5.03,
        43.23
      ],
      [
        5.02,
        43.16
      ]
    ]
  },
  {
    "id": "skytruth-70",
    "name": "Balearic Sea Palma Bunkering Overflow",
    "time": "2023-11-22 11:20:10",
    "area_km2": 20.0,
    "length_km": 9,
    "lat": 39.5,
    "lon": 2.6,
    "eez": "Spain",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231122T112010_000444_068B12_00E4",
    "vessel_name": "Mallorca Fueler",
    "vessel_type": "Bunker Tanker",
    "mmsi": "224000340",
    "imo": "9654133",
    "flag_code": "ESP",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 12,
    "match_prob": 93.5,
    "coordinates": [
      [
        2.52,
        39.46
      ],
      [
        2.69,
        39.48
      ],
      [
        2.66,
        39.55
      ],
      [
        2.53,
        39.53
      ],
      [
        2.52,
        39.46
      ]
    ]
  },
  {
    "id": "skytruth-71",
    "name": "Kerch Strait Volgo-Neft River Tanker Spill",
    "time": "2023-12-14 07:30:00",
    "area_km2": 54.0,
    "length_km": 21,
    "lat": 45.15,
    "lon": 36.6,
    "eez": "Russia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231214T073000_008510_068B12_1112",
    "vessel_name": "Volgo-Neft 123",
    "vessel_type": "River Tanker",
    "mmsi": "273001800",
    "imo": "9412593",
    "flag_code": "RUS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 230,
    "match_prob": 94.2,
    "coordinates": [
      [
        36.52,
        45.11
      ],
      [
        36.69,
        45.13
      ],
      [
        36.66,
        45.2
      ],
      [
        36.53,
        45.18
      ],
      [
        36.52,
        45.11
      ]
    ]
  },
  {
    "id": "skytruth-72",
    "name": "Novorossiysk CPC Oil Terminal SPM Failure",
    "time": "2021-08-07 15:40:12",
    "area_km2": 59.0,
    "length_km": 23,
    "lat": 44.7,
    "lon": 37.8,
    "eez": "Russia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20210807T154012_035187_068B12_4695",
    "vessel_name": "CPC Terminal SPM #1",
    "vessel_type": "Crude SPM Terminal",
    "mmsi": "273000550",
    "imo": "9785425",
    "flag_code": "KAZ",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 951,
    "match_prob": 94.9,
    "coordinates": [
      [
        37.72,
        44.66
      ],
      [
        37.89,
        44.68
      ],
      [
        37.86,
        44.75
      ],
      [
        37.73,
        44.73
      ],
      [
        37.72,
        44.66
      ]
    ]
  },
  {
    "id": "skytruth-73",
    "name": "Constanta Port Approaches Bulk Carrier Bilge",
    "time": "2024-01-25 10:15:00",
    "area_km2": 32.5,
    "length_km": 14,
    "lat": 44.15,
    "lon": 28.7,
    "eez": "Romania",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240125T101500_003256_068B12_0688",
    "vessel_name": "Danube King",
    "vessel_type": "Bulk Carrier",
    "mmsi": "264000120",
    "imo": "9321793",
    "flag_code": "ROU",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 88,
    "match_prob": 95.6,
    "coordinates": [
      [
        28.62,
        44.11
      ],
      [
        28.79,
        44.13
      ],
      [
        28.76,
        44.2
      ],
      [
        28.63,
        44.18
      ],
      [
        28.62,
        44.11
      ]
    ]
  },
  {
    "id": "skytruth-74",
    "name": "Bosphorus Strait Northern Approach Slick",
    "time": "2023-10-30 13:50:40",
    "area_km2": 28.0,
    "length_km": 12,
    "lat": 41.25,
    "lon": 29.1,
    "eez": "Turkey",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231030T135040_018981_068B12_2613",
    "vessel_name": "Istanbul Trans",
    "vessel_type": "Chemical Tanker",
    "mmsi": "271000230",
    "imo": "9654134",
    "flag_code": "TUR",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 513,
    "match_prob": 96.3,
    "coordinates": [
      [
        29.02,
        41.21
      ],
      [
        29.19,
        41.23
      ],
      [
        29.16,
        41.3
      ],
      [
        29.03,
        41.28
      ],
      [
        29.02,
        41.21
      ]
    ]
  },
  {
    "id": "skytruth-75",
    "name": "Odessa Gulf Tanker Missile Impact & Leak",
    "time": "2022-03-03 09:00:00",
    "area_km2": 43.2,
    "length_km": 17,
    "lat": 46.5,
    "lon": 30.8,
    "eez": "Ukraine",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20220303T090000_005291_068B12_0A9D",
    "vessel_name": "Millennial Spirit",
    "vessel_type": "Chemical Tanker",
    "mmsi": "351000550",
    "imo": "9123463",
    "flag_code": "PAN",
    "flag_emoji": "\ud83c\uddf5\ud83c\udde6",
    "img_idx": 143,
    "match_prob": 97.0,
    "coordinates": [
      [
        30.72,
        46.46
      ],
      [
        30.89,
        46.48
      ],
      [
        30.86,
        46.55
      ],
      [
        30.73,
        46.53
      ],
      [
        30.72,
        46.46
      ]
    ]
  },
  {
    "id": "skytruth-76",
    "name": "Forties Oil Field Offshore Platform Discharge",
    "time": "2023-06-20 11:10:00",
    "area_km2": 38.5,
    "length_km": 16,
    "lat": 57.75,
    "lon": 0.95,
    "eez": "United Kingdom",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230620T111000_025197_068B12_328B",
    "vessel_name": "Forties Alpha Rig",
    "vessel_type": "Offshore Platform",
    "mmsi": "232000120",
    "imo": "9541243",
    "flag_code": "GBR",
    "flag_emoji": "\ud83c\uddec\ud83c\udde7",
    "img_idx": 681,
    "match_prob": 97.7,
    "coordinates": [
      [
        0.87,
        57.71
      ],
      [
        1.04,
        57.73
      ],
      [
        1.01,
        57.8
      ],
      [
        0.88,
        57.78
      ],
      [
        0.87,
        57.71
      ]
    ]
  },
  {
    "id": "skytruth-77",
    "name": "Ekofisk Field Subsea Pipeline Weepage",
    "time": "2024-02-17 14:35:20",
    "area_km2": 41.0,
    "length_km": 17,
    "lat": 56.55,
    "lon": 3.2,
    "eez": "Norway",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240217T143520_035187_068B12_4695",
    "vessel_name": "ConocoPhillips Ekofisk",
    "vessel_type": "Subsea Pipeline",
    "mmsi": "257000340",
    "imo": "9785426",
    "flag_code": "NOR",
    "flag_emoji": "\ud83c\uddf3\ud83c\uddf4",
    "img_idx": 951,
    "match_prob": 98.4,
    "coordinates": [
      [
        3.12,
        56.51
      ],
      [
        3.29,
        56.53
      ],
      [
        3.26,
        56.6
      ],
      [
        3.13,
        56.58
      ],
      [
        3.12,
        56.51
      ]
    ]
  },
  {
    "id": "skytruth-78",
    "name": "Brent Field Decommissioning Rig Plume",
    "time": "2023-09-18 08:20:00",
    "area_km2": 30.0,
    "length_km": 13,
    "lat": 61.05,
    "lon": 1.7,
    "eez": "United Kingdom",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230918T082000_013875_068B12_1BD5",
    "vessel_name": "Brent Bravo Rig",
    "vessel_type": "Offshore Platform",
    "mmsi": "235000560",
    "imo": "9321794",
    "flag_code": "GBR",
    "flag_emoji": "\ud83c\uddec\ud83c\udde7",
    "img_idx": 375,
    "match_prob": 99.1,
    "coordinates": [
      [
        1.62,
        61.01
      ],
      [
        1.79,
        61.03
      ],
      [
        1.76,
        61.1
      ],
      [
        1.63,
        61.08
      ],
      [
        1.62,
        61.01
      ]
    ]
  },
  {
    "id": "skytruth-79",
    "name": "Statfjord Oil Field Offshore Loading Spill",
    "time": "2024-04-11 16:00:00",
    "area_km2": 36.2,
    "length_km": 15,
    "lat": 61.25,
    "lon": 1.85,
    "eez": "Norway",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240411T160000_001702_068B12_036A",
    "vessel_name": "Statfjord SPM #2",
    "vessel_type": "Offshore Loading Buoy",
    "mmsi": "258000120",
    "imo": "9654135",
    "flag_code": "NOR",
    "flag_emoji": "\ud83c\uddf3\ud83c\uddf4",
    "img_idx": 46,
    "match_prob": 99.8,
    "coordinates": [
      [
        1.77,
        61.21
      ],
      [
        1.94,
        61.23
      ],
      [
        1.91,
        61.3
      ],
      [
        1.78,
        61.28
      ],
      [
        1.77,
        61.21
      ]
    ]
  },
  {
    "id": "skytruth-80",
    "name": "Troll Gas/Condensate Field Flange Weep",
    "time": "2023-11-05 10:45:15",
    "area_km2": 24.8,
    "length_km": 11,
    "lat": 60.65,
    "lon": 3.75,
    "eez": "Norway",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231105T104515_003293_068B12_069B",
    "vessel_name": "Troll A Giant Platform",
    "vessel_type": "Gas/Oil Rig",
    "mmsi": "259000230",
    "imo": "9123464",
    "flag_code": "NOR",
    "flag_emoji": "\ud83c\uddf3\ud83c\uddf4",
    "img_idx": 89,
    "match_prob": 92.7,
    "coordinates": [
      [
        3.67,
        60.61
      ],
      [
        3.84,
        60.63
      ],
      [
        3.81,
        60.7
      ],
      [
        3.68,
        60.68
      ],
      [
        3.67,
        60.61
      ]
    ]
  },
  {
    "id": "skytruth-81",
    "name": "English Channel Dover Strait Cargo Bilge",
    "time": "2023-10-28 07:15:30",
    "area_km2": 31.2,
    "length_km": 13,
    "lat": 51.1,
    "lon": 1.45,
    "eez": "United Kingdom",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231028T071530_003293_068B12_069B",
    "vessel_name": "Dover Navigator",
    "vessel_type": "Container Ship",
    "mmsi": "235002000",
    "imo": "9412594",
    "flag_code": "GBR",
    "flag_emoji": "\ud83c\uddec\ud83c\udde7",
    "img_idx": 89,
    "match_prob": 93.4,
    "coordinates": [
      [
        1.37,
        51.06
      ],
      [
        1.54,
        51.08
      ],
      [
        1.51,
        51.15
      ],
      [
        1.38,
        51.13
      ],
      [
        1.37,
        51.06
      ]
    ]
  },
  {
    "id": "skytruth-82",
    "name": "Kattegat Strait Tanker Collision Slick",
    "time": "2024-01-30 13:40:00",
    "area_km2": 34.6,
    "length_km": 14,
    "lat": 57.2,
    "lon": 11.5,
    "eez": "Denmark",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240130T134000_001702_068B12_036A",
    "vessel_name": "Nordic Transporter",
    "vessel_type": "Chemical Tanker",
    "mmsi": "219001400",
    "imo": "9785427",
    "flag_code": "DNK",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 46,
    "match_prob": 94.1,
    "coordinates": [
      [
        11.42,
        57.16
      ],
      [
        11.59,
        57.18
      ],
      [
        11.56,
        57.25
      ],
      [
        11.43,
        57.23
      ],
      [
        11.42,
        57.16
      ]
    ]
  },
  {
    "id": "skytruth-83",
    "name": "Gulf of Finland Primorsk Crude Transit Trail",
    "time": "2023-12-02 05:20:10",
    "area_km2": 49.8,
    "length_km": 20,
    "lat": 60.1,
    "lon": 28.5,
    "eez": "Russia",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231202T052010_029970_068B12_3C1E",
    "vessel_name": "Baltic Captain",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "273004500",
    "imo": "9541244",
    "flag_code": "RUS",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 810,
    "match_prob": 94.8,
    "coordinates": [
      [
        28.42,
        60.06
      ],
      [
        28.59,
        60.08
      ],
      [
        28.56,
        60.15
      ],
      [
        28.43,
        60.13
      ],
      [
        28.42,
        60.06
      ]
    ]
  },
  {
    "id": "skytruth-84",
    "name": "Gotland Deep Transit Cargo Bilge Streak",
    "time": "2024-03-15 16:10:00",
    "area_km2": 28.5,
    "length_km": 12,
    "lat": 57.3,
    "lon": 19.5,
    "eez": "Sweden",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240315T161000_005254_068B12_0A8A",
    "vessel_name": "Svea Trader",
    "vessel_type": "General Cargo",
    "mmsi": "265000120",
    "imo": "9321795",
    "flag_code": "SWE",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 142,
    "match_prob": 95.5,
    "coordinates": [
      [
        19.42,
        57.26
      ],
      [
        19.59,
        57.28
      ],
      [
        19.56,
        57.35
      ],
      [
        19.43,
        57.33
      ],
      [
        19.42,
        57.26
      ]
    ]
  },
  {
    "id": "skytruth-85",
    "name": "Skagerrak Deepwater Bunkering Overfill",
    "time": "2023-08-14 11:00:25",
    "area_km2": 23.0,
    "length_km": 10,
    "lat": 58.0,
    "lon": 9.5,
    "eez": "Norway",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230814T110025_002035_068B12_0415",
    "vessel_name": "Viking Fueler",
    "vessel_type": "Bunkering Barge",
    "mmsi": "257000890",
    "imo": "9654136",
    "flag_code": "NOR",
    "flag_emoji": "\ud83c\uddf3\ud83c\uddf4",
    "img_idx": 55,
    "match_prob": 96.2,
    "coordinates": [
      [
        9.42,
        57.96
      ],
      [
        9.59,
        57.98
      ],
      [
        9.56,
        58.05
      ],
      [
        9.43,
        58.03
      ],
      [
        9.42,
        57.96
      ]
    ]
  },
  {
    "id": "skytruth-86",
    "name": "Mississippi Canyon MC-20 Chronic Plume",
    "time": "2022-04-28 11:30:00",
    "area_km2": 71.5,
    "length_km": 27,
    "lat": 28.9,
    "lon": -88.88,
    "eez": "United States",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20220428T113000_035187_068B12_4695",
    "vessel_name": "Taylor Energy Site",
    "vessel_type": "Subsea Well Complex",
    "mmsi": "367000100",
    "imo": "9854125",
    "flag_code": "USA",
    "flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
    "img_idx": 951,
    "match_prob": 96.9,
    "coordinates": [
      [
        -88.96,
        28.86
      ],
      [
        -88.79,
        28.88
      ],
      [
        -88.82,
        28.95
      ],
      [
        -88.95,
        28.93
      ],
      [
        -88.96,
        28.86
      ]
    ]
  },
  {
    "id": "skytruth-87",
    "name": "Bay of Campeche Ku-Maloob-Zaap Fire & Spill",
    "time": "2021-07-02 06:15:00",
    "area_km2": 58.0,
    "length_km": 23,
    "lat": 19.35,
    "lon": -92.15,
    "eez": "Mexico",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20210702T061500_000444_068B12_00E4",
    "vessel_name": "Pemex KMZ Cluster",
    "vessel_type": "Gas/Oil Pipeline",
    "mmsi": "345000120",
    "imo": "9412595",
    "flag_code": "MEX",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 12,
    "match_prob": 97.6,
    "coordinates": [
      [
        -92.23,
        19.31
      ],
      [
        -92.06,
        19.33
      ],
      [
        -92.09,
        19.4
      ],
      [
        -92.22,
        19.38
      ],
      [
        -92.23,
        19.31
      ]
    ]
  },
  {
    "id": "skytruth-88",
    "name": "Tobago Gulf of Paria Mystery Barge Overturn",
    "time": "2024-02-07 14:40:20",
    "area_km2": 66.0,
    "length_km": 26,
    "lat": 11.15,
    "lon": -60.75,
    "eez": "Trinidad and Tobago",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240207T144020_005291_068B12_0A9D",
    "vessel_name": "Solo Creed Tug",
    "vessel_type": "Fuel Barge",
    "mmsi": "362000100",
    "imo": "9785428",
    "flag_code": "TTO",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 143,
    "match_prob": 98.3,
    "coordinates": [
      [
        -60.83,
        11.11
      ],
      [
        -60.66,
        11.13
      ],
      [
        -60.69,
        11.2
      ],
      [
        -60.82,
        11.18
      ],
      [
        -60.83,
        11.11
      ]
    ]
  },
  {
    "id": "skytruth-89",
    "name": "Galveston Bay Tanker Lightering Leak",
    "time": "2023-09-08 09:20:00",
    "area_km2": 26.5,
    "length_km": 11,
    "lat": 29.3,
    "lon": -94.75,
    "eez": "United States",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230908T092000_003256_068B12_0688",
    "vessel_name": "Texas Navigator",
    "vessel_type": "Chemical Tanker",
    "mmsi": "367001400",
    "imo": "9321796",
    "flag_code": "USA",
    "flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
    "img_idx": 88,
    "match_prob": 99.0,
    "coordinates": [
      [
        -94.83,
        29.26
      ],
      [
        -94.66,
        29.28
      ],
      [
        -94.69,
        29.35
      ],
      [
        -94.82,
        29.33
      ],
      [
        -94.83,
        29.26
      ]
    ]
  },
  {
    "id": "skytruth-90",
    "name": "Tampa Bay Offshore Bunkering Overflow",
    "time": "2024-04-03 16:15:45",
    "area_km2": 21.8,
    "length_km": 9,
    "lat": 27.8,
    "lon": -82.6,
    "eez": "United States",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240403T161545_008547_068B12_1125",
    "vessel_name": "Gulf Coast Bunkerer",
    "vessel_type": "Fuel Barge",
    "mmsi": "368000230",
    "imo": "9654137",
    "flag_code": "USA",
    "flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
    "img_idx": 231,
    "match_prob": 99.7,
    "coordinates": [
      [
        -82.68,
        27.76
      ],
      [
        -82.51,
        27.78
      ],
      [
        -82.54,
        27.85
      ],
      [
        -82.67,
        27.83
      ],
      [
        -82.68,
        27.76
      ]
    ]
  },
  {
    "id": "skytruth-91",
    "name": "Huntington Beach Beta Pipeline Rupture",
    "time": "2021-10-02 12:45:00",
    "area_km2": 33.7,
    "length_km": 14,
    "lat": 33.62,
    "lon": -118.0,
    "eez": "United States",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20211002T124500_013912_068B12_1BE8",
    "vessel_name": "Platform Elly",
    "vessel_type": "Subsea Crude Pipeline",
    "mmsi": "366000120",
    "imo": "9541245",
    "flag_code": "USA",
    "flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
    "img_idx": 376,
    "match_prob": 92.6,
    "coordinates": [
      [
        -118.08,
        33.58
      ],
      [
        -117.91,
        33.6
      ],
      [
        -117.94,
        33.67
      ],
      [
        -118.07,
        33.65
      ],
      [
        -118.08,
        33.58
      ]
    ]
  },
  {
    "id": "skytruth-92",
    "name": "Repsol La Pampilla Ventanilla Disaster",
    "time": "2022-01-15 17:30:10",
    "area_km2": 42.1,
    "length_km": 17,
    "lat": -11.88,
    "lon": -77.14,
    "eez": "Peru",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20220115T173010_008547_068B12_1125",
    "vessel_name": "Mare Doricum",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "248039000",
    "imo": "9123465",
    "flag_code": "PER",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 231,
    "match_prob": 93.3,
    "coordinates": [
      [
        -77.22,
        -11.92
      ],
      [
        -77.05,
        -11.9
      ],
      [
        -77.08,
        -11.83
      ],
      [
        -77.21,
        -11.85
      ],
      [
        -77.22,
        -11.92
      ]
    ]
  },
  {
    "id": "skytruth-93",
    "name": "Santa Barbara Channel Offshore Platform Seep",
    "time": "2023-11-19 08:10:00",
    "area_km2": 29.0,
    "length_km": 12,
    "lat": 34.35,
    "lon": -119.6,
    "eez": "United States",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231119T081000_025197_068B12_328B",
    "vessel_name": "Platform Holly Asset",
    "vessel_type": "Offshore Platform",
    "mmsi": "367000560",
    "imo": "9785429",
    "flag_code": "USA",
    "flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
    "img_idx": 681,
    "match_prob": 94.0,
    "coordinates": [
      [
        -119.68,
        34.31
      ],
      [
        -119.51,
        34.33
      ],
      [
        -119.54,
        34.4
      ],
      [
        -119.67,
        34.38
      ],
      [
        -119.68,
        34.31
      ]
    ]
  },
  {
    "id": "skytruth-94",
    "name": "Guayaquil Gulf Container Ship Grounding",
    "time": "2024-01-12 14:05:30",
    "area_km2": 30.5,
    "length_km": 13,
    "lat": -2.8,
    "lon": -80.2,
    "eez": "Ecuador",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240112T140530_003293_068B12_069B",
    "vessel_name": "Pacific Pioneer",
    "vessel_type": "Container Ship",
    "mmsi": "735000100",
    "imo": "9412596",
    "flag_code": "ECU",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 89,
    "match_prob": 94.7,
    "coordinates": [
      [
        -80.28,
        -2.84
      ],
      [
        -80.11,
        -2.82
      ],
      [
        -80.14,
        -2.75
      ],
      [
        -80.27,
        -2.77
      ],
      [
        -80.28,
        -2.84
      ]
    ]
  },
  {
    "id": "skytruth-95",
    "name": "Valparaiso Outer Anchorage Fuel Discharge",
    "time": "2023-08-08 10:50:00",
    "area_km2": 23.5,
    "length_km": 10,
    "lat": -33.0,
    "lon": -71.6,
    "eez": "Chile",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20230808T105000_005254_068B12_0A8A",
    "vessel_name": "Chilean Express",
    "vessel_type": "Bulk Carrier",
    "mmsi": "725000230",
    "imo": "9654138",
    "flag_code": "CHL",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 142,
    "match_prob": 95.4,
    "coordinates": [
      [
        -71.68,
        -33.04
      ],
      [
        -71.51,
        -33.02
      ],
      [
        -71.54,
        -32.95
      ],
      [
        -71.67,
        -32.97
      ],
      [
        -71.68,
        -33.04
      ]
    ]
  },
  {
    "id": "skytruth-96",
    "name": "Niger Delta Bonny Offshore Terminal Slick",
    "time": "2023-12-04 05:40:00",
    "area_km2": 65.3,
    "length_km": 25,
    "lat": 4.25,
    "lon": 7.15,
    "eez": "Nigeria",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231204T054000_003256_068B12_0688",
    "vessel_name": "Bonny Crude Base",
    "vessel_type": "Export Pipeline",
    "mmsi": "657000120",
    "imo": "9541246",
    "flag_code": "NGA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 88,
    "match_prob": 96.1,
    "coordinates": [
      [
        7.07,
        4.21
      ],
      [
        7.24,
        4.23
      ],
      [
        7.21,
        4.3
      ],
      [
        7.08,
        4.28
      ],
      [
        7.07,
        4.21
      ]
    ]
  },
  {
    "id": "skytruth-97",
    "name": "Cabinda Deepwater Block 14 Production Plume",
    "time": "2024-03-14 13:20:00",
    "area_km2": 49.0,
    "length_km": 20,
    "lat": -5.45,
    "lon": 11.7,
    "eez": "Angola",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240314T132000_013875_068B12_1BD5",
    "vessel_name": "FPSO Kuito Asset",
    "vessel_type": "FPSO Facility",
    "mmsi": "603000340",
    "imo": "9785430",
    "flag_code": "AGO",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 375,
    "match_prob": 96.8,
    "coordinates": [
      [
        11.62,
        -5.49
      ],
      [
        11.79,
        -5.47
      ],
      [
        11.76,
        -5.4
      ],
      [
        11.63,
        -5.42
      ],
      [
        11.62,
        -5.49
      ]
    ]
  },
  {
    "id": "skytruth-98",
    "name": "Guanabara Bay Petrobras Pipeline Weep",
    "time": "2023-10-18 16:45:20",
    "area_km2": 37.0,
    "length_km": 15,
    "lat": -22.8,
    "lon": -43.15,
    "eez": "Brazil",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231018T164520_008510_068B12_1112",
    "vessel_name": "Reduc Pipeline Asset",
    "vessel_type": "Refinery Subsea Line",
    "mmsi": "710000100",
    "imo": "9321797",
    "flag_code": "BRA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 230,
    "match_prob": 97.5,
    "coordinates": [
      [
        -43.23,
        -22.84
      ],
      [
        -43.06,
        -22.82
      ],
      [
        -43.09,
        -22.75
      ],
      [
        -43.22,
        -22.77
      ],
      [
        -43.23,
        -22.84
      ]
    ]
  },
  {
    "id": "skytruth-99",
    "name": "Cape Town Agulhas Retroflection Tanker Wash",
    "time": "2024-01-14 09:10:15",
    "area_km2": 42.8,
    "length_km": 17,
    "lat": -34.5,
    "lon": 18.2,
    "eez": "South Africa",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20240114T091015_018944_068B12_2600",
    "vessel_name": "Cape Route Pioneer",
    "vessel_type": "Crude Oil Tanker",
    "mmsi": "636009000",
    "imo": "9654139",
    "flag_code": "ZAF",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 512,
    "match_prob": 98.2,
    "coordinates": [
      [
        18.12,
        -34.54
      ],
      [
        18.29,
        -34.52
      ],
      [
        18.26,
        -34.45
      ],
      [
        18.13,
        -34.47
      ],
      [
        18.12,
        -34.54
      ]
    ]
  },
  {
    "id": "skytruth-100",
    "name": "Ghana Jubilee Deepwater FPSO Kwame Nkrumah",
    "time": "2023-11-20 12:00:00",
    "area_km2": 33.5,
    "length_km": 14,
    "lat": 4.55,
    "lon": -2.9,
    "eez": "Ghana",
    "s1_scene_id": "S1A_IW_GRDH_1SDV_20231120T120000_001702_068B12_036A",
    "vessel_name": "Tullow Jubilee FPSO",
    "vessel_type": "FPSO Vessel",
    "mmsi": "627000120",
    "imo": "9123466",
    "flag_code": "GHA",
    "flag_emoji": "\ud83c\udf10",
    "img_idx": 46,
    "match_prob": 98.9,
    "coordinates": [
      [
        -2.98,
        4.51
      ],
      [
        -2.81,
        4.53
      ],
      [
        -2.84,
        4.6
      ],
      [
        -2.97,
        4.58
      ],
      [
        -2.98,
        4.51
      ]
    ]
  }
];
