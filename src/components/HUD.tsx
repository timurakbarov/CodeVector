import React from 'react';
import { CodeState, CodeAction } from '../state/codeState';
import { Clock, Syringe, Activity, CheckSquare } from 'lucide-react';

interface HUDProps {
    state: CodeState;
    dispatch: React.Dispatch<CodeAction>;
}

const HsAndTs = [
    'Hypovolemia', 'Hypoxia', 'Hydrogen ion (acidosis)', 'Hypo-/hyperkalemia', 'Hypothermia',
    'Tension pneumothorax', 'Tamponade, cardiac', 'Toxins', 'Thrombosis, pulmonary', 'Thrombosis, coronary'
];

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export const HUD: React.FC<HUDProps> = ({ state, dispatch }) => {
    const showHsAndTs = state.cprCycleCount >= 2; // Show after 3rd complete cycle begins (or 2nd completed)

    return (
        <>
            {/* Left Panel: H's & T's */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900 border-r border-t border-b border-gray-700 rounded-r-2xl p-4 w-64 shadow-2xl transition-transform duration-500 ${showHsAndTs ? 'translate-x-0' : '-translate-x-full'} z-10`}>
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                    <CheckSquare className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-gray-200">H's & T's</h3>
                </div>
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {HsAndTs.map(item => (
                        <label key={item} className="flex items-start gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-gray-900 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Right Panel: Drugs */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
                <button
                    className={`relative p-6 px-8 rounded-2xl border-2 font-bold text-lg flex flex-col items-center justify-center shadow-lg transition-all ${state.epiCooldownSecondsRemaining === 0 && !state.codeEnded
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 hover:bg-blue-900 hover:text-white'
                        : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                        }`}
                    onClick={() => dispatch({ type: 'GIVE_EPI' })}
                    disabled={state.epiCooldownSecondsRemaining > 0 || state.codeEnded}
                >
                    <Syringe className="w-8 h-8 mb-2" />
                    Epinephrine
                    <span className="text-sm font-normal mt-1 opacity-80">1 mg IV/IO</span>

                    {state.epiCooldownSecondsRemaining > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 rounded-2xl border-2 border-gray-700 text-gray-400">
                            <span className="text-xs uppercase tracking-widest mb-1">Cooldown</span>
                            <span className="text-2xl font-mono">{formatTime(state.epiCooldownSecondsRemaining)}</span>
                        </div>
                    )}
                </button>

                <button
                    className={`p-6 px-8 rounded-2xl border-2 font-bold text-lg flex flex-col items-center justify-center shadow-lg transition-all ${state.amioDoses < 2 && !state.codeEnded
                        ? 'border-purple-500 bg-purple-950/40 text-purple-300 hover:bg-purple-900 hover:text-white'
                        : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                        }`}
                    onClick={() => dispatch({ type: 'GIVE_AMIO' })}
                    disabled={state.amioDoses >= 2 || state.codeEnded}
                >
                    <Syringe className="w-8 h-8 mb-2" />
                    Amiodarone
                    <span className="text-sm font-normal mt-1 opacity-80">
                        {state.amioDoses === 0 ? '300 mg bolus' : state.amioDoses === 1 ? '150 mg bolus' : 'Max doses reached'}
                    </span>
                </button>
            </div>

            {/* Bottom: Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-gray-900 border border-gray-700 p-3 px-6 rounded-full shadow-2xl z-10 w-max overflow-x-auto max-w-full">
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_METRONOME' })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold border-2 transition-all ${state.metronomeEnabled
                        ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.5)]'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        }`}
                    style={state.metronomeEnabled ? { color: 'var(--color-neon-green)', borderColor: 'var(--color-neon-green)' } : undefined}
                    disabled={state.codeEnded}
                >
                    <Activity className="w-5 h-5" />
                    Metronome {state.metronomeEnabled ? 'ON' : 'OFF'}
                </button>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                <button
                    onClick={() => dispatch({ type: 'ACHIEVE_ROSC' })}
                    className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold border-2 border-green-500 bg-green-950/40 text-green-400 hover:bg-green-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={state.codeEnded}
                >
                    ROSC Achieved
                </button>

                <button
                    onClick={() => dispatch({ type: 'TERMINATE_CODE' })}
                    className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold border-2 border-red-500 bg-red-950/40 text-red-500 hover:bg-red-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={state.codeEnded}
                >
                    End Code
                </button>
            </div>
        </>
    );
};
