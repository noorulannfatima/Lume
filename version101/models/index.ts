// models/index.ts
import sequelize from '@/lib/database';
import User from './User';
import Workspace from './Workspace';
import WorkspaceMember from './WorkspaceMember';
import Channels from './Channels';
import ChannelMember from './ChannelsMember';
import Message from './Message';
import File from './File';
import Reaction from './Reaction';
import DirectMessage from './DirectMessage';
import DirectMessageMember from './DirectMessageMember';
import ThreadReply from './ThreadReply';
import MessageMention from './MessageMention';
import Notification from './Notification';
import DirectMessageConversation from './DirectMessageConversation';
import DirectMessageParticipant from './DirectMessageParticipant';

// Initialize models
const models = {
  User,
  Workspace,
  WorkspaceMember,
  Channels,
  ChannelMember,
  Message,
  File,
  Reaction,
  DirectMessage,
  DirectMessageMember,
  ThreadReply,
  MessageMention,
  Notification,
  DirectMessageConversation,
  DirectMessageParticipant,
};

// ==================== USER ASSOCIATIONS ====================

// User <-> WorkspaceMember
User.hasMany(WorkspaceMember, {
  foreignKey: 'userId',
  as: 'workspaceMemberships',
});
WorkspaceMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> Channels (as creator)
User.hasMany(Channels, {
  foreignKey: 'createdById',
  as: 'createdChannels',
});
Channels.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'creator',
});

// User <-> Messages
User.hasMany(Message, {
  foreignKey: 'userId',
  as: 'messages',
});
Message.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> ThreadReply
User.hasMany(ThreadReply, {
  foreignKey: 'userId',
  as: 'threadReplies',
});
ThreadReply.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> Reactions
User.hasMany(Reaction, {
  foreignKey: 'userId',
  as: 'reactions',
});
Reaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> Files
User.hasMany(File, {
  foreignKey: 'userId',
  as: 'files',
});
File.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> Notifications
User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
});
Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User <-> MessageMention (as mentioned user)
User.hasMany(MessageMention, {
  foreignKey: 'mentionedUserId',
  as: 'mentions',
});
MessageMention.belongsTo(User, {
  foreignKey: 'mentionedUserId',
  as: 'mentionedUser',
});

// User <-> MessageMention (as mentioner)
User.hasMany(MessageMention, {
  foreignKey: 'userId',
  as: 'userMentions',
});
MessageMention.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// ==================== WORKSPACE ASSOCIATIONS ====================

// Workspace <-> WorkspaceMember
Workspace.hasMany(WorkspaceMember, {
  foreignKey: 'workspaceId',
  as: 'members',
});
WorkspaceMember.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Workspace <-> Channels
Workspace.hasMany(Channels, {
  foreignKey: 'workspaceId',
  as: 'channels',
});
Channels.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Workspace <-> DirectMessage
Workspace.hasMany(DirectMessage, {
  foreignKey: 'workspaceId',
  as: 'directMessages',
});
DirectMessage.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Workspace <-> Files
Workspace.hasMany(File, {
  foreignKey: 'workspaceId',
  as: 'files',
});
File.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Workspace <-> Notifications
Workspace.hasMany(Notification, {
  foreignKey: 'workspaceId',
  as: 'notifications',
});
Notification.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Workspace <-> DirectMessageConversation
Workspace.hasMany(DirectMessageConversation, {
  foreignKey: 'workspaceId',
  as: 'dmConversations',
});
DirectMessageConversation.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// ==================== CHANNEL ASSOCIATIONS ====================

// Channels <-> ChannelMember
Channels.hasMany(ChannelMember, {
  foreignKey: 'channelId',
  as: 'members',
});
ChannelMember.belongsTo(Channels, {
  foreignKey: 'channelId',
  as: 'channel',
});

// Channels <-> Message
Channels.hasMany(Message, {
  foreignKey: 'channelId',
  as: 'messages',
});
Message.belongsTo(Channels, {
  foreignKey: 'channelId',
  as: 'channel',
});

