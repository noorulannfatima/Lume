import { CreateNewChannel } from "../(dashboard)/workspace/[workspaecId]/_components/CreateNewChannel";
import { createWorkspace, listWorkspaces } from "./workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspace,
    },

    channel: {
        create: CreateNewChannel,
    },
};