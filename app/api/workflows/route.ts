import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/workflows — Save a new workflow
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, nodes, edges } = body;

        const workflow = await prisma.workflow.create({
            data: {
                name: name || "Untitled Workflow",
                nodes: typeof nodes === "string" ? nodes : JSON.stringify(nodes || []),
                edges: typeof edges === "string" ? edges : JSON.stringify(edges || []),
            },
        });

        return NextResponse.json(workflow, { status: 201 });
    } catch (error) {
        console.error("Error creating workflow:", error);
        return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
    }
}
