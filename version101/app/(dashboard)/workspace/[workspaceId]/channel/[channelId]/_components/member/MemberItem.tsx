import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/utils/get-avatar";
import { User } from "next-auth";
import Image from "next/image";//

interface MemberItemProps {
    member: User;
}


export function MemberItem({member}: MemberItemProps) {
    return (
        <div className="px-3 py-3 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Avatar className="size-8">
                      <Image
                      src={getAvatar(member.image ?? null, member.email!)}
                      alt="member Avatar"
                      fill
                      className="object-cover"
                      />
                      <AvatarFallback>
                        {member.name?.charAt(0).toUpperCase() ?? "M"}
                      </AvatarFallback>
                    </Avatar>
                </div>

                {/* Member info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                            {member.name}
                        </p>
                        <span className="inline-flex items-center rounded-md 
                        bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700
                        ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10
                        dark:text-blue-400 dark:ring-blue-400/30">
                            Admin
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                    </p>
                </div>
            </div>
        </div>
    )
}