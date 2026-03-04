import React, { useRef, useEffect } from 'react';
import { LogEvent } from '../state/codeState';
import { List } from 'lucide-react';

interface EventLogProps {
    events: LogEvent[];
    codeStartTime: Date | null;
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);

    return (
        <div className="w-full h-full bg-gray-900 flex flex-col shadow-inner border-l border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950 shrink-0">
                <div className="flex items-center gap-2 text-gray-300 font-bold uppercase tracking-widest text-sm">
                    <List className="w-5 h-5 text-neon-green" style={{ color: 'var(--color-neon-green)' }} />
                    Medical Log
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-black/20">
                {events.map((evt) => (
                    <div key={evt.id} className="text-sm pb-3 font-mono border-b border-gray-800/50 last:border-0 leading-relaxed">
                        <span className="text-neon-green opacity-90 font-bold block mb-1" style={{ color: 'var(--color-neon-green)' }}>
                            [{formatTime(evt.timestamp)}]
                        </span>
                        <div className="text-gray-100 font-semibold text-base">{evt.label}</div>
                        {evt.details && (
                            <div className="text-gray-400 text-sm mt-1">{evt.details}</div>
                        )}
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="text-gray-600 text-sm text-center mt-12 font-mono uppercase tracking-widest">
                        Awaiting events...
                    </div>
                )}
            </div>
        </div>
    );
};
