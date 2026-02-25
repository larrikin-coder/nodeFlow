"use client";

import React, { useState, useRef, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Controls,
    Background,
    MiniMap,
    Connection,
    Node,
    ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/sidebar';
import { GridBackground } from '@/components/aceternity/grid-background';
import {
    ManualTriggerNode,
    WebhookTriggerNode,
    HttpRequestNode,
    TransformNode,
    DecisionNode,
    WaitNode,
    EndNode,
} from '@/components/nodes';
import { FloatingNavDemo } from './nav-bar';

const nodeTypes = {
    manualTrigger: ManualTriggerNode,
    webhookTrigger: WebhookTriggerNode,
    httpRequest: HttpRequestNode,
    transformData: TransformNode,
    decision: DecisionNode,
    wait: WaitNode,
    end: EndNode,
};

function nodeColor(node: Node): string {
    switch (node.type) {
        case 'manualTrigger':  return '#10B981';
        case 'webhookTrigger': return '#a3004c';
        case 'httpRequest':    return '#00598a';
        case 'transformData':  return '#5d0ec0';
        case 'decision':       return '#9f2d00';
        case 'wait':           return '#973c00';
        case 'end':            return '#52525c';
        default:               return '#111';
    }
}

// Default data for each node type — ensures backend always receives required fields
const defaultNodeData: Record<string, Record<string, unknown>> = {
    manualTrigger:  { label: 'manualTrigger node',  payload: {} },
    webhookTrigger: { label: 'webhookTrigger node' },
    httpRequest:    { label: 'httpRequest node',    method: 'GET', url: '', headers: {}, body: {} },
    transformData:  { label: 'transformData node',  transformationType: 'uppercase', field: '', value: '' },
    decision:       { label: 'decision node',        field: '', operator: 'equals', value: '' },
    wait:           { label: 'wait node',            duration: 0 },
    end:            { label: 'end node' },
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const FlowCanvasInternal = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const nodes         = useStore((state) => state.nodes);
    const edges         = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect     = useStore((state) => state.onConnect);
    const addNode       = useStore((state) => state.addNode);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            if (reactFlowInstance && reactFlowWrapper.current) {
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                const newNode: Node = {
                    id: getId(),
                    type,
                    position,
                    data: defaultNodeData[type] ?? { label: `${type} node` },
                };

                addNode(newNode);
            }
        },
        [reactFlowInstance, addNode]
    );

    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 relative h-full w-full" ref={reactFlowWrapper}>
                <div className="absolute inset-0 z-0">
                    <GridBackground>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            colorMode='dark'
                            fitView
                            className="h-full w-full"
                        >
                            <Controls />
                            <MiniMap bgColor='#111' nodeColor={nodeColor} offsetScale={0.8} position='bottom-right' />
                            <Background gap={12} size={1} />
                        </ReactFlow>
                    </GridBackground>
                </div>
                <div className="absolute justify-center z-50">
                    <FloatingNavDemo />
                </div>
            </div>
        </div>
    );
};

export const FlowCanvas = () => {
    return (
        <ReactFlowProvider>
            <FlowCanvasInternal />
        </ReactFlowProvider>
    );
};