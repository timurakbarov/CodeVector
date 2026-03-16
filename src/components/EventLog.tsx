import React, { useRef, useEffect, useState } from 'react';
import { LogEvent, CodeAction } from '../state/codeState';
import { List, Send } from 'lucide-react';

interface EventLogProps {
    events: LogEvent[];
    codeStartTime: Date | null;
    dispatch: React.Dispatch<CodeAction>;
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
};

export const EventLog: React.FC<EventLogProps> = ({ events, dispatch }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');

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

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-black/20 pb-20">
                {events.map((evt) => (
                    <div key={evt.id} className="text-sm pb-3 font-mono border-b border-gray-800/50 last:border-0 leading-relaxed">
                        <div className="flex items-center gap-2 text-gray-100 font-semibold text-base">
                            <span className="text-neon-green opacity-90 font-bold tracking-widest" style={{ color: 'var(--color-neon-green)' }}>
                                [{formatTime(evt.timestamp)}]
                            </span>
                            <span>-</span>
                            <span>{evt.label}</span>
                        </div>
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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!inputValue.trim()) return;
                    dispatch({ type: 'ADD_LOG', payload: { label: 'Log Entry', details: inputValue.trim() } });
                    setInputValue('');
                }}
                className="absolute bottom-[10vh] border-t border-gray-800 bg-gray-950 p-3 flex gap-2"
                style={{ width: 'inherit' }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Log additional actions (e.g. 04:19 IO access)..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500"
                />
                <button type="submit" disabled={!inputValue.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white p-2 rounded-lg transition-colors">
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};
