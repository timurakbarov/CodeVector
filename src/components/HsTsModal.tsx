import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';

export const HsTsModal = ({ onClear }: { onClear: () => void }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/95 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-indigo-500/50 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)] max-w-4xl w-full p-4 md:p-8 text-gray-100 flex flex-col gap-6 max-h-[95vh] overflow-y-auto custom-scrollbar">

                <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
                    <div className="min-w-12 min-h-12 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500">
                        <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white uppercase mb-1">Reversible Causes</h1>
                        <p className="text-indigo-400 font-semibold tracking-widest text-[10px] md:text-xs uppercase">The H's and T's Clinical Guide</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 text-sm md:text-base text-gray-300">
                    <p className="text-indigo-300 font-bold mb-2">Identify and treat underlying reversible causes when applicable:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-950 p-4 border border-gray-800 rounded-xl">
                            <h3 className="text-white font-bold mb-3 border-b border-gray-800 pb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> The 5 H's</h3>
                            <ul className="flex flex-col gap-4 text-[13px] md:text-sm">
                                <li><strong className="text-indigo-300 block text-sm md:text-base">Hypovolemia</strong>
                                    <span className="opacity-80">Volume infusion (NS/LR), blood products, control bleeding.</span>
                                </li>
                                <li><strong className="text-indigo-300 block text-sm md:text-base">Hypoxia</strong>
                                    <span className="opacity-80">100% FiO2, secure airway, ensure adequate ventilation.</span>
                                </li>
                                <li><strong className="text-indigo-300 block text-sm md:text-base">Hydrogen ion (acidosis)</strong>
                                    <span className="opacity-80">Optimize ventilation, consider sodium bicarbonate.</span>
                                </li>
                                <li><strong className="text-indigo-300 block text-sm md:text-base">Hypo-/Hyperkalemia</strong>
                                    <span className="opacity-80">Calcium chloride, sodium bicarb, glucose + insulin, albuterol.</span>
                                </li>
                                <li><strong className="text-indigo-300 block text-sm md:text-base">Hypothermia</strong>
                                    <span className="opacity-80">Warm IV fluids, active internal/external core rewarming.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-950 p-4 border border-gray-800 rounded-xl">
                            <h3 className="text-white font-bold mb-3 border-b border-gray-800 pb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500" /> The 5 T's</h3>
                            <ul className="flex flex-col gap-4 text-[13px] md:text-sm">
                                <li><strong className="text-cyan-300 block text-sm md:text-base">Tension pneumothorax</strong>
                                    <span className="opacity-80">Needle decompression, tube thoracostomy.</span>
                                </li>
                                <li><strong className="text-cyan-300 block text-sm md:text-base">Tamponade, cardiac</strong>
                                    <span className="opacity-80">Pericardiocentesis, rapid fluid bolus.</span>
                                </li>
                                <li><strong className="text-cyan-300 block text-sm md:text-base">Toxins</strong>
                                    <span className="opacity-80">Administer specific antidote (e.g. Naloxone), supportive care.</span>
                                </li>
                                <li><strong className="text-cyan-300 block text-sm md:text-base">Thrombosis, pulmonary</strong>
                                    <span className="opacity-80">Consider thrombolytics, surgical embolectomy.</span>
                                </li>
                                <li><strong className="text-cyan-300 block text-sm md:text-base">Thrombosis, coronary</strong>
                                    <span className="opacity-80">Prepare for PCI, consider thrombolytics.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 mt-2">
                    <button
                        onClick={onClear}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};
