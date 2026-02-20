import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { BaseNode } from './base-node';

export const WaitNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="Wait"
            icon={Clock}
            handles={[
                { type: 'target', position: Position.Left, id: 'in' },
                { type: 'source', position: Position.Right, id: 'out' }
            ]}
            className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30"
        >
            <div className="text-xs text-zinc-500">
                {data.duration ? `${data.duration}s` : 'Config duration'}
            </div>
        </BaseNode>
    );
});
