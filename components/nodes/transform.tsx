import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './base-node';

export const TransformNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="Transform"
            icon={Wand2}
            handles={[
                { type: 'target', position: Position.Left, id: 'in' },
                { type: 'source', position: Position.Right, id: 'out' }
            ]}
            className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30"
        >
            <div className="text-xs text-zinc-500">
                {data.transformationType ? `${data.transformationType}` : 'Select transformation'}
            </div>
        </BaseNode>
    );
});
