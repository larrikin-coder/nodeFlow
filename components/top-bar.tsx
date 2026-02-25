"use client";

import React, { useState } from 'react';
import { Play, Save, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export const TopBar = () => {
    const { nodes, edges } = useStore();
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        const triggerNode = nodes.find((n) => n.type === 'manualTrigger');
        const initial_payload = triggerNode?.data?.payload || {};

        const body = {
            workflow: { nodes, edges },
            initial_payload,
        };

        console.log('Running workflow:', body);
        setIsRunning(true);

        try {
            const response = await fetch('http://localhost:8000/api/workflows/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const json = await response.json();
            console.log('Response from backend:', json);

            // Backend returns { workflow_id, result } — display just the result
            const output = json.result ?? json;
            alert(`Workflow complete!\n\n${JSON.stringify(output, null, 2)}`);
        } catch (err) {
            console.error('Failed to run workflow:', err);
            alert('Failed to connect to backend. Is it running on port 8000?');
        } finally {
            setIsRunning(false);
        }
    };

    const handleSave = () => {
        const data = JSON.stringify({ nodes, edges });
        localStorage.setItem('workflow-data', data);
        console.log('Workflow saved:', { nodes, edges });
        alert('Workflow saved to local storage.');
    };

    return (
        <div className="absolute bottom-10 left-8 z-50 flex gap-2">
            <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white rounded shadow-lg transition-colors font-semibold"
            >
                {isRunning
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
                    : <><Play className="w-4 h-4" /> Run</>
                }
            </button>
            <button
                onClick={handleSave}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded shadow-lg transition-colors font-semibold"
            >
                <Save className="w-4 h-4" />
                Save
            </button>
        </div>
    );
};