import { createWorkspace, listWorkspaces } from "./workspace";
import { createChannel, listChannels, getChannel } from "./channel";
import { createMessage, listMessages } from "./message";
import { updateUser } from "./user";
import { inviteMember } from "./member";


export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspace,
        member: {
            invite: inviteMember,
        },

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