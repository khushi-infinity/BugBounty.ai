import React from 'react';

export const FloorReview: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-slate-900/90 border-b-4 border-slate-950 flex flex-col justify-between p-3 select-none overflow-hidden">
      {/* Background Pixel Wallpaper Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#581c87_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      {/* Top Department Signboard & Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            FLOOR 2 : REVIEW DEPT (AGENT 2)
          </span>
          <span className="hidden sm:inline-block font-code text-[10px] text-slate-400">
            [Entire.io Checkpoints &amp; Peer Verification]
          </span>
        </div>

        {/* Entire.io Sync Status Tag */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-0.5 rounded border border-purple-500/30 text-[9px] font-code text-purple-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>ENTIRE SYNC: READY</span>
        </div>
      </div>

      {/* Decorative Furniture & Pixel Review Equipment */}
      <div className="relative z-10 flex items-end justify-between px-2 pb-1">
        {/* Left: Git Branch Whiteboard & Rubber Duck */}
        <div className="flex flex-col items-center">
          {/* Shelf with Rubber Duck */}
          <div className="w-16 h-3 bg-amber-900/80 border-t border-amber-700 mb-1 flex items-center justify-end px-1 shadow-sm">
            <span className="text-xs" title="Rubber Duck Debugger">
              🦆
            </span>
          </div>

          {/* Git Branch Whiteboard */}
          <div className="w-20 sm:w-24 h-14 bg-slate-950 border-2 border-slate-700 rounded-xs p-1 flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-center text-[7px] font-pixel text-purple-300 border-b border-slate-800 pb-0.5">
              <span>GIT TREE</span>
              <span className="text-emerald-400">PR#4092</span>
            </div>
            {/* Git Branch Lines */}
            <div className="relative h-7 flex items-center px-1">
              {/* Main Line */}
              <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-slate-700" />
              {/* Branch curve */}
              <div className="relative z-10 flex justify-between w-full">
                <div className="w-2 h-2 rounded-full bg-blue-500 border border-slate-900" title="main" />
                <div className="w-2 h-2 rounded-full bg-purple-500 border border-slate-900" title="checkpoint" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" title="merged" />
              </div>
            </div>
            <div className="text-[6px] font-code text-slate-400 truncate">
              chk_ent_7f9a...
            </div>
          </div>
          {/* Board Stand */}
          <div className="w-16 flex justify-between px-2">
            <div className="w-1 h-3 bg-slate-800" />
            <div className="w-1 h-3 bg-slate-800" />
          </div>
        </div>

        {/* Center: Water Cooler & Potted Plant */}
        <div className="hidden sm:flex items-end gap-3 pb-0.5">
          {/* Water Cooler */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-7 bg-cyan-500/40 border border-cyan-400 rounded-t-full relative flex items-center justify-center">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" />
            </div>
            <div className="w-6 h-8 bg-slate-800 border border-slate-700 flex flex-col justify-around items-center">
              <div className="w-2 h-1 bg-cyan-400 rounded-xs" />
            </div>
          </div>
          {/* Potted Pixel Plant */}
          <div className="flex flex-col items-center">
            <div className="text-sm">🌿</div>
            <div className="w-4 h-3 bg-amber-800 border-t border-amber-600 rounded-b-xs" />
          </div>
        </div>

        {/* Right: Reviewer Desk (Dual Ultrawide monitors, Code Diff, Laptop) */}
        <div className="flex flex-col items-center">
          {/* Monitors */}
          <div className="flex items-end gap-1 mb-0.5">
            {/* Diff Monitor Left (Red Deleted) */}
            <div className="w-10 h-8 bg-slate-950 border border-rose-500/80 rounded-xs p-0.5 flex flex-col justify-between shadow-sm">
              <div className="text-[6px] font-mono text-rose-400 truncate">
                - buggy()
              </div>
              <div className="w-full bg-rose-950/60 h-1 rounded-full" />
              <div className="text-[6px] font-mono text-slate-500">
                L2: ERR
              </div>
            </div>
            {/* Diff Monitor Right (Green Verified) */}
            <div className="w-14 h-9 bg-slate-950 border border-emerald-500/80 rounded-xs p-0.5 flex flex-col justify-between shadow-sm">
              <div className="text-[6px] font-mono text-emerald-400 truncate">
                + patchVerified()
              </div>
              <div className="w-full bg-emerald-950/60 h-1 rounded-full">
                <div className="bg-emerald-400 h-full w-full" />
              </div>
              <div className="text-[6px] font-pixel text-emerald-400 flex items-center gap-1">
                <span>PASS</span>
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Desk Surface */}
          <div className="w-32 h-5 bg-slate-800 border-t-2 border-slate-600 rounded-t-xs flex items-center justify-between px-2">
            {/* Laptop */}
            <div className="w-9 h-2.5 bg-slate-900 border border-slate-700 rounded-xs flex items-center justify-center">
              <div className="w-4 h-1 bg-purple-400/80 rounded-xs" />
            </div>
            {/* Coffee mug */}
            <div className="w-2.5 h-3 bg-purple-500/80 rounded-xs" />
            {/* Checkmark icon */}
            <span className="text-[10px] text-emerald-400">✅</span>
          </div>
          {/* Desk Legs */}
          <div className="w-30 flex justify-between px-2">
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
