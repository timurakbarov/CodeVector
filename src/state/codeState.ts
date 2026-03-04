import { Reducer } from 'react';

export type RhythmType = 'unknown' | 'shockable' | 'nonShockable';
export type AppMode = 'training' | 'live';
export type ViewMode = 'map' | 'wizard';

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
    viewMode: ViewMode;
    airwayGatekeeperCleared: boolean;
    history: CodeState[];
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
    viewMode: 'map',
    airwayGatekeeperCleared: false,
    history: [],
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
    | { type: 'ADD_LOG'; payload: { label: string; details?: string } }
    | { type: 'SET_VIEW_MODE'; payload: { mode: ViewMode } }
    | { type: 'CLEAR_AIRWAY_GATEKEEPER' }
    | { type: 'UNDO_LAST_ACTION' };

// Generic node jumps are no longer visibly tracked in the medical record to reduce clutter.
// Only explicitly triggered physiological events (CPR, Meds, Shocks, ROSC) are kept.

const createLog = (label: string, details?: string): LogEvent => ({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    label,
    details
});

export const codeReducer: Reducer<CodeState, CodeAction> = (state, action) => {
    // Helper to push history for major structural changes
    const pushHistory = (newState: CodeState): CodeState => {
        // Do not store the events/history deep clone if memory is an issue, but for a short webapp it's fine.
        // We only save history before states that move the node or change critical logic.
        return {
            ...newState,
            history: [...state.history, state]
        };
    };

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
                    createLog(`CPR Started (30:2)`)
                ],
                history: []
            };

        case 'SET_CHECKLIST':
            return { ...state, ...action.payload };

        case 'DELIVER_SHOCK':
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            return pushHistory({
                ...state,
                currentNodeId: action.payload.nextNodeId,
                cprTimerSecondsRemaining: 120,
                events: [
                    ...state.events,
                    createLog(`Shock Delivered`, action.payload.energy || `200 J`)
                ]
            });

        case 'GIVE_EPI':
            if (state.epiCooldownSecondsRemaining > 0) return state;
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            return pushHistory({
                ...state,
                epiDoses: state.epiDoses + 1,
                epiCooldownSecondsRemaining: 240, // 4-minute autotrigger
                events: [
                    ...state.events,
                    createLog(`Epinephrine Administered`, `1 mg IV/IO`)
                ]
            });

        case 'GIVE_AMIO':
            if (state.amioDoses >= 2) return state;
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200]);
            const nextDose = state.amioDoses === 0 ? 1 : 2;
            const amount = state.amioDoses === 0 ? '300 mg' : '150 mg';
            return pushHistory({
                ...state,
                amioDoses: nextDose,
                events: [
                    ...state.events,
                    createLog(`Amiodarone Administered`, `${amount} IV/IO`)
                ]
            });

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
            return pushHistory({
                ...state,
                cprCycleCount: state.cprCycleCount + 1,
                events: [
                    ...state.events,
                    createLog(`CPR Cycle Completed`, `Cycle #${state.cprCycleCount + 1}`)
                ]
            });

        case 'CHANGE_RHYTHM':
            return pushHistory({
                ...state,
                rhythmType: action.payload.rhythmType,
                currentNodeId: action.payload.nextNodeId || state.currentNodeId,
                events: [
                    ...state.events,
                    createLog(`Rhythm manually updated`, action.payload.rhythmType.toUpperCase())
                ]
            });

        case 'ACHIEVE_ROSC':
            return pushHistory({
                ...state,
                rosCachieved: true,
                codeEnded: true,
                metronomeEnabled: false,
                currentNodeId: 'BOX_12_ROSC_OR_TERMINATE',
                events: [
                    ...state.events,
                    createLog('ROSC Achieved', 'Starting post-cardiac arrest care')
                ]
            });

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
            // We consciously DO NOT emit a medical record line for touching the flowchart 
            // to keep the log strictly focused on physical medical actions (shocks, meds, cpr resets, rhythms)
            return pushHistory({
                ...state,
                currentNodeId: action.payload.nodeId
            });

        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload.mode };

        case 'CLEAR_AIRWAY_GATEKEEPER':
            return {
                ...state,
                airwayGatekeeperCleared: true,
                events: [
                    ...state.events,
                    createLog('Airway Gatekeeper Cleared', 'Intubation checklist confirmed')
                ]
            };

        case 'UNDO_LAST_ACTION':
            if (state.history.length === 0) return state;
            const previousState = state.history[state.history.length - 1];
            // We pop the history, but we probably want to keep the current events array so we don't erase logs when undoing?
            // Actually, if we undo a shock, it shouldn't be in the clinical record (it was a misclick). 
            // So fully restoring the state is exactly what we want.
            // But we might need to preserve viewMode and timers if they ticked... 
            // For simplicity, restore the full previous structural state, but keep the current viewMode.
            return {
                ...previousState,
                viewMode: state.viewMode,
                history: state.history.slice(0, -1)
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
