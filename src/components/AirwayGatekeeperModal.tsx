import React from 'react';
import { Stethoscope } from 'lucide-react';

export const AirwayGatekeeperModal = ({ onClear }: { onClear: () => void }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/95 backdrop-blur-md p-4">
            <div className="bg-gray-900 border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] max-w-2xl w-full p-6 md:p-10 text-gray-100 flex flex-col gap-8 max-h-[95vh] overflow-y-auto">

                <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                    <div className="min-w-16 min-h-16 w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500">
                        <Stethoscope className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mb-1">Advanced Airway</h1>
                        <p className="text-amber-500 font-semibold tracking-widest text-xs md:text-sm uppercase">Intubation Checklist</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-4">
                        A second shock has been delivered. It is now highly recommended to prepare for and execute an advanced airway strategy if not already established.
                    </p>
                    <ul className="flex flex-col gap-3 text-gray-400 text-base md:text-lg ml-2">
                        <li className="flex gap-3"><span className="text-amber-500">&bull;</span> Ensure 360-degree space and optimize positioning.</li>
                        <li className="flex gap-3"><span className="text-amber-500">&bull;</span> Verify laryngoscope and suction are fully operational.</li>
                        <li className="flex gap-3"><span className="text-amber-500">&bull;</span> Attach waveform capnography immediately post-placement.</li>
                    </ul>
                </div>

                <div className="pt-6 border-t border-gray-800">
                    <button
                        onClick={onClear}
                        className="w-full px-6 py-5 bg-amber-500 hover:bg-amber-400 text-gray-900 text-xl font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    >
                        Proceed to Intubation
                    </button>
                </div>
            </div>
        </div>
    );
};
