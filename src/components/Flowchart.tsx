import React, { useEffect, useRef } from 'react';
import { AHA_ALGORITHM_NODES, AHA_ALGORITHM_EDGES } from '../data/algorithm';

interface FlowchartProps {
    currentNodeId: string;
    onNodeTap: (nodeId: string) => void;
    onDeliverShock: () => void;
    rhythm: 'unknown' | 'shockable' | 'nonShockable';
}

// Rigid, perfect grid layout matching AHA guidelines 
const LAYOUT: Record<string, { x: number; y: number }> = {
    BOX_1_START_CPR: { x: 50, y: 3 },

    // Shockable (Left Column)
    BOX_2_VF_PVT: { x: 20, y: 14 },
    BOX_3_SHOCK: { x: 20, y: 24 },
    BOX_4_CPR_2_MIN: { x: 20, y: 40 },
    BOX_5_SHOCK: { x: 20, y: 55 },
    BOX_6_CPR_EPI: { x: 20, y: 70 },
    BOX_7_SHOCK: { x: 20, y: 85 },
    BOX_8_CPR_AMIO: { x: 20, y: 100 },

    // Non-Shockable (Right Column)
    BOX_9_ASYSTOLE_PEA: { x: 80, y: 14 },
    BOX_10_EPI_ASAP: { x: 80, y: 24 },
    BOX_11_CPR_2_MIN_NONSHOCK: { x: 80, y: 40 },
    BOX_11_TREAT_CAUSES: { x: 80, y: 55 },

    // Terminal
    BOX_12_ROSC_OR_TERMINATE: { x: 50, y: 110 }
};

const generateSegments = (points: string[]) => {
    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i].split(',');
        const p2 = points[i + 1].split(',');
        segments.push({ x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] });
    }
    return segments;
};

