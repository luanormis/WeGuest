import React from 'react';
import { useApp } from '../context/AppContext';
import { Battery, Monitor, Smartphone, Wifi } from 'lucide-react';

export const MobileFrameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileFrame, setIsMobileFrame } = useApp();

  if (!isMobileFrame) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-900 py-6 px-2 sm:px-4 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Simulator Switcher Banner */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm text-xs text-stone-300 px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-[#C5A880]" />
          <span>Simulador Mobile (Android / Capacitor)</span>
        </div>
        <button
          onClick={() => setIsMobileFrame(false)}
          className="text-[11px] bg-stone-800 hover:bg-stone-700 text-[#DFCDAE] px-2.5 py-1 rounded transition-colors flex items-center gap-1"
        >
          <Monitor className="w-3 h-3 text-[#C5A880]" />
          <span>Tela Cheia</span>
        </button>
      </div>

      {/* Realistic Mobile Device Container */}
      <div className="w-full max-w-[410px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-stone-700 relative">
        {/* Device Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 bg-stone-900 rounded-full mr-2" />
          <div className="w-2 h-2 bg-blue-900/60 rounded-full" />
        </div>

        {/* Screen Viewport */}
        <div className="bg-[#FFFFFF] text-[#111111] rounded-[38px] overflow-hidden flex flex-col h-[820px] max-h-[85vh] relative">
          
          {/* Simulated Status Bar */}
          <div className="h-10 bg-white/95 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-800 shrink-0 z-40 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scrollable Content inside the phone */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="h-5 bg-white/95 flex items-center justify-center shrink-0 z-40">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
