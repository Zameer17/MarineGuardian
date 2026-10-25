"""
MARINE GUARDIAN: COASTAL LOCATION DATABASE
Maps major Indian fishing harbors, landing centers, and coastal hubs 
to their latitude and longitude coordinates.
"""

INDIAN_COASTAL_ZONES = {
    # Gujarat
    "jakhau": {"lat": 23.2366, "lon": 68.7111},
    "okha": {"lat": 22.4633, "lon": 69.0066},
    "porbandar": {"lat": 21.6417, "lon": 69.6010},
    "veraval": {"lat": 20.9159, "lon": 70.3629},
    "mangrol": {"lat": 21.1156, "lon": 70.1147},
    "kandla": {"lat": 23.0333, "lon": 70.2167},
    "mundra": {"lat": 22.8350, "lon": 69.7333},
    "bhavnagar": {"lat": 21.7645, "lon": 72.1519},
    "hazira": {"lat": 21.0968, "lon": 72.6300},
    "valsad": {"lat": 20.5992, "lon": 72.9342},

    # Maharashtra
    "dahanu": {"lat": 19.9868, "lon": 72.7303},
    "palghar": {"lat": 19.6969, "lon": 72.7681},
    "vasai": {"lat": 19.3318, "lon": 72.7937},
    "mumbai": {"lat": 18.9220, "lon": 72.8347},
    "alibaug": {"lat": 18.6416, "lon": 72.8722},
    "murud": {"lat": 18.3297, "lon": 72.9645},
    "harnai": {"lat": 17.8152, "lon": 73.0886},
    "ratnagiri": {"lat": 16.9902, "lon": 73.3120},
    "devgad": {"lat": 16.3773, "lon": 73.3792},
    "malvan": {"lat": 16.0628, "lon": 73.4655},
    "vengurla": {"lat": 15.8643, "lon": 73.6267},

    # Goa
    "chapora": {"lat": 15.6052, "lon": 73.7408},
    "panaji": {"lat": 15.4909, "lon": 73.8278},
    "vasco": {"lat": 15.3976, "lon": 73.8378},
    "mormugao": {"lat": 15.4055, "lon": 73.7931},
    "goa": {"lat": 15.2993, "lon": 74.1240},
    "betul": {"lat": 15.1378, "lon": 73.9632},

    # Karnataka
    "karwar": {"lat": 14.8052, "lon": 74.1311},
    "honnavar": {"lat": 14.2798, "lon": 74.4439},
    "bhatkal": {"lat": 13.9788, "lon": 74.5583},
    "kundapura": {"lat": 13.6231, "lon": 74.6939},
    "malpe": {"lat": 13.3524, "lon": 74.7042},
    "mangaluru": {"lat": 12.8797, "lon": 74.8426},
    "mangalore": {"lat": 12.8797, "lon": 74.8426}, 

    # Kerala
    "kasaragod": {"lat": 12.5102, "lon": 74.9852},
    "kannur": {"lat": 11.8745, "lon": 75.3704},
    "kozhikode": {"lat": 11.2588, "lon": 75.7804},
    "ponnani": {"lat": 10.7719, "lon": 75.9254},
    "munambam": {"lat": 10.1802, "lon": 76.1706},
    "kochi": {"lat": 9.9312, "lon": 76.2673},
    "alappuzha": {"lat": 9.4981, "lon": 76.3388},
    "kollam": {"lat": 8.8932, "lon": 76.5510},
    "trivandrum": {"lat": 8.5241, "lon": 76.9366},
    "thiruvananthapuram": {"lat": 8.5241, "lon": 76.9366},
    "vizhinjam": {"lat": 8.3739, "lon": 76.9904},

    # Tamil Nadu
    "colachel": {"lat": 8.1752, "lon": 77.2530},
    "kanyakumari": {"lat": 8.0883, "lon": 77.5385},
    "tuticorin": {"lat": 8.7642, "lon": 78.1348},
    "kilakarai": {"lat": 9.2323, "lon": 78.7845},
    "rameswaram": {"lat": 9.2876, "lon": 79.3129},
    "mallipattinam": {"lat": 10.2762, "lon": 79.3149},
    "nagapattinam": {"lat": 10.7656, "lon": 79.8424},
    "poompuhar": {"lat": 11.1441, "lon": 79.8540},
    "cuddalore": {"lat": 11.7480, "lon": 79.7714},
    "chennai": {"lat": 13.0827, "lon": 80.2707},
    "ennore": {"lat": 13.2104, "lon": 80.3245},
    "pulicat": {"lat": 13.4187, "lon": 80.3188},

    # Andhra Pradesh
    "krishnapatnam": {"lat": 14.2514, "lon": 80.1245},
    "nellore": {"lat": 14.4426, "lon": 79.9865},
    "nizampatnam": {"lat": 15.9084, "lon": 80.6657},
    "machilipatnam": {"lat": 16.1793, "lon": 81.1340},
    "kakinada": {"lat": 16.9891, "lon": 82.2475},
    "gangavaram": {"lat": 17.6186, "lon": 83.2378},
    "visakhapatnam": {"lat": 17.6868, "lon": 83.2185},
    "bheemunipatnam": {"lat": 17.8920, "lon": 83.4502},
    "srikakulam": {"lat": 18.2949, "lon": 83.8938},
    "bhavanapadu": {"lat": 18.5714, "lon": 84.3411},

    # Odisha
    "gopalpur": {"lat": 19.2618, "lon": 84.9048},
    "chilika": {"lat": 19.6800, "lon": 85.3100},
    "puri": {"lat": 19.8135, "lon": 85.8312},
    "astaranga": {"lat": 19.9803, "lon": 86.2755},
    "paradip": {"lat": 20.3168, "lon": 86.6111},
    "dhamra": {"lat": 20.8037, "lon": 86.9536},
    "chandipur": {"lat": 21.4402, "lon": 87.0163},
    "baleshwar": {"lat": 21.4934, "lon": 86.9333},

    # West Bengal
    "digha": {"lat": 21.6266, "lon": 87.5074},
    "shankarpur": {"lat": 21.6375, "lon": 87.5746},
    "tajpur": {"lat": 21.6441, "lon": 87.6253},
    "bakkhali": {"lat": 21.5645, "lon": 88.2619},
    "kakdwip": {"lat": 21.8791, "lon": 88.1873},
    "sagar island": {"lat": 21.7820, "lon": 88.1065},
    "haldia": {"lat": 22.0667, "lon": 88.0698},

    # Union Territories - Andaman & Nicobar
    "diglipur": {"lat": 13.2642, "lon": 92.9774},
    "mayabunder": {"lat": 12.9272, "lon": 92.9348},
    "port blair": {"lat": 11.6234, "lon": 92.7265}, 
    "hut bay": {"lat": 10.5917, "lon": 92.5401},
    "car nicobar": {"lat": 9.1667, "lon": 92.7667},
    "campbell bay": {"lat": 7.0135, "lon": 93.9248},

    # Union Territories - Lakshadweep
    "agatti": {"lat": 10.8443, "lon": 72.1932},
    "kavaratti": {"lat": 10.5667, "lon": 72.6369},
    "andrott": {"lat": 10.8175, "lon": 73.6823},
    "kalpeni": {"lat": 10.0768, "lon": 73.6402},
    "minicoy": {"lat": 8.2753, "lon": 73.0487}, 

    # Union Territories - Puducherry
    "yanam": {"lat": 16.7327, "lon": 82.2176},
    "puducherry": {"lat": 11.9416, "lon": 79.8083},
    "karaikal": {"lat": 10.9254, "lon": 79.8380},
    "mahe": {"lat": 11.7002, "lon": 75.5340},
}