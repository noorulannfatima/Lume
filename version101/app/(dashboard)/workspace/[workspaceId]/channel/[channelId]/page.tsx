'use client'
import { useQuery } from '@tanstack/react-query'
import { ChannelHeader } from './_components/ChannelHeader'
import { MessageList } from './_components/MessageList'
import { MessageInputForm } from './_components/message/MessageInputForm'
import { useParams } from 'next/navigation'
import { orpc } from '@/lib/orpc'

import { useSession } from 'next-auth/react'

const ChannelPage = () => {

  const {channelId, workspaceId} = useParams<{
    channelId: string;
    workspaceId: string;
  }>();
    
    const { data: session } = useSession();

    const {data, isLoading, error} = useQuery(
        orpc.channel.get.queryOptions({
          input: {
            channelId: channelId,
            workspaceId: workspaceId,
          }
        })
    );
//
  return (
    <div className='flex h-screen w-full'>
        {/* Main Channel Area */}
        <div className='flex flex-col flex-1 min-w-0'>
            {/* Fixed Header */}
          <ChannelHeader channelName={data?.name}/>

          {/* Scrollable Messages Area */}
        <div className='flex-1 overflow-hidden mb-4'>
            <MessageList/>
        </div>

        {/* text area */}
          <div className=' border-t bg-background p-4'>
            {session?.user && (
                <MessageInputForm
                key={channelId}
                channelId={channelId}
                workspaceId={workspaceId}
                user={{
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                }}
                />
            )}
          </div>
        </div> 
    </div>
  )
}

export default ChannelPage