export const Flowchart: React.FC<FlowchartProps> = ({ currentNodeId, onNodeTap, onDeliverShock }) => {
    const activeNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeNodeRef.current) {
            activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }, [currentNodeId]);

    const getEdgeColor = (fromId: string, toId: string) => {
        const from = AHA_ALGORITHM_NODES[fromId];
        if (toId === 'BOX_2_VF_PVT' || from.branch === 'shockable') return '#EF4444';
        if (toId === 'BOX_9_ASYSTOLE_PEA' || from.branch === 'nonShockable') return '#3B82F6';
        return '#4B5563';
    };

    return (
        <div className="relative w-full h-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner">
            <div className="absolute inset-0 overflow-y-auto overflow-x-auto custom-scrollbar pb-32">
                <div className="relative w-full min-w-[600px] lg:min-w-full min-h-[1400px] mt-8">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <defs>
                            <marker id="arrow-gray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#4B5563" /></marker>
                            <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#EF4444" opacity="0.8" /></marker>
                            <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#3B82F6" opacity="0.8" /></marker>
                        </defs>

                        {AHA_ALGORITHM_EDGES.map((edge, idx) => {
                            const from = LAYOUT[edge.fromNodeId];
                            const to = LAYOUT[edge.toNodeId];
                            if (!from || !to) return null;

                            const color = getEdgeColor(edge.fromNodeId, edge.toNodeId);
                            const markerRef = color === '#EF4444' ? 'url(#arrow-red)' : color === '#3B82F6' ? 'url(#arrow-blue)' : 'url(#arrow-gray)';

                            // Subtracting ~2.5% from the target Y so arrows never cross box borders visually
                            let targetY = to.y - 2.5;
                            let points = [`${from.x}%,${from.y + 2.5}%`, `${to.x}%,${targetY}%`];

                            // Orthogonal adjustments to perfectly avoid crossing lines and diagonals
                            if (from.x !== to.x && from.y !== to.y) {
                                if (edge.toNodeId === 'BOX_2_VF_PVT') {
                                    points = [`${from.x}%,${from.y + 2.5}%`, `${to.x}%,${from.y + 2.5}%`, `${to.x}%,${targetY}%`];
                                } else if (edge.toNodeId === 'BOX_9_ASYSTOLE_PEA' && edge.fromNodeId === 'BOX_1_START_CPR') {
                                    points = [`${from.x}%,${from.y + 2.5}%`, `${to.x}%,${from.y + 2.5}%`, `${to.x}%,${targetY}%`];
                                } else if (edge.toNodeId === 'BOX_12_ROSC_OR_TERMINATE') {
                                    // Drop down directly below, then slide to center center
                                    points = [`${from.x}%,${from.y}%`, `${from.x}%,115%`, `50%,115%`, `50%,${targetY}%`];
                                } else if (edge.fromNodeId === 'BOX_11_CPR_2_MIN_NONSHOCK' && edge.toNodeId === 'BOX_5_SHOCK') {
                                    // non-shockable to shockable wrap around
                                    points = [`${from.x}%,${from.y}%`, `95%,${from.y}%`, `95%,118%`, `5%,118%`, `5%,${targetY}%`, `${to.x}%,${targetY}%`];
                                } else if (edge.fromNodeId === 'BOX_11_TREAT_CAUSES' && edge.toNodeId === 'BOX_5_SHOCK') {
                                    // non-shockable to shockable wrap around
                                    points = [`${from.x}%,${from.y}%`, `95%,${from.y}%`, `95%,118%`, `5%,118%`, `5%,${targetY}%`, `${to.x}%,${targetY}%`];
                                } else if (edge.fromNodeId === 'BOX_11_TREAT_CAUSES' && edge.toNodeId === 'BOX_11_CPR_2_MIN_NONSHOCK') {
                                    // loop back up non-shockable path
                                    points = [`${from.x}%,${from.y}%`, `90%,${from.y}%`, `90%,36%`, `${to.x}%,36%`, `${to.x}%,${targetY}%`];
                                } else if (edge.fromNodeId === 'BOX_8_CPR_AMIO' && edge.toNodeId === 'BOX_5_SHOCK') {
                                    // Loop back up the shockable path
                                    points = [`${from.x}%,${from.y}%`, `10%,${from.y}%`, `10%,52%`, `${to.x}%,52%`, `${to.x}%,${targetY}%`];
                                }
                            }

                            const segments = generateSegments(points);

                            return (
                                <g key={idx}>
                                    {segments.map((seg, sIdx) => (
                                        <line
                                            key={sIdx}
                                            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                                            stroke={color}
                                            strokeWidth="2"
                                            strokeOpacity="0.8"
                                            markerEnd={sIdx === segments.length - 1 ? markerRef : undefined}
                                        />
                                    ))}
                                    {edge.conditionLabel && segments.length === 1 && (
                                        <text
                                            x={`${(from.x + to.x) / 2}%`}
                                            y={`${(from.y + to.y) / 2}%`}
                                            fill={color === '#EF4444' ? '#FCA5A5' : color === '#3B82F6' ? '#93C5FD' : '#9CA3AF'}
                                            fontSize="14"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dy="-8"
                                            className="font-sans bg-gray-950 px-2"
                                        >
                                            {edge.conditionLabel}
                                        </text>
                                    )}
                                    {edge.conditionLabel && segments.length > 1 && (
                                        <text
                                            x={segments[0].x2}
                                            y={segments[0].y2}
                                            fill={color === '#EF4444' ? '#FCA5A5' : color === '#3B82F6' ? '#93C5FD' : '#9CA3AF'}
                                            fontSize="14"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dy="-8"
                                            className="font-sans bg-gray-950 px-2"
                                        >
                                            {edge.conditionLabel}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* HTML Nodes */}
                    {Object.values(AHA_ALGORITHM_NODES).map(node => {
                        const layout = LAYOUT[node.id];
                        if (!layout) return null;

                        const isActive = currentNodeId === node.id;

                        let typeStyles = 'bg-blue-100 border-blue-400 text-blue-900';
                        if (node.type === 'action') typeStyles = 'bg-blue-100 border-blue-400 text-blue-900 shadow-md';
                        if (node.type === 'decision') typeStyles = 'bg-[#D97777] border-[#A83232] text-white shadow-md hero-hexagon'; // Replicating AHA Red Hexagon
                        if (node.id === 'BOX_1_START_CPR') typeStyles = 'bg-gray-100 border-gray-400 text-gray-900 shadow-md';
                        if (node.type === 'terminal') typeStyles = 'bg-gray-100 border-gray-400 text-gray-900 rounded-3xl shadow-md';

                        const activeStyles = isActive
                            ? 'ring-4 ring-neon-green ring-offset-4 ring-offset-gray-950 scale-105 opacity-100 z-20 shadow-[0_0_30px_rgba(57,255,20,0.8)]'
                            : 'opacity-15 hover:opacity-100 transition-opacity duration-300 z-10 grayscale-[50%]';

                        const isShockNode = node.id.includes('SHOCK') && !node.id.includes('NONSHOCK');
                        const showShockBtn = isActive && isShockNode;

                        return (
                            <div
                                key={node.id}
                                ref={isActive ? activeNodeRef : null}
                                onClick={() => onNodeTap(node.id)}
                                className={`absolute flex -translate-x-1/2 -translate-y-1/2 w-[220px] md:w-[260px] cursor-pointer transition-transform duration-300 ${activeStyles}`}
                                style={{
                                    left: `${layout.x}%`,
                                    top: `${layout.y}%`,
                                }}
                                title={node.description}
                            >
                                {/* Node Box */}
                                <div className={`w-full h-full flex flex-col p-2 md:p-3 rounded-[10px] border-[3px] ${typeStyles}`}
                                    style={node.type === 'decision' ? { clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)', borderRadius: 0 } : {}}>

                                    <div className={`text-center font-bold text-base md:text-lg leading-tight ${node.type === 'decision' ? 'mb-0' : 'mb-2'}`}>
                                        {node.title}
                                    </div>
                                    {node.description && node.type !== 'decision' && (
                                        <div className="text-[13px] md:text-sm font-medium leading-snug">
                                            <ul className="list-disc text-left pl-4 marker:text-current">
                                                {node.description.split('. ').map((desc, i) => desc ? <li key={i}>{desc.replace(/\.$/, '')}</li> : null)}
                                            </ul>
                                        </div>
                                    )}

                                    {showShockBtn && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeliverShock(); }}
                                            className="mt-3 min-h-[64px] text-xl bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl w-full border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce"
                                        >
                                            DELIVER SHOCK
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
