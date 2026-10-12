import React from 'react';
import { AgentFloor, AgentState, ElevatorState } from '../../types/agent';
import { ChatBubble } from './ChatBubble';
import { ElevatorShaft } from './ElevatorShaft';
import { FloorFinance } from './FloorFinance';
import { FloorQA } from './FloorQA';
import { FloorReview } from './FloorReview';
import { PixelAvatar } from './PixelAvatar';

interface DollhouseBuildingProps {
  agents: AgentState[];
  elevator: ElevatorState;
  treasuryBalance?: number;
  activeFloorHighlight?: AgentFloor | null;
}

export const DollhouseBuilding: React.FC<DollhouseBuildingProps> = ({
  agents,
  elevator,
  treasuryBalance = 12500,
  activeFloorHighlight = null,
}) => {
  // Convert floor number to vertical top CSS position for agent container
  // Floor 3 (top): 4% to 32%
  // Floor 2 (mid): 37% to 65%
  // Floor 1 (bot): 70% to 98%
  const getAgentFloorTop = (floor: AgentFloor) => {
    switch (floor) {
      case 3:
        return '17%';
      case 2:
        return '50%';
      case 1:
        return '83%';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden border-4 border-slate-900 bg-slate-950 shadow-2xl">
      {/* 1. Rooftop Sign & Antennas */}
      <div className="relative h-14 bg-slate-900 border-b-4 border-slate-950 flex items-center justify-between px-4 select-none">
        {/* Antennas & Satellite on Left */}
        <div className="flex items-end gap-3 h-full pb-1">
          <div className="flex flex-col items-center">
            <span className="text-sm animate-pulse">📡</span>
            <div className="w-1 h-3 bg-slate-700" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-cyan-400" />
            <div className="w-2 h-0.5 bg-cyan-400" />
          </div>
        </div>

        {/* Center Glowing Neon Sign */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs font-pixel animate-pulse">⚡</span>
            <h1 className="font-pixel text-xs sm:text-sm text-amber-300 tracking-wider text-center drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]">
              BUGBOUNTY.AI // AUTONOMOUS HQ
            </h1>
            <span className="text-amber-400 text-xs font-pixel animate-pulse">⚡</span>
          </div>
          <span className="font-code text-[9px] text-slate-400 tracking-widest uppercase">
            3-Tier Multi-Agent Software Factory
          </span>
        </div>

        {/* Sponsor Tech Badges on Right */}
        <div className="hidden sm:flex items-center gap-1.5 text-[8px] font-pixel">
          <span className="bg-blue-950/80 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
            GEMINI
          </span>
          <span className="bg-purple-950/80 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">
            ENTIRE
          </span>
          <span className="bg-amber-950/80 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
            CFO.AI
          </span>
          <span className="bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
            NEATLOGS
          </span>
        </div>
      </div>

      {/* 2. Main Dollhouse Body (Elevator Shaft on Left + 3 Floors on Right) */}
      <div className="relative h-[480px] sm:h-[560px] flex">
        {/* Elevator Shaft (Left Column) */}
        <ElevatorShaft elevator={elevator} />

        {/* Department Floors (Right Grid) */}
        <div className="relative flex-1 flex flex-col h-full bg-slate-900">
          {/* Floor 3: QA Dept */}
          <div
            className={`h-1/3 transition-all duration-300 ${
              activeFloorHighlight === 3 ? 'ring-2 ring-cyan-400/50 bg-cyan-950/20' : ''
            }`}
          >
            <FloorQA />
          </div>

          {/* Floor 2: Review Dept */}
          <div
            className={`h-1/3 transition-all duration-300 ${
              activeFloorHighlight === 2 ? 'ring-2 ring-purple-400/50 bg-purple-950/20' : ''
            }`}
          >
            <FloorReview />
          </div>

          {/* Floor 1: Finance Dept */}
          <div
            className={`h-1/3 transition-all duration-300 ${
              activeFloorHighlight === 1 ? 'ring-2 ring-amber-400/50 bg-amber-950/20' : ''
            }`}
          >
            <FloorFinance treasuryBalance={treasuryBalance} />
          </div>

          {/* 3. Physical Agents Overlay Layer */}
          {/* Each agent moves physically across floors and horizontally */}
          {agents.map((agent) => {
            const isPassenger = elevator.passengerId === agent.id;
            const floorTop = getAgentFloorTop(agent.floor);

            // If riding elevator, position agent inside the elevator carriage on the left
            const computedLeft = isPassenger
              ? '-60px' // inside elevator shaft
              : `${agent.xPercent}%`;

            return (
              <div
                key={agent.id}
                className="absolute z-20 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                  top: floorTop,
                  left: computedLeft,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Chat Bubble above agent */}
                <ChatBubble
                  agentId={agent.id}
                  agentName={agent.name}
                  role={agent.role}
                  message={agent.message}
                  badgeColor={agent.badgeColor}
                />

                {/* Pixel Character Avatar */}
                <div className="pointer-events-auto cursor-pointer group">
                  <PixelAvatar
                    id={agent.id}
                    action={agent.action}
                    direction={agent.direction}
                    isRidingElevator={isPassenger}
                  />

                  {/* Character Name Tag Below Avatar */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-slate-300 font-pixel text-[7px] px-1 py-0.5 rounded border border-slate-700/60 pointer-events-none">
                    {agent.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Building Foundation & Pavement */}
      <div className="h-6 bg-slate-950 border-t-2 border-slate-800 flex items-center justify-between px-3 text-[9px] font-code text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AGENTS ONLINE: QA (Bugsy), REVIEW (Dr. Patch), FINANCE (Ledger-9000)</span>
        </div>
        <div className="hidden sm:block">
          STATUS: AUTONOMOUS DISPATCH SYSTEM READY
        </div>
      </div>
    </div>
  );
};
