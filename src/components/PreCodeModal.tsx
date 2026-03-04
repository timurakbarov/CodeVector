import React, { useState } from 'react';
import { Activity, Zap, Stethoscope } from 'lucide-react';
import { AppMode, RhythmType } from '../state/codeState';

interface PreCodeModalProps {
    onStart: (mode: AppMode, startNodeId: string, rhythm: RhythmType) => void;
}

export const PreCodeModal: React.FC<PreCodeModalProps> = ({ onStart }) => {
    const [fullCode, setFullCode] = useState(false);
    const [defibReady, setDefibReady] = useState(false);
    const [airwayReady, setAirwayReady] = useState(false);

    const allChecked = fullCode && defibReady && airwayReady;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 text-gray-100 flex flex-col gap-6 md:gap-8 max-h-[95vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
                    <Activity className="w-10 h-10 text-neon-green" style={{ color: 'var(--color-neon-green)' }} />
                    <h1 className="text-3xl font-bold tracking-tight">ACLS Code Protocol</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-300">Pre-Code Safety Checklist</h2>

                    <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input
                            type="checkbox"
                            className="w-6 h-6 rounded bg-gray-900 border-gray-600 text-neon-green focus:ring-neon-green"
                            checked={fullCode}
                            onChange={(e) => setFullCode(e.target.checked)}
                        />
                        <span className="text-lg">Confirm FULL CODE status (No DNR/DNI)</span>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input
                            type="checkbox"
                            className="w-6 h-6 rounded bg-gray-900 border-gray-600 text-neon-green focus:ring-neon-green"
                            checked={defibReady}
                            onChange={(e) => setDefibReady(e.target.checked)}
                        />
                        <span className="text-lg">Defibrillator present and functional</span>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input
                            type="checkbox"
                            className="w-6 h-6 rounded bg-gray-900 border-gray-600 text-neon-green focus:ring-neon-green"
                            checked={airwayReady}
                            onChange={(e) => setAirwayReady(e.target.checked)}
                        />
                        <span className="text-lg">Laryngoscope and suction ready</span>
                    </label>
                </div>

                {allChecked && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold text-gray-300 pt-4 border-t border-gray-800">Select Starting Point</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                            <button
                                onClick={() => onStart('live', 'BOX_1_START_CPR', 'unknown')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all text-center"
                            >
                                <Stethoscope className="w-8 h-8 text-blue-400" />
                                <span className="font-semibold">Start from beginning</span>
                                <span className="text-sm text-gray-400">Assess & attach monitor</span>
                            </button>

                            <button
                                onClick={() => onStart('live', 'BOX_2_VF_PVT', 'shockable')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-700 hover:border-red-500 hover:bg-gray-800 transition-all text-center"
                            >
                                <Zap className="w-8 h-8 text-red-400" />
                                <span className="font-semibold text-red-100">Shockable Branch</span>
                                <span className="text-sm text-gray-400">VF / pVT</span>
                            </button>

                            <button
                                onClick={() => onStart('live', 'BOX_9_ASYSTOLE_PEA', 'nonShockable')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-700 hover:border-gray-400 hover:bg-gray-800 transition-all text-center"
                            >
                                <Activity className="w-8 h-8 text-gray-400" />
                                <span className="font-semibold">Non-shockable Branch</span>
                                <span className="text-sm text-gray-400">Asystole / PEA</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
