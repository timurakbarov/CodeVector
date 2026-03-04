import React, { useReducer, useEffect, useRef, useState } from 'react';
import { codeReducer, initialState, RhythmType, AppMode, ViewMode } from './state/codeState';
import { getNextShockableNode, AHA_ALGORITHM_NODES } from './data/algorithm';
import { PreCodeModal } from './components/PreCodeModal';
import { Flowchart } from './components/Flowchart';
import { DrugsSidebar } from './components/Sidebars';
import { EventLog } from './components/EventLog';
import { SummaryView } from './components/SummaryView';
import { WizardView } from './components/WizardView';
import { AirwayGatekeeperModal } from './components/AirwayGatekeeperModal';
import { HsTsModal } from './components/HsTsModal';
import { Activity, LayoutList, Map as MapIcon, RotateCcw } from 'lucide-react';

class Metronome {
  private audioCtx: AudioContext | null = null;
  private intervalId: number | null = null;

  start(bpm: number = 110) {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    if (this.intervalId !== null) clearInterval(this.intervalId);

    this.intervalId = window.setInterval(() => {
      this.playClick();
    }, 60000 / bpm);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playClick() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(codeReducer, initialState);
  const metronomeRef = useRef(new Metronome());
  const [activeTab, setActiveTab] = useState<'flowchart' | 'log'>('flowchart');
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (diff > 50) setActiveTab('log'); // Swipe left
    if (diff < -50) setActiveTab('flowchart'); // Swipe right

    touchStartRef.current = null;
  };

  useEffect(() => {
    if (!state.codeStartTime || state.codeEnded) return;
    const timer = setInterval(() => { dispatch({ type: 'TICK_TIMERS' }); }, 1000);
    return () => clearInterval(timer);
  }, [state.codeStartTime, state.codeEnded]);

  useEffect(() => {
    if (state.metronomeEnabled && !state.codeEnded) {
      metronomeRef.current.start(110);
    } else {
      metronomeRef.current.stop();
    }
    return () => metronomeRef.current.stop();
  }, [state.metronomeEnabled, state.codeEnded]);

