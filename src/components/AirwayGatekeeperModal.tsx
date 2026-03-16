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
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-2 font-medium">
                        Advanced airway preparation recommended. Review clinical checklist below before proceeding.
                    </p>

                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                1. Airway Assessment (LEMON)
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• Look externally (facial trauma, large incisors, beard, large tongue)</li>
                                <li>• Evaluate 3-3-2 rule</li>
                                <li>• Mallampati score</li>
                                <li>• Obstruction/Obesity</li>
                                <li>• Neck mobility</li>
                            </ul>
                        </details>

                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                2. Monitoring & Access
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• IV/IO access confirmed and patent</li>
                                <li>• ECG, SpO2, and NIBP monitoring active</li>
                                <li>• Waveform capnography ready</li>
                            </ul>
                        </details>

                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                3. Pre-oxygenation
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• 100% FiO2 via BVM or NRB</li>
                                <li>• Maintain SpO2 &gt; 94% optimally</li>
                            </ul>
                        </details>

                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                4. Airway Equipment (SOAPME)
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• <span className="font-bold">S</span>uction (tested, under mattress)</li>
                                <li>• <span className="font-bold">O</span>xygen (flowing)</li>
                                <li>• <span className="font-bold">A</span>irways (OPA, NPA, ETT with stylet/bougie)</li>
                                <li>• <span className="font-bold">P</span>harmacology (induction/paralytic ready)</li>
                                <li>• <span className="font-bold">M</span>onitoring equipment attached</li>
                                <li>• <span className="font-bold">E</span>quipment (Video/Direct laryngoscope tested)</li>
                            </ul>
                        </details>

                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                5. Hemodynamic Prep
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• Push-dose pressors ready (e.g., Epi 10mcg/ml) if peri-intubation hypotension occurs</li>
                                <li>• IV fluids hanging</li>
                            </ul>
                        </details>

                        <details className="group bg-gray-950/50 border border-gray-800 rounded-xl p-3 open:bg-gray-950 open:border-amber-500/30 transition-all">
                            <summary className="font-bold text-amber-500 cursor-pointer list-none flex justify-between items-center text-sm md:text-base uppercase tracking-wider">
                                6. Team Roles & Backup Plan
                                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <ul className="text-gray-300 text-sm mt-3 ml-2 flex flex-col gap-2">
                                <li>• Primary intubator and med pusher assigned</li>
                                <li>• Plan B: SGA (e.g., iGel, LMA) ready</li>
                                <li>• Plan C: Surgical airway equipment at bedside</li>
                                <li>• Ventilator prepared and settings confirmed</li>
                            </ul>
                        </details>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 shrink-0">
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
