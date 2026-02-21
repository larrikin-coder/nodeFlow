import React from 'react';
import { FlowCanvas } from "@/components/flow-canvas";
import { ConfigPanel } from '@/components/config-panel';
import { TopBar } from '@/components/top-bar';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black relative">
      <TopBar />
      <FlowCanvas />
      <ConfigPanel />
    </main>
  );
}
