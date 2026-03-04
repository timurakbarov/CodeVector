import { Reducer } from 'react';

export type RhythmType = 'unknown' | 'shockable' | 'nonShockable';
export type AppMode = 'training' | 'live';

export interface LogEvent {
    id: string;
    timestamp: Date;
    label: string;
    details?: string;
}

export interface CodeState {
    currentNodeId: string;
    rhythmType: RhythmType;
    cprCycleCount: number;
    epiDoses: number;
    amioDoses: 0 | 1 | 2;
    lidocaineDoses: number;
    codeStatusConfirmed: boolean;
    defibrillatorPresent: boolean;
    airwayReady: boolean;
    mode: AppMode;
    codeStartTime: Date | null;
    events: LogEvent[];
    epiCooldownSecondsRemaining: number;
    cprTimerSecondsRemaining: number;
    metronomeEnabled: boolean;
    rosCachieved: boolean;
    codeEnded: boolean;
}

export const initialState: CodeState = {
    currentNodeId: '',
    rhythmType: 'unknown',
    cprCycleCount: 0,
    epiDoses: 0,
    amioDoses: 0,
    lidocaineDoses: 0,
    codeStatusConfirmed: false,
    defibrillatorPresent: false,
    airwayReady: false,
    mode: 'live',
    codeStartTime: null,
    events: [],
    epiCooldownSecondsRemaining: 0,
    cprTimerSecondsRemaining: 120,
    metronomeEnabled: false,
    rosCachieved: false,
    codeEnded: false,
};

export type CodeAction =
    | { type: 'START_CODE'; payload: { mode: AppMode; startNodeId: string; rhythm: RhythmType } }
    | { type: 'SET_CHECKLIST'; payload: Partial<CodeState> }
    | { type: 'DELIVER_SHOCK'; payload: { nextNodeId: string; energy: string } }
    | { type: 'GIVE_EPI' }
    | { type: 'GIVE_AMIO' }
    | { type: 'TOGGLE_METRONOME' }
    | { type: 'TICK_TIMERS' }
    | { type: 'RESET_CPR_TIMER' }
    | { type: 'COMPLETED_CPR_CYCLE' }
    | { type: 'CHANGE_RHYTHM'; payload: { rhythmType: RhythmType; nextNodeId?: string } }
    | { type: 'ACHIEVE_ROSC' }
    | { type: 'TERMINATE_CODE' }
    | { type: 'JUMP_NODE'; payload: { nodeId: string } }
    | { type: 'ADD_LOG'; payload: { label: string; details?: string } };

const getHumaneNodeLabel = (nodeId: string) => {
    const map: Record<string, string> = {
        'BOX_1_START_CPR': 'Box 1: Start CPR',
        'BOX_2_VF_PVT': 'Box 2: VF/pVT (Shockable)',
        'BOX_3_SHOCK': 'Box 3: Deliver Shock',
        'BOX_4_CPR_2_MIN': 'Box 4: CPR 2 min',
        'BOX_5_SHOCK': 'Box 5: Deliver Shock',
        'BOX_6_CPR_EPI': 'Box 6: CPR 2 min',
        'BOX_7_SHOCK': 'Box 7: Deliver Shock',
        'BOX_8_CPR_AMIO': 'Box 8: CPR 2 min',
        'BOX_9_ASYSTOLE_PEA': 'Box 9: Asystole/PEA (Non-Shockable)',
        'BOX_10_EPI_ASAP': 'Box 10: Epinephrine ASAP',
        'BOX_11_CPR_2_MIN_NONSHOCK': 'Box 10: CPR 2 min',
        'BOX_11_TREAT_CAUSES': 'Box 11: Treat Causes',
        'BOX_12_ROSC_OR_TERMINATE': 'Box 12: ROSC or Terminate'
    };
    return map[nodeId] || nodeId;
};

const createLog = (label: string, details?: string): LogEvent => ({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    label,
    details
});

