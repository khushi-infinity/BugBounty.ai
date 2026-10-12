import React from 'react';

interface FloorFinanceProps {
  bountyCount?: number;
  treasuryBalance?: number;
}

export const FloorFinance: React.FC<FloorFinanceProps> = ({
  bountyCount = 1,
  treasuryBalance = 12500,
}) => {
  return (
    <div className="relative w-full h-full bg-slate-900/90 border-b-4 border-slate-950 flex flex-col justify-between p-3 select-none overflow-hidden">
      {/* Background Pixel Wallpaper Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      {/* Top Department Signboard & Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-500/40 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            FLOOR 1 : FINANCE DEPT (AGENT 3)
          </span>
          <span className="hidden sm:inline-block font-code text-[10px] text-slate-400">
            [CFO.ai Autonomous Payout &amp; Treasury Ledger]
          </span>
        </div>

        {/* Live Treasury Balance Pill */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-0.5 rounded border border-amber-500/30 text-[9px] font-code text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>VAULT: ${treasuryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Decorative Furniture & Pixel Finance Equipment */}
      <div className="relative z-10 flex items-end justify-between px-2 pb-1">
        {/* Left: Heavy Steel Bank Vault with Spinning Dial & Cash Stacks */}
        <div className="flex flex-col items-center">
          <div className="w-20 sm:w-24 h-16 bg-slate-950 border-3 border-amber-600/80 rounded-t-lg relative flex items-center justify-center shadow-lg shadow-amber-500/10">
            {/* Vault Door Outer Ring */}
            <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center relative">
              {/* Spinning Combination Wheel */}
              <div className="w-6 h-6 rounded-full border-2 border-amber-500 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              {/* Spoke handles */}
              <div className="absolute w-8 h-0.5 bg-amber-600/80" />
              <div className="absolute h-8 w-0.5 bg-amber-600/80" />
            </div>

            {/* Pixel Stacks of Green Cash Beside Vault */}
            <div className="absolute bottom-1 right-1 flex flex-col gap-0.5">
              <div className="w-4 h-1 bg-emerald-500 border border-emerald-600 rounded-xs" />
              <div className="w-4 h-1 bg-emerald-500 border border-emerald-600 rounded-xs" />
              <div className="w-4 h-1 bg-emerald-500 border border-emerald-600 rounded-xs" />
            </div>

            {/* Gold bars on left */}
            <div className="absolute bottom-1 left-1 flex flex-col gap-0.5">
              <div className="w-3 h-1 bg-amber-400 border border-amber-500 rounded-xs" />
              <div className="w-3 h-1 bg-amber-400 border border-amber-500 rounded-xs" />
            </div>
          </div>
          {/* Vault Base */}
          <div className="w-24 h-2 bg-slate-800 border-t border-slate-700" />
        </div>

        {/* Center: Receipt Printer & Payout Dispenser */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="w-16 h-12 bg-slate-950 border border-amber-500/50 rounded-xs p-1 flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-center text-[7px] font-pixel text-amber-400 border-b border-slate-800 pb-0.5">
              <span>CFO.AI</span>
              <span className="text-emerald-400">TX#LEDGER</span>
            </div>
            {/* Receipt Paper Feed */}
            <div className="relative bg-amber-100 text-slate-950 font-mono text-[6px] p-0.5 rounded-xs leading-none shadow-inner animate-pulse">
              <div className="font-bold">BOUNTY: $50.00</div>
              <div className="text-[5px]">STATUS: CLEARED</div>
            </div>
            <div className="text-[6px] font-code text-slate-400 text-center">
              INSTANT SETTLEMENT
            </div>
          </div>
          <div className="w-14 h-2 bg-slate-800" />
        </div>

        {/* Right: CFO Desk (Cash register, Gold Ticker, LED balance display) */}
        <div className="flex flex-col items-center">
          {/* Monitors / Displays */}
          <div className="flex items-end gap-1 mb-0.5">
            {/* Ticker Display */}
            <div className="w-12 h-8 bg-slate-950 border border-amber-500/80 rounded-xs p-0.5 flex flex-col justify-between shadow-sm">
              <div className="text-[6px] font-pixel text-amber-400 truncate">
                $ CFO.AI
              </div>
              <div className="text-[7px] font-code text-emerald-400 font-bold">
                +$50.00
              </div>
              <div className="text-[5px] font-mono text-slate-500">
                AUDIT: VERIFIED
              </div>
            </div>
            {/* Cash Register / Terminal */}
            <div className="w-12 h-9 bg-slate-950 border border-emerald-500/80 rounded-xs p-0.5 flex flex-col justify-between shadow-sm">
              <div className="text-[6px] font-mono text-emerald-400">
                &gt; transfer()
              </div>
              <div className="text-[6px] font-pixel text-amber-300 flex items-center gap-1">
                <span>BOUNTY</span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-full" />
              </div>
            </div>
          </div>

          {/* Desk Surface */}
          <div className="w-32 h-5 bg-slate-800 border-t-2 border-slate-600 rounded-t-xs flex items-center justify-between px-2">
            {/* Calculator / Keypad */}
            <div className="w-8 h-2 bg-slate-900 border border-slate-700 rounded-xs" />
            {/* Coin stack */}
            <div className="flex items-center gap-0.5">
              <span className="text-xs animate-coin">🪙</span>
            </div>
            {/* Gold briefcase */}
            <div className="w-3 h-2.5 bg-amber-600 border border-amber-500 rounded-xs" />
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
