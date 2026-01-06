import { createWorkspace, listWorkspaces } from "./workspace";
import { createChannel, listChannels, getChannel } from "./channel";
import { createMessage, listMessages, updatedMessage } from "./message";
import { updateUser } from "./user";
import { inviteMember, listMembers } from "./member";


export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspace,
        member: {
            invite: inviteMember,
            list: listMembers,
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
        update: updatedMessage,
    },
    user: {
        update: updateUser,
    },
};