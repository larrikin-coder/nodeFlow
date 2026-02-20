import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { BaseNode } from './base-node';

export const DecisionNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="Decision"
            icon={GitFork}
            handles={[
                { type: 'target', position: Position.Left, id: 'in' },
                // Two output handles
                {
                    type: 'source',
                    position: Position.Right,
                    id: 'true',
                    style: { top: '30%', background: '#10b981' }, // Green for True
                },
                {
                    type: 'source',
                    position: Position.Right,
                    id: 'false',
                    style: { top: '70%', background: '#ef4444' }, // Red for False
                }
            ]}
            className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30"
        >
            <div className="flex flex-col gap-1 text-[10px] text-zinc-500 mt-1">
                <div className="flex justify-between items-center">
                    <span>True</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex justify-between items-center">
                    <span>False</span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                </div>
            </div>
            <div className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                {data.condition ? `${data.condition}` : 'If...'}
            </div>
        </BaseNode>
    );
});
