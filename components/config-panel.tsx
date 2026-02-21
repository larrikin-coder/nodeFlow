"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { X } from 'lucide-react';

export const ConfigPanel = () => {
    const { nodes, updateNodeData, deleteNode } = useStore();
    const [selectedNode, setSelectedNode] = useState<any>(null);

    useEffect(() => {
        const found = nodes.find((n) => n.selected);
        setSelectedNode(found || null);
    }, [nodes]);

    if (!selectedNode) {
        return null;
    }

    const handleChange = (key: string, value: any) => {
        updateNodeData(selectedNode.id, { [key]: value });
    };

    return (
        <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-4 shadow-xl z-20 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <h3 className="font-bold text-lg dark:text-zinc-100">Configuration</h3>
                <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Node ID</label>
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded font-mono">{selectedNode.id}</code>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                    <span className="text-sm dark:text-zinc-300">{selectedNode.type}</span>
                </div>

                {/* Dynamic fields based on node type */}
                {selectedNode.type === 'manualTrigger' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Initial Payload (JSON)</label>
                        <textarea
                            className="w-full h-32 p-2 text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300"
                            value={JSON.stringify(selectedNode.data.payload || {}, null, 2)}
                            onChange={(e) => {
                                try {
                                    handleChange('payload', JSON.parse(e.target.value));
                                } catch (err) {
                                    // ignore invalid json while typing
                                }
                            }}
                        />
                    </div>
                )}

                {selectedNode.type === 'httpRequest' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Method</label>
                            <select
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.method || 'GET'}
                                onChange={(e) => handleChange('method', e.target.value)}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">URL</label>
                            <input
                                type="text"
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder="https://api.example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Headers (JSON)</label>
                            <textarea
                                className="w-full h-24 p-2 text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300"
                                value={JSON.stringify(selectedNode.data.headers || {}, null, 2)}
                                onChange={(e) => {
                                    try {
                                        handleChange('headers', JSON.parse(e.target.value));
                                    } catch (err) {
                                        // ignore
                                    }
                                }}
                            />
                        </div>
                        {selectedNode.data.method !== 'GET' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Body (JSON)</label>
                                <textarea
                                    className="w-full h-24 p-2 text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300"
                                    value={JSON.stringify(selectedNode.data.body || {}, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            handleChange('body', JSON.parse(e.target.value));
                                        } catch (err) {
                                            // ignore
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}

                {selectedNode.type === 'transformData' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                            <select
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.transformationType || 'uppercase'}
                                onChange={(e) => handleChange('transformationType', e.target.value)}
                            >
                                <option value="uppercase">Uppercase</option>
                                <option value="append">Append Text</option>
                                <option value="multiply">Multiply Number</option>
                                <option value="extract">Extract Key</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Target Field</label>
                            <input
                                type="text"
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.field || ''}
                                onChange={(e) => handleChange('field', e.target.value)}
                                placeholder="e.g. message"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Parameter (Value)</label>
                            <input
                                type="text"
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.value || ''}
                                onChange={(e) => handleChange('value', e.target.value)}
                                placeholder="Value to append/multiply"
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'decision' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Field to Check</label>
                            <input
                                type="text"
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.field || ''}
                                onChange={(e) => handleChange('field', e.target.value)}
                                placeholder="e.g. status"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Operator</label>
                            <select
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.operator || 'equals'}
                                onChange={(e) => handleChange('operator', e.target.value)}
                            >
                                <option value="equals">Equals</option>
                                <option value="not_equals">Not Equals</option>
                                <option value="greater_than">Greater Than</option>
                                <option value="less_than">Less Than</option>
                                <option value="contains">Contains</option>
                                <option value="is_empty">Is Empty</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Comparison Value</label>
                            <input
                                type="text"
                                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                                value={selectedNode.data.value || ''}
                                onChange={(e) => handleChange('value', e.target.value)}
                                placeholder="Value to compare against"
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'wait' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Duration (seconds)</label>
                        <input
                            type="number"
                            className="p-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 dark:text-zinc-300"
                            value={selectedNode.data.duration || 0}
                            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                            placeholder="30"
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                    onClick={() => {
                        deleteNode(selectedNode.id);
                        setSelectedNode(null);
                    }}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded transition-colors text-sm font-semibold"
                >
                    Delete Node
                </button>
            </div>
        </aside>
    );
};
