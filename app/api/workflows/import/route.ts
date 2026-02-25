import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // We expect the payload from GET /api/workflows/[id]/export
        const { nodes, edges, metadata } = body;

        const name = metadata?.name ? `${metadata.name} (Imported)` : "Imported Workflow";

        const workflow = await prisma.workflow.create({
            data: {
                name,
                nodes: typeof nodes === "string" ? nodes : JSON.stringify(nodes || []),
                edges: typeof edges === "string" ? edges : JSON.stringify(edges || []),
            },
        });

        return NextResponse.json({
            id: workflow.id,
            message: "Workflow imported successfully"
        }, { status: 201 });
    } catch (error) {
        console.error("Error importing workflow:", error);
        return NextResponse.json({ error: "Failed to import workflow" }, { status: 500 });
    }
}
