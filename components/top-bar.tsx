"use client";

import React from 'react';
import { Play, Save, Upload } from 'lucide-react';
import { useStore } from '@/lib/store';

export const TopBar = () => {
    const { nodes, edges } = useStore();

    const handleRun = async () => {
        // Mock execution
        console.log('Running workflow:', { nodes, edges });
        alert('Workflow execution triggered! Check console for payload.');
        // In real app, this would POST to backend
    };

    const handleSave = () => {
        console.log('Saving workflow:', { nodes, edges });
        const data = JSON.stringify({ nodes, edges });
        localStorage.setItem('workflow-data', data);
        alert('Workflow saved to local storage.');
    };

    return (
        <div className="absolute top-4 left-4 z-50 flex gap-2">
            <button
                onClick={handleRun}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded shadow-lg transition-colors font-semibold"
            >
                <Play className="w-4 h-4" />
                Run
            </button>
            <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-lg transition-colors font-semibold"
            >
                <Save className="w-4 h-4" />
                Save
            </button>
        </div>
    );
};
