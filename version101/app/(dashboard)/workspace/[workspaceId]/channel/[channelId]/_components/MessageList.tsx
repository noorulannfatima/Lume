'use client'
import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageItem } from "./message/MessageItem"
import { orpc, client } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";


export function MessageList() {

    const {channelId} = useParams<{channelId: string}>();
    const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    // for fetching new messages
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [newMessages, setNewMessages] = useState(false);
    // for infinite scroll
    const lastItemIdRef = useRef<string | undefined>(undefined);
    const infiniteOptions = orpc.message.list.infiniteOptions({
        input: (pageParam: string | undefined) => ({
            channelId: channelId,
            limit: 10,
            cursor: pageParam,
        }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage: { nextCursor: string | null; hasMore: boolean }) => lastPage.nextCursor,
        select: (data: any) => ({
            pages : [...data.pages].reverse().map((p: any) => ({ 
                ...p, 
                items: [...p.messages].reverse()
            })),
            pageParams: [...data.pageParams].reverse(),
        }),
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
        error,
    } = useInfiniteQuery({
        ...infiniteOptions,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });


    useEffect (() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                el.scrollTop = el.scrollHeight;
                setHasInitialScrolled(true);
                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);

 const isNearBottom = (el: HTMLDivElement) => 
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const  handleScroll = () => {// for fetching new data
        const el = scrollRef.current;
                if (!el) return;

                if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
                    const prevScrollHeight = el.scrollHeight;
                    const prevScrollTop = el.scrollTop;
                    fetchNextPage().then(() => {
                        const newScrollHeight = el.scrollHeight;

                        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
                    });    
                }

                setIsAtBottom(isNearBottom(el));
            };
        
            const items = useMemo (() => {
                return data?.pages.flatMap((p: any) => p.items) ?? [];
            }, [data]);

            useEffect(() => {
                if (!items.length ) return;

                const lastId = items[items.length - 1].id;

                const prevLastId = lastItemIdRef.current;

                const el = scrollRef.current;

                if (prevLastId && lastId !== prevLastId) {
                if ( el && isNearBottom(el)) {
                    requestAnimationFrame(() => {
                       el.scrollTop = el.scrollHeight;
                    });

                    setNewMessages(false);
                    setIsAtBottom(true);
                } else {
                    setNewMessages(true);
                }
            }

            lastItemIdRef.current = lastId;
        }, [items]);

        // for scrolling to bottom on click 
        const scrollToBottom = () => {
            const el = scrollRef.current;
            if (!el)  return;

            el.scrollTop = el.scrollHeight;
            setNewMessages(false);
            setIsAtBottom(true);
        };
    
    return (
        <div className="relative h-full">
            <div 
            ref={scrollRef} 
            onScroll={handleScroll}
            className="h-full overflow-y-auto px-4" >
                {items?.map((message) => (
                    <MessageItem key={message.id} message={message}/>
                ))}

               <div ref={bottomRef}></div>
            </div>

            {newMessages && !isAtBottom ? (
                <Button
                type="button"
                className="absolute bottom-4 right-4 rounded-full"
                onClick={scrollToBottom}
                >
                    New Messages
                </Button>
            ) : null}
        </div>
    );
} 