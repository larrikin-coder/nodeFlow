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

        // Export format mapping
        const exportData = {
            metadata: {
                workflow_id: workflow.id,
                name: workflow.name,
                created_at: workflow.createdAt,
                updated_at: workflow.updatedAt,
                export_version: "1.0",
            },
            nodes: JSON.parse(workflow.nodes),
            edges: JSON.parse(workflow.edges),
        };

        return NextResponse.json(exportData);
    } catch (error) {
        console.error(`Error exporting workflow ${id}:`, error);
        return NextResponse.json({ error: "Failed to export workflow" }, { status: 500 });
    }
}
