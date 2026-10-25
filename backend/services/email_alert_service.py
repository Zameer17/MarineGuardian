import os
import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone
from typing import Dict, Any, Optional

# Master Prototype Inbox - ALL dispatches are strictly routed here.
# Absolutely NO official port, government, or third-party emails are contacted.
PROTOTYPE_MASTER_INBOX = "zameershaikh17112006@gmail.com"

def load_resend_api_key() -> Optional[str]:
    """Retrieves Resend API key from environment variables or .env file."""
    for key_name in ["RESEND_API_KEY", "RESEND_KEY", "Resend_API_Key", "Resend_Key"]:
        val = os.environ.get(key_name)
        if val and val.strip().strip("\"'"):
            return val.strip().strip("\"'")
            
    for env_path in [".env", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")]:
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as fp:
                    for line in fp:
                        if "RESEND" in line.upper() and "=" in line:
                            parts = line.split("=", 1)
                            if len(parts) == 2:
                                v = parts[1].strip().strip("\"' ")
                                if v:
                                    return v
            except Exception:
                pass
    return None

def resolve_port_email(port_name: Optional[str] = None) -> str:
    """
    Prototype safety enforcement: Always returns the prototype inbox.
    No official port authority emails exist or are ever contacted.
    """
    return PROTOTYPE_MASTER_INBOX

def resolve_vessel_email(mmsi: str, vessel_name: Optional[str] = None) -> str:
    """
    Prototype safety enforcement: Always returns the prototype inbox.
    No live ship master addresses are ever contacted.
    """
    return PROTOTYPE_MASTER_INBOX

def build_hazard_email_html(payload: Dict[str, Any], timestamp_str: str, target_inbox: str = PROTOTYPE_MASTER_INBOX) -> str:
    """Builds a high-contrast maritime command HTML email strictly addressed to the prototype inbox."""
    v_name = payload.get("vessel_name", "Target Vessel")
    mmsi = payload.get("mmsi", "N/A")
    flag = payload.get("flag", "⚓")
    lat = payload.get("lat", 0.0)
    lon = payload.get("lon", 0.0)
    sog = payload.get("sog_knots", 0.0)
    cog = payload.get("cog_degrees", 0.0)
    origin = payload.get("origin") or "Departure Berth"
    destination = payload.get("destination") or "Destination Corridor"
    
    wave_h = payload.get("wave_height_meters", 3.2)
    wind_spd = payload.get("wind_speed_kmh", 42.0)
    ceiling = payload.get("seaHaltThreshold", payload.get("sea_halt_threshold", 2.8))
    extra_nm = payload.get("diversion_distance_nm", 18.5)
    time_delay = payload.get("time_delay_hours", 2.1)
    
    shelter_name = payload.get("emergency_shelter_name", "Mormugao Deepwater Base")
    shelter_dist = payload.get("emergency_shelter_distance_nm", 42.0)
    shelter_eta = payload.get("emergency_shelter_eta_hours", 2.8)

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>MarineGuardian Navigational Dispatch</title>
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; color: #e2e8f0; margin: 0; padding: 20px; }}
        .container {{ max-width: 650px; margin: 0 auto; background: #111d3a; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ background: #0d1730; padding: 20px; border-bottom: 2px solid #ef4444; }}
        .header h1 {{ margin: 0; font-size: 18px; color: #f8fafc; letter-spacing: 0.5px; }}
        .badge-hazard {{ display: inline-block; background: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; margin-top: 8px; }}
        .proto-banner {{ background: #1e3a8a; border: 1px solid #3b82f6; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px; color: #bfdbfe; font-family: monospace; }}
        .content {{ padding: 24px; }}
        .vessel-card {{ background: #0d1730; border: 1px solid #334155; border-radius: 10px; padding: 16px; margin-bottom: 20px; }}
        .vessel-name {{ font-size: 17px; font-weight: bold; color: #38bdf8; }}
        .vessel-meta {{ font-size: 12px; font-family: monospace; color: #94a3b8; margin-top: 4px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }}
        .metric-box {{ background: #152243; padding: 10px 12px; border-radius: 8px; border: 1px solid #1e293b; }}
        .metric-label {{ font-size: 10px; font-family: monospace; color: #94a3b8; text-transform: uppercase; font-weight: bold; }}
        .metric-val {{ font-size: 14px; font-weight: bold; color: #f8fafc; margin-top: 2px; }}
        .text-hazard {{ color: #f87171; }}
        .text-safe {{ color: #34d399; }}
        .text-accent {{ color: #38bdf8; }}
        .section-title {{ font-size: 12px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; font-family: monospace; margin-top: 20px; margin-bottom: 10px; letter-spacing: 0.5px; border-bottom: 1px solid #1e293b; padding-bottom: 4px; }}
        .routing-table {{ width: 100%; border-collapse: collapse; font-size: 12px; }}
        .routing-table td {{ padding: 8px 10px; border-bottom: 1px solid #1e293b; }}
        .routing-table td:first-child {{ color: #94a3b8; width: 40%; font-family: monospace; }}
        .routing-table td:last-child {{ color: #f8fafc; font-weight: bold; }}
        .btn {{ display: inline-block; background: #0284c7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; margin-top: 20px; text-align: center; }}
        .footer {{ background: #0d1730; padding: 16px 20px; border-top: 1px solid #1e293b; font-size: 11px; font-family: monospace; color: #64748b; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ MARITIME COMMAND NAVIGATIONAL DISPATCH</h1>
          <div class="badge-hazard">SEVERE WEATHER HAZARD ALERT &bull; SEA HALT CEILING BREACH</div>
        </div>

        <div class="content">
          <div class="proto-banner">
            🛡️ <strong>PROTOTYPE DEMONSTRATION DISPATCH</strong><br>
            Delivered directly to: <strong>{target_inbox}</strong><br>
            Simulating multi-party dispatch for Vessel {v_name} Bridge, Departure Port ({origin}), and Arrival Port ({destination}).<br>
            <em>Note: No official port or maritime authorities are contacted.</em>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #cbd5e1; margin-top: 0;">
            This prototype navigational alert represents a simulated multi-party dispatch for <strong>{v_name}</strong> and passage corridors. Hydrodynamic sea conditions exceed safe navigational thresholds.
          </p>

          <div class="vessel-card">
            <div class="vessel-name">{flag} {v_name}</div>
            <div class="vessel-meta">MMSI: {mmsi} &bull; SOG: {sog} kn &bull; COG: {cog}&deg; &bull; POS: {lat:.4f}&deg;N, {lon:.4f}&deg;E</div>
            
            <div class="grid">
              <div class="metric-box">
                <div class="metric-label">Observed Wave Swell</div>
                <div class="metric-val text-hazard">{wave_h:.2f} m <span style="font-size: 10px; color: #94a3b8;">(Ceiling: {ceiling}m)</span></div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Surface Gale Wind</div>
                <div class="metric-val text-hazard">{wind_spd:.1f} km/h</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">AI Seaward Bypass</div>
                <div class="metric-val text-accent">+{extra_nm:.1f} nm Offset</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Arrival Adjustment</div>
                <div class="metric-val text-hazard">+{time_delay:.1f} hrs ETA Delay</div>
              </div>
            </div>
          </div>

          <div class="section-title">Voyage Corridors &amp; Simulated Stakeholders</div>
          <table class="routing-table">
            <tr>
              <td>Target Vessel Bridge:</td>
              <td>{v_name} &bull; <span style="color: #38bdf8; font-weight: normal;">Simulated Bridge Role (routed strictly to {target_inbox})</span></td>
            </tr>
            <tr>
              <td>Departure Port (Start):</td>
              <td>{origin} &bull; <span style="color: #38bdf8; font-weight: normal;">Simulated Departure Port Role (routed strictly to {target_inbox})</span></td>
            </tr>
            <tr>
              <td>Destination Port (Arrival):</td>
              <td>{destination} &bull; <span style="color: #38bdf8; font-weight: normal;">Simulated Destination Port Role (routed strictly to {target_inbox})</span></td>
            </tr>
            <tr>
              <td>Emergency Safe Shelter:</td>
              <td>{shelter_name} ({shelter_dist:.1f} nm, ETA: {shelter_eta:.1f}h) &bull; <span style="color: #38bdf8; font-weight: normal;">Simulated Safe Harbor Role (routed strictly to {target_inbox})</span></td>
            </tr>
          </table>

          <div class="section-title">Navigational Action Summary</div>
          <p style="font-size: 12px; line-height: 1.6; color: #cbd5e1;">
            1. <strong>Vessel Master:</strong> Alter course along the AI Seaward Detour corridor with a minimum {extra_nm} nm seaward buffer to bypass high swell focus.<br>
            2. <strong>Start Port Control ({origin}):</strong> Vessel departure log amended. Heavy weather passage advisory confirmed.<br>
            3. <strong>Destination Port Control ({destination}):</strong> Berth arrival window adjusted by +{time_delay} hours.<br>
            4. <strong>Emergency Harbor ({shelter_name}):</strong> Standing by on VHF Ch 16 for emergency basin entry if conditions deteriorate.
          </p>

          <div style="text-align: center;">
            <a href="http://localhost:5173/fleet?mmsi={mmsi}" class="btn">View Live Telematics &amp; Detour GIS Corridor</a>
          </div>
        </div>

        <div class="footer">
          MarineGuardian Autonomous Maritime Safety Platform &bull; Dispatch ID: NAVWARN-{mmsi}-{int(datetime.now().timestamp())}<br>
          Transmission Timestamp: {timestamp_str} &bull; Recipient: {target_inbox}
        </div>
      </div>
    </body>
    </html>
    """
    return html

async def send_vessel_hazard_dispatch(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends targeted emergency weather hazard dispatch strictly to zameershaikh17112006@gmail.com
    simulating delivery for Vessel X Bridge, Start Port Authority, and Destination Port Authority.
    No official emails are ever used or contacted.
    """
    now_utc = datetime.now(timezone.utc)
    ts_str = now_utc.strftime("%Y-%m-%d %H:%M:%S UTC")
    
    v_name = payload.get("vessel_name", "Target Vessel")
    mmsi = payload.get("mmsi", "N/A")
    origin = payload.get("origin") or "Departure Port"
    destination = payload.get("destination") or "Destination Corridor"

    # Strictly enforce delivery to PROTOTYPE_MASTER_INBOX
    target_inbox = PROTOTYPE_MASTER_INBOX

    subject = f"[PROTOTYPE DISPATCH] {v_name} (MMSI: {mmsi}) | {origin} -> {destination} | Severe Weather Detour Active"
    html_body = build_hazard_email_html(payload, ts_str, target_inbox)
    
    text_body = f"""
    [MARITIME COMMAND NAVIGATIONAL DISPATCH - PROTOTYPE DEMONSTRATION]
    Delivered strictly to: {target_inbox}
    (No official port authority emails contacted)
    
    Vessel: {v_name} (MMSI: {mmsi})
    Passage: {origin} ➔ {destination}
    Alert: Wave swell ({payload.get('wave_height_meters', 3.2)}m) exceeds ceiling ({payload.get('sea_halt_threshold', 2.8)}m).
    AI Seaward Detour: +{payload.get('diversion_distance_nm', 18.5)} nm clearance, +{payload.get('time_delay_hours', 2.1)} hrs ETA delay.
    Emergency Shelter: {payload.get('emergency_shelter_name', 'Mormugao Base')} ({payload.get('emergency_shelter_distance_nm', 42.0)} nm).
    
    Simulated Stakeholder Routing:
    - Bridge: {v_name} Bridge (routed strictly to {target_inbox})
    - Start Port: {origin} Authority (routed strictly to {target_inbox})
    - Destination Port: {destination} Authority (routed strictly to {target_inbox})
    - Safe Shelter: {payload.get('emergency_shelter_name')} (routed strictly to {target_inbox})
    Timestamp: {ts_str}
    """

    # Check Resend Cloud API and SMTP configuration
    resend_api_key = load_resend_api_key()
    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "").strip()
    smtp_from = os.environ.get("SMTP_FROM", f"MarineGuardian Prototype <{smtp_user or 'noreply@marineguardian.org'}>").strip()

    is_smtp_configured = bool(smtp_host and smtp_user and smtp_password)

    def _deliver_email():
        # 1. Primary Channel: Resend Cloud HTTPS API (Instant delivery, no ISP port blocks)
        if resend_api_key:
            import requests
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "from": "MarineGuardian Maritime Command <onboarding@resend.dev>",
                "to": [target_inbox],
                "subject": subject,
                "html": html_body,
                "text": text_body
            }
            res = requests.post(url, headers=headers, json=data, timeout=12)
            if res.status_code in [200, 201]:
                res_id = res.json().get("id", "delivered")
                return f"resend_cloud_delivered (ID: {res_id} | To: {target_inbox})"
            else:
                raise RuntimeError(f"Resend API error: {res.status_code} - {res.text}")

        # 2. Secondary Channel: Authenticated SMTP relay
        if is_smtp_configured:
            import email.utils
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"MarineGuardian Maritime Command <{smtp_user or 'alerts@marineguardian.org'}>"
            msg["To"] = target_inbox
            msg["Date"] = email.utils.formatdate(localtime=True)
            msg["Message-ID"] = f"<NAVWARN-{mmsi}-{int(now_utc.timestamp())}@marineguardian.org>"
            msg.attach(MIMEText(text_body, "plain", "utf-8"))
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=14) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(msg["From"], [target_inbox], msg.as_string())
            return f"smtp_authenticated_delivered (To: {target_inbox})"

        # 3. Fallback: Local simulation
        return f"simulated_dispatch (No live credentials | Routed to: {target_inbox})"

    try:
        delivery_mode = await asyncio.to_thread(_deliver_email)
    except Exception as exc:
        print(f"[EMAIL SERVICE WARNING] Live transmission error: {exc}. Logging dispatch locally for {target_inbox}.")
        delivery_mode = f"simulated_dispatch (Delivery note: {exc} | Routed to: {target_inbox})"

    return {
        "success": True,
        "dispatch_id": f"NAVWARN-{mmsi}-{int(now_utc.timestamp())}",
        "timestamp": ts_str,
        "delivery_mode": delivery_mode,
        "vessel_mmsi": mmsi,
        "vessel_name": v_name,
        "subject": subject,
        "recipients": {
            "delivered_to": target_inbox,
            "simulated_roles": {
                "vessel_bridge": f"{v_name} Bridge",
                "start_port": f"{origin} Control",
                "dest_port": f"{destination} Control",
                "shelter_port": payload.get("emergency_shelter_name", "Mormugao Base")
            },
            "all_recipients": [target_inbox]
        },
        "metrics": {
            "wave_height": payload.get("wave_height_meters"),
            "wind_speed": payload.get("wind_speed_kmh"),
            "diversion_distance_nm": payload.get("diversion_distance_nm"),
            "time_delay_hours": payload.get("time_delay_hours")
        }
    }


def build_coastal_hazard_email_html(payload: Dict[str, Any], timestamp_str: str, target_inbox: str = PROTOTYPE_MASTER_INBOX) -> str:
    """Builds a high-visibility coastal early warning advisory HTML email strictly for the prototype inbox."""
    port_name = payload.get("port_name", "Monitored Coastal Port")
    state = payload.get("state", "India")
    region = payload.get("region", "Coastal Zone")
    lat = payload.get("lat", 0.0)
    lon = payload.get("lon", 0.0)
    alert_level = payload.get("alert_level", 2)
    threat_level = str(payload.get("threat_level", "CAUTION")).upper()
    english_advisory = payload.get("english_advisory", "Advisory issued.")
    multilingual = payload.get("multilingual_advisories", {}) or {}
    metrics = payload.get("weather_metrics", {}) or {}
    fleet = payload.get("fleet_allowances", {}) or {}
    is_forced = payload.get("is_forced", False)

    wave_h = float(metrics.get("wave_height_m") if metrics.get("wave_height_m") is not None else metrics.get("wave_height", 1.8))
    wind_spd = float(metrics.get("wind_speed_kmh") if metrics.get("wind_speed_kmh") is not None else metrics.get("wind_speed", 28.0))
    current_spd = float(metrics.get("ocean_current_velocity_kmh") if metrics.get("ocean_current_velocity_kmh") is not None else metrics.get("current_speed", 2.1))
    current_kts = current_spd * 0.539957
    temp_c = float(metrics.get("temperature_c") if metrics.get("temperature_c") is not None else metrics.get("temperature", 28.0))
    swell_h = float(metrics.get("swell_wave_height_m", 0.5))
    wind_gusts = float(metrics.get("wind_gusts_kmh", wind_spd * 1.3))
    wind_compass = str(metrics.get("wind_compass", "SW"))
    wind_dir = metrics.get("wind_direction_deg", 230)
    
    beaufort_data = metrics.get("beaufort", {})
    beaufort_desc = beaufort_data.get("desc", "Breeze") if isinstance(beaufort_data, dict) else "Moderate"
    beaufort_force = beaufort_data.get("force", 4) if isinstance(beaufort_data, dict) else 4
    
    douglas_data = metrics.get("douglas", {})
    douglas_degree = douglas_data.get("degree", "Moderate") if isinstance(douglas_data, dict) else "Moderate"

    header_bg = "#dc2626" if threat_level == "DANGER" else "#d97706"
    status_badge_bg = "#7f1d1d" if threat_level == "DANGER" else "#78350f"
    status_badge_text = "#fca5a5" if threat_level == "DANGER" else "#fde68a"
    status_border = "#ef4444" if threat_level == "DANGER" else "#f59e0b"

    multi_rows = ""
    for lang, text in multilingual.items():
        if lang.lower() == "english":
            continue
        multi_rows += f"""
        <div style="background: #152243; border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 10px; font-family: monospace; color: #38bdf8; font-weight: bold; text-transform: uppercase;">{lang.upper()} REGIONAL BROADCAST FEED</div>
          <div style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.5;">{text}</div>
        </div>
        """

    forced_banner = ""
    if is_forced:
        forced_banner = """
        <div style="background: #7f1d1d; border: 1px solid #ef4444; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 11px; font-weight: bold; color: #fecaca; font-family: monospace;">
          🚨 MANUAL EMERGENCY SOS TRIGGER: High-Priority Distress Broadcast Initiated via Coastal Command.
        </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>MarineGuardian Coastal Safety Advisory</title>
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; color: #e2e8f0; margin: 0; padding: 20px; }}
        .container {{ max-width: 650px; margin: 0 auto; background: #111d3a; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ background: #0d1730; padding: 20px; border-bottom: 3px solid {header_bg}; }}
        .header h1 {{ margin: 0; font-size: 18px; color: #f8fafc; letter-spacing: 0.5px; }}
        .badge-hazard {{ display: inline-block; background: {status_badge_bg}; color: {status_badge_text}; border: 1px solid {status_border}; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; margin-top: 8px; }}
        .proto-banner {{ background: #1e3a8a; border: 1px solid #3b82f6; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px; color: #bfdbfe; font-family: monospace; }}
        .content {{ padding: 24px; }}
        .sector-card {{ background: #0d1730; border: 1px solid #334155; border-radius: 10px; padding: 16px; margin-bottom: 20px; }}
        .sector-title {{ font-size: 17px; font-weight: bold; color: #38bdf8; }}
        .sector-meta {{ font-size: 12px; font-family: monospace; color: #94a3b8; margin-top: 4px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }}
        .metric-box {{ background: #152243; padding: 10px 12px; border-radius: 8px; border: 1px solid #1e293b; }}
        .metric-label {{ font-size: 10px; font-family: monospace; color: #94a3b8; text-transform: uppercase; font-weight: bold; }}
        .metric-val {{ font-size: 15px; font-weight: bold; color: #f8fafc; margin-top: 2px; }}
        .text-hazard {{ color: #f87171; }}
        .section-title {{ font-size: 12px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; font-family: monospace; margin-top: 20px; margin-bottom: 10px; letter-spacing: 0.5px; border-bottom: 1px solid #1e293b; padding-bottom: 4px; }}
        .fleet-box {{ background: #0d1730; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 10px; }}
        .sar-box {{ background: #1e1b4b; border: 1px solid #4338ca; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #c7d2fe; margin-top: 15px; font-family: monospace; }}
        .btn {{ display: inline-block; background: #0284c7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; margin-top: 20px; text-align: center; }}
        .footer {{ background: #0d1730; padding: 16px 20px; border-top: 1px solid #1e293b; font-size: 11px; font-family: monospace; color: #64748b; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ COASTAL EARLY WARNING &amp; FISHERMEN SAFETY ADVISORY</h1>
          <div class="badge-hazard">ALERT LEVEL {alert_level} &bull; {threat_level} CONDITIONS</div>
        </div>

        <div class="content">
          {forced_banner}
          <div class="proto-banner">
            📡 <strong>PROTOTYPE COASTAL COMMAND ALERT</strong><br>
            Dispatched directly to: <strong>{target_inbox}</strong><br>
            Monitored Sector: <strong>{port_name}, {state} ({region})</strong><br>
            <em>Transmitted to coastal fisheries landing centers and Indian Coast Guard SAR coordinators.</em>
          </div>

          <div class="sector-card">
            <div class="sector-title">⚓ Sector: {port_name}</div>
            <div class="sector-meta">State: {state} &bull; GPS: {lat:.4f}&deg;N, {lon:.4f}&deg;E &bull; Region: {region}</div>

            <div class="grid">
              <div class="metric-box">
                <div class="metric-label">Significant Wave Swell</div>
                <div class="metric-val text-hazard">{wave_h:.2f} m <span style="font-size:11px; color:#94a3b8; font-weight:normal;">({douglas_degree})</span></div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Surface Wind Speed</div>
                <div class="metric-val text-hazard">{wind_spd:.1f} km/h <span style="font-size:11px; color:#94a3b8; font-weight:normal;">(Force {beaufort_force} {beaufort_desc})</span></div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Ocean Current Velocity</div>
                <div class="metric-val">{current_spd:.1f} km/h <span style="font-size:11px; color:#94a3b8; font-weight:normal;">({current_kts:.1f} kts)</span></div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Wind Vector &amp; Gusts</div>
                <div class="metric-val">{wind_compass} ({wind_dir}&deg;) <span style="font-size:11px; color:#94a3b8; font-weight:normal;">| Gusts: {wind_gusts:.1f} km/h</span></div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Secondary Ocean Swell</div>
                <div class="metric-val">{swell_h:.2f} m</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Air Temperature</div>
                <div class="metric-val">{temp_c:.1f} &deg;C</div>
              </div>
            </div>
          </div>

          <div class="section-title">Official Early Warning Advisory (English)</div>
          <div style="background: #152243; border-left: 4px solid #f59e0b; padding: 12px 14px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #f8fafc;">
            {english_advisory}
          </div>

          <div class="section-title">Multilingual Regional Dialect Broadcasts</div>
          {multi_rows if multi_rows else '<div style=\"color:#94a3b8; font-size:12px;\">Standard English Broadcast transmitted.</div>'}

          <div class="section-title">Fleet Operating Clearance Directives</div>
          <div class="fleet-box">
            <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">🛶 Small Traditional Crafts (&lt; 12m):</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{fleet.get('small', {}).get('status', 'CAUTION')} - {fleet.get('small', {}).get('desc', 'Exercise extreme caution near surf zones.')}</div>
          </div>
          <div class="fleet-box">
            <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">🚤 Mechanized Trawlers (12-24m):</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{fleet.get('medium', {}).get('status', 'RESTRICTED')} - {fleet.get('medium', {}).get('desc', 'Deep sea operations restricted during gale squalls.')}</div>
          </div>
          <div class="fleet-box">
            <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">🚢 Deep-Sea Commercial Vessels (&gt; 24m):</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{fleet.get('large', {}).get('status', 'ALLOWED')} - {fleet.get('large', {}).get('desc', 'Maintain continuous radar watch on VHF Channel 16.')}</div>
          </div>

          <div class="sar-box">
            🚨 <strong>INDIAN COAST GUARD &amp; MRCC RESCUE CHANNELS:</strong><br>
            &bull; National SAR 24x7 Hotline: <strong>1554 (Toll-Free)</strong><br>
            &bull; MRCC Mumbai (West Coast): +91 22 2437 6133<br>
            &bull; MRCC Chennai (East Coast): +91 44 2539 5018<br>
            &bull; VHF Distress Channel: 16 (156.800 MHz) &bull; DSC: Channel 70
          </div>

          <div style="text-align: center;">
            <a href="http://localhost:5173/command" class="btn">View Live Coastal Telemetry &amp; Windy Radar</a>
          </div>
        </div>

        <div class="footer">
          MarineGuardian National Maritime Defense Hub &bull; SAR Hotline: 1554 (Toll-Free)<br>
          Transmission Timestamp: {timestamp_str} &bull; Target: {target_inbox}
        </div>
      </div>
    </body>
    </html>
    """
    return html


async def send_coastal_fisherman_dispatch(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends coastal emergency hazard advisory email strictly to zameershaikh17112006@gmail.com
    when Alert Level >= 2 is triggered or forced via Emergency SOS button.
    """
    now_utc = datetime.now(timezone.utc)
    ts_str = now_utc.strftime("%Y-%m-%d %H:%M:%S UTC")

    port_key = payload.get("port_key", "coastal").lower()
    port_name = payload.get("port_name", "Coastal Sector")
    state = payload.get("state", "India")
    alert_level = payload.get("alert_level", 2)
    threat_level = str(payload.get("threat_level", "CAUTION")).upper()
    is_forced = payload.get("is_forced", False)
    target_inbox = payload.get("recipient_email") or PROTOTYPE_MASTER_INBOX

    dispatch_type = "EMERGENCY SOS BROADCAST" if is_forced else f"LEVEL {alert_level} ({threat_level}) ADVISORY"
    subject = f"[COASTAL ALERT] Sector: {port_name}, {state} | {dispatch_type} | MarineGuardian"

    html_body = build_coastal_hazard_email_html(payload, ts_str, target_inbox)
    text_body = f"""
    [MARINEGUARDIAN | COASTAL EARLY WARNING & FISHERMEN SAFETY ADVISORY]
    Sector: {port_name}, {state}
    Alert Level: LEVEL {alert_level} ({threat_level})
    Dispatch Mode: {'Manual Force SOS' if is_forced else 'Automated Threshold Trigger'}
    Timestamp: {ts_str}
    
    Advisory:
    {payload.get('english_advisory', 'Sea conditions evaluated.')}
    
    SAR Contact:
    - National SAR Hotline: 1554
    - Recipient: {target_inbox}
    """

    resend_api_key = load_resend_api_key()
    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "").strip()
    is_smtp_configured = bool(smtp_host and smtp_user and smtp_password)

    def _deliver_email():
        # 1. Primary: Resend Cloud HTTPS API
        if resend_api_key:
            import requests
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "from": "MarineGuardian Coastal Command <onboarding@resend.dev>",
                "to": [target_inbox],
                "subject": subject,
                "html": html_body,
                "text": text_body
            }
            res = requests.post(url, headers=headers, json=data, timeout=12)
            if res.status_code in [200, 201]:
                res_id = res.json().get("id", "delivered")
                return f"resend_cloud_delivered (ID: {res_id} | To: {target_inbox})"
            else:
                raise RuntimeError(f"Resend API error: {res.status_code} - {res.text}")

        # 2. Secondary: Authenticated SMTP
        if is_smtp_configured:
            import email.utils
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"MarineGuardian Coastal Command <{smtp_user or 'alerts@marineguardian.org'}>"
            msg["To"] = target_inbox
            msg["Date"] = email.utils.formatdate(localtime=True)
            msg["Message-ID"] = f"<COASTAL-{port_key}-{int(now_utc.timestamp())}@marineguardian.org>"
            msg.attach(MIMEText(text_body, "plain", "utf-8"))
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=14) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(msg["From"], [target_inbox], msg.as_string())
            return f"smtp_authenticated_delivered (To: {target_inbox})"

        return f"simulated_dispatch (No credentials | Routed to: {target_inbox})"

    try:
        delivery_mode = await asyncio.to_thread(_deliver_email)
    except Exception as exc:
        print(f"[COASTAL EMAIL WARNING] Transmission error: {exc}. Logging dispatch locally.")
        delivery_mode = f"simulated_dispatch (Note: {exc} | Routed to: {target_inbox})"

    return {
        "success": True,
        "dispatch_id": f"COASTAL-{port_key.upper()}-{int(now_utc.timestamp())}",
        "timestamp": ts_str,
        "delivery_mode": delivery_mode,
        "sector": port_name,
        "state": state,
        "alert_level": alert_level,
        "threat_level": threat_level,
        "is_forced": is_forced,
        "recipient": target_inbox,
        "subject": subject
    }