export const codeReducer: Reducer<CodeState, CodeAction> = (state, action) => {
    switch (action.type) {
        case 'START_CODE':
            return {
                ...state,
                mode: action.payload.mode,
                currentNodeId: action.payload.startNodeId,
                rhythmType: action.payload.rhythm,
                codeStartTime: new Date(),
                events: [
                    ...state.events,
                    createLog(`Box 1: Start CPR (Live Code Initialized)`)
                ]
            };

        case 'SET_CHECKLIST':
            return { ...state, ...action.payload };

        case 'DELIVER_SHOCK':
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            return {
                ...state,
                currentNodeId: action.payload.nextNodeId,
                cprTimerSecondsRemaining: 120,
                events: [
                    ...state.events,
                    createLog(`Box ${state.currentNodeId === 'BOX_2_VF_PVT' ? '3' : state.currentNodeId === 'BOX_4_CPR_2_MIN' ? '5' : '7'}: Shock Delivered`)
                ]
            };

        case 'GIVE_EPI':
            if (state.epiCooldownSecondsRemaining > 0) return state;
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            return {
                ...state,
                epiDoses: state.epiDoses + 1,
                epiCooldownSecondsRemaining: 240, // 4-minute autotrigger
                events: [
                    ...state.events,
                    createLog(state.currentNodeId === 'BOX_9_ASYSTOLE_PEA' ? `Box 10: Epinephrine 1mg Administered` : `Box 6: CPR & Epinephrine 1mg Administered`)
                ]
            };

        case 'GIVE_AMIO':
            if (state.amioDoses >= 2) return state;
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            const nextDose = state.amioDoses === 0 ? 1 : 2;
            const amount = state.amioDoses === 0 ? '300 mg' : '150 mg';
            return {
                ...state,
                amioDoses: nextDose,
                events: [
                    ...state.events,
                    createLog(`Box 8: Amiodarone ${amount} Administered`)
                ]
            };

        case 'TOGGLE_METRONOME':
            return {
                ...state,
                metronomeEnabled: !state.metronomeEnabled,
                events: [
                    ...state.events,
                    createLog(`Metronome Toggled`, state.metronomeEnabled ? 'OFF' : 'ON')
                ]
            };

        case 'TICK_TIMERS':
            if (state.codeEnded) return state;
            return {
                ...state,
                epiCooldownSecondsRemaining: Math.max(0, state.epiCooldownSecondsRemaining - 1),
                cprTimerSecondsRemaining: state.cprTimerSecondsRemaining > 0 ? state.cprTimerSecondsRemaining - 1 : 0
            };

        case 'RESET_CPR_TIMER':
            return {
                ...state,
                cprTimerSecondsRemaining: 120,
                events: [
                    ...state.events,
                    createLog('CPR Timer Reset', 'Timer manually set to 2:00')
                ]
            };

        case 'COMPLETED_CPR_CYCLE':
            return {
                ...state,
                cprCycleCount: state.cprCycleCount + 1,
                events: [
                    ...state.events,
                    createLog(`CPR Cycle Completed`, `Cycle #${state.cprCycleCount + 1}`)
                ]
            };

        case 'CHANGE_RHYTHM':
            return {
                ...state,
                rhythmType: action.payload.rhythmType,
                currentNodeId: action.payload.nextNodeId || state.currentNodeId,
                events: [
                    ...state.events,
                    createLog(`Rhythm manually updated`, action.payload.rhythmType.toUpperCase())
                ]
            };

        case 'ACHIEVE_ROSC':
            return {
                ...state,
                rosCachieved: true,
                codeEnded: true,
                metronomeEnabled: false,
                currentNodeId: 'BOX_12_ROSC_OR_TERMINATE',
                events: [
                    ...state.events,
                    createLog('ROSC Achieved', 'Starting post-cardiac arrest care')
                ]
            };

        case 'TERMINATE_CODE':
            return {
                ...state,
                codeEnded: true,
                metronomeEnabled: false,
                currentNodeId: 'BOX_12_ROSC_OR_TERMINATE',
                events: [
                    ...state.events,
                    createLog('Code Terminated', 'Resuscitation efforts ended')
                ]
            };

        case 'JUMP_NODE':
            return {
                ...state,
                currentNodeId: action.payload.nodeId,
                events: [
                    ...state.events,
                    createLog(`Algorithm Target Change`, getHumaneNodeLabel(action.payload.nodeId))
                ]
            };

        case 'ADD_LOG':
            return {
                ...state,
                events: [
                    ...state.events,
                    createLog(action.payload.label, action.payload.details)
                ]
            };

        default:
            return state;
    }
};
