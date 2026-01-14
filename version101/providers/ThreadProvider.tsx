"use client"

import { createContext, useContext, useState } from "react"

interface ThreadContextType {
    selectedThreadId: string | null;
    setSelectedThreadId: (id: string | null) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined)

export function ThreadProvider({children}: {children: React.ReactNode}) {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const value = {
        selectedThreadId,
        setSelectedThreadId,
    };

    return (
        <ThreadContext.Provider value={value}>
            {children}
        </ThreadContext.Provider>
    )
}

export function useThread() {
    const context = useContext(ThreadContext);
    if (context == undefined) {
        throw new Error("useThread must be used within a ThreadProvider");
    }
    return context;
}