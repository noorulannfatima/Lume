'use client'
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { orpc } from "@/lib/orpc";

export function WorkspaceHeader() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { data } = useQuery(orpc.workspace.list.queryOptions({
        input: { workspaceId },
    }));
    
    return (
        <h2 className="text-xl font-semibold">{data?.currentWorkspace.name || 'Loading...'}</h2>
    )
}