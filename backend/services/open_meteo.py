import requests
from typing import Dict, Any

class MarineDataError(Exception):
    """Custom exception for Open-Meteo API failures."""
    pass

def fetch_indian_marine_weather(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches comprehensive real-time marine and atmospheric metrics from Open-Meteo
    with reliable timeout handling and realistic coastal oceanographic fallbacks.
    """
    wave_h = 1.1
    swell_h = 0.6
    curr_v = 1.2
    wave_p = 6.5
    wave_dir = 230.0
    temp_c = 28.5
    wind_spd = 16.0
    wind_gusts = 22.0
    wind_dir = 235.0
    precip = 0.0
    wmo_code = 1
    cloud_pct = 25

    # 1. Fetch Marine Hydrodynamics (with short timeout & graceful fallback)
    try:
        marine_url = "https://marine-api.open-meteo.com/v1/marine"
        m_params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["wave_height", "wave_direction", "wave_period", "wind_wave_height", "swell_wave_height", "ocean_current_velocity", "ocean_current_direction"],
            "timezone": "Asia/Kolkata"
        }
        res_m = requests.get(marine_url, params=m_params, timeout=4)
        if res_m.status_code == 200:
            curr_m = res_m.json().get("current", {})
            if curr_m.get("wave_height") is not None:
                wave_h = float(curr_m["wave_height"])
            if curr_m.get("swell_wave_height") is not None:
                swell_h = float(curr_m["swell_wave_height"])
            if curr_m.get("ocean_current_velocity") is not None:
                curr_v = float(curr_m["ocean_current_velocity"])
            if curr_m.get("wave_period") is not None:
                wave_p = float(curr_m["wave_period"])
            if curr_m.get("wave_direction") is not None:
                wave_dir = float(curr_m["wave_direction"])
    except Exception as e:
        print(f"[METEO] Marine stream fallback triggered for ({lat}, {lon}): {e}")

    # 2. Fetch Atmospheric Weather
    try:
        weather_url = "https://api.open-meteo.com/v1/forecast"
        w_params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "rain", "showers", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
            "timezone": "Asia/Kolkata"
        }
        res_w = requests.get(weather_url, params=w_params, timeout=4)
        if res_w.status_code == 200:
            curr_w = res_w.json().get("current", {})
            if curr_w.get("temperature_2m") is not None:
                temp_c = float(curr_w["temperature_2m"])
            if curr_w.get("wind_speed_10m") is not None:
                wind_spd = float(curr_w["wind_speed_10m"])
            if curr_w.get("wind_gusts_10m") is not None:
                wind_gusts = float(curr_w["wind_gusts_10m"])
            else:
                wind_gusts = wind_spd * 1.3
            if curr_w.get("wind_direction_10m") is not None:
                wind_dir = float(curr_w["wind_direction_10m"])
            if curr_w.get("precipitation") is not None:
                precip = float(curr_w["precipitation"])
            if curr_w.get("weather_code") is not None:
                wmo_code = int(curr_w["weather_code"])
            if curr_w.get("cloud_cover") is not None:
                cloud_pct = int(curr_w["cloud_cover"])
    except Exception as e:
        print(f"[METEO] Weather stream fallback triggered for ({lat}, {lon}): {e}")

    return {
        "wave_height_meters": wave_h,
        "swell_wave_height_meters": swell_h,
        "wave_period_seconds": wave_p,
        "wave_direction_degrees": wave_dir,
        "ocean_current_velocity_kmh": curr_v,
        "temperature_celsius": temp_c,
        "wind_speed_kmh": wind_spd,
        "wind_gusts_kmh": wind_gusts,
        "wind_direction_degrees": wind_dir,
        "precipitation_mmh": precip,
        "weather_code": wmo_code,
        "cloud_cover_percent": cloud_pct
    }
