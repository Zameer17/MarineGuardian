# MarineGuardian — National Maritime Defense & GIS Intelligence Platform

MarineGuardian is an advanced Maritime GIS, Coastal Early Warning, and Proactive AI Fleet Management System.

## Project Structure
- `backend/` — FastAPI REST API, WebSocket AISStream live ingestion, Open-Meteo marine telemetry, SAR U-Net oil spill segmentation, and YOLOv8s debris detection.
- `frontend-react/` — React 19, Leaflet interactive geospatial mapping, Tailwind CSS, multi-lingual audio broadcast studio.
- `doc_generator/` — Academic documentation compilation engine.
- `MarineGuardian_Complete_Project_Documentation.docx` — 52-page academic project documentation.
- `notebooks/` — Data exploration and training notebooks.
- `reports/` — Analysis reports and research findings.

## How to Run
1. Double-click `run_project.bat` (launches both Backend and Frontend automatically).
2. Or manually:
   - **Backend:** `python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload`
   - **Frontend:** `cd frontend-react && npm run dev`
   - Access the dashboard at `http://localhost:5173`
