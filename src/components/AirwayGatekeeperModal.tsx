import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AirwayGatekeeperModal = ({ onClear }: { onClear: () => void }) => {
    const [space, setSpace] = useState(false);
    const [position, setPosition] = useState(false);
    const [equipment, setEquipment] = useState(false);
    const [co2, setCo2] = useState(false);

    const allChecked = space && position && equipment && co2;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/95 backdrop-blur-md p-4">
            <div className="bg-gray-900 border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] max-w-2xl w-full p-6 md:p-10 text-gray-100 flex flex-col gap-8 max-h-[95vh] overflow-y-auto">

                <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                    <div className="min-w-16 min-h-16 w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500">
                        <AlertCircle className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mb-1">Airway Preparation</h1>
                        <p className="text-amber-500 font-semibold tracking-widest text-xs md:text-sm uppercase">Second Cycle intubation Gatekeeper</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-gray-400 text-lg mb-2">Before pausing current CPR for a rhythm check, acknowledge the advanced airway safety checklist:</p>

                    <label className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-colors ${space ? 'bg-green-950/20 border-green-500/50' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border-2 ${space ? 'bg-green-500 border-green-400 text-gray-900' : 'bg-gray-900 border-gray-600'}`}>
                            {space && <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <span className={`text-xl md:text-2xl font-medium ${space ? 'text-green-50' : 'text-gray-300'}`}>360&deg; Space Clearance Confirmed</span>
                        <input type="checkbox" className="hidden" checked={space} onChange={(e) => setSpace(e.target.checked)} />
                    </label>

                    <label className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-colors ${position ? 'bg-green-950/20 border-green-500/50' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border-2 ${position ? 'bg-green-500 border-green-400 text-gray-900' : 'bg-gray-900 border-gray-600'}`}>
                            {position && <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <span className={`text-xl md:text-2xl font-medium ${position ? 'text-green-50' : 'text-gray-300'}`}>Patient Positioning Optimised</span>
                        <input type="checkbox" className="hidden" checked={position} onChange={(e) => setPosition(e.target.checked)} />
                    </label>

                    <label className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-colors ${equipment ? 'bg-green-950/20 border-green-500/50' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border-2 ${equipment ? 'bg-green-500 border-green-400 text-gray-900' : 'bg-gray-900 border-gray-600'}`}>
                            {equipment && <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <span className={`text-xl md:text-2xl font-medium ${equipment ? 'text-green-50' : 'text-gray-300'}`}>Laryngoscope & Suction Tested</span>
                        <input type="checkbox" className="hidden" checked={equipment} onChange={(e) => setEquipment(e.target.checked)} />
                    </label>

                    <label className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-colors ${co2 ? 'bg-green-950/20 border-green-500/50' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border-2 ${co2 ? 'bg-green-500 border-green-400 text-gray-900' : 'bg-gray-900 border-gray-600'}`}>
                            {co2 && <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <span className={`text-xl md:text-2xl font-medium ${co2 ? 'text-green-50' : 'text-gray-300'}`}>Waveform Capnography Attached</span>
                        <input type="checkbox" className="hidden" checked={co2} onChange={(e) => setCo2(e.target.checked)} />
                    </label>
                </div>

                {allChecked && (
                    <div className="pt-4 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={onClear}
                            className="w-full px-6 py-6 bg-amber-500 hover:bg-amber-400 text-gray-900 text-2xl font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                        >
                            Acknowledge & Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
