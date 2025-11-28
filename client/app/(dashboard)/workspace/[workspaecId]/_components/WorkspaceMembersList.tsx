import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const members = [
    {
        id: 1,
        name: "Member 1",
        imageUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: "member1@example.com"
    },
    {
        id: 2,
        name: "Member 2",
        imageUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: "member2@example.com"
    },
    {
        id: 3,
        name: "Member 3",
        imageUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: "member3@example.com"
    },
];


export function WorkspaceMembersList() {
    return (
        <div className="space-y-0.5 py-1">
            {members.map((member) =>(
                <div 
                className="px-3 py-2 hover:bg-accent cursor-pointer
                transition-colors flex items-center space-x-3" 
                key={member.id}>
                    <div className="relative">
                        <Avatar className="size-8 relative">
                            <Image
                            src={member.imageUrl}
                            alt="User Image"
                            className="object-cover"
                            fill
                            />
                            <AvatarFallback>
                                {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>

                </div>
            ))}
        </div>
    );
}