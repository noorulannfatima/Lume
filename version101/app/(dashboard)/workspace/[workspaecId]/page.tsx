
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { client } from "@/lib/orpc";
import { Cloud } from "lucide-react";
import { redirect } from "next/navigation";
import { CreateNewChannel } from "./_components/CreateNewChannel";

interface iAppProps {
    params: Promise<{workspaecId: string}>;
}

const WorkspacePage = async({params}: iAppProps) => {
  const {workspaecId} = await params;
  const channels = await client.channel.list();

  if(channels.length > 0){
    return redirect(`/workspace/${workspaecId}/channel/${channels[0].id}`);
  }

  return (
    <div className="p-20 flex flex-1">
      <Empty className="border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Cloud />
        </EmptyMedia>
        <EmptyTitle>No channel yet</EmptyTitle>
        <EmptyDescription>
          Create a channel to start messaging.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-xs mx-auto">
        <CreateNewChannel/>
      </EmptyContent>
    </Empty>
    </div>
  )
}

export default WorkspacePage