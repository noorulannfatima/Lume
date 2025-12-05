import { createWorkspace, listWorkspaces } from "./workspace";
import { createChannel, listChannels, getChannel } from "./channel";
import { createMessage, listMessages } from "./message";
import { updateUser } from "./user";


export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspace,

    },
    channel: {
        list: listChannels,
        create: createChannel,
        get: getChannel,
    },
    message: {
        create: createMessage,
        list: listMessages,
    },
    user: {
        update: updateUser,
    },
};