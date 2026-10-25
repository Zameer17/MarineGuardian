from typing import Dict, Any

def get_weather_desc(wmo_code: int) -> str:
    codes = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Marine Fog", 48: "Depositing Rime Fog",
        51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Torrential Rain",
        71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow",
        80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Squalls",
        95: "Marine Thunderstorm", 96: "Thunderstorm with Hail", 99: "Severe Squall Line"
    }
    return codes.get(wmo_code, "Clear Conditions")

def evaluate_marine_safety(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates multi-hazard marine physical metrics against safety standards.
    Considers Wave Height, Swell, Current, Wind, Gusts, Rain Rate, and Thunderstorms.
    """
    wave_h = float(telemetry.get("wave_height_meters", 0.8))
    swell_h = float(telemetry.get("swell_wave_height_meters", 0.4))
    curr_v = float(telemetry.get("ocean_current_velocity_kmh", 1.0))
    wind_spd = float(telemetry.get("wind_speed_kmh", 15.0))
    wind_gusts = float(telemetry.get("wind_gusts_kmh", 20.0))
    precip = float(telemetry.get("precipitation_mmh", 0.0))
    wmo_code = int(telemetry.get("weather_code", 0))
    weather_desc = get_weather_desc(wmo_code)

    # 1. Multi-Hazard Risk Categorization
    is_severe_storm = (wmo_code in [95, 96, 99])  # Thunderstorms, squalls
    is_heavy_rain = (wmo_code in [65, 82] or precip >= 8.0)  # Torrential rain
    is_extreme_wave = (wave_h >= 2.8 or swell_h >= 2.2)
    is_gale_wind = (wind_spd >= 42.0 or wind_gusts >= 55.0)
    is_strong_current = (curr_v >= 3.8)

    is_high_risk = (is_severe_storm or is_heavy_rain or is_extreme_wave or is_gale_wind or is_strong_current)

    is_moderate_rain = (wmo_code in [51, 53, 55, 61, 63, 80, 81] or precip >= 1.0)
    is_moderate_wave = (wave_h >= 1.6 or swell_h >= 1.2)
    is_fresh_wind = (wind_spd >= 26.0 or wind_gusts >= 38.0)
    is_moderate_current = (curr_v >= 2.2)

    is_medium_risk = (is_moderate_rain or is_moderate_wave or is_fresh_wind or is_moderate_current)

    # 2. Consistent Fleet Clearance Assignment
    if is_high_risk:
        status_code = "DANGER"
        alert_level = 3
        color_hex = "#EF4444"
        theme_class = "threat-banner-danger"
        
        # Determine specific reason string
        reasons = []
        if is_severe_storm: reasons.append(f"Active {weather_desc}")
        elif is_heavy_rain: reasons.append(f"Heavy Torrential Rain ({precip:.1f} mm/h)")
        if is_extreme_wave: reasons.append(f"{wave_h:.1f}m High Waves")
        if is_gale_wind: reasons.append(f"Gale Gusts of {wind_gusts:.1f} km/h")
        if is_strong_current: reasons.append(f"{curr_v:.1f} km/h Strong Currents")
        reason_str = " & ".join(reasons) if reasons else f"{weather_desc} and high sea turbulence"

        eng_advisory = f"DANGER: {reason_str} detected. High capsizing and swamping hazard for small and medium crafts. Return to port immediately."
        native_templates = {
            "Marathi": f"धोका: {reason_str} मुळे समुद्रात अत्यंत धोकादायक परिस्थिती आहे. लहान व मध्यम बोटींना मोठा धोका आहे. तात्काळ बंदरात परता.",
            "Hindi": f"खतरा: {reason_str} के कारण समुद्र में अत्यधिक जोखिम है। छोटी और मध्यम नौकाओं को तुरंत बंदरगाह लौटना चाहिए।"
        }

        vessels = {
            "small": {"status": "PROHIBITED", "desc": "High capsizing hazard; total sailing ban, remain moored"},
            "medium": {"status": "RESTRICTED", "desc": "Severe roll & drift risk; cease trawling, return to port"},
            "large": {"status": "ADVISORY", "desc": "Proceed with radar watch; reduce speed in squall zones"}
        }

    elif is_medium_risk:
        status_code = "CAUTION"
        alert_level = 2
        color_hex = "#F59E0B"
        theme_class = "threat-banner-caution"

        reasons = []
        if is_moderate_rain: reasons.append(f"{weather_desc} ({precip:.1f} mm/h)" if precip > 0 else weather_desc)
        if is_moderate_wave: reasons.append(f"{wave_h:.1f}m Waves")
        if is_fresh_wind: reasons.append(f"{wind_spd:.1f} km/h Winds (Gusts: {wind_gusts:.1f} km/h)")
        if is_moderate_current: reasons.append(f"{curr_v:.1f} km/h Currents")
        reason_str = " with ".join(reasons) if reasons else "Moderate sea chop and wind"

        eng_advisory = f"CAUTION: {reason_str}. Small crafts must operate with vigilance and remain within 3-5 nautical miles of coastline."
        native_templates = {
            "Marathi": f"सावधान: {reason_str}. लहान बोटींनी खबरदारी बाळगावी आणि किनाऱ्याजवळच (३-५ नॉटिकल मैल) मासेमारी करावी.",
            "Hindi": f"सावधानी: {reason_str}. छोटी नौकाएं सतर्कता बरतें और तट के निकट (3-5 समुद्री मील) ही रहें।"
        }

        vessels = {
            "small": {"status": "CAUTION", "desc": "Operate within 3 NM of coast; wear life-jackets"},
            "medium": {"status": "ALLOWED WITH CAUTION", "desc": "Permitted with continuous VHF Channel 16 watch"},
            "large": {"status": "ALLOWED", "desc": "Normal deep-sea commercial navigation permitted"}
        }

    else:
        status_code = "SAFE"
        alert_level = 1
        color_hex = "#10B981"
        theme_class = "threat-banner-safe"
        eng_advisory = f"SAFE: Calm sea conditions with {wave_h:.1f}m waves, light winds ({wind_spd:.1f} km/h), and favorable atmospheric clarity. Normal fishing and navigation permitted."
        native_templates = {
            "Marathi": f"सुरक्षित: समुद्र शांत असून {wave_h:.1f} मीटर लाटा व {wind_spd:.1f} किमी/तास वारे आहेत. सर्व प्रकारच्या मासेमारीसाठी हवामान अनुकूल आहे.",
            "Hindi": f"सुरक्षित: समुद्र शांत है, {wave_h:.1f} मीटर लहरें और {wind_spd:.1f} किमी/घंटा हवा है। सामान्य नौकायन व मत्स्यव्यवसाय की अनुमति है।"
        }

        vessels = {
            "small": {"status": "ALLOWED", "desc": "Safe for beach landings, traditional crafts & near-shore fishing"},
            "medium": {"status": "ALLOWED", "desc": "Safe for operational deep-sea fishing & bottom trawling"},
            "large": {"status": "ALLOWED", "desc": "Normal commercial navigation permitted"}
        }

    return {
        "status_code": status_code,
        "alert_level": alert_level,
        "color_hex": color_hex,
        "theme_class": theme_class,
        "english": eng_advisory,
        "native_templates": native_templates,
        "vessels": vessels
    }
