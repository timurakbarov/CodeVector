import React, { useState } from 'react';
import { CodeState, CodeAction } from '../state/codeState';
import { Syringe, CheckSquare, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface SidebarProps {
    state: CodeState;
    dispatch: React.Dispatch<CodeAction>;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const HS_AND_TS_GUIDELINES = [
    { name: "Hypovolemia", hint: "Crystalloid 30 mL/kg bolus; add PRBCs, activate massive transfusion." },
    { name: "Hypoxia", hint: "100% FiO2; secure airway; target SpO2 94–98% rapidly." },
    { name: "Hydrogen Ion (Acidosis)", hint: "Optimize ventilation; consider sodium bicarbonate 1 mEq/kg IV bolus." },
    { name: "Hypokalemia", hint: "Give potassium chloride 10–20 mEq IV over 10–20 minutes." },
    { name: "Hyperkalemia", hint: "Calcium 1 g IV, insulin 10 U IV + 25 g dextrose." },
    { name: "Hypothermia", hint: "Warm IV fluids 30–40 mL/kg; use active external rewarming." },
    { name: "Tension Pneumothorax", hint: "Immediate needle decompression; then chest tube 28–32 Fr if feasible." },
    { name: "Tamponade (Cardiac)", hint: "Urgent pericardiocentesis; give small fluid bolus 250–500 mL IV." },
    { name: "Toxins", hint: "Administer specific antidote; give activated charcoal 1 g/kg if appropriate." },
    { name: "Thrombosis (Pulmonary)", hint: "Consider thrombolytic: alteplase 50 mg IV bolus during arrest." },
    { name: "Thrombosis (Coronary)", hint: "Activate cath lab for PCI; give aspirin and heparin per protocol." }
];

export const HsAndTsSidebar: React.FC<SidebarProps> = ({ state }) => {
    const showSidebar = state.cprCycleCount >= 2;
    const [selectedCause, setSelectedCause] = useState<string | null>(null);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    // Auto-expand on mobile when it first appears
    React.useEffect(() => {
        if (showSidebar) setIsMobileExpanded(true);
    }, [showSidebar]);

    if (!showSidebar) return null;

    return (
        <div className={`
            fixed md:relative z-40 md:z-auto
            bottom-[10vh] md:bottom-auto left-0 right-0 md:left-auto md:right-auto
            w-full md:w-[320px] 
            ${isMobileExpanded ? 'h-[60vh] md:h-full' : 'h-[60px] md:h-full'}
            bg-gray-900 border-t md:border-t-0 md:border-r border-gray-700 
            flex flex-col shrink-0 transition-all duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] md:shadow-none
        `}>
            {/* Header / Mobile Toggle */}
            <div
                className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950 shrink-0 cursor-pointer md:cursor-default"
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            >
                <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <h3 className="font-bold text-gray-200 uppercase tracking-widest text-sm">H's & T's Checklist</h3>
                </div>

                {/* Mobile chevron */}
                <div className="md:hidden text-gray-400">
                    {isMobileExpanded ? <ChevronDown /> : <ChevronUp />}
                </div>
            </div>

            <div className={`flex-1 overflow-y-auto custom-scrollbar p-2 flex-col gap-1 ${isMobileExpanded ? 'flex' : 'hidden md:flex'}`}>
                {HS_AND_TS_GUIDELINES.map(item => {
                    const isSelected = selectedCause === item.name;
                    return (
                        <div key={item.name} className={`flex flex-col border rounded transition-colors ${isSelected ? 'border-yellow-500/50 bg-yellow-950/20' : 'border-transparent hover:bg-gray-800'}`}>
                            <label className="flex items-center min-h-[64px] gap-3 p-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="hs-and-ts"
                                    checked={isSelected}
                                    onChange={() => setSelectedCause(item.name)}
                                    className="w-5 h-5 rounded-full bg-gray-900 border-gray-600 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                />
                                <span className={`text-base md:text-sm font-semibold transition-colors ${isSelected ? 'text-yellow-400' : 'text-gray-300 group-hover:text-gray-100'}`}>
                                    {item.name}
                                </span>
                            </label>
                            {isSelected && (
                                <div className="px-3 pb-3 pt-1 pl-10 text-xs md:text-sm text-gray-400 leading-relaxed border-t border-yellow-900/30 mt-1 flex flex-col gap-2">
                                    <div className="flex items-start gap-2 text-yellow-200">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{item.hint}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const DrugsSidebar: React.FC<SidebarProps> = ({ state, dispatch }) => {
    return (
        <div className="w-full flex flex-col gap-3 p-4 border-b border-gray-800 bg-gray-950 shrink-0">
            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Medications</div>
            <button
                className={`relative min-h-[80px] md:min-h-[64px] p-4 rounded-xl border flex items-center gap-4 transition-all ${state.epiCooldownSecondsRemaining === 0 && !state.codeEnded
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300 hover:bg-blue-900 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                onClick={() => dispatch({ type: 'GIVE_EPI' })}
                disabled={state.epiCooldownSecondsRemaining > 0 || state.codeEnded}
            >
                <div className="bg-black/20 p-2 rounded-lg shrink-0">
                    <Syringe className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start flex-1">
                    <span className="font-bold text-lg leading-none">Epinephrine</span>
                    <span className="text-xs font-normal mt-1 opacity-80">1 mg IV/IO</span>
                </div>

                {state.epiCooldownSecondsRemaining > 0 && (
                    <div className="absolute inset-0 flex items-center justify-between px-6 bg-gray-900/95 rounded-xl border border-gray-700 text-gray-400 overflow-hidden">
                        <span className="text-xs uppercase tracking-widest font-bold">Cooldown</span>
                        <span className="text-2xl font-mono font-bold text-blue-400">{formatTime(state.epiCooldownSecondsRemaining)}</span>

                        {/* Progress Bar background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-900 w-full opacity-30">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(state.epiCooldownSecondsRemaining / 240) * 100}%` }} />
                        </div>
                    </div>
                )}
            </button>

            <button
                className={`min-h-[80px] md:min-h-[64px] p-4 rounded-xl border flex items-center gap-4 transition-all ${state.amioDoses < 2 && !state.codeEnded
                    ? 'border-purple-500 bg-purple-950/40 text-purple-300 hover:bg-purple-900 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                onClick={() => dispatch({ type: 'GIVE_AMIO' })}
                disabled={state.amioDoses >= 2 || state.codeEnded}
            >
                <div className="bg-black/20 p-2 rounded-lg shrink-0">
                    <Syringe className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start flex-1">
                    <span className="font-bold text-lg leading-none">Amiodarone</span>
                    <span className="text-xs font-normal mt-1 opacity-80">
                        {state.amioDoses === 0 ? '300 mg bolus' : state.amioDoses === 1 ? '150 mg bolus' : 'Max doses reached'}
                    </span>
                </div>
            </button>
        </div>
    );
};
