import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        // Return the nodes and edges as actual JSON instead of strings
        return NextResponse.json({
            ...workflow,
            nodes: JSON.parse(workflow.nodes),
            edges: JSON.parse(workflow.edges),
        });
    } catch (error) {
        console.error(`Error loading workflow ${id}:`, error);
        return NextResponse.json({ error: "Failed to load workflow" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { name, nodes, edges } = body;

        const updatedData: any = {};
        if (name !== undefined) updatedData.name = name;
        if (nodes !== undefined) updatedData.nodes = typeof nodes === "string" ? nodes : JSON.stringify(nodes);
        if (edges !== undefined) updatedData.edges = typeof edges === "string" ? edges : JSON.stringify(edges);

        const workflow = await prisma.workflow.update({
            where: { id },
            data: updatedData,
        });

        return NextResponse.json(workflow);
    } catch (error) {
        console.error(`Error updating workflow ${id}:`, error);
        return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
    }
}
