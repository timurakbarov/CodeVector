import React, { useState } from 'react';
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
    const [showDebrief, setShowDebrief] = useState(true);

    // Determine if code ended due to ROSC
    const achievedRosc = events.length > 0 && events[events.length - 1].label.includes('ROSC');

    if (showDebrief) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/95 backdrop-blur-md p-4">
                <div className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
                    <h2 className="text-2xl font-bold tracking-widest text-center border-b border-gray-800 pb-4 text-white">Team Debriefing Checklist</h2>
                    <ul className="space-y-4 text-xl text-gray-300 font-medium px-2">
                        <li className="flex gap-3"><span className="text-gray-500">•</span>What went wrong?</li>
                        <li className="flex gap-3"><span className="text-gray-500">•</span>What went well?</li>
                        <li className="flex gap-3"><span className="text-gray-500">•</span>Key lessons learned</li>
                    </ul>
                    <div className="pt-6 mt-2 border-t border-gray-800 flex justify-center">
                        <button 
                            onClick={() => setShowDebrief(false)}
                            className="px-10 py-3 bg-gray-800 border-2 border-gray-600 hover:bg-white hover:text-black hover:border-white rounded-full text-lg font-bold transition-all uppercase tracking-widest shadow-lg"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white p-4 md:p-8 overflow-y-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-widest border-b border-gray-800 pb-4">
                CodeVector Medical Log
            </h1>

            {achievedRosc && (
                <div className="mb-4 p-4 bg-green-950/30 border-2 border-green-500/50 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-green-400 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        AHA Post-Cardiac Arrest Care
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        <label className="flex items-center gap-3 p-2 rounded border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-5 h-5 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-base text-green-100">Optimize Ventilation/Oxygenation</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-5 h-5 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-base text-green-100">Treat Hypotension (MAP &ge; 65 mm Hg)</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-5 h-5 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-base text-green-100">Obtain 12-Lead ECG</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded border border-green-900/50 bg-black/40 cursor-pointer hover:bg-black/60">
                            <input type="checkbox" className="w-5 h-5 rounded bg-black border-green-600 text-green-500 focus:ring-green-500" />
                            <span className="text-base text-green-100">Targeted Temperature Management</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto mb-8 pr-4 custom-scrollbar">
                <ul className="space-y-4">
                    {events.map((evt) => (
                        <li key={evt.id} className="text-lg md:text-xl font-medium leading-normal flex gap-4">
                            <span className="font-mono text-gray-400 shrink-0">
                                [{formatTime(evt.timestamp)}]
                            </span>
                            <div>
                                <span className="block text-gray-100">{evt.label}</span>
                                {evt.details && (
                                    <span className="block text-base text-gray-500 mt-1">{evt.details}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pt-4 border-t border-gray-800 flex justify-end">
                <button
                    onClick={onReset}
                    className="px-6 py-3 bg-gray-900 border border-gray-700 hover:bg-white hover:text-black rounded text-lg font-bold transition-all uppercase tracking-widest"
                >
                    Close Session
                </button>
            </div>
        </div>
    );
};
