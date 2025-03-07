// controllers/messageController.js
import Message from '../models/Message.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
  const { sender, receiver, group, content } = req.body;

  try {
    const message = new Message({ sender, receiver, group, content });
    await message.save();

    // Populate sender details for the frontend
    const populatedMessage = await Message.findById(message._id).populate('sender');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Create a group
export const createGroup = async (req, res) => {
  const { name, members, createdBy } = req.body;

  try {
    // Ensure the creator is part of the group
    if (!members.includes(createdBy)) {
      members.push(createdBy);
    }

    const group = new Group({ name, members, createdBy });
    await group.save();

    // Populate group details for the frontend
    const populatedGroup = await Group.findById(group._id).populate('members');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

// Get messages for a user (direct messages and group messages)
export const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch direct messages
    const directMessages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate('sender receiver');

    // Fetch group messages
    const groups = await Group.find({ members: userId });
    const groupIds = groups.map((group) => group._id);
    const groupMessages = await Message.find({ group: { $in: groupIds } }).populate('sender group');

    res.json({ directMessages, groupMessages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Get all groups for a user
export const getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    const groups = await Group.find({ members: userId }).populate('members');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};