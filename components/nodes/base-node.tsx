import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BaseNodeProps {
    selected?: boolean;
    label: string;
    icon?: LucideIcon;
    children?: React.ReactNode;
    handles?: {
        type: 'source' | 'target';
        position: Position;
        id?: string;
        style?: React.CSSProperties;
    }[];
    className?: string;
}

export const BaseNode = ({
    selected,
    label,
    icon: Icon,
    children,
    handles = [],
    className,
}: BaseNodeProps) => {
    return (
        <div
            className={cn(
                'rounded-xl border-2 bg-white dark:bg-zinc-950 px-4 py-2 min-w-[150px] shadow-sm transition-all',
                selected
                    ? 'border-indigo-500 shadow-indigo-500/20'
                    : 'border-zinc-200 dark:border-zinc-800',
                className
            )}
        >
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
                {Icon && <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {label}
                </span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {children}
            </div>

            {handles.map((handle, index) => (
                <Handle
                    key={index}
                    type={handle.type}
                    position={handle.position}
                    id={handle.id}
                    style={handle.style}
                    className="w-3 h-3 bg-zinc-400 dark:bg-zinc-600 border-2 border-white dark:border-black"
                />
            ))}
        </div>
    );
};
