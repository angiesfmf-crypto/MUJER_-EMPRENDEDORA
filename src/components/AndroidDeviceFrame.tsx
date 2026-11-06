import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
  isOnline: boolean;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  isDeviceMode,
  isOnline
}) => {
  if (!isDeviceMode) {
    return <div className="w-full min-h-[calc(100vh-65px)] flex flex-col">{children}</div>;
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="py-4 px-2 sm:px-6 flex items-center justify-center bg-[#EFECE1]/60 min-h-[calc(100vh-65px)]">
      <div className="relative w-full max-w-[430px] h-[870px] max-h-[92vh] bg-[#1E2920] rounded-[52px] p-3 shadow-2xl shadow-[#1F3D1B]/30 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        
        {/* Device Outer Speaker & Camera Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1E2920] rounded-full z-40 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-black ring-2 ring-slate-800" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-full bg-[#FAF7EE] rounded-[42px] overflow-hidden flex flex-col">
          
          {/* Android Status Bar */}
          <div className="h-7 bg-[#2D5A27] text-white px-6 flex items-center justify-between text-xs font-semibold select-none z-30 shrink-0">
            <span>{timeString}</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <span className="text-[10px] text-amber-200 font-bold">Sin señal</span>
              )}
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto flex flex-col relative bg-[#FAF7EE]">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="h-4 bg-[#FFFDF9] flex items-center justify-center shrink-0 z-30 border-t border-[#DFEBDC]">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
