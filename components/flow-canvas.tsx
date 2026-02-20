"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    Connection,
    Edge,
    Node,
    ReactFlowInstance,
    NodeChange,
    EdgeChange,
    applyNodeChanges,
    applyEdgeChanges
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
import { BaseNode } from './nodes/base-node';

const nodeTypes = {
    manualTrigger: ManualTriggerNode,
    webhookTrigger: WebhookTriggerNode,
    httpRequest: HttpRequestNode,
    transformData: TransformNode,
    decision: DecisionNode,
    wait: WaitNode,
    end: EndNode,
};

function nodeColor(node:Node):string {
    switch (node.type) {
        case 'manualTrigger':
            return "#10B981";
        case 'webhookTrigger':
            return "#a3004c";
        case 'httpRequest':
            return "#00598a";
        case 'transformData':
            return "#5d0ec0";
        case 'decision':
            return "#9f2d00";
        case 'wait':
            return "#973c00";
        case 'end':
            return "#52525c";
        default:
            return "#111";
    }
}

// const color = nodeColor(nodeTypes);

let id = 0;
const getId = () => `dndnode_${id++}`;

const FlowCanvasInternal = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    // Use store state directly to ensure ConfigPanel and Canvas are in sync
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const addNode = useStore((state) => state.addNode);

    // If we wanted to treat the store as initial state and manage locally, we would do this:
    /*
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    */
    // But then ConfigPanel wouldn't update the node on the canvas unless we sync back.
    // So sticking to store as source of truth is better for this requirement.

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            if (reactFlowInstance && reactFlowWrapper.current) {
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                const newNode: Node = {
                    id: getId(),
                    type,
                    position,
                    data: { label: `${type} node` },
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
                            <MiniMap bgColor='#111' nodeColor={nodeColor} offsetScale={0.8} position='bottom-right'/>
                            <Background gap={12} size={1} />
                        </ReactFlow>
                    </GridBackground>
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
