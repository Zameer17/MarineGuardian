import React from 'react';
import { Globe, Radio, ExternalLink, ShieldCheck } from 'lucide-react';

export const SegmentationLab = () => {
  return (
    <div className="space-y-6">
      {/* SkyTruth Command Header Bar */}
      <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0D1730] border border-[#1E293B] text-emerald-400">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-100 tracking-tight">
              SkyTruth Cerulean Live Satellite Oil Slick Command
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time global AI oil slick detection feed powered by Sentinel-1 SAR satellite telemetry
            </p>
          </div>
        </div>

        {/* Live SkyTruth Status Indicator */}
        <div className="flex items-center bg-emerald-950/70 border border-emerald-800/80 px-4 py-2.5 rounded-xl font-mono text-xs text-emerald-400 font-extrabold shrink-0 gap-2.5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LIVE SKYTRUTH CERULEAN STREAM</span>
          <a
            href="https://cerulean.skytruth.org/"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-white transition-colors flex items-center gap-1 font-bold pl-2 border-l border-emerald-800/60"
          >
            Launch Full <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* FULL WIDTH SKYTRUTH CERULEAN MAP PLATFORM */}
      <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            Live SkyTruth Cerulean Cloud Platform
          </h3>
          <span className="px-3 py-1 rounded-md bg-[#0D1730] border border-[#1E293B] text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AI Oil Slick Pipeline Operational
          </span>
        </div>

        {/* Prominent High-Definition SkyTruth Platform Canvas (780px height) */}
        <div className="relative w-full h-[780px] rounded-xl overflow-hidden border border-[#1E293B] bg-[#0B132B] shadow-2xl">
          <iframe
            src="https://cerulean.skytruth.org/"
            title="SkyTruth Cerulean Live Oil Spill Map"
            className="w-full h-full border-0"
            allow="geolocation"
          />
        </div>
      </div>
    </div>
  );
};

export default SegmentationLab;
