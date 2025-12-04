import { MessageItem } from "./message/MessageItem"

const messages = [
    {
        id: 1,
        message: "Hello",
        date: new Date(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        userName: "John Doe"
    },
    {
        id: 2,
        message: "Hello",
        date: new Date(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        userName: "John Doe"
    },
    {
        id: 3,
        message: "Hello",
        date: new Date(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        userName: "John Doe"
    }
]

export function MessageList () {
    return (
        <div className="relative h-full">
            <div className="h-full overflow-y-auto px-4">
                {messages.map((message) => (
                    <MessageItem key={message.id} {...message}/>
                ))}
            </div>

        </div>
    )
}