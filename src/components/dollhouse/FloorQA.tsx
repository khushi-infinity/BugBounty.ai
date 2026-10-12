import React from 'react';

export const FloorQA: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-slate-900/90 border-b-4 border-slate-950 flex flex-col justify-between p-3 select-none overflow-hidden">
      {/* Background Pixel Wallpaper Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      {/* Top Department Signboard & Security Cam */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/40 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            FLOOR 3 : QA DEPT (AGENT 1)
          </span>
          <span className="hidden sm:inline-block font-code text-[10px] text-slate-400">
            [Automated Bug Diagnostic &amp; Specimen Lab]
          </span>
        </div>

        {/* Blinking Server Diagnostics */}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>

      {/* Decorative Furniture & Pixel Lab Equipment */}
      <div className="relative z-10 flex items-end justify-between px-2 pb-1">
        {/* Left: Bug Terrarium / Specimen Jar */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-14 bg-slate-950/80 border-2 border-emerald-500/60 rounded-t-lg relative flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10">
            {/* Glowing liquid */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-emerald-500/20 backdrop-blur-xs" />
            {/* Animated bug specimen */}
            <div className="relative z-10 animate-bounce text-xs">
              🐛
            </div>
            <div className="absolute top-1 text-[7px] font-pixel text-emerald-400">
              SPECIMEN
            </div>
          </div>
          <div className="w-14 h-2 bg-slate-800 border-t border-slate-700" />
        </div>

        {/* Center: Server Rack with Blinking LEDs */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="w-14 h-16 bg-slate-950 border border-slate-700 rounded-xs p-1 flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-center text-[7px] font-pixel text-cyan-400 border-b border-slate-800 pb-0.5">
              <span>SRV-QA</span>
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
            </div>
            {/* LED rows */}
            <div className="grid grid-cols-4 gap-1 py-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1 rounded-xs ${
                    i % 3 === 0
                      ? 'bg-emerald-400'
                      : i % 3 === 1
                      ? 'bg-cyan-400'
                      : 'bg-amber-400'
                  } animate-pulse`}
                  style={{ animationDuration: `${0.6 + (i % 4) * 0.2}s` }}
                />
              ))}
            </div>
            <div className="text-[6px] font-mono text-slate-500 text-center">
              NEATLOGS TAP
            </div>
          </div>
        </div>

        {/* Right: QA Desk Setup (Dual CRTs, Magnifying tool, desk lamp) */}
        <div className="flex flex-col items-center">
          {/* Monitors */}
          <div className="flex items-end gap-1 mb-0.5">
            {/* Left Screen: Radar / Waveform */}
            <div className="w-10 h-8 bg-slate-950 border border-cyan-500/80 rounded-xs flex flex-col items-center justify-center p-0.5 shadow-sm">
              <span className="text-[7px] text-cyan-400 font-pixel">RADAR</span>
              <div className="w-6 h-3 border border-cyan-500/40 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
              </div>
            </div>
            {/* Right Screen: Code Diagnostic Terminal */}
            <div className="w-12 h-9 bg-slate-950 border border-emerald-500/80 rounded-xs p-0.5 flex flex-col justify-between shadow-sm">
              <div className="text-[6px] font-mono text-emerald-400 truncate">
                &gt; scan()
              </div>
              <div className="text-[6px] font-mono text-cyan-300 animate-pulse">
                BUG: DETECTED
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-4/5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Desk Surface */}
          <div className="w-28 h-5 bg-slate-800 border-t-2 border-slate-600 rounded-t-xs flex items-center justify-between px-2">
            {/* Keyboard */}
            <div className="w-8 h-2 bg-slate-900 border border-slate-700 rounded-xs" />
            {/* Coffee mug */}
            <div className="w-2 h-2.5 bg-amber-500/80 rounded-xs border-r border-amber-600" />
            {/* Magnifying Glass badge */}
            <span className="text-[10px]">🔍</span>
          </div>
          {/* Desk Legs */}
          <div className="w-26 flex justify-between px-2">
            <div className="w-1.5 h-3 bg-slate-900" />
            <div className="w-1.5 h-3 bg-slate-900" />
          </div>
        </div>
      </div>

      {/* Floor Base Plank */}
      <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-950 border-t border-slate-800" />
    </div>
  );
};
