import React from 'react';
import { LogEvent } from '../state/codeState';

interface SummaryViewProps {
    events: LogEvent[];
    codeStartTime: Date | null;
    onReset: () => void;
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const SummaryView: React.FC<SummaryViewProps> = ({ events, onReset }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white p-8 overflow-y-auto">
            <h1 className="text-4xl font-bold mb-8 uppercase tracking-widest border-b border-gray-800 pb-4">CodeVector Dictation Log</h1>
            <div className="flex-1 overflow-y-auto mb-8">
                <ul className="space-y-6">
                    {events.map((evt) => (
                        <li key={evt.id} className="text-2xl md:text-3xl font-medium leading-normal flex gap-6">
                            <span className="font-mono text-gray-400 shrink-0">
                                [{formatTime(evt.timestamp)}]
                            </span>
                            <div>
                                <span className="block">{evt.label}</span>
                                {evt.details && (
                                    <span className="block text-xl text-gray-400 mt-2">{evt.details}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pt-6 border-t border-gray-800 flex justify-end">
                <button
                    onClick={onReset}
                    className="px-8 py-4 bg-gray-900 border border-gray-700 hover:bg-white hover:text-black rounded text-xl font-bold transition-all uppercase tracking-widest"
                >
                    Close Session
                </button>
            </div>
        </div>
    );
};
