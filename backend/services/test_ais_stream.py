import os
import sys
import json
import asyncio
import websockets

def load_ais_key():
    for path in [".env", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")]:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    if "AIS" in line.upper() and "=" in line:
                        parts = line.split("=", 1)
                        if len(parts) == 2:
                            return parts[1].strip().strip("\"' ")
    return None

async def test_north_indian_ocean_belt():
    key = load_ais_key()
    url = "wss://stream.aisstream.io/v0/stream"
    
    # North Indian Ocean Strategic Belt: 0°N - 26.5°N, 54°E - 104°E
    subscribe_msg = {
        "APIKey": key,
        "BoundingBoxes": [
            [[0.0, 54.0], [26.5, 104.0]]
        ],
        "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
    }
    
    async with websockets.connect(url, ping_interval=20, ping_timeout=20) as ws:
        await ws.send(json.dumps(subscribe_msg))
        print("Subscribed to North Indian Ocean Strategic Belt. Listening...", flush=True)
        
        for i in range(10):
            raw = await ws.recv()
            data = json.loads(raw)
            mtype = data.get("MessageType")
            meta = data.get("MetaData", {})
            print(f"[{i+1}] {mtype} | {meta.get('ShipName')} | MMSI: {meta.get('MMSI')} | Lat: {meta.get('latitude')} Lon: {meta.get('longitude')}", flush=True)

if __name__ == "__main__":
    asyncio.run(test_north_indian_ocean_belt())
