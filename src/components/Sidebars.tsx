import React, { useState } from 'react';
import { CodeState, CodeAction } from '../state/codeState';
import { Syringe, CheckSquare, AlertCircle, ChevronUp, ChevronDown, Map as MapIcon, LayoutList, FileText } from 'lucide-react';

interface SidebarProps {
    state: CodeState;
    dispatch: React.Dispatch<CodeAction>;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// Reversible causes are now handled by HsTsModal directly


export const DrugsSidebar: React.FC<SidebarProps> = ({ state, dispatch }) => {
    return (
        <div className="w-full flex flex-col gap-2 p-2 px-3 border-b border-gray-800 bg-gray-950 shrink-0 shadow-md z-20">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">Medications & View Options</span>
            </div>

            <div className="grid grid-cols-4 md:flex md:flex-col gap-2 w-full">
                {/* Epinephrine */}
                <button
                    className={`relative min-h-[50px] md:min-h-[64px] p-2 md:p-4 rounded-lg md:rounded-xl border flex flex-col md:flex-row justify-center md:justify-start items-center gap-1 md:gap-3 transition-all ${state.epiCooldownSecondsRemaining === 0 && !state.codeEnded
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 hover:bg-blue-900 hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                        : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                        }`}
                    onClick={() => dispatch({ type: 'GIVE_EPI' })}
                    disabled={state.epiCooldownSecondsRemaining > 0 || state.codeEnded}
                >
                    <Syringe className="w-4 h-4 md:w-6 md:h-6 shrink-0" />
                    <div className="flex flex-col items-center md:items-start leading-tight">
                        <span className="font-bold text-[11px] md:text-lg flex items-center gap-1">Epi 1mg {state.epiDoses > 0 && <span className="bg-blue-600 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full ml-1">Dose {state.epiDoses}</span>}</span>
                        <span className="text-[10px] md:text-xs font-normal opacity-80 hidden md:block">1 mg IV/IO</span>
                    </div>

                    {state.epiCooldownSecondsRemaining > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 rounded-lg md:rounded-xl border border-gray-700 text-gray-400 overflow-hidden z-10">
                            <span className="text-xl md:text-2xl font-mono font-bold text-blue-400">{formatTime(state.epiCooldownSecondsRemaining)}</span>
                            {state.epiDoses > 0 && <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full shadow-md">Dose {state.epiDoses}</span>}
                            <div className="absolute bottom-0 left-0 h-1 bg-blue-900 w-full opacity-30">
                                <div className="h-full bg-blue-500" style={{ width: `${(state.epiCooldownSecondsRemaining / 240) * 100}%` }} />
                            </div>
                        </div>
                    )}
                </button>

                {/* Amiodarone */}
                <button
                    className={`min-h-[50px] md:min-h-[64px] p-2 md:p-4 rounded-lg md:rounded-xl border flex flex-col md:flex-row justify-center md:justify-start items-center gap-1 md:gap-3 transition-all ${state.amioDoses < 2 && !state.codeEnded
                        ? 'border-purple-500 bg-purple-950/40 text-purple-300 hover:bg-purple-900 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'border-gray-800 bg-gray-950 text-gray-700 cursor-not-allowed opacity-50'
                        }`}
                    onClick={() => dispatch({ type: 'GIVE_AMIO' })}
                    disabled={state.amioDoses >= 2 || state.codeEnded}
                >
                    <Syringe className="w-4 h-4 md:w-6 md:h-6 shrink-0" />
                    <div className="flex flex-col items-center md:items-start leading-tight">
                        <span className="font-bold text-[11px] md:text-lg flex items-center gap-1">Amio {state.amioDoses > 0 && <span className="bg-purple-800 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full ml-1">Dose {state.amioDoses}</span>}</span>
                        <span className="text-[10px] md:text-xs font-normal opacity-80 hidden md:block">
                            {state.amioDoses === 0 ? '300 mg bolus' : state.amioDoses === 1 ? '150 mg bolus' : 'Max doses reached'}
                        </span>
                    </div>
                </button>

                {/* H's & T's Button */}
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_HS_TS_MODAL' })}
                    className="min-h-[50px] md:min-h-[64px] p-2 md:p-4 rounded-lg md:rounded-xl border flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 transition-all bg-gray-800 border-gray-700 text-indigo-400 hover:bg-gray-700 hover:text-indigo-300"
                >
                    <FileText className="w-4 h-4 md:w-6 md:h-6 shrink-0" />
                    <div className="flex flex-col items-center md:items-start leading-tight">
                        <span className="font-bold text-[11px] md:text-lg">H's & T's</span>
                        <span className="text-[10px] md:text-xs font-normal opacity-70 hidden md:block">Reversible Causes</span>
                    </div>
                </button>

                {/* View Toggle Button for Mobile Only */}
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: { mode: state.viewMode === 'map' ? 'wizard' : 'map' } })}
                    className="md:hidden min-h-[50px] p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                    {state.viewMode === 'map' ? <LayoutList className="w-4 h-4 text-neon-green" style={{ color: 'var(--color-neon-green)' }} /> : <MapIcon className="w-4 h-4 text-blue-400" />}
                    <div className="flex flex-col items-center leading-tight">
                        <span className="font-bold text-[11px] uppercase">{state.viewMode === 'map' ? 'Wizard' : 'Map'}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
