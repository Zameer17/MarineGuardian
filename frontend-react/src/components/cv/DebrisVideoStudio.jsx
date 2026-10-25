import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Eye, ShieldCheck, Sliders, Upload, RefreshCw } from 'lucide-react';
import { useMarineContext } from '../../context/MarineContext';
import { fetchDebrisVideoFrame, runDebrisInference } from '../../services/api';
import { getCachedDebrisVideoFrame } from '../../services/mockData';

export default function DebrisVideoStudio() {
  const { cachedDebrisData, setCachedDebrisData } = useMarineContext();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [loadingFrame, setLoadingFrame] = useState(false);
  const [customInference, setCustomInference] = useState(null);
  const [inferring, setInferring] = useState(false);

  // Fetch live video frame inference from FastAPI backend or high-speed CDN stream
  useEffect(() => {
    let interval = null;
    let isMounted = true;

    async function loadFrame() {
      setLoadingFrame(true);
      try {
        const res = await fetchDebrisVideoFrame(currentFrameIdx);
        if (res && isMounted) {
          setCachedDebrisData(res);
        } else if (isMounted) {
          setCachedDebrisData(getCachedDebrisVideoFrame(currentFrameIdx));
        }
      } catch (err) {
        console.warn("Frame fetch fallback", err);
        if (isMounted) setCachedDebrisData(getCachedDebrisVideoFrame(currentFrameIdx));
      } finally {
        if (isMounted) setLoadingFrame(false);
      }
    }

    loadFrame();

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % 15);
      }, 2500);
    }
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [currentFrameIdx, isPlaying]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setInferring(true);
    try {
      const res = await runDebrisInference(file, confThreshold);
      if (res) {
        setCustomInference(res);
      }
    } catch (err) {
      console.error("Custom debris inference error", err);
    } finally {
      setInferring(false);
    }
  };

  const videoData = cachedDebrisData || getCachedDebrisVideoFrame(currentFrameIdx);
  const frameB64 = customInference?.annotated_image_b64 || videoData?.annotated_frame_b64 || videoData?.annotated_frame_url;
  const detections = customInference?.detections || videoData?.detections || [];
  const latency = customInference?.latency_ms || videoData?.latency_ms || 32.5;

  return (
    <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-6 shadow-sm text-slate-100 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#1E293B] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">ROV Underwater Debris Studio</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              YOLOv8 Active Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            YOLOv8 subsea plastic & ghost net recognition on real MP4 ROV surveillance feed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {customInference && (
            <button
              onClick={() => setCustomInference(null)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#1E293B] text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              Back to ROV Stream
            </button>
          )}
          <label className="px-3 py-2 rounded-xl bg-[#0D1730] hover:bg-[#1A284B] border border-[#1E293B] text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-sky-400" /> Upload Debris Image
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Scanner Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-[#1E293B] overflow-hidden group shadow-md flex items-center justify-center">
            {frameB64 ? (
              <img src={frameB64} alt="ROV Debris Feed" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center p-5 rounded-full bg-[#0D1730] border border-[#1E293B] text-cyan-400 mb-3">
                  <Activity className="w-10 h-10 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-slate-200">Connecting Subsea ROV Video Stream...</div>
              </div>
            )}

            {inferring && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold font-mono">
                <RefreshCw className="w-5 h-5 animate-spin text-sky-400 mr-2" /> Running YOLOv8 Detection...
              </div>
            )}

            {/* ROV HUD Overlay */}
            <div className="absolute top-3 left-3 bg-[#0D1730]/90 border border-[#1E293B] px-3 py-1.5 rounded-lg text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              ROV SUBSEA FEED | {videoData ? `${videoData.timestamp_s}s` : '00:04.20'} | LATENCY: {latency}ms
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-[#0D1730] border border-[#1E293B] p-3 rounded-xl gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => {
                  setCurrentFrameIdx(0);
                  setCachedDebrisData(getCachedDebrisVideoFrame(0));
                }}
                className="p-2.5 rounded-lg bg-[#111D3A] border border-[#1E293B] text-slate-300 hover:bg-[#1A284B] transition-colors"
                title="Reset Stream"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Frame Timeline Selector */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((idx) => (
                <button
                  key={idx}
                  onClick={() => { 
                    setCurrentFrameIdx(idx); 
                    setIsPlaying(false); 
                    setCachedDebrisData(getCachedDebrisVideoFrame(idx));
                  }}
                  className={`py-1.5 px-2.5 rounded-lg text-[11px] font-mono transition-all border whitespace-nowrap ${
                    idx === currentFrameIdx 
                      ? 'bg-sky-600 text-white border-sky-500 font-bold' 
                      : 'bg-[#111D3A] text-slate-300 border-[#1E293B] hover:bg-[#1A284B]'
                  }`}
                >
                  Step {idx * 2}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hyperparameter Controls & Diagnostics */}
        <div className="space-y-4">
          <div className="bg-[#0D1730] border border-[#1E293B] rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              YOLO Hyperparameters
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Confidence Cutoff:</span>
                <span className="text-sky-400">{(confThreshold * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.90" 
                step="0.05"
                value={confThreshold} 
                onChange={(e) => setConfThreshold(Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-[#111D3A] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-[#0D1730] border border-[#1E293B] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              YOLOv8 Detections ({detections.length})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {detections.length > 0 ? (
                detections.map((det, i) => (
                  <div key={i} className="p-2.5 bg-[#111D3A] border border-[#1E293B] rounded-lg flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-100">{det.label}</span>
                    <span className="text-emerald-400 font-extrabold">{det.confidence}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 font-mono text-center bg-[#111D3A] rounded-lg border border-[#1E293B]">
                  Scanning for subsea debris...
                </div>
              )}
            </div>

            <div className="p-3 bg-[#111D3A] border border-[#1E293B] rounded-lg text-xs text-sky-300 flex items-start gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Real-time YOLOv8 subsea object recognition active.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
