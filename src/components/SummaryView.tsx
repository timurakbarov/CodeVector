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
    // Determine if code ended due to ROSC
    const achievedRosc = events.length > 0 && events[events.length - 1].label.includes('ROSC');

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white p-4 md:p-8 overflow-y-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-widest border-b border-gray-800 pb-4">
                CodeVector Medical Log
            </h1>

            {achievedRosc && (
                <div className="mb-8 p-6 bg-green-950/30 border-2 border-green-500/50 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-green-400 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                        AHA Post-Cardiac Arrest Care
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <label className="flex items-center gap-4 p-3 rounded-lg border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-6 h-6 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-lg text-green-100">Optimize Ventilation/Oxygenation</span>
                        </label>
                        <label className="flex items-center gap-4 p-3 rounded-lg border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-6 h-6 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-lg text-green-100">Treat Hypotension (MAP &ge; 65 mm Hg)</span>
                        </label>
                        <label className="flex items-center gap-4 p-3 rounded-lg border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-6 h-6 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-lg text-green-100">Obtain 12-Lead ECG</span>
                        </label>
                        <label className="flex items-center gap-4 p-3 rounded-lg border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-6 h-6 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-lg text-green-100">Targeted Temperature Management</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto mb-8 pr-4 custom-scrollbar">
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
