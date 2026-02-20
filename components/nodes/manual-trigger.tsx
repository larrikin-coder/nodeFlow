import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Play } from 'lucide-react';
import { BaseNode } from './base-node';

export const ManualTriggerNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="Manual Trigger"
            icon={Play}
            handles={[
                { type: 'source', position: Position.Right, id: 'out' }
            ]}
            className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
        >
            <div className="text-xs text-zinc-500">Click Run to start</div>
        </BaseNode>
    );
});
