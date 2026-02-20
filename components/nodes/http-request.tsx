import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Database } from 'lucide-react';
import { BaseNode } from './base-node';

export const HttpRequestNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="HTTP Request"
            icon={Database}
            handles={[
                { type: 'target', position: Position.Left, id: 'in' },
                { type: 'source', position: Position.Right, id: 'out' }
            ]}
            className="border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30"
        >
            <div className="text-xs text-zinc-500 font-mono">
                {data.method || 'GET'} {data.url || 'https://...'}
            </div>
        </BaseNode>
    );
});