  const handleNodeTap = (nodeId: string) => {
    const node = AHA_ALGORITHM_NODES[nodeId];
    if (node) {
      if (node.branch === 'shockable' && state.rhythmType !== 'shockable') {
        dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'shockable', nextNodeId: nodeId } });
        return;
      }
      if (node.branch === 'nonShockable' && state.rhythmType !== 'nonShockable') {
        dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: 'nonShockable', nextNodeId: nodeId } });
        return;
      }
    }
    dispatch({ type: 'JUMP_NODE', payload: { nodeId } });
  };

  const handleDeliverShock = () => {
    const nextNodeId = getNextShockableNode(state.currentNodeId);
    dispatch({ type: 'DELIVER_SHOCK', payload: { nextNodeId, energy: '200 J' } });
  };

  const handleStartCode = (mode: AppMode, viewMode: "map" | "wizard", startNodeId: string, rhythm: RhythmType) => {
    dispatch({ type: 'START_CODE', payload: { mode, startNodeId, rhythm } });
    dispatch({ type: 'SET_VIEW_MODE', payload: { mode: viewMode } });
  };

  if (!state.codeStartTime) return <PreCodeModal onStart={handleStartCode} />;
  if (state.codeEnded && state.events.length > 0) return <SummaryView events={state.events} codeStartTime={state.codeStartTime} onReset={() => window.location.reload()} />;

  return (
    <>
      <div className="flex flex-col bg-black text-gray-100 overflow-hidden select-none w-screen h-screen">

        {/* HEADER: Sticky Top Mobile HUD */}
        <div className="h-[12vh] md:h-[10vh] border-b border-gray-800 bg-black flex flex-col md:flex-row items-center justify-between px-2 md:px-6 shrink-0 z-30 shadow-md">

          {/* Top Row on Mobile: Brand and Rhythm */}
          <div className="w-full flex items-center justify-between md:w-auto">
            <div className="flex items-center gap-2 md:gap-4">
              <h2 className="text-xl md:text-3xl font-bold tracking-widest" style={{ color: 'var(--color-neon-green)' }}>CodeVector</h2>

              {/* View Mode Toggle */}
              <div className="hidden md:flex ml-2 bg-gray-900 rounded-lg p-1 border border-gray-800">
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: { mode: 'map' } })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${state.viewMode === 'map' ? 'bg-gray-800 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                  <MapIcon className="w-4 h-4" /> HUD MAP
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: { mode: 'wizard' } })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${state.viewMode === 'wizard' ? 'bg-gray-800 text-neon-green shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                  <LayoutList className="w-4 h-4" /> WIZARD
                </button>
              </div>
            </div>
            <div className="flex md:hidden items-center gap-2 bg-black border border-gray-800 p-1 px-2 rounded text-xs shrink-0">
              <span className="text-gray-400">RHYTHM:</span>
              <select value={state.rhythmType} onChange={(e) => dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: e.target.value as RhythmType } })} className="bg-transparent text-white font-bold outline-none cursor-pointer">
                <option value="unknown">UNK</option>
                <option value="shockable">SHOCK</option>
                <option value="nonShockable">NON-SHOCK</option>
              </select>
            </div>
          </div>

          {/* CPR TIMER - Condensed on Mobile */}
          <div className="w-full md:w-auto flex items-center justify-center gap-2 bg-black mt-1 md:mt-0 px-2 md:px-3 py-1 rounded-lg border border-gray-800 shadow-inner">
            <span className="uppercase tracking-widest text-[10px] md:text-xs font-semibold text-gray-400">CPR</span>
            <span className={`text-2xl md:text-3xl font-mono font-bold ${state.cprTimerSecondsRemaining === 0 ? 'text-red-500 animate-pulse' : ''}`}
              style={state.cprTimerSecondsRemaining > 0 ? { color: 'var(--color-neon-green)', textShadow: '0 0 10px rgba(57, 255, 20, 0.4)' } : undefined}>
              {Math.floor(state.cprTimerSecondsRemaining / 60)}:{(state.cprTimerSecondsRemaining % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex justify-center ml-2 md:ml-3 gap-2">
              <button onClick={() => dispatch({ type: 'RESET_CPR_TIMER' })} disabled={state.codeEnded} className="min-h-[36px] md:min-h-[40px] px-2 py-1 bg-gray-900 border-[1px] border-gray-800 hover:bg-gray-800 text-gray-300 rounded text-[10px] md:text-xs font-bold transition-all">RESET</button>
              {state.cprTimerSecondsRemaining === 0 && (
                <button onClick={() => dispatch({ type: 'COMPLETED_CPR_CYCLE' })} disabled={state.codeEnded} className="min-h-[36px] md:min-h-[40px] px-2 py-1 bg-blue-900 border border-blue-500 hover:bg-blue-800 text-blue-200 rounded text-[10px] md:text-xs font-bold transition-all animate-pulse">CONTINUE</button>
              )}
            </div>
          </div>

          {/* Desktop Rhythm Selector */}
          <div className="hidden md:flex items-center gap-2 bg-black border border-gray-800 p-2 px-4 rounded text-sm shrink-0">
            <span className="text-gray-400">RHYTHM:</span>
            <select value={state.rhythmType} onChange={(e) => dispatch({ type: 'CHANGE_RHYTHM', payload: { rhythmType: e.target.value as RhythmType } })} className="bg-transparent text-white font-bold outline-none cursor-pointer">
              <option value="unknown">UNKNOWN</option>
              <option value="shockable">SHOCKABLE (VF/pVT)</option>
              <option value="nonShockable">NON-SHOCKABLE (PEA/Asystole)</option>
            </select>
          </div>
        </div>

        {/* MIDDLE: Mobile Tabbed vs Desktop Sidebars */}
        <div className="flex-1 w-full flex bg-black relative overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

          {/* Left Panel / Mobile Bottom Drawer Removed in V7 -> Uses HsTsModal instead */}

          {/* Central Flowchart Layout Wrapping */}
          <div className={`flex-1 flex flex-col relative ${activeTab === 'log' ? 'hidden md:flex' : 'flex'}`}>
            {/* V5: Mobile Permanent Drugs Bar (Top of Flowchart) */}
            <div className="md:hidden border-b border-gray-800 shrink-0">
              <DrugsSidebar state={state} dispatch={dispatch} />
            </div>

            <div className="flex-1 overflow-auto border-r border-l border-gray-800 flex flex-col">
              {state.viewMode === 'map' ? (
                <Flowchart currentNodeId={state.currentNodeId} onNodeTap={handleNodeTap} onDeliverShock={handleDeliverShock} rhythm={state.rhythmType} />
              ) : (
                <WizardView state={state} dispatch={dispatch} />
              )}
            </div>
          </div>

          {/* Right Panel: Desktop Sidebars / Mobile Event Log */}
          <div className={`w-full md:w-[380px] h-full shrink-0 flex flex-col bg-gray-900 border-l border-gray-800 overflow-hidden ${activeTab === 'flowchart' ? 'hidden md:flex' : 'flex'}`}>
            {/* Hide DrugsSidebar in the tab view for mobile since it's above flowchart now */}
            <div className="hidden md:block">
              <DrugsSidebar state={state} dispatch={dispatch} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventLog events={state.events} codeStartTime={state.codeStartTime} />
            </div>
          </div>
        </div>

        {/* Mobile Tab Indicators */}
        <div className="md:hidden flex h-10 bg-gray-900 border-t border-gray-800 z-40">
          <button
            onClick={() => setActiveTab('flowchart')}
            className={`flex-1 font-bold text-xs uppercase tracking-wider ${activeTab === 'flowchart' ? 'bg-gray-800 text-neon-green border-t-2 border-neon-green' : 'text-gray-500'}`}
            style={activeTab === 'flowchart' ? { color: 'var(--color-neon-green)' } : undefined}>
            Flowchart
          </button>
          <div className="w-px bg-gray-800" />
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 font-bold text-xs uppercase tracking-wider ${activeTab === 'log' ? 'bg-gray-800 text-blue-400 border-t-2 border-blue-500' : 'text-gray-500'}`}>
            Medical Log
          </button>
        </div>

        {/* FOOTER: Controls */}
        <div className="h-[10vh] max-h-[80px] border-t border-gray-800 bg-black flex items-center justify-center gap-4 md:gap-8 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
          <button onClick={() => dispatch({ type: 'TOGGLE_METRONOME' })} disabled={state.codeEnded}
            className={`flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full font-semibold border-2 transition-all ${state.metronomeEnabled ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)] scale-105' : 'bg-gray-900 border-gray-800 text-gray-400'} text-xs md:text-base`}
            style={state.metronomeEnabled ? { color: 'var(--color-neon-green)', borderColor: 'var(--color-neon-green)' } : undefined}>
            <Activity className="w-4 h-4 md:w-5 md:h-5" /> Metronome {state.metronomeEnabled ? 'ON' : 'OFF'}
          </button>

          {state.viewMode === 'wizard' && state.history.length > 0 && (
            <button onClick={() => dispatch({ type: 'UNDO_LAST_ACTION' })} disabled={state.codeEnded} className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-900 border-2 border-gray-600 hover:border-gray-400 text-gray-300 rounded-full text-xs font-bold transition-all uppercase">
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" /> Undo
            </button>
          )}

          <div className="hidden md:block w-px h-10 bg-gray-800" />

          <button onClick={() => dispatch({ type: 'ACHIEVE_ROSC' })} disabled={state.codeEnded} className="px-6 md:px-8 min-h-[50px] rounded-full font-semibold border-2 border-green-500 bg-green-950/40 text-green-400 hover:bg-green-900 transition-all text-sm md:text-lg">
            ROSC
          </button>

          <button onClick={() => dispatch({ type: 'TERMINATE_CODE' })} disabled={state.codeEnded} className="px-6 md:px-8 min-h-[50px] rounded-full font-semibold border-2 border-red-500 bg-red-950/40 text-red-500 hover:bg-red-900 transition-all text-sm md:text-lg tracking-wider">
            END CODE
          </button>
        </div>

      </div>
      {state.shockCount === 2 && !state.airwayGatekeeperCleared && !state.codeEnded && (
        <AirwayGatekeeperModal onClear={() => dispatch({ type: 'CLEAR_AIRWAY_GATEKEEPER' })} />
      )}
      {state.showHsTsModal && (
        <HsTsModal onClear={() => dispatch({ type: 'TOGGLE_HS_TS_MODAL' })} />
      )}
    </>
  );
};

export default App;
