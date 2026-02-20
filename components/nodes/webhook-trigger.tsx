import React, { memo } from 'react';
import { Position } from '@xyflow/react';
import { Globe } from 'lucide-react';
import { BaseNode } from './base-node';

export const WebhookTriggerNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            label="Webhook"
            icon={Globe}
            handles={[
                { type: 'source', position: Position.Right, id: 'out' }
            ]}
            className="border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/30"
        >
            <div className="text-xs text-zinc-500 truncate max-w-[150px]">
                {data.webhookId ? `/api/webhooks/${data.webhookId}` : 'Generates URL'}
            </div>
        </BaseNode>
    );
});
