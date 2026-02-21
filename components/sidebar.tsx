"use client";

import React from 'react';

export const nodeTypes = {
    manualTrigger: 'Manual Trigger',
    webhookTrigger: 'Webhook Trigger',
    httpRequest: 'HTTP Request',
    transformData: 'Transform Data',
    decision: 'Decision Node',
    wait: 'Wait Node',
    end: 'End Node',
};

export const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4 z-10">
            <div className="font-bold text-lg dark:text-zinc-100">Nodes Pallete</div>
            <div className="text-s text-zinc-500 mb-2">Drag nodes to the canvas</div>
            <div className="flex flex-col gap-2">
                {Object.entries(nodeTypes).map(([type, label]) => (
                    <div
                        key={type}
                        className="p-3 border border-zinc-200 dark:border-zinc-700 rounded cursor-grab hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-950 text-sm font-medium dark:text-zinc-300"
                        onDragStart={(event) => onDragStart(event, type)}
                        draggable
                    >
                        {label}
                    </div>
                ))}
            </div>
        </aside>
    );
};
