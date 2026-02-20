import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Flag } from 'lucide-react';
import { BaseNode } from './base-node';

export const EndNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="End"
            icon={Flag}
            handles={[
                { type: 'target', position: Position.Left, id: 'in' }
            ]}
            className="border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900"
        >
            <div className="text-xs text-zinc-500 italic">
                Workflow ends here
            </div>
        </BaseNode>
    );
});
