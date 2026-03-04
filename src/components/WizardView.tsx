import React from 'react';
import { CodeState, CodeAction } from '../state/codeState';

interface WizardViewProps {
    state: CodeState;
    dispatch: React.Dispatch<CodeAction>;
}

interface OptionConfig {
    label: string;
    action: () => void;
    color?: string;
}

interface WizardConfig {
    title: string;
    bullets: string[];
    question?: string;
    options: OptionConfig[];
}

export const WizardView: React.FC<WizardViewProps> = ({ state, dispatch }) => {
    const getLetter = (index: number) => ['A', 'B', 'C', 'D'][index];

    const getConfig = () => {
        const id = state.currentNodeId;

        const checkShockable = {
            label: 'Shockable \u2014 VF or pulseless VT',
            action: () => dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'shockable', nextNodeId: 'BOX_2_VF_PVT' } })
        };
        const checkNonShockable = {
            label: 'Non-shockable \u2014 PEA or Asystole',
            action: () => dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'nonShockable', nextNodeId: 'BOX_9_ASYSTOLE_PEA' } })
        };
        const checkRosc: OptionConfig = {
            label: 'ROSC \u2014 Organised rhythm with palpable pulse',
            action: () => dispatch({ type: 'ACHIEVE_ROSC' }),
            color: 'border-green-500 text-green-400 hover:bg-green-950/40'
        };

        switch (id) {
            case 'BOX_1_START_CPR':
                return {
                    title: 'CARDIAC ARREST CONFIRMED',
                    bullets: [
                        'Call resuscitation team / 999 NOW',
                        'Begin CPR immediately (30:2)',
                        'Give Oxygen & Attach monitor/defibrillator'
                    ],
                    question: 'Defibrillator attached \u2014 what does the rhythm show?',
                    options: [checkShockable, checkNonShockable]
                };

            case 'BOX_2_VF_PVT':
            case 'BOX_5_SHOCK':
            case 'BOX_7_SHOCK':
            case 'BOX_3_SHOCK':
                return {
                    title: 'SHOCKABLE RHYTHM \u2014 VF / pVT',
                    bullets: [
                        'Shock: Biphasic 150-200 J / Monophasic 360 J',
                        'Resume CPR immediately \u2014 do NOT check pulse first',
                        id === 'BOX_7_SHOCK' ? 'After 3rd shock: Adrenaline 1mg IV + Amiodarone 300mg IV.' : 'Ensure high-quality compressions continue.'
                    ],
                    question: 'Deliver shock now.',
                    options: [
                        {
                            label: 'Shock Delivered (Resume CPR 2 Min)',
                            action: () => {
                                const map: Record<string, string> = {
                                    'BOX_2_VF_PVT': 'BOX_4_CPR_2_MIN',
                                    'BOX_3_SHOCK': 'BOX_4_CPR_2_MIN',
                                    'BOX_5_SHOCK': 'BOX_6_CPR_EPI',
                                    'BOX_7_SHOCK': 'BOX_8_CPR_AMIO',
                                };
                                const next = map[id] || 'BOX_4_CPR_2_MIN';
                                dispatch({ type: 'DELIVER_SHOCK', payload: { nextNodeId: next, energy: '200 J' } })
                            },
                            color: 'border-red-500 text-red-400 hover:bg-red-950/40'
                        }
                    ]
                };

            case 'BOX_4_CPR_2_MIN':
            case 'BOX_6_CPR_EPI':
            case 'BOX_8_CPR_AMIO':
                return {
                    title: 'CPR \u2014 SHOCKABLE PATHWAY',
                    bullets: [
                        id === 'BOX_6_CPR_EPI' ? 'Adrenaline 1mg IV/IO' : (id === 'BOX_8_CPR_AMIO' ? 'Amiodarone 300mg IV/IO' : 'Obtain IV/IO access'),
                        'Minimise interruptions in compressions',
                        'Consider advanced airway & capnography'
                    ],
                    question: 'After this 2-min CPR cycle \u2014 check rhythm:',
                    options: [
                        {
                            label: 'Still shockable \u2014 VF/pVT persists',
                            action: () => {
                                const map: Record<string, string> = { 'BOX_4_CPR_2_MIN': 'BOX_5_SHOCK', 'BOX_6_CPR_EPI': 'BOX_7_SHOCK', 'BOX_8_CPR_AMIO': 'BOX_5_SHOCK' };
                                dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'shockable', nextNodeId: map[id] || 'BOX_5_SHOCK' } });
                            }
                        },
                        checkNonShockable
                    ]
                };

            case 'BOX_9_ASYSTOLE_PEA':
            case 'BOX_10_EPI_ASAP':
                return {
                    title: 'NON-SHOCKABLE \u2014 PEA or Asystole',
                    bullets: [
                        'DO NOT shock \u2014 resume CPR immediately',
                        'Adrenaline 1mg IV as soon as access obtained',
                        '4Hs & 4Ts: Consider reversible causes'
                    ],
                    question: 'Proceed to continuous CPR monitoring:',
                    options: [
                        { label: 'Start CPR (2 Min Cycle)', action: () => dispatch({ type: 'JUMP_NODE', payload: { nodeId: 'BOX_11_CPR_2_MIN_NONSHOCK' } }) }
                    ]
                };

            case 'BOX_11_CPR_2_MIN_NONSHOCK':
            case 'BOX_11_TREAT_CAUSES':
                return {
                    title: 'CPR \u2014 NON-SHOCKABLE PATHWAY',
                    bullets: [
                        'Continue high-quality CPR',
                        'Adrenaline every 3-5 minutes',
                        '4Hs: Hypoxia, Hypovolaemia, Hypo/Hyperkalaemia, Hypothermia',
                        '4Ts: Tension pneumothorax, Tamponade, Toxins, Thrombosis'
                    ],
                    question: 'After 2 min CPR \u2014 check rhythm:',
                    options: [
                        checkShockable,
                        { label: 'Still non-shockable \u2014 PEA or Asystole', action: () => dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'nonShockable', nextNodeId: 'BOX_11_CPR_2_MIN_NONSHOCK' } }) }
                    ]
                };

            case 'BOX_12_ROSC_OR_TERMINATE':
                return {
                    title: 'ROSC ACHIEVED',
                    bullets: [
                        'Optimise Ventilation and Oxygenation',
                        'Treat Hypotension (MAP \u2265 65 mm Hg)',
                        'Obtain 12-Lead ECG',
                        'Targeted Temperature Management'
                    ],
                    question: 'Code Vector is logging post-cardiac arrest recovery.',
                    options: []
                };

            default:
                return {
                    title: 'AHA ALGORITHM ROUTING',
                    bullets: ['Select a rhythm to orient the wizard.'],
                    options: [checkShockable, checkNonShockable]
                };
        }
    };

    const config: WizardConfig = getConfig();

    return (
        <div className="flex-1 flex flex-col items-center bg-black p-4 md:p-8 relative overflow-y-auto w-full h-full">
            <div className="w-full max-w-4xl flex flex-col gap-8 md:gap-12 mt-4 md:mt-8 pb-32">

                {/* Card Container - True Black Styling */}
                <div className="bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden flex flex-col w-full shadow-2xl">
                    <div className="w-full h-1.5 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.9)]" />

                    <div className="p-8 md:p-12 flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-indigo-400 font-bold uppercase tracking-widest text-sm md:text-base">
                                <span className="text-xl">?</span> CLINICAL QUESTION
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
                            {config.title}
                        </h1>

                        <ul className="flex flex-col gap-4 my-2">
                            {config.bullets.map((b, i) => (
                                <li key={i} className="flex gap-4 text-gray-300 text-xl md:text-2xl font-medium leading-relaxed">
                                    <span className="text-gray-600 font-bold">&bull;</span>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>

                        {config.question && (
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mt-6 pt-6 border-t border-gray-800">
                                {config.question}
                            </h3>
                        )}
                    </div>
                </div>

                {/* Options Stack */}
                <div className="flex flex-col gap-4 md:gap-6 w-full">
                    {config.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={opt.action}
                            className={`flex items-center gap-6 p-6 md:p-8 rounded-2xl border-2 bg-gray-950 transition-all text-left shadow-lg ${opt.color ? opt.color : 'text-gray-100 border-gray-700 hover:border-indigo-500 hover:bg-gray-900'}`}
                        >
                            <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-xl md:text-2xl ${opt.color ? opt.color.replace('text-', 'border-') : 'border-gray-500 text-gray-400'}`}>
                                {getLetter(idx)}
                            </div>
                            <span className="text-2xl md:text-3xl font-semibold leading-tight">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