// Channels <-> Notification
Channels.hasMany(Notification, {
  foreignKey: 'channelId',
  as: 'notifications',
});
Notification.belongsTo(Channels, {
  foreignKey: 'channelId',
  as: 'channel',
});

// ==================== MESSAGE ASSOCIATIONS ====================

// Message <-> Reaction
Message.hasMany(Reaction, {
  foreignKey: 'messageId',
  as: 'reactions',
});
Reaction.belongsTo(Message, {
  foreignKey: 'messageId',
  as: 'message',
});

// Message <-> ThreadReply
Message.hasMany(ThreadReply, {
  foreignKey: 'messageId',
  as: 'threadReplies',
});
ThreadReply.belongsTo(Message, {
  foreignKey: 'messageId',
  as: 'message',
});

// Message <-> File
Message.hasMany(File, {
  foreignKey: 'messageId',
  as: 'files',
});
File.belongsTo(Message, {
  foreignKey: 'messageId',
  as: 'message',
});

// Message <-> MessageMention
Message.hasMany(MessageMention, {
  foreignKey: 'messageId',
  as: 'mentions',
});
MessageMention.belongsTo(Message, {
  foreignKey: 'messageId',
  as: 'message',
});

// Message <-> Notification
Message.hasMany(Notification, {
  foreignKey: 'messageId',
  as: 'notifications',
});
Notification.belongsTo(Message, {
  foreignKey: 'messageId',
  as: 'message',
});

// Message self-referential (for threading)
Message.hasMany(Message, {
  foreignKey: 'threadId',
  as: 'replies',
});
Message.belongsTo(Message, {
  foreignKey: 'threadId',
  as: 'parentThread',
});

// ==================== DIRECT MESSAGE ASSOCIATIONS ====================

// DirectMessage <-> DirectMessageMember
DirectMessage.hasMany(DirectMessageMember, {
  foreignKey: 'directMessageId',
  as: 'members',
});
DirectMessageMember.belongsTo(DirectMessage, {
  foreignKey: 'directMessageId',
  as: 'directMessage',
});

// DirectMessage <-> Message
DirectMessage.hasMany(Message, {
  foreignKey: 'directMessageId',
  as: 'messages',
});
Message.belongsTo(DirectMessage, {
  foreignKey: 'directMessageId',
  as: 'directMessage',
});

// ==================== DM CONVERSATION ASSOCIATIONS ====================

// DirectMessageConversation <-> DirectMessageParticipant
DirectMessageConversation.hasMany(DirectMessageParticipant, {
  foreignKey: 'conversationId',
  as: 'participants',
});
DirectMessageParticipant.belongsTo(DirectMessageConversation, {
  foreignKey: 'conversationId',
  as: 'conversation',
});

// User <-> DirectMessageParticipant
User.hasMany(DirectMessageParticipant, {
  foreignKey: 'userId',
  as: 'dmParticipations',
});
DirectMessageParticipant.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// ==================== CHANNEL MEMBER ASSOCIATIONS ====================

// User <-> ChannelMember
User.hasMany(ChannelMember, {
  foreignKey: 'userId',
  as: 'channelMemberships',
});
ChannelMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// ==================== DIRECT MESSAGE MEMBER ASSOCIATIONS ====================

// User <-> DirectMessageMember
User.hasMany(DirectMessageMember, {
  foreignKey: 'userId',
  as: 'directMessageMemberships',
});
DirectMessageMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// ==================== THREAD REPLY ASSOCIATIONS ====================

// ThreadReply <-> Notification
ThreadReply.hasMany(Notification, {
  foreignKey: 'threadReplyId',
  as: 'notifications',
});
Notification.belongsTo(ThreadReply, {
  foreignKey: 'threadReplyId',
  as: 'threadReply',
});

// ==================== DATABASE SYNC ====================

export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

// Export all models
export {
  sequelize,
  User,
  Workspace,
  WorkspaceMember,
  Channels,
  ChannelMember,
  Message,
  File,
  Reaction,
  DirectMessage,
  DirectMessageMember,
  ThreadReply,
  MessageMention,
  Notification,
  DirectMessageConversation,
  DirectMessageParticipant,
};

export default models;