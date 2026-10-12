import React from 'react';
import { AgentAction, AgentId } from '../../types/agent';

interface PixelAvatarProps {
  id: AgentId;
  action: AgentAction;
  direction: 'left' | 'right';
  isRidingElevator?: boolean;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  id,
  action,
  direction,
  isRidingElevator,
}) => {
  const isWalking = action === 'walking';
  const isTyping = action === 'typing';
  const isCelebrating = action === 'celebrating';
  const isPaying = action === 'paying';

  const flipClass = direction === 'left' ? 'scale-x-[-1]' : 'scale-x-100';

  // Render SVG pixel art characters with sharp pixel borders
  return (
    <div
      className={`relative inline-block transition-transform duration-200 ${flipClass} ${
        isWalking ? 'animate-walk' : ''
      } ${isTyping ? 'animate-typing' : ''} ${isCelebrating ? 'animate-celebrate' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {id === 'qa' && (
        // Agent 1: Detective Bugsy (QA Specialist - Blue / Cyan trench coat & cyber visor)
        <svg width="44" height="56" viewBox="0 0 22 28" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
          {/* Hat / Visor */}
          <rect x="6" y="2" width="10" height="3" fill="#1e3a8a" />
          <rect x="4" y="5" width="14" height="2" fill="#2563eb" />
          <rect x="7" y="4" width="8" height="2" fill="#38bdf8" />
          {/* Face */}
          <rect x="7" y="7" width="8" height="5" fill="#fed7aa" />
          {/* Eyes / Cyber Goggles */}
          <rect x="9" y="8" width="5" height="2" fill="#06b6d4" />
          <rect x="10" y="8" width="1" height="1" fill="#ecfeff" />
          <rect x="13" y="8" width="1" height="1" fill="#ecfeff" />
          {/* Magnifying Glass in hand */}
          <circle cx="18" cy="12" r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
          <rect x="16" y="14" width="3" height="4" fill="#64748b" transform="rotate(45 17 15)" />
          {/* Body / Coat */}
          <rect x="6" y="12" width="10" height="9" fill="#1d4ed8" />
          <rect x="9" y="12" width="4" height="9" fill="#1e3a8a" />
          <rect x="7" y="14" width="2" height="2" fill="#fbbf24" /> {/* Gold QA Badge */}
          {/* Arms */}
          <rect x="4" y="13" width="2" height="6" fill="#1d4ed8" />
          <rect x="16" y="13" width="2" height="5" fill="#1d4ed8" />
          {/* Hands */}
          <rect x="4" y="19" width="2" height="2" fill="#fed7aa" />
          <rect x="16" y="18" width="2" height="2" fill="#fed7aa" />
          {/* Legs */}
          <rect x="7" y="21" width="3" height="5" fill="#0f172a" />
          <rect x="12" y="21" width="3" height="5" fill="#0f172a" />
          {/* Shoes */}
          <rect x="6" y="26" width="4" height="2" fill="#475569" />
          <rect x="12" y="26" width="4" height="2" fill="#475569" />
        </svg>
      )}

      {id === 'reviewer' && (
        // Agent 2: Dr. Patch (Code Reviewer - Purple hoodie, green terminal glasses, headphones)
        <svg width="44" height="56" viewBox="0 0 22 28" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
          {/* Headphones Band */}
          <rect x="6" y="2" width="10" height="2" fill="#475569" />
          <rect x="4" y="3" width="3" height="5" fill="#10b981" /> {/* Headphone earcup */}
          <rect x="15" y="3" width="3" height="5" fill="#10b981" />
          {/* Hair */}
          <rect x="7" y="4" width="8" height="3" fill="#4a044e" />
          {/* Face */}
          <rect x="7" y="7" width="8" height="5" fill="#fde047" />
          {/* Terminal Hacker Glasses */}
          <rect x="8" y="8" width="6" height="2" fill="#10b981" />
          <rect x="9" y="8" width="1" height="1" fill="#d1fae5" />
          <rect x="12" y="8" width="1" height="1" fill="#d1fae5" />
          {/* Hoodie Body */}
          <rect x="6" y="12" width="10" height="9" fill="#7c3aed" />
          <rect x="9" y="13" width="4" height="8" fill="#581c87" />
          <rect x="10" y="14" width="2" height="3" fill="#a78bfa" />
          {/* Laptop in hand when reviewing */}
          <rect x="14" y="15" width="6" height="4" fill="#334155" />
          <rect x="15" y="16" width="4" height="2" fill="#22c55e" /> {/* glowing green screen */}
          {/* Arms */}
          <rect x="4" y="13" width="2" height="6" fill="#7c3aed" />
          <rect x="16" y="13" width="2" height="5" fill="#7c3aed" />
          {/* Hands */}
          <rect x="4" y="19" width="2" height="2" fill="#fde047" />
          <rect x="16" y="18" width="2" height="2" fill="#fde047" />
          {/* Pants */}
          <rect x="7" y="21" width="3" height="5" fill="#1e1b4b" />
          <rect x="12" y="21" width="3" height="5" fill="#1e1b4b" />
          {/* Sneakers */}
          <rect x="6" y="26" width="4" height="2" fill="#10b981" />
          <rect x="12" y="26" width="4" height="2" fill="#10b981" />
        </svg>
      )}

      {id === 'cfo' && (
        // Agent 3: Ledger-9000 (CFO & Treasury Agent - Golden cyber tie, banker visor, ledger)
        <svg width="44" height="56" viewBox="0 0 22 28" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
          {/* Gold Banker Visor / Top */}
          <rect x="6" y="2" width="10" height="2" fill="#b45309" />
          <rect x="5" y="4" width="12" height="2" fill="#f59e0b" />
          <rect x="10" y="1" width="2" height="2" fill="#fbbf24" /> {/* Antenna */}
          {/* Cyber Face / Screen */}
          <rect x="7" y="6" width="8" height="6" fill="#1e293b" />
          {/* Digital Dollar Eyes */}
          <rect x="8" y="8" width="2" height="2" fill="#eab308" />
          <rect x="12" y="8" width="2" height="2" fill="#eab308" />
          <rect x="9" y="11" width="4" height="1" fill="#22c55e" /> {/* Smiling status line */}
          {/* Suit Body */}
          <rect x="6" y="12" width="10" height="9" fill="#0f172a" />
          <rect x="9" y="12" width="4" height="9" fill="#ffffff" /> {/* Crisp white shirt */}
          {/* Gold Tie */}
          <polygon points="10,13 12,13 11,20" fill="#f59e0b" />
          {/* Golden Coin in hand */}
          <circle cx="17" cy="16" r="3" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
          <rect x="16" y="15" width="2" height="2" fill="#fef08a" />
          {/* Arms */}
          <rect x="4" y="13" width="2" height="6" fill="#0f172a" />
          <rect x="16" y="13" width="2" height="5" fill="#0f172a" />
          {/* Hands */}
          <rect x="4" y="19" width="2" height="2" fill="#cbd5e1" />
          <rect x="16" y="18" width="2" height="2" fill="#cbd5e1" />
          {/* Pants */}
          <rect x="7" y="21" width="3" height="5" fill="#1e293b" />
          <rect x="12" y="21" width="3" height="5" fill="#1e293b" />
          {/* Shoes */}
          <rect x="6" y="26" width="4" height="2" fill="#000000" />
          <rect x="12" y="26" width="4" height="2" fill="#000000" />
        </svg>
      )}

      {/* Floating Action Indicator (Typing, Cash, Search) */}
      {isTyping && (
        <div className="absolute -top-3 -right-2 bg-emerald-500 text-[8px] font-pixel px-1 py-0.5 rounded text-black shadow animate-pulse">
          &lt;/&gt;
        </div>
      )}

      {isPaying && (
        <div className="absolute -top-4 -right-3 bg-amber-400 text-[8px] font-pixel px-1 py-0.5 rounded text-black shadow animate-bounce font-bold">
          +$50
        </div>
      )}

      {isCelebrating && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs animate-spin">
          ⭐
        </div>
      )}
    </div>
  );
};
