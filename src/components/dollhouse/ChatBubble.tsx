import React from 'react';
import { AgentId } from '../../types/agent';

interface ChatBubbleProps {
  agentId: AgentId;
  agentName: string;
  role: string;
  message: string;
  badgeColor: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  agentId,
  agentName,
  role,
  message,
  badgeColor,
}) => {
  if (!message) return null;

  return (
    <div
      className="absolute bottom-[68px] left-1/2 -translate-x-1/2 z-30 pointer-events-none w-56 sm:w-64 transition-all duration-300 transform scale-100 opacity-100"
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))' }}
    >
      {/* Speech Box Container */}
      <div className="bg-slate-900 border-2 border-slate-300 rounded-lg p-2.5 shadow-2xl relative">
        {/* Header Tag with Role & Name */}
        <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-700/80">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: badgeColor }}
            />
            <span className="font-pixel text-[9px] text-amber-300 uppercase tracking-wide">
              {agentName}
            </span>
          </div>
          <span className="font-code text-[9px] text-slate-400 bg-slate-800 px-1 py-0.5 rounded">
            {role}
          </span>
        </div>

        {/* Message Content */}
        <p className="font-code text-[11px] sm:text-xs text-slate-100 leading-snug break-words">
          {message}
        </p>

        {/* Downward Speech Caret Pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-300" />
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-900" />
      </div>
    </div>
  );
};
