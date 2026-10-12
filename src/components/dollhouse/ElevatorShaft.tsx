import React from 'react';
import { AgentFloor, ElevatorState } from '../../types/agent';

interface ElevatorShaftProps {
  elevator: ElevatorState;
}

export const ElevatorShaft: React.FC<ElevatorShaftProps> = ({ elevator }) => {
  // Map floor number to vertical CSS top percentage
  // Floor 3 (top floor): ~3%
  // Floor 2 (middle floor): ~36%
  // Floor 1 (bottom floor): ~69%
  const getFloorTopPercent = (floor: AgentFloor) => {
    switch (floor) {
      case 3:
        return '4%';
      case 2:
        return '37%';
      case 1:
        return '70%';
    }
  };

  const currentTop = getFloorTopPercent(elevator.currentFloor);
  const isMoving = elevator.doorState === 'moving' || elevator.direction !== 'idle';
  const isOpen = elevator.doorState === 'open';

  return (
    <div className="relative w-24 sm:w-28 h-full bg-slate-950/90 border-r-4 border-slate-900 flex flex-col justify-between items-center py-2 select-none">
      {/* Top Pulley Gear & Motor Assembly */}
      <div className="absolute top-0 inset-x-0 h-8 bg-slate-900 border-b-2 border-slate-800 flex items-center justify-center gap-2 z-20">
        {/* Animated Pulley Wheel */}
        <div
          className={`w-5 h-5 rounded-full border-2 border-amber-500 bg-slate-800 flex items-center justify-center ${
            isMoving ? 'animate-spin' : ''
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 border-amber-500 bg-slate-800 flex items-center justify-center ${
            isMoving ? 'animate-spin' : ''
          }`}
          style={{ animationDirection: 'reverse' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* Hanging Steel Elevator Cables */}
      <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-4 flex justify-between pointer-events-none opacity-40">
        <div className="w-0.5 h-full bg-repeat-y bg-[linear-gradient(to_bottom,#64748b_2px,transparent_2px)] bg-[length:100%_4px]" />
        <div className="w-0.5 h-full bg-repeat-y bg-[linear-gradient(to_bottom,#64748b_2px,transparent_2px)] bg-[length:100%_4px]" />
      </div>

      {/* Floor Number Indicator Marks on Shaft Wall */}
      <div className="absolute inset-y-0 right-1 flex flex-col justify-around py-8 text-[9px] font-pixel text-slate-600 pointer-events-none">
        <span className={elevator.currentFloor === 3 ? 'text-cyan-400 font-bold' : ''}>F3</span>
        <span className={elevator.currentFloor === 2 ? 'text-purple-400 font-bold' : ''}>F2</span>
        <span className={elevator.currentFloor === 1 ? 'text-amber-400 font-bold' : ''}>F1</span>
      </div>

      {/* Moving Elevator Carriage Car */}
      <div
        className="absolute left-2 right-2 h-[26%] bg-slate-900 border-2 border-amber-500/80 rounded shadow-xl flex flex-col transition-all duration-1000 ease-in-out z-10"
        style={{ top: currentTop }}
      >
        {/* Carriage Header & Digital Floor Display */}
        <div className="h-6 bg-slate-950 border-b border-amber-500/50 flex items-center justify-between px-1.5">
          {/* Floor indicators */}
          <div className="flex items-center gap-1 font-pixel text-[8px]">
            <span
              className={`px-0.5 py-0.2 rounded ${
                elevator.currentFloor === 3 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-600'
              }`}
            >
              3
            </span>
            <span
              className={`px-0.5 py-0.2 rounded ${
                elevator.currentFloor === 2 ? 'bg-purple-500 text-white font-bold' : 'text-slate-600'
              }`}
            >
              2
            </span>
            <span
              className={`px-0.5 py-0.2 rounded ${
                elevator.currentFloor === 1 ? 'bg-amber-500 text-black font-bold' : 'text-slate-600'
              }`}
            >
              1
            </span>
          </div>

          {/* Direction Arrow */}
          <div className="text-[10px]">
            {elevator.direction === 'up' && <span className="text-emerald-400 animate-pulse">▲</span>}
            {elevator.direction === 'down' && <span className="text-amber-400 animate-pulse">▼</span>}
            {elevator.direction === 'idle' && <span className="text-slate-500">●</span>}
          </div>
        </div>

        {/* Carriage Interior & Sliding Door */}
        <div className="relative flex-1 bg-slate-800 overflow-hidden flex items-center justify-center">
          {/* Interior warm lamp */}
          <div className="absolute top-1 w-6 h-1 bg-amber-200/60 rounded-full blur-[1px]" />

          {/* Passenger in elevator */}
          {elevator.passengerId && (
            <div className="text-[10px] font-pixel text-amber-300 animate-pulse flex flex-col items-center">
              <span>👤</span>
              <span className="text-[7px] uppercase mt-0.5">{elevator.passengerId}</span>
            </div>
          )}

          {/* Sliding Mechanical Doors */}
          {/* Left Door */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-slate-900 border-r border-amber-500/40 transition-all duration-500 flex flex-col justify-around py-1"
            style={{ width: isOpen ? '10%' : '50%' }}
          >
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-800" />
          </div>

          {/* Right Door */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-slate-900 border-l border-amber-500/40 transition-all duration-500 flex flex-col justify-around py-1"
            style={{ width: isOpen ? '10%' : '50%' }}
          >
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-800" />
          </div>
        </div>

        {/* Hazard Safety Stripes on bottom of carriage */}
        <div className="h-2 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_4px,#000_4px,#000_8px)]" />
      </div>
    </div>
  );
};
