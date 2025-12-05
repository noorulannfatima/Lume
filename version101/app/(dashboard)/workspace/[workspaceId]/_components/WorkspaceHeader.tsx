'use client'
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function WorkspaceHeader() {
    const { data } = useQuery(orpc.workspace.list.queryOptions());
    
    return (
        <h2 className="text-xl font-semibold">{data?.currentWorkspace.name || 'Loading...'}</h2>
    )
}