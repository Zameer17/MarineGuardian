import React, { useState } from 'react';
import SegmentationLab from '../components/cv/SegmentationLab';
import DebrisVideoStudio from '../components/cv/DebrisVideoStudio';
import HSILab from '../components/cv/HSILab';
import { Cpu, Eye, Layers, Zap } from 'lucide-react';

export default function SatelliteGisPage() {
  const [activeTab, setActiveTab] = useState('sar'); // 'sar', 'debris', 'hsi'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#111D3A] border border-[#1E293B] p-6 rounded-2xl shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Satellite SAR & Oil Spill GIS Intelligence
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> AI Engine Active
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Sentinel-1 C-Band SAR oil spill segmentation, subsea ROV video scanner & 224-band Hyperspectral signature analysis
          </p>
        </div>

        {/* Enterprise Hardware Specs Status */}
        <div className="flex items-center gap-2 bg-[#0D1730] border border-[#1E293B] px-4 py-2 rounded-xl font-mono text-xs text-slate-300 font-bold">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>Inference Engine: <strong className="text-sky-400">Enterprise Tensor Cluster</strong></span>
        </div>
      </div>

      {/* Pill Tab Navigation matching reference image */}
      <div className="flex items-center bg-[#111D3A] border border-[#1E293B] p-1.5 rounded-xl gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('sar')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border ${
            activeTab === 'sar'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Synthetic Aperture Radar (SAR) Oil Spill Lab
        </button>

        <button
          onClick={() => setActiveTab('debris')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border ${
            activeTab === 'debris'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730] hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          ROV Marine Debris Video Studio
        </button>

        <button
          onClick={() => setActiveTab('hsi')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs transition-all border ${
            activeTab === 'hsi'
              ? 'bg-sky-600 text-white border-sky-500'
              : 'text-slate-300 border-transparent hover:bg-[#0D1730] hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          Hyperspectral (HSI) Lab
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-300">
        {activeTab === 'sar' && <SegmentationLab />}
        {activeTab === 'debris' && <DebrisVideoStudio />}
        {activeTab === 'hsi' && <HSILab />}
      </div>
    </div>
  );
}
