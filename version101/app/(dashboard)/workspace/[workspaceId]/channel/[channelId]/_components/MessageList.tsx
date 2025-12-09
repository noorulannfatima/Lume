'use client'
import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageItem } from "./message/MessageItem"
import { orpc, client } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { ChevronDown, Loader2 } from "lucide-react";


export function MessageList() {

    const {channelId} = useParams<{channelId: string}>();
    const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null); // to scroll the user to bottom
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

    // scroll to the bottom when new messages first load
    useEffect (() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                bottomRef.current?.scrollIntoView({ block: "end" });
                setHasInitialScrolled(true);
                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);


    // keep view pinned to bottom on late content growth (e.g images)
    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;
        const scrollToBottomIfNeeded = () => {
            if (isAtBottom || !hasInitialScrolled) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({ block: "end" }); 
                });
            }
        };
        // 
        const onImageLoad = (e: Event) => {
        if (e.target instanceof HTMLImageElement){
            scrollToBottomIfNeeded();
        }
        };
        el.addEventListener("load", onImageLoad, true);

        // when image is loading and expanding from 0 to 100 px
        // ResizeObserver watches for size change in the container
        const resizeObserver = new ResizeObserver(() => {
            scrollToBottomIfNeeded();
        });
        
        resizeObserver.observe(el);

        // mutation observer to detect any dom changes (e.g images loading)
        const mutationObserver = new MutationObserver(() => {
            scrollToBottomIfNeeded();
        });

        mutationObserver.observe(el, { 
            childList: true,  // watch for child nodes changes
            subtree: true,    // watch for all child nodes
            attributes: true, // watch for attribute changes
            characterData: true, // watch for text content changes
        });

        return () => {
            el.removeEventListener("load", onImageLoad, true);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [isAtBottom, hasInitialScrolled]);
 

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

            const isEmpty = !isLoading && !error && items.length===0

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

            bottomRef.current?.scrollIntoView({ block: "end" });

            setNewMessages(false);
            setIsAtBottom(true);
        };
    
    return (
        <div className="relative h-full">
            <div 
            className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
            ref={scrollRef} 
            onScroll={handleScroll}
            >
               {isEmpty ? (
                <div className="flex h-full pt-4">
                    <EmptyState
                title="No messages"
                description="Start a conversation by sending a message"
                buttonText="Send a message"
                href="#"
                />
                </div>
               ) : (
                items?.map((message) => (
                    <MessageItem key={message.id} message={message}/>
                ))
               )}

               <div ref={bottomRef}></div>
            </div>

            {isFetchingNextPage && (
                <div className="pointer-events-none absolute top-0 
                left-0 right-0 z-20 flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 rounded-md
                    bg-gradient-to-b from-white/80 to-transparent dark:from-neutral-900/80">
                        <Loader2 className="size-4 animate-spin text-muted-foreground"/>
                        <span>Loading previous messages...</span>
                    </div>
                </div>
            )}

            {!isAtBottom && (
                <Button 
                type="button"
                size="sm"
                className="absolute bottom-4 right-5 z-20 size-10 rounded-full 
                hover:shadow-xl transition-all duration-200"
                onClick={scrollToBottom}
                >
                    <ChevronDown className="size-4"/>
                </Button>
            )}

        </div>
    );
} 