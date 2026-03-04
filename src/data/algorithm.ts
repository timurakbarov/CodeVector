export type NodeType = 'action' | 'decision' | 'terminal';
export type BranchType = 'shockable' | 'nonShockable' | 'common';

export interface AlgorithmNode {
    id: string;
    boxNumber?: string;
    title: string;
    description: string;
    type: NodeType;
    branch: BranchType;
}

export interface AlgorithmEdge {
    fromNodeId: string;
    toNodeId: string;
    conditionLabel?: string;
}

export const AHA_ALGORITHM_NODES: Record<string, AlgorithmNode> = {
    BOX_1_START_CPR: {
        id: 'BOX_1_START_CPR',
        boxNumber: '1',
        title: 'Start CPR',
        description: 'Begin bag-mask ventilation and give oxygen. Attach monitor/defibrillator.',
        type: 'action',
        branch: 'common'
    },
    BOX_2_VF_PVT: {
        id: 'BOX_2_VF_PVT',
        boxNumber: '2',
        title: 'VF/pVT',
        description: 'Rhythm shockable? Yes.',
        type: 'decision',
        branch: 'shockable'
    },
    BOX_3_SHOCK: {
        id: 'BOX_3_SHOCK',
        boxNumber: '3',
        title: 'Shock',
        description: 'Deliver Shock.',
        type: 'action',
        branch: 'shockable'
    },
    BOX_4_CPR_2_MIN: {
        id: 'BOX_4_CPR_2_MIN',
        boxNumber: '4',
        title: 'CPR 2 min',
        description: 'IV/IO access',
        type: 'action',
        branch: 'shockable'
    },
    BOX_5_SHOCK: {
        id: 'BOX_5_SHOCK',
        boxNumber: '5',
        title: 'Shock',
        description: 'Deliver Shock.',
        type: 'action',
        branch: 'shockable'
    },
    BOX_6_CPR_EPI: {
        id: 'BOX_6_CPR_EPI',
        boxNumber: '6',
        title: 'CPR 2 min',
        description: 'Epinephrine every 3-5 min. Consider advanced airway, capnography.',
        type: 'action',
        branch: 'shockable'
    },
    BOX_7_SHOCK: {
        id: 'BOX_7_SHOCK',
        boxNumber: '7',
        title: 'Shock',
        description: 'Deliver Shock.',
        type: 'action',
        branch: 'shockable'
    },
    BOX_8_CPR_AMIO: {
        id: 'BOX_8_CPR_AMIO',
        boxNumber: '8',
        title: 'CPR 2 min',
        description: 'Amiodarone or lidocaine. Treat reversible causes.',
        type: 'action',
        branch: 'shockable'
    },
    BOX_9_ASYSTOLE_PEA: {
        id: 'BOX_9_ASYSTOLE_PEA',
        boxNumber: '9',
        title: 'Asystole/PEA',
        description: 'Rhythm shockable? No.',
        type: 'decision',
        branch: 'nonShockable'
    },
    BOX_10_EPI_ASAP: {
        id: 'BOX_10_EPI_ASAP',
        title: 'Epinephrine ASAP',
        description: 'Administer Epinephrine ASAP.',
        type: 'action',
        branch: 'nonShockable'
    },
    BOX_11_CPR_2_MIN_NONSHOCK: {
        id: 'BOX_11_CPR_2_MIN_NONSHOCK',
        boxNumber: '10', // Following visual, box 10 is CPR 2 min. So wait, let me map carefully.
        title: 'CPR 2 min',
        description: 'IV/IO access. Epinephrine every 3-5 min. Consider advanced airway.',
        type: 'action',
        branch: 'nonShockable'
    },
    BOX_12_ROSC_OR_TERMINATE: {
        id: 'BOX_12_ROSC_OR_TERMINATE',
        boxNumber: '12',
        title: 'ROSC or Terminate',
        description: 'If no signs of ROSC, go to 10. If ROSC, go to post-cardiac arrest care.',
        type: 'terminal',
        branch: 'common'
    },
    BOX_11_TREAT_CAUSES: {
        id: 'BOX_11_TREAT_CAUSES',
        boxNumber: '11',
        title: 'CPR 2 min',
        description: 'Treat reversible causes.',
        type: 'action',
        branch: 'nonShockable'
    }
};

export const AHA_ALGORITHM_EDGES: AlgorithmEdge[] = [
    // From Start
    { fromNodeId: 'BOX_1_START_CPR', toNodeId: 'BOX_2_VF_PVT', conditionLabel: 'Yes' },
    { fromNodeId: 'BOX_1_START_CPR', toNodeId: 'BOX_9_ASYSTOLE_PEA', conditionLabel: 'No' },

    // Shockable Branch (Strict Linear)
    { fromNodeId: 'BOX_2_VF_PVT', toNodeId: 'BOX_3_SHOCK' },
    { fromNodeId: 'BOX_3_SHOCK', toNodeId: 'BOX_4_CPR_2_MIN' },
    { fromNodeId: 'BOX_4_CPR_2_MIN', toNodeId: 'BOX_5_SHOCK' },

    { fromNodeId: 'BOX_5_SHOCK', toNodeId: 'BOX_6_CPR_EPI' },
    { fromNodeId: 'BOX_6_CPR_EPI', toNodeId: 'BOX_7_SHOCK' },

    { fromNodeId: 'BOX_7_SHOCK', toNodeId: 'BOX_8_CPR_AMIO' },

    // Non-Shockable Branch (Strict Linear)
    { fromNodeId: 'BOX_9_ASYSTOLE_PEA', toNodeId: 'BOX_10_EPI_ASAP' },
    { fromNodeId: 'BOX_10_EPI_ASAP', toNodeId: 'BOX_11_CPR_2_MIN_NONSHOCK' },
    { fromNodeId: 'BOX_11_CPR_2_MIN_NONSHOCK', toNodeId: 'BOX_11_TREAT_CAUSES' }
];

export const getNextShockableNode = (currentNodeId: string) => {
    const mapping: Record<string, string> = {
        'BOX_2_VF_PVT': 'BOX_3_SHOCK',
        'BOX_3_SHOCK': 'BOX_4_CPR_2_MIN',
        'BOX_4_CPR_2_MIN': 'BOX_5_SHOCK',
        'BOX_5_SHOCK': 'BOX_6_CPR_EPI',
        'BOX_6_CPR_EPI': 'BOX_7_SHOCK',
        'BOX_7_SHOCK': 'BOX_8_CPR_AMIO',
        'BOX_8_CPR_AMIO': 'BOX_5_SHOCK', // Loop back to shock
    };
    return mapping[currentNodeId] || 'BOX_2_VF_PVT';
};